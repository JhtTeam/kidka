import { motion } from 'framer-motion';
import type { AlphabetEntry } from '../types';
import { cn } from '../utils/cn';
import { speak } from '../utils/audio';

interface Props {
  entry: AlphabetEntry;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  learned?: boolean;
  stars?: number;
  className?: string;
}

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-24 w-24 text-4xl',
  md: 'h-36 w-36 text-6xl',
  lg: 'h-48 w-48 text-7xl',
  xl: 'h-64 w-64 text-9xl',
};

// Reusable card that shows a single letter. Used in grids, games, and the learn page.
export function LetterCard({ entry, size = 'md', onClick, learned, stars = 0, className }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 360, damping: 18 }}
      onClick={() => {
        speak(entry.letter);
        onClick?.();
      }}
      className={cn(
        'relative flex items-center justify-center rounded-[2rem] font-display font-bold shadow-cute',
        `bg-gradient-to-br ${entry.bgGradient}`,
        'text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.18)]',
        sizeClass[size],
        className,
      )}
      style={{ color: entry.color }}
      aria-label={`Letter ${entry.letter} for ${entry.word}`}
    >
      <span className="relative z-10">{entry.letter}</span>
      {learned ? (
        <span className="absolute top-2 right-2 text-2xl" aria-hidden>
          ✅
        </span>
      ) : null}
      {stars > 0 ? (
        <span className="absolute bottom-2 left-0 right-0 flex justify-center gap-0.5 text-base">
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        </span>
      ) : null}
    </motion.button>
  );
}
