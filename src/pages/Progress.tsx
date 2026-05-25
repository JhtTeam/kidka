import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTitle } from '../components/PageTitle';
import { BigButton } from '../components/BigButton';
import { LetterCard } from '../components/LetterCard';
import { Mascot } from '../components/Mascot';
import { useProgress } from '../hooks/useProgress';
import { ALPHABET } from '../data/alphabet';

export function ProgressPage() {
  const { progress, reset } = useProgress();
  const [confirm, setConfirm] = useState(false);
  const totalStars = Object.values(progress.stars).reduce((a, b) => a + b, 0);
  const learnedPct = Math.round((progress.learned.length / ALPHABET.length) * 100);

  return (
    <>
      <PageTitle emoji="⭐" title="My Progress" subtitle="Look at all the letters you've learned!" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat emoji="🔤" value={`${progress.learned.length}/26`} label="Learned" />
        <Stat emoji="✏️" value={progress.traced.length} label="Traced" />
        <Stat emoji="⭐" value={totalStars} label="Stars" />
        <Stat emoji="🏆" value={progress.gameWins} label="Wins" />
      </div>

      <div className="mb-6 overflow-hidden rounded-full bg-white/80 p-1 shadow-cute dark:bg-slate-800/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${learnedPct}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="h-6 rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-500 to-amber-400 text-center text-xs font-bold leading-6 text-white"
        >
          {learnedPct}%
        </motion.div>
      </div>

      <Mascot
        message={
          learnedPct === 100
            ? 'You learned them all! 🎉'
            : learnedPct >= 50
              ? 'Halfway there — keep going!'
              : 'Great start! Tap Learn to keep going!'
        }
      />

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {ALPHABET.map((entry) => (
          <LetterCard
            key={entry.letter}
            entry={entry}
            size="md"
            learned={progress.learned.includes(entry.letter)}
            stars={progress.stars[entry.letter] ?? 0}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 border-t border-white/40 pt-6 dark:border-slate-700/40">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">For parents</p>
        {confirm ? (
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <BigButton variant="primary" onClick={() => { reset(); setConfirm(false); }}>
              Yes, reset
            </BigButton>
            <BigButton variant="ghost" onClick={() => setConfirm(false)}>
              Cancel
            </BigButton>
          </div>
        ) : (
          <BigButton size="md" variant="ghost" onClick={() => setConfirm(true)}>
            🔄 Reset progress
          </BigButton>
        )}
      </div>
    </>
  );
}

interface StatProps {
  emoji: string;
  value: number | string;
  label: string;
}

function Stat({ emoji, value, label }: StatProps) {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      className="rounded-3xl bg-white/85 px-4 py-4 text-center shadow-cute backdrop-blur dark:bg-slate-800/85"
    >
      <div className="text-3xl" aria-hidden>{emoji}</div>
      <div className="font-display text-2xl font-bold text-pink-600 dark:text-pink-200">{value}</div>
      <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</div>
    </motion.div>
  );
}
