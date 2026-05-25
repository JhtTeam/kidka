// Core types used throughout the app.

export interface AlphabetEntry {
  letter: string; // Uppercase letter A-Z
  lower: string;  // Lowercase
  word: string;   // Example word e.g. "Apple"
  emoji: string;  // Cartoon-like emoji illustration
  hint: string;   // Visual hint e.g. "A looks like a mountain"
  shapeHint: string; // One-word shape resemblance
  color: string;  // Hex color for theming
  bgGradient: string; // Tailwind gradient classes for the card
}

export interface Progress {
  learned: string[];        // Letters the child has tapped through in Learn mode
  traced: string[];         // Letters the child has traced successfully
  stars: Record<string, number>; // Stars earned per letter (0-3)
  gameWins: number;         // Total mini-game victories
  lastVisited?: string;     // Last letter visited
}

export type GameKind = 'choose-letter' | 'match-image' | 'memory' | 'puzzle';
