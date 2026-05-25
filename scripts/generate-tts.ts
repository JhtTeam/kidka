import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import { ALPHABET } from '../src/data/alphabet';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT_DIR = resolve(ROOT, 'public/audio');
const MANIFEST_PATH = resolve(OUT_DIR, 'manifest.json');

// Load .env from project root (KEY=value lines, # comments, optional quotes).
// Values in .env OVERRIDE existing shell env vars on purpose: a developer who
// puts a key in .env is making the most explicit choice, and surprises from a
// stale `export GEMINI_API_KEY=...` somewhere in ~/.zshrc caused real debugging
// pain. Comment a key out (or leave it blank) in .env to fall back to the
// shell's value.
function loadDotEnv() {
  try {
    const content = readFileSync(resolve(ROOT, '.env'), 'utf-8');
    for (const raw of content.split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      const quoted =
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"));
      if (quoted) {
        value = value.slice(1, -1);
      } else {
        // Strip inline "  # comment" (only when not inside quotes).
        const hash = value.search(/\s+#/);
        if (hash >= 0) value = value.slice(0, hash).trimEnd();
      }
      if (value === '') continue; // empty placeholder — keep any shell value
      process.env[key] = value;
    }
  } catch {
    // No .env file — fall back to exported env vars only.
  }
}
loadDotEnv();

// --- Provider selection -----------------------------------------------------
// Default to ElevenLabs because it doesn't have Gemini free tier's daily 10-req
// cap. Set TTS_PROVIDER=gemini to use Gemini instead.
type Provider = 'elevenlabs' | 'gemini';
const PROVIDER = (process.env.TTS_PROVIDER as Provider) || 'elevenlabs';

// ElevenLabs config
// Voice IDs from ElevenLabs preset library:
//   Bella  EXAVITQu4vr4xnSDxMaL  young female, warm — default for this app
//   Rachel 21m00Tcm4TlvDq8ikWAM  calm female
//   Elli   MF3mGyEYCl7XYWbV9V6O  young female, soft
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const ELEVENLABS_MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Gemini config
const GEMINI_MODEL = 'gemini-2.5-flash-preview-tts';
const GEMINI_VOICE = 'Kore';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log(`Using Gemini voice: ${GEMINI_VOICE} - key = ${GEMINI_API_KEY ? '✓' : 'missing'}`);
// Rate limiting (overridable per provider).
//   ElevenLabs free tier: ~2 concurrent — 20 RPM is safe and quick.
//   Gemini free tier:     3 RPM and 10 requests / day (use paid for full runs).
const DEFAULT_RPM = PROVIDER === 'gemini' ? 3 : 20;
const RPM = Number(process.env.TTS_RPM ?? process.env.GEMINI_TTS_RPM ?? DEFAULT_RPM);
const MIN_INTERVAL_MS = Math.ceil(60_000 / RPM) + 500;
const MAX_RETRIES = 5;

// Set TTS_LIMIT=N to only generate the first N phrases (handy for smoke tests).
const LIMIT = process.env.TTS_LIMIT
  ? Number(process.env.TTS_LIMIT)
  : process.env.GEMINI_TTS_LIMIT
  ? Number(process.env.GEMINI_TTS_LIMIT)
  : Infinity;

if (PROVIDER === 'elevenlabs' && !ELEVENLABS_API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY. Export it: export ELEVENLABS_API_KEY=...');
  process.exit(1);
}
if (PROVIDER === 'gemini' && !GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY. Export it: export GEMINI_API_KEY=...');
  process.exit(1);
}
if (PROVIDER === 'gemini' && !ffmpegPath) {
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

type Phrase = { text: string; style: keyof typeof STYLE; name: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Build the full phrase list from the alphabet data + static UI lines.
// Keep this in sync with src/utils/audio.ts speak() call sites.
// `name` becomes the MP3 filename — keep it short and human-readable.
function buildPhrases(): Phrase[] {
  const phrases: Phrase[] = [];
  const add = (text: string, style: Phrase['style'], name: string) =>
    phrases.push({ text, style, name });

  // Static UI lines
  add("Let's go!", 'cheer', 'lets-go');

  // Cheer + encourage lines (must match ENCOURAGE/TRY_AGAIN in audio.ts)
  ['Great job!', 'Awesome!', 'You did it!', 'Fantastic!', 'Well done!'].forEach((t) =>
    add(t, 'cheer', `cheer-${slugify(t)}`),
  );
  ['Try again!', 'Almost there!', 'You can do it!'].forEach((t) =>
    add(t, 'encourage', `encourage-${slugify(t)}`),
  );

  // Per-letter lines
  for (const entry of ALPHABET) {
    const L = entry.letter; // single uppercase letter, safe in filenames
    add(entry.letter, 'letter', `letter-${L}`);
    add(entry.word, 'word', `word-${L}`);
    add(`${entry.letter}. ${entry.word}.`, 'learn', `learn-${L}`);
    add(`Trace the letter ${entry.letter}`, 'trace', `trace-${L}`);

    // Story script: matches the template in src/pages/Story.tsx
    const intros = [
      `Today we will learn the letter ${entry.letter}!`,
      `Here comes the letter ${entry.letter}!`,
      `Look! It's the letter ${entry.letter}.`,
    ];
    intros.forEach((intro, i) => {
      add(
        `${intro} ${entry.letter} is for ${entry.word}. ${entry.hint}.`,
        'story',
        `story-${L}-${i + 1}`,
      );
    });
  }

  return phrases;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function parseRetryDelay(errBody: string): number | null {
  // Gemini 429 responses include a "retryDelay": "4.07s" hint inside details[].
  const m = errBody.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/);
  return m ? Math.ceil(parseFloat(m[1]) * 1000) : null;
}

async function withRetry(
  call: () => Promise<Response>,
  describe: string,
): Promise<Response> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const res = await call();
    if (res.ok) return res;
    const txt = await res.text();
    if (res.status === 429 && attempt < MAX_RETRIES) {
      const delay = parseRetryDelay(txt) ?? MIN_INTERVAL_MS;
      process.stdout.write(`429, waiting ${Math.round(delay / 1000)}s … `);
      await sleep(delay + 500);
      continue;
    }
    throw new Error(`${describe} failed (${res.status}) after attempt ${attempt}: ${txt}`);
  }
  throw new Error('Unreachable');
}

async function fetchGeminiPcm(text: string, styleKey: Phrase['style']): Promise<Buffer> {
  const prompt = `${STYLE[styleKey]} ${text}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: GEMINI_VOICE } },
      },
    },
  };
  const res = await withRetry(
    () =>
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY!,
        },
        body: JSON.stringify(body),
      }),
    'Gemini TTS request',
  );
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { inlineData?: { data?: string } }[] } }[];
  };
  const b64 = json.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error(`No audio in response: ${JSON.stringify(json).slice(0, 400)}`);
  return Buffer.from(b64, 'base64');
}

// ElevenLabs voice_settings tuned for child-friendly narration:
//   stability 0.5 keeps a consistent delivery without being monotonous
//   similarity_boost 0.75 holds the preset voice's character
//   style 0.3 adds a touch of expressiveness for cheers/encouragement
const ELEVENLABS_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.3,
  use_speaker_boost: true,
};

async function fetchElevenLabsMp3(text: string): Promise<Buffer> {
  // We send the raw phrase; the Bella/Rachel presets already sound warm for
  // a child audience, so no style-prefix prompting is necessary.
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`;
  const body = {
    text,
    model_id: ELEVENLABS_MODEL,
    voice_settings: ELEVENLABS_VOICE_SETTINGS,
  };
  const res = await withRetry(
    () =>
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY!,
          accept: 'audio/mpeg',
        },
        body: JSON.stringify(body),
      }),
    'ElevenLabs TTS request',
  );
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
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

