import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import { ALPHABET } from '../src/data/alphabet';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT_DIR = resolve(ROOT, 'public/audio');
const MANIFEST_PATH = resolve(OUT_DIR, 'manifest.json');

const MODEL = 'gemini-2.5-flash-preview-tts';
const VOICE = 'Kore';
const API_KEY = process.env.GEMINI_API_KEY;
// Free tier allows 3 RPM for the TTS model. Override with GEMINI_TTS_RPM if you
// have a paid plan (e.g. `GEMINI_TTS_RPM=60 npm run generate-audio`).
const RPM = Number(process.env.GEMINI_TTS_RPM ?? '3');
const MIN_INTERVAL_MS = Math.ceil(60_000 / RPM) + 500; // small safety margin
const MAX_RETRIES = 5;
// Set GEMINI_TTS_LIMIT=N to only generate the first N phrases (handy for smoke tests).
const LIMIT = process.env.GEMINI_TTS_LIMIT ? Number(process.env.GEMINI_TTS_LIMIT) : Infinity;

if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY. Export it before running: export GEMINI_API_KEY=...');
  process.exit(1);
}

if (!ffmpegPath) {
  console.error('ffmpeg-static did not provide a binary path.');
  process.exit(1);
}

// PCM format from Gemini TTS: signed 16-bit little-endian, 24kHz, mono.
const PCM_SAMPLE_RATE = 24_000;

// Style prefixes hint to the model how to read the phrase.
// Gemini interprets "Say X: Y" patterns as style instruction + content.
const STYLE = {
  letter: 'Say the letter clearly and warmly, like for a young child learning the alphabet:',
  word: 'Say the word clearly and warmly, like for a young child:',
  learn: 'Say warmly and clearly, with a small pause between the letter and the word, like for a young child:',
  trace: 'Say gently and encouragingly, like guiding a young child:',
  story: 'Read slowly, cheerfully, and warmly, like telling a story to a young child:',
  cheer: 'Say excitedly and joyfully, like cheering on a young child:',
  encourage: 'Say warmly and kindly, like encouraging a young child to try again:',
};

type Phrase = { text: string; style: keyof typeof STYLE };

// Build the full phrase list from the alphabet data + static UI lines.
// Keep this in sync with src/utils/audio.ts speak() call sites.
function buildPhrases(): Phrase[] {
  const phrases: Phrase[] = [];
  const add = (text: string, style: Phrase['style']) =>
    phrases.push({ text, style });

  // Static UI lines
  add("Let's go!", 'cheer');

  // Cheer + encourage lines (must match ENCOURAGE/TRY_AGAIN in audio.ts)
  ['Great job!', 'Awesome!', 'You did it!', 'Fantastic!', 'Well done!'].forEach(
    (t) => add(t, 'cheer'),
  );
  ['Try again!', 'Almost there!', 'You can do it!'].forEach((t) => add(t, 'encourage'));

  // Per-letter lines
  for (const entry of ALPHABET) {
    add(entry.letter, 'letter');
    add(entry.word, 'word');
    add(`${entry.letter}. ${entry.word}.`, 'learn');
    add(`Trace the letter ${entry.letter}`, 'trace');

    // Story script: matches the template in src/pages/Story.tsx
    const intros = [
      `Today we will learn the letter ${entry.letter}!`,
      `Here comes the letter ${entry.letter}!`,
      `Look! It's the letter ${entry.letter}.`,
    ];
    for (const intro of intros) {
      add(`${intro} ${entry.letter} is for ${entry.word}. ${entry.hint}.`, 'story');
    }
  }

  return phrases;
}

function fileNameFor(text: string): string {
  const hash = createHash('sha1').update(text).digest('hex').slice(0, 10);
  return `${hash}.mp3`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function parseRetryDelay(errBody: string): number | null {
  // Gemini 429 responses include a "retryDelay": "4.07s" hint inside details[].
  const m = errBody.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/);
  return m ? Math.ceil(parseFloat(m[1]) * 1000) : null;
}

