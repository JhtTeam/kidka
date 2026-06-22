import type { AlphabetEntry } from '../types';

// Each entry pairs a letter with a fun, child-friendly visual hint.
// The shape hints help children who struggle with visual recognition
// by anchoring the letter to a familiar object shape.
export const ALPHABET: AlphabetEntry[] = [
  { letter: 'A', lower: 'a', word: 'Apple',     emoji: '🍎', hint: 'A looks like a mountain',        shapeHint: 'mountain',   color: '#ef4444', bgGradient: 'from-red-200 via-orange-200 to-yellow-200' },
  { letter: 'B', lower: 'b', word: 'Butterfly', emoji: '🦋', hint: 'B looks like two glasses',       shapeHint: 'glasses',    color: '#f97316', bgGradient: 'from-orange-200 via-amber-200 to-yellow-100' },
  { letter: 'C', lower: 'c', word: 'Cookie',    emoji: '🍪', hint: 'C looks like a moon',            shapeHint: 'moon',       color: '#eab308', bgGradient: 'from-amber-200 via-yellow-200 to-lime-200' },
  { letter: 'D', lower: 'd', word: 'Door',      emoji: '🚪', hint: 'D looks like a door',            shapeHint: 'door',       color: '#84cc16', bgGradient: 'from-lime-200 via-green-200 to-emerald-200' },
  { letter: 'E', lower: 'e', word: 'Egg',       emoji: '🥚', hint: 'E looks like a comb',            shapeHint: 'comb',       color: '#22c55e', bgGradient: 'from-emerald-200 via-teal-200 to-cyan-200' },
  { letter: 'F', lower: 'f', word: 'Flag',      emoji: '🚩', hint: 'F looks like a flag',            shapeHint: 'flag',       color: '#14b8a6', bgGradient: 'from-teal-200 via-cyan-200 to-sky-200' },
  { letter: 'G', lower: 'g', word: 'Giraffe',   emoji: '🦒', hint: 'G looks like a curly tail',      shapeHint: 'curl',       color: '#06b6d4', bgGradient: 'from-cyan-200 via-sky-200 to-blue-200' },
  { letter: 'H', lower: 'h', word: 'House',     emoji: '🏠', hint: 'H looks like a ladder',          shapeHint: 'ladder',     color: '#0ea5e9', bgGradient: 'from-sky-200 via-blue-200 to-indigo-200' },
  { letter: 'I', lower: 'i', word: 'Ice cream', emoji: '🍦', hint: 'I looks like a pencil',          shapeHint: 'pencil',     color: '#3b82f6', bgGradient: 'from-blue-200 via-indigo-200 to-violet-200' },
  // --- TEMP: letters below are not fully voiced yet. Uncomment in batches and
  //     run `npm run generate-audio` to generate their audio, a few at a time. ---
  
  // { letter: 'J', lower: 'j', word: 'Jellyfish', emoji: '🪼', hint: 'J looks like a fish hook',       shapeHint: 'hook',       color: '#6366f1', bgGradient: 'from-indigo-200 via-violet-200 to-purple-200' },
  // { letter: 'K', lower: 'k', word: 'Kite',      emoji: '🪁', hint: 'K looks like a karate kick',     shapeHint: 'kick',       color: '#8b5cf6', bgGradient: 'from-violet-200 via-purple-200 to-fuchsia-200' },
  // { letter: 'L', lower: 'l', word: 'Lion',      emoji: '🦁', hint: 'L looks like a corner',          shapeHint: 'corner',     color: '#a855f7', bgGradient: 'from-purple-200 via-fuchsia-200 to-pink-200' },
  // { letter: 'M', lower: 'm', word: 'Moon',      emoji: '🌙', hint: 'M looks like two mountains',     shapeHint: 'mountains',  color: '#d946ef', bgGradient: 'from-fuchsia-200 via-pink-200 to-rose-200' },
  // { letter: 'N', lower: 'n', word: 'Nest',      emoji: '🪺', hint: 'N looks like a zigzag',          shapeHint: 'zigzag',     color: '#ec4899', bgGradient: 'from-pink-200 via-rose-200 to-red-200' },
  // { letter: 'O', lower: 'o', word: 'Orange',    emoji: '🍊', hint: 'O looks like a ball',            shapeHint: 'ball',       color: '#f43f5e', bgGradient: 'from-rose-200 via-red-200 to-orange-200' },
  // { letter: 'P', lower: 'p', word: 'Panda',     emoji: '🐼', hint: 'P looks like a balloon',         shapeHint: 'balloon',    color: '#ef4444', bgGradient: 'from-red-200 via-rose-200 to-pink-200' },
  // { letter: 'Q', lower: 'q', word: 'Queen',     emoji: '👑', hint: 'Q looks like O with a tail',     shapeHint: 'tail',       color: '#f97316', bgGradient: 'from-orange-200 via-amber-200 to-yellow-200' },
  // { letter: 'R', lower: 'r', word: 'Rabbit',    emoji: '🐰', hint: 'R looks like a running person',  shapeHint: 'runner',     color: '#eab308', bgGradient: 'from-yellow-200 via-amber-200 to-orange-200' },
  // { letter: 'S', lower: 's', word: 'Snake',     emoji: '🐍', hint: 'S looks like a snake',           shapeHint: 'snake',      color: '#84cc16', bgGradient: 'from-lime-200 via-green-200 to-teal-200' },
  // { letter: 'T', lower: 't', word: 'Tree',      emoji: '🌳', hint: 'T looks like a hammer',          shapeHint: 'hammer',     color: '#22c55e', bgGradient: 'from-green-200 via-emerald-200 to-teal-200' },
  // { letter: 'U', lower: 'u', word: 'Umbrella',  emoji: '☂️', hint: 'U looks like a cup',             shapeHint: 'cup',        color: '#14b8a6', bgGradient: 'from-teal-200 via-cyan-200 to-blue-200' },
  // { letter: 'V', lower: 'v', word: 'Volcano',   emoji: '🌋', hint: 'V looks like a valley',          shapeHint: 'valley',     color: '#06b6d4', bgGradient: 'from-cyan-200 via-sky-200 to-indigo-200' },
  // { letter: 'W', lower: 'w', word: 'Whale',     emoji: '🐋', hint: 'W looks like waves',             shapeHint: 'waves',      color: '#0ea5e9', bgGradient: 'from-sky-200 via-blue-200 to-violet-200' },
  // { letter: 'X', lower: 'x', word: 'Xylophone', emoji: '🎹', hint: 'X looks like a crisscross',      shapeHint: 'crisscross', color: '#8b5cf6', bgGradient: 'from-violet-200 via-purple-200 to-pink-200' },
  // { letter: 'Y', lower: 'y', word: 'Yo-yo',     emoji: '🪀', hint: 'Y looks like a slingshot',       shapeHint: 'slingshot',  color: '#d946ef', bgGradient: 'from-fuchsia-200 via-pink-200 to-rose-200' },
  // { letter: 'Z', lower: 'z', word: 'Zebra',     emoji: '🦓', hint: 'Z looks like a zigzag',          shapeHint: 'zigzag',     color: '#ec4899', bgGradient: 'from-pink-200 via-rose-200 to-red-200' },
  
];

export const getLetter = (letter: string): AlphabetEntry | undefined =>
  ALPHABET.find((e) => e.letter.toLowerCase() === letter.toLowerCase());
