import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ALPHABET } from '../data/alphabet';
import type { AlphabetEntry } from '../types';
import { BigButton } from '../components/BigButton';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Confetti';
import { cheer, encourage } from '../utils/audio';
import { useProgress } from '../hooks/useProgress';

// Puzzle: drag the lowercase letter onto its matching uppercase slot.
function pickRound(): AlphabetEntry[] {
  return [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, 4);
}

export function PuzzleGame() {
  const { addGameWin } = useProgress();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [entries, setEntries] = useState<AlphabetEntry[]>(() => pickRound());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [confetti, setConfetti] = useState(false);

  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allDone = matched.size === entries.length;

  const onDragEnd = (entry: AlphabetEntry, point: { x: number; y: number }) => {
    const slot = slotRefs.current[entry.letter];
    if (!slot) return;
    const rect = slot.getBoundingClientRect();
    const inside =
      point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
    if (inside) {
      cheer();
      const next = new Set(matched);
      next.add(entry.letter);
      setMatched(next);
      if (next.size === entries.length) {
        addGameWin();
        setConfetti(true);
        setTimeout(() => setConfetti(false), 1800);
      }
    } else {
      encourage();
    }
  };

  const newRound = () => {
    setEntries(pickRound());
    setMatched(new Set());
  };

  const tiles = useMemo(() => [...entries].sort(() => Math.random() - 0.5), [entries]);

  return (
    <div className="flex flex-col items-center gap-6" ref={containerRef}>
      <h2 className="font-display text-3xl font-bold text-pink-700 dark:text-pink-200">
        Drag the small letter onto its big letter
      </h2>

      <div className="grid w-full max-w-2xl grid-cols-4 gap-3">
        {entries.map((entry) => (
          <div
            key={`slot-${entry.letter}`}
            ref={(el) => {
              slotRefs.current[entry.letter] = el;
            }}
            className={`flex aspect-square items-center justify-center rounded-3xl border-4 border-dashed font-display text-5xl font-bold shadow-inner sm:text-6xl ${
              matched.has(entry.letter)
                ? `border-transparent bg-gradient-to-br ${entry.bgGradient}`
                : 'border-pink-300 bg-white/70 dark:border-pink-700 dark:bg-slate-800/60'
            }`}
            style={{ color: entry.color }}
          >
            {matched.has(entry.letter) ? entry.letter : <span className="opacity-40">{entry.letter}</span>}
          </div>
        ))}
      </div>

      <div className="grid w-full max-w-2xl grid-cols-4 gap-3">
        {tiles.map((entry) => (
          <motion.button
            key={`tile-${entry.letter}`}
            drag={!matched.has(entry.letter)}
            dragSnapToOrigin
            whileDrag={{ scale: 1.15, zIndex: 10 }}
            onDragEnd={(_, info) => onDragEnd(entry, { x: info.point.x, y: info.point.y })}
            className={`aspect-square rounded-3xl font-display text-5xl font-bold shadow-cute sm:text-6xl ${
              matched.has(entry.letter)
                ? 'bg-gray-200 text-gray-400 dark:bg-slate-700 dark:text-slate-500'
                : `bg-gradient-to-br ${entry.bgGradient}`
            }`}
            style={{ color: matched.has(entry.letter) ? undefined : entry.color, touchAction: 'none' }}
            aria-label={`Drag letter ${entry.lower}`}
            disabled={matched.has(entry.letter)}
          >
            {entry.lower}
          </motion.button>
        ))}
      </div>

      {allDone ? (
        <Mascot message="All matched! Awesome! 🎉" />
      ) : (
        <Mascot message="Drag the little letters home." />
      )}

      <BigButton size="md" variant="ghost" onClick={newRound}>
        🔄 New puzzle
      </BigButton>

      <Confetti show={confetti} />
    </div>
  );
}
