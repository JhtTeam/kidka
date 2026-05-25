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
- 🔊 Pronunciation via the browser's `speechSynthesis` API (no audio files to host)
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

The app uses the browser's built-in `speechSynthesis` API to pronounce letters
and give encouraging voice feedback ("Great job!", "Try again!"). UI clicks and
celebration chimes are synthesized with `AudioContext` at runtime so there are
**no external audio files to ship**. If you'd like richer voice/sound effects,
drop MP3/WAV files into `src/assets/` and wire them up in
[src/utils/audio.ts](src/utils/audio.ts) using Howler.

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
