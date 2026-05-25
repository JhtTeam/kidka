# KidKa - Alphabet Learning for Kids

A colorful, friendly, child-safe web app that teaches young children the English
alphabet through visual associations, sounds, and mini-games. Designed for
preschoolers who have trouble visually recognizing letters.

Built with **React + Vite + TypeScript + TailwindCSS + Framer Motion + Howler.js + React Router**.

## Features

| Page          | What it does |
| ------------- | ------------ |
| **Home**      | Big start button, mascot greeting, progress at a glance |
| **Learn**     | A–Z grid + dedicated card view per letter with sound, illustration and a visual shape hint ("A looks like a mountain") |
| **Practice**  | Finger / mouse tracing pad over a dotted letter, with coverage scoring and confetti reward |
| **Games**     | 4 mini-games — Hear & Pick, Match It, Memory, and a drag-and-drop Puzzle |
| **Progress**  | Stars, learned letters, parental reset |
| **Story**     | A mascot narrates the alphabet one letter at a time |

Other goodies:
- 🌙 Dark mode toggle for parents
- 🔊 Pronunciation via pre-generated TTS audio (ElevenLabs / Gemini, with `speechSynthesis` fallback)
- 🎉 Confetti, floating shapes, gradient backgrounds, smooth Framer Motion transitions
- 💾 Progress saved automatically to `localStorage`
- 📱 Mobile / tablet first, large rounded buttons, child-safe minimal text

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

```bash
npm run build      # production bundle in /dist
npm run preview    # preview the production build
```

## Project structure

```
src/
  assets/         # static assets (currently SVG icons live in /public)
  components/     # Reusable UI: BigButton, LetterCard, Mascot, Layout, ...
  data/           # alphabet.ts — the A-Z dataset
  games/          # ChooseLetter, MatchImage, Memory, Puzzle
  hooks/          # useProgress, useDarkMode
  pages/          # Home, Learn, Practice, Games, Progress, Story
  types/          # Shared TypeScript types
  utils/          # audio (speech + tones), storage (localStorage), cn
```

## Alphabet data shape

Each letter is described by:

```ts
{
  letter: 'A',
  lower: 'a',
  word: 'Apple',
  emoji: '🍎',
  hint: 'A looks like a mountain',
  shapeHint: 'mountain',
  color: '#ef4444',
  bgGradient: 'from-red-200 via-orange-200 to-yellow-200',
}
```

Edit [src/data/alphabet.ts](src/data/alphabet.ts) to change words, hints,
emojis or colors.

## Notes on audio

Letter names, words, encouragement and story narration are spoken from
pre-generated MP3 files in `public/audio/`.
[src/utils/audio.ts](src/utils/audio.ts) loads
`public/audio/manifest.json` at startup and plays the matching clip via
Howler.js; phrases not in the manifest fall back to the browser's
`speechSynthesis` API. UI clicks and celebration chimes are still synthesized
on the fly with `AudioContext`.

### Regenerating audio

The generator script [scripts/generate-tts.ts](scripts/generate-tts.ts) speaks
to **two providers** so you can keep building the pack when one runs out of
quota — phrases already present in `public/audio/manifest.json` are skipped, so
a re-run only fills the gaps.

**Set up your keys**

Copy `.env.example` to `.env` and fill in whichever provider key(s) you have.
The script auto-loads `.env` (real exported env vars still win), so you don't
need to re-export every shell. `.env` is gitignored; `.env.example` is checked
in.

```bash
cp .env.example .env
# then edit .env and paste your ELEVENLABS_API_KEY / GEMINI_API_KEY
```

**ElevenLabs (default — no daily limit)**

```bash
npm run generate-audio
```

Default voice: Bella (`EXAVITQu4vr4xnSDxMaL` — young, warm female). Override:

```bash
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM npm run generate-audio   # Rachel
```

ElevenLabs free tier: 10k characters / month (≈ enough for a fresh run). If
you'll be tweaking phrases often, a paid Starter plan ($5/mo, 30k chars) is
plenty.

**Gemini TTS (alternate — voice: Kore)**

```bash
TTS_PROVIDER=gemini npm run generate-audio
```

Heads-up: free tier caps at **10 requests per day** + 3 RPM for
`gemini-2.5-flash-tts`. The full phrase list (≈ 191) requires a paid plan
(`TTS_PROVIDER=gemini TTS_RPM=60 npm run generate-audio` ≈ 4 minutes) or many
days of drip-feeding on free tier.

**Useful env vars**

| Var | Purpose |
| --- | --- |
| `TTS_PROVIDER` | `elevenlabs` (default) or `gemini` |
| `TTS_RPM` | Override rate limit (default 20 for ElevenLabs, 3 for Gemini) |
| `TTS_LIMIT` | Generate only the first N phrases — handy for smoke tests |
| `ELEVENLABS_VOICE_ID` | Override the default Bella voice |
| `ELEVENLABS_MODEL` | Default `eleven_multilingual_v2` |

## Accessibility

- Buttons are huge (>= 44px touch target, most ~120px)
- High-contrast gradient text vs. solid letter color
- Friendly rounded display font (Fredoka)
- Optional dark mode
- Keyboard focus ring on every interactive element
- `aria-label`s on icon-only buttons

## Customization tips

- Swap the mascot in [src/components/Mascot.tsx](src/components/Mascot.tsx) for
  your own SVG character.
- Tweak the gradient palette under `@theme { ... }` in
  [src/index.css](src/index.css).
- Add additional mini-games as components in `src/games/` and register them in
  [src/pages/Games.tsx](src/pages/Games.tsx).

Have fun! 🎉
