import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { WORD_TOPICS, getTopic } from '../data/words';
import type { WordEntry, WordTopic } from '../data/words';
import { BigButton } from '../components/BigButton';
import { Mascot } from '../components/Mascot';
import { PageTitle } from '../components/PageTitle';
import { Confetti } from '../components/Confetti';
import { cheer, encourage, speak, speakSequence } from '../utils/audio';
import { useProgress } from '../hooks/useProgress';

// Show the real picture when it exists, otherwise fall back to the emoji.
// onError covers the gap before a real image is dropped into public/images/words.
function WordImage({
  entry,
  className,
  emojiClassName,
}: {
  entry: WordEntry;
  className?: string;
  emojiClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (entry.image && !failed) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}${entry.image}`}
        alt={entry.display}
        onError={() => setFailed(true)}
        className={className ?? 'h-40 w-40 rounded-3xl object-cover sm:h-52 sm:w-52'}
      />
    );
  }
  return (
    <span className={emojiClassName ?? 'text-8xl drop-shadow sm:text-9xl'} aria-hidden>
      {entry.emoji}
    </span>
  );
}

export function Review() {
  const { topicId } = useParams<{ topicId?: string }>();
  const navigate = useNavigate();

  if (!topicId) {
    return (
      <>
        <PageTitle emoji="🔁" title="Review Words" subtitle="Pick a topic to practise the words you know!" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORD_TOPICS.map((topic) => (
            <motion.button
              key={topic.id}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/review/${topic.id}`)}
              className={`flex items-center gap-4 rounded-[2rem] bg-gradient-to-br ${topic.bgGradient} px-6 py-6 text-left shadow-pop`}
            >
              <span className="text-6xl drop-shadow" aria-hidden>{topic.emoji}</span>
              <span>
                <span className="block font-display text-2xl font-bold text-slate-800">{topic.title}</span>
                <span className="block text-sm font-semibold text-slate-700">{topic.words.length} words</span>
              </span>
            </motion.button>
          ))}
        </div>
      </>
    );
  }

  const topic = getTopic(topicId);
  if (!topic) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold">Topic not found 😢</p>
        <BigButton className="mt-6" onClick={() => navigate('/review')}>Back to topics</BigButton>
      </div>
    );
  }

  return <ReviewTopic topic={topic} key={topic.id} navigate={navigate} />;
}

interface TopicProps {
  topic: WordTopic;
  navigate: (path: string) => void;
}

function ReviewTopic({ topic, navigate }: TopicProps) {
  const [mode, setMode] = useState<'cards' | 'quiz'>('cards');

  return (
    <>
      <PageTitle
        emoji={topic.emoji}
        title={topic.title}
        subtitle={mode === 'cards' ? 'Look, listen and say the word!' : 'Listen, then tap the right picture!'}
      />
      {mode === 'cards' ? (
        <Flashcards topic={topic} onPlayQuiz={() => setMode('quiz')} onBack={() => navigate('/review')} />
      ) : (
        <Quiz topic={topic} onReplay={() => setMode('cards')} onBack={() => navigate('/review')} />
      )}
    </>
  );
}

// --- Flashcards -------------------------------------------------------------

