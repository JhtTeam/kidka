import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ALPHABET, getLetter } from '../data/alphabet';
import { LetterCard } from '../components/LetterCard';
import { BigButton } from '../components/BigButton';
import { Mascot } from '../components/Mascot';
import { PageTitle } from '../components/PageTitle';
import { useProgress } from '../hooks/useProgress';
import { speak } from '../utils/audio';

export function Learn() {
  const { letter } = useParams<{ letter?: string }>();
  const navigate = useNavigate();
  const { progress, markLearned } = useProgress();

  // Grid view when no specific letter is selected.
  if (!letter) {
    return (
      <>
        <PageTitle emoji="🔤" title="Learn the Alphabet" subtitle="Tap a letter to hear it!" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {ALPHABET.map((entry) => (
            <LetterCard
              key={entry.letter}
              entry={entry}
              size="md"
              learned={progress.learned.includes(entry.letter)}
              stars={progress.stars[entry.letter] ?? 0}
              onClick={() => navigate(`/learn/${entry.letter}`)}
            />
          ))}
        </div>
      </>
    );
  }

  return <LearnSingle code={letter} key={letter} markLearned={markLearned} navigate={navigate} />;
}

interface SingleProps {
  code: string;
  markLearned: (letter: string) => void;
  navigate: (path: string) => void;
}

function LearnSingle({ code, markLearned, navigate }: SingleProps) {
  const entry = useMemo(() => getLetter(code), [code]);
  const idx = ALPHABET.findIndex((e) => e.letter === entry?.letter);
  const prev = idx > 0 ? ALPHABET[idx - 1] : ALPHABET[ALPHABET.length - 1];
  const next = idx < ALPHABET.length - 1 ? ALPHABET[idx + 1] : ALPHABET[0];

  // Speak the letter and example word when arriving on a new card.
  useEffect(() => {
    if (!entry) return;
    markLearned(entry.letter);
    const t = setTimeout(() => {
      speak(`${entry.letter}. ${entry.word}.`);
    }, 350);
    return () => clearTimeout(t);
  }, [entry, markLearned]);

  if (!entry) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold">Letter not found 😢</p>
        <BigButton className="mt-6" onClick={() => navigate('/learn')}>Back to letters</BigButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className={`relative w-full max-w-3xl rounded-[3rem] bg-gradient-to-br ${entry.bgGradient} p-6 shadow-pop sm:p-10`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={entry.letter}
            initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <button
              onClick={() => speak(`${entry.letter}. ${entry.word}.`)}
              className="font-display text-[12rem] font-bold leading-none drop-shadow-[0_8px_0_rgba(0,0,0,0.18)] sm:text-[16rem]"
              style={{ color: entry.color }}
              aria-label={`Hear letter ${entry.letter}`}
            >
              {entry.letter}
              <span className="ml-2 text-7xl sm:text-9xl" style={{ color: entry.color, opacity: 0.7 }}>
                {entry.lower}
              </span>
            </button>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl sm:text-9xl"
              aria-hidden
            >
              {entry.emoji}
            </motion.div>

            <div className="rounded-3xl bg-white/85 px-5 py-3 shadow-cute backdrop-blur dark:bg-slate-800/85">
              <p className="font-display text-2xl font-bold text-slate-700 dark:text-slate-100 sm:text-3xl">
                {entry.word}
              </p>
              <p className="text-base font-semibold text-slate-600 sm:text-lg dark:text-slate-300">
                {entry.hint}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <Mascot message={entry.hint} bouncing={false} />

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <BigButton variant="soft" onClick={() => navigate(`/learn/${prev.letter}`)}>
          <span className="text-2xl">⬅️</span> {prev.letter}
        </BigButton>
        <BigButton variant="accent" onClick={() => speak(`${entry.letter}. ${entry.word}.`)}>
          🔊 Hear it
        </BigButton>
        <BigButton variant="primary" onClick={() => navigate(`/practice/${entry.letter}`)}>
          ✏️ Trace it
        </BigButton>
        <BigButton variant="soft" onClick={() => navigate(`/learn/${next.letter}`)}>
          {next.letter} <span className="text-2xl">➡️</span>
        </BigButton>
      </div>
    </div>
  );
}
