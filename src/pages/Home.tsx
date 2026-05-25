import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BigButton } from '../components/BigButton';
import { Mascot } from '../components/Mascot';
import { useProgress } from '../hooks/useProgress';
import { ALPHABET } from '../data/alphabet';
import { speak } from '../utils/audio';

export function Home() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const learnedCount = progress.learned.length;
  const totalStars = Object.values(progress.stars).reduce((a, b) => a + b, 0);
  const nextLetter = ALPHABET.find((l) => !progress.learned.includes(l.letter)) ?? ALPHABET[0];

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-5xl font-bold leading-tight text-pink-700 drop-shadow-md sm:text-7xl dark:text-pink-200"
      >
        Let's learn the<br />
        <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
          ABC!
        </span>
      </motion.h1>

      <Mascot
        message={`Hi! Today let's learn the letter ${nextLetter.letter}!`}
        size={140}
      />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <BigButton
          size="xl"
          onClick={() => {
            speak("Let's go!");
            navigate(`/learn/${nextLetter.letter}`);
          }}
        >
          <span className="text-3xl">▶️</span>
          Start Learning
        </BigButton>
        <BigButton size="lg" variant="accent" onClick={() => navigate('/games')}>
          <span className="text-2xl">🎮</span>
          Play Games
        </BigButton>
        <BigButton size="lg" variant="soft" onClick={() => navigate('/story')}>
          <span className="text-2xl">📖</span>
          Story Mode
        </BigButton>
      </div>

      <div className="mt-4 grid w-full max-w-2xl grid-cols-3 gap-3 sm:gap-5">
        <StatCard emoji="🔤" label="Letters" value={`${learnedCount}/26`} />
        <StatCard emoji="⭐" label="Stars" value={totalStars} />
        <StatCard emoji="🏆" label="Wins" value={progress.gameWins} />
      </div>
    </div>
  );
}

interface StatProps {
  emoji: string;
  label: string;
  value: number | string;
}

function StatCard({ emoji, label, value }: StatProps) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      className="rounded-3xl bg-white/85 px-4 py-4 shadow-cute backdrop-blur dark:bg-slate-800/85"
    >
      <div className="text-3xl sm:text-4xl" aria-hidden>{emoji}</div>
      <div className="font-display text-2xl font-bold text-pink-600 sm:text-3xl dark:text-pink-200">{value}</div>
      <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</div>
    </motion.div>
  );
}