function Flashcards({ topic, onPlayQuiz, onBack }: { topic: WordTopic; onPlayQuiz: () => void; onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const entry = topic.words[index];
  const isLast = index === topic.words.length - 1;

  // Speak the word, then the sentence, whenever a new card appears. The
  // sentence only starts after the word clip finishes, so longer words like
  // "Librarian" are never cut off.
  useEffect(() => {
    let cancel: (() => void) | undefined;
    const t = setTimeout(() => {
      cancel = speakSequence([entry.display, entry.sentence]);
    }, 350);
    return () => {
      clearTimeout(t);
      cancel?.();
    };
  }, [entry]);

  const sayAgain = () => speakSequence([entry.display, entry.sentence]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className={`relative w-full max-w-3xl rounded-[3rem] bg-gradient-to-br ${entry.bgGradient} p-6 shadow-pop sm:p-10`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={entry.word}
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="flex flex-col items-center gap-5 text-center"
          >
            <motion.button
              onClick={sayAgain}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              aria-label={`Hear ${entry.display}`}
            >
              <WordImage entry={entry} />
            </motion.button>

            <div className="rounded-3xl bg-white/85 px-6 py-4 shadow-cute backdrop-blur dark:bg-slate-800/85">
              <p className="font-display text-3xl font-bold sm:text-4xl" style={{ color: entry.color }}>
                {entry.display}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-600 sm:text-xl dark:text-slate-300">
                {entry.sentence}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-center gap-2" aria-hidden>
          {topic.words.map((w, i) => (
            <span
              key={w.word}
              className={`h-2.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2.5 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <Mascot message={entry.sentence} bouncing={false} />

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <BigButton variant="soft" onClick={() => setIndex((i) => (i > 0 ? i - 1 : i))}>
          <span className="text-2xl">⬅️</span> Back
        </BigButton>
        <BigButton variant="accent" onClick={sayAgain}>🔊 Hear it</BigButton>
        {isLast ? (
          <BigButton variant="primary" onClick={onPlayQuiz}>🎯 Play quiz</BigButton>
        ) : (
          <BigButton variant="soft" onClick={() => setIndex((i) => i + 1)}>
            Next <span className="text-2xl">➡️</span>
          </BigButton>
        )}
      </div>

      <button onClick={onBack} className="text-sm font-semibold text-slate-600 underline dark:text-slate-300">
        ← All topics
      </button>
    </div>
  );
}

// --- Mini quiz: listen and tap the picture ----------------------------------

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

interface Round {
  target: WordEntry;
  choices: WordEntry[];
}

function buildRounds(topic: WordTopic): Round[] {
  return shuffle(topic.words).map((target) => {
    const distractors = shuffle(topic.words.filter((w) => w.word !== target.word)).slice(0, 3);
    return { target, choices: shuffle([target, ...distractors]) };
  });
}

function Quiz({ topic, onReplay, onBack }: { topic: WordTopic; onReplay: () => void; onBack: () => void }) {
  const { addGameWin } = useProgress();
  const [rounds, setRounds] = useState(() => buildRounds(topic));
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);

  const round = rounds[step];
  const done = step >= rounds.length;

  // Speak the prompt word at the start of each round.
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => speak(round.target.display), 400);
    return () => clearTimeout(t);
  }, [step, round, done]);

  // Celebrate once when the quiz is finished.
  useEffect(() => {
    if (!done) return;
    cheer();
    const on = setTimeout(() => setConfetti(true), 0);
    const off = setTimeout(() => setConfetti(false), 1500);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [done]);

  const pick = (choice: WordEntry) => {
    if (locked) return;
    if (choice.word === round.target.word) {
      setLocked(true);
      cheer();
      addGameWin();
      setScore((s) => s + 1);
      setConfetti(true);
      setTimeout(() => {
        setConfetti(false);
        setWrong(null);
        setLocked(false);
        setStep((s) => s + 1);
      }, 900);
    } else {
      setWrong(choice.word);
      encourage();
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <Confetti show={confetti} />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="text-8xl"
          aria-hidden
        >
          🌟
        </motion.div>
        <p className="font-display text-3xl font-bold text-pink-700 dark:text-pink-200">
          You got {score} / {rounds.length}!
        </p>
        <Mascot message="Great reviewing! Want to go again?" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <BigButton
            variant="primary"
            onClick={() => {
              setRounds(buildRounds(topic));
              setStep(0);
              setScore(0);
            }}
          >
            🔁 Play again
          </BigButton>
          <BigButton variant="soft" onClick={onReplay}>📖 See cards</BigButton>
          <BigButton variant="soft" onClick={onBack}>🏫 Topics</BigButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-white/80 px-4 py-1 text-sm font-bold text-slate-700 shadow-cute dark:bg-slate-800/80 dark:text-slate-200">
          {step + 1} / {rounds.length}
        </span>
        <span className="rounded-full bg-white/80 px-4 py-1 text-sm font-bold text-amber-600 shadow-cute dark:bg-slate-800/80">
          ⭐ {score}
        </span>
      </div>

      <BigButton size="xl" variant="accent" onClick={() => speak(round.target.display)}>
        🔊 {round.target.display}
      </BigButton>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {round.choices.map((choice) => {
          const isWrong = wrong === choice.word;
          return (
            <motion.button
              key={choice.word}
              whileHover={{ scale: locked ? 1 : 1.06 }}
              whileTap={{ scale: locked ? 1 : 0.94 }}
              animate={isWrong ? { x: [0, -8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
              onClick={() => pick(choice)}
              className={`flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-cute ring-4 sm:h-40 sm:w-40 dark:bg-slate-800 ${
                isWrong ? 'ring-red-300' : 'ring-pink-200 dark:ring-pink-700'
              }`}
              aria-label={`Pick ${choice.display}`}
            >
              <WordImage
                entry={choice}
                className="h-24 w-24 rounded-2xl object-cover sm:h-32 sm:w-32"
                emojiClassName="text-6xl sm:text-7xl"
              />
            </motion.button>
          );
        })}
      </div>

      <Mascot message="Listen to the word, then tap its picture!" />
      <Confetti show={confetti} />
    </div>
  );
}
