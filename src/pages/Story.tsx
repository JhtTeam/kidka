import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ALPHABET } from '../data/alphabet';
import { Mascot } from '../components/Mascot';
import { BigButton } from '../components/BigButton';
import { speak } from '../utils/audio';
import { useProgress } from '../hooks/useProgress';

// Story Mode — a friendly mascot narrates the alphabet one letter at a time.
export function Story() {
  const navigate = useNavigate();
  const { markLearned } = useProgress();
  const [idx, setIdx] = useState(0);
  const entry = ALPHABET[idx];
  const scriptLine = useMemo(() => {
    const intros = [
      `Today we will learn the letter ${entry.letter}!`,
      `Here comes the letter ${entry.letter}!`,
      `Look! It's the letter ${entry.letter}.`,
    ];
    return `${intros[idx % intros.length]} ${entry.letter} is for ${entry.word}. ${entry.hint}.`;
  }, [entry, idx]);

  useEffect(() => {
    markLearned(entry.letter);
    const t = setTimeout(() => speak(scriptLine), 350);
    return () => clearTimeout(t);
  }, [entry, scriptLine, markLearned]);

  const next = () => setIdx((i) => Math.min(i + 1, ALPHABET.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));
  const last = idx === ALPHABET.length - 1;

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        key={entry.letter}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        className={`flex w-full max-w-3xl flex-col items-center gap-4 rounded-[3rem] bg-gradient-to-br ${entry.bgGradient} p-8 shadow-pop sm:p-12`}
      >
        <span className="font-display text-[10rem] font-bold leading-none drop-shadow-[0_8px_0_rgba(0,0,0,0.18)] sm:text-[14rem]" style={{ color: entry.color }}>
          {entry.letter}
        </span>
        <span className="text-7xl sm:text-8xl" aria-hidden>{entry.emoji}</span>
        <span className="font-display text-2xl font-bold text-slate-800 sm:text-3xl">{entry.word}</span>
      </motion.div>

      <Mascot message={scriptLine} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        <BigButton variant="soft" onClick={prev}>⬅️ Back</BigButton>
        <BigButton variant="accent" onClick={() => speak(scriptLine)}>🔊 Again</BigButton>
        {last ? (
          <BigButton variant="primary" onClick={() => navigate('/progress')}>
            🏆 Finish
          </BigButton>
        ) : (
          <BigButton variant="primary" onClick={next}>
            Next ➡️
          </BigButton>
        )}
      </div>
    </div>
  );
}
