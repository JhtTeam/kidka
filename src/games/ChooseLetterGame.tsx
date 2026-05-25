import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ALPHABET } from '../data/alphabet';
import type { AlphabetEntry } from '../types';
import { BigButton } from '../components/BigButton';
import { Confetti } from '../components/Confetti';
import { Mascot } from '../components/Mascot';
import { cheer, encourage, speak } from '../utils/audio';
import { useProgress } from '../hooks/useProgress';

// Hear & Pick: app speaks a letter; child taps the right one out of 4.
function pickRound(): { target: AlphabetEntry; choices: AlphabetEntry[] } {
  const pool = [...ALPHABET].sort(() => Math.random() - 0.5);
  const choices = pool.slice(0, 4);
  const target = choices[Math.floor(Math.random() * 4)];
  return { target, choices };
}

export function ChooseLetterGame() {
  const { addGameWin } = useProgress();
  const [round, setRound] = useState(() => pickRound());
  const [streak, setStreak] = useState(0);
  const [confetti, setConfetti] = useState(false);

  const sayLetter = useCallback(() => speak(round.target.letter), [round]);

  useEffect(() => {
    const t = setTimeout(sayLetter, 400);
    return () => clearTimeout(t);
  }, [sayLetter]);

  const onPick = (entry: AlphabetEntry) => {
    if (entry.letter === round.target.letter) {
      cheer();
      addGameWin();
      setStreak((s) => s + 1);
      setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
        setRound(pickRound());
      }, 900);
    } else {
      encourage();
      setStreak(0);
    }
  };

  const grid = useMemo(() => round.choices, [round]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-display text-3xl font-bold text-pink-700 dark:text-pink-200">
        Tap the letter you hear
      </h2>
      <BigButton size="xl" variant="accent" onClick={sayLetter}>
        🔊 Hear it again
      </BigButton>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {grid.map((entry) => (
          <motion.button
            key={entry.letter}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onPick(entry)}
            className={`flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br ${entry.bgGradient} font-display text-6xl font-bold shadow-cute sm:h-40 sm:w-40 sm:text-7xl`}
            style={{ color: entry.color }}
            aria-label={`Pick letter ${entry.letter}`}
          >
            {entry.letter}
          </motion.button>
        ))}
      </div>
      <Mascot message={streak > 1 ? `${streak} in a row! 🎉` : 'Listen carefully!'} />
      <Confetti show={confetti} />
    </div>
  );
}