async function fetchPcm(text: string, styleKey: Phrase['style']): Promise<Buffer> {
  const prompt = `${STYLE[styleKey]} ${text}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
      },
    },
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY!,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const json = (await res.json()) as {
        candidates?: { content?: { parts?: { inlineData?: { data?: string } }[] } }[];
      };
      const b64 = json.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) throw new Error(`No audio data in response: ${JSON.stringify(json).slice(0, 400)}`);
      return Buffer.from(b64, 'base64');
    }

    const txt = await res.text();
    if (res.status === 429 && attempt < MAX_RETRIES) {
      const delay = parseRetryDelay(txt) ?? MIN_INTERVAL_MS;
      process.stdout.write(`429, waiting ${Math.round(delay / 1000)}s … `);
      await sleep(delay + 500);
      continue;
    }
    throw new Error(`TTS request failed (${res.status}) after attempt ${attempt}: ${txt}`);
  }
  throw new Error('Unreachable');
}

function pcmToMp3(pcm: Buffer, outPath: string): Promise<void> {
  return new Promise((res, rej) => {
    const args = [
      '-hide_banner',
      '-loglevel', 'error',
      '-y',
      '-f', 's16le',
      '-ar', String(PCM_SAMPLE_RATE),
      '-ac', '1',
      '-i', 'pipe:0',
      '-codec:a', 'libmp3lame',
      '-qscale:a', '4',
      outPath,
    ];
    const proc = spawn(ffmpegPath!, args);
    let stderr = '';
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('error', rej);
    proc.on('close', (code) => {
      if (code === 0) res();
      else rej(new Error(`ffmpeg exited ${code}: ${stderr}`));
    });
    proc.stdin.end(pcm);
  });
}

async function loadExistingManifest(): Promise<Record<string, string>> {
  try {
    const txt = await readFile(MANIFEST_PATH, 'utf-8');
    return JSON.parse(txt);
  } catch {
    return {};
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const phrases = buildPhrases().slice(0, LIMIT);
  const existing = await loadExistingManifest();
  const manifest: Record<string, string> = { ...existing };

  console.log(
    `Generating ${phrases.length} phrases → ${OUT_DIR} (rate limit: ${RPM} rpm)`,
  );
  let i = 0;
  let lastCallAt = 0;
  for (const { text, style } of phrases) {
    i++;
    const file = fileNameFor(text);
    const outPath = resolve(OUT_DIR, file);
    const relPath = `audio/${file}`;

    // Skip if already generated (idempotent re-runs).
    if (existing[text] === relPath) {
      try {
        await readFile(outPath);
        console.log(`[${i}/${phrases.length}] skip (cached): ${text}`);
        continue;
      } catch { /* file missing — regenerate */ }
    }

    // Throttle to stay within free-tier RPM limit.
    const since = Date.now() - lastCallAt;
    if (lastCallAt && since < MIN_INTERVAL_MS) {
      const wait = MIN_INTERVAL_MS - since;
      process.stdout.write(`(throttle ${Math.ceil(wait / 1000)}s) `);
      await sleep(wait);
    }

    process.stdout.write(`[${i}/${phrases.length}] ${text} … `);
    try {
      const pcm = await fetchPcm(text, style);
      lastCallAt = Date.now();
      await pcmToMp3(pcm, outPath);
      manifest[text] = relPath;
      // Persist manifest after each success so interrupted runs resume cleanly.
      await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
      console.log('ok');
    } catch (err) {
      console.log('FAIL');
      console.error(err);
      throw err;
    }
  }

  // Final write — when running the full phrase list, drop stale entries no
  // longer referenced. Skip pruning during a LIMIT run so partial test runs
  // don't erase previously generated entries.
  if (!Number.isFinite(LIMIT)) {
    const finalManifest: Record<string, string> = {};
    for (const { text } of buildPhrases()) {
      if (manifest[text]) finalManifest[text] = manifest[text];
    }
    await writeFile(MANIFEST_PATH, JSON.stringify(finalManifest, null, 2) + '\n');
  }
  console.log(`\nWrote manifest → ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