async function migrateExistingNames(
  phrases: Phrase[],
  existing: Record<string, string>,
): Promise<Record<string, string>> {
  // If the manifest references a file with the old naming scheme (or any name
  // other than the current `name.mp3`), rename the file on disk so we don't
  // re-spend quota regenerating audio we already have.
  const updated: Record<string, string> = { ...existing };
  const phraseByText = new Map(phrases.map((p) => [p.text, p]));
  for (const [text, oldRel] of Object.entries(existing)) {
    const phrase = phraseByText.get(text);
    if (!phrase) continue;
    const newRel = `audio/${phrase.name}.mp3`;
    if (oldRel === newRel) continue;
    const oldPath = resolve(OUT_DIR, oldRel.replace(/^audio\//, ''));
    const newPath = resolve(OUT_DIR, `${phrase.name}.mp3`);
    try {
      await rename(oldPath, newPath);
      updated[text] = newRel;
      console.log(`renamed: ${oldRel} → ${newRel}`);
    } catch {
      // Source missing — let the main loop regenerate it.
    }
  }
  return updated;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const phrases = buildPhrases().slice(0, LIMIT);
  let existing = await loadExistingManifest();
  existing = await migrateExistingNames(phrases, existing);
  const manifest: Record<string, string> = { ...existing };
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log(
    `Generating ${phrases.length} phrases → ${OUT_DIR} (rate limit: ${RPM} rpm)`,
  );
  let i = 0;
  let lastCallAt = 0;
  for (const { text, style, name } of phrases) {
    i++;
    const file = `${name}.mp3`;
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
      if (PROVIDER === 'elevenlabs') {
        const mp3 = await fetchElevenLabsMp3(text);
        lastCallAt = Date.now();
        await writeFile(outPath, mp3);
      } else {
        const pcm = await fetchGeminiPcm(text, style);
        lastCallAt = Date.now();
        await pcmToMp3(pcm, outPath);
      }
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
