import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ALPHABET } from '../data/alphabet';
import type { AlphabetEntry } from '../types';
import { BigButton } from '../components/BigButton';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Confetti';
import { cheer, encourage, speak } from '../utils/audio';
import { useProgress } from '../hooks/useProgress';

// Match It: show one big picture and 4 letter options.
function pickRound(): { target: AlphabetEntry; choices: AlphabetEntry[] } {
  const pool = [...ALPHABET].sort(() => Math.random() - 0.5);
  const choices = pool.slice(0, 4);
  const target = choices[Math.floor(Math.random() * 4)];
  return { target, choices };
}

export function MatchImageGame() {
  const { addGameWin } = useProgress();
  const [round, setRound] = useState(() => pickRound());
  const [confetti, setConfetti] = useState(false);

  const onPick = (entry: AlphabetEntry) => {
    if (entry.letter === round.target.letter) {
      cheer();
      addGameWin();
      setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
        setRound(pickRound());
      }, 900);
    } else {
      encourage();
    }
  };

  const choices = useMemo(() => round.choices, [round]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-display text-3xl font-bold text-pink-700 dark:text-pink-200">
        Which letter is this?
      </h2>
      <motion.div
        key={round.target.letter}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        className={`flex flex-col items-center gap-2 rounded-[2.5rem] bg-gradient-to-br ${round.target.bgGradient} px-10 py-6 shadow-pop`}
      >
        <span className="text-8xl drop-shadow sm:text-9xl" aria-hidden>{round.target.emoji}</span>
        <span className="font-display text-2xl font-bold text-slate-800">{round.target.word}</span>
      </motion.div>

      <BigButton size="md" variant="accent" onClick={() => speak(round.target.word)}>
        🔊 Hear word
      </BigButton>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {choices.map((entry) => (
          <motion.button
            key={entry.letter}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onPick(entry)}
            className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white text-5xl font-bold text-pink-600 shadow-cute ring-4 ring-pink-200 sm:h-36 sm:w-36 sm:text-6xl dark:bg-slate-800 dark:text-pink-200 dark:ring-pink-700"
            aria-label={`Pick letter ${entry.letter}`}
          >
            {entry.letter}
          </motion.button>
        ))}
      </div>
      <Mascot message="Look at the picture, then pick its letter!" />
      <Confetti show={confetti} />
    </div>
  );
}
