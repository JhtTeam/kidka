import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ALPHABET } from '../data/alphabet';
import { BigButton } from '../components/BigButton';
import { Confetti } from '../components/Confetti';
import { Mascot } from '../components/Mascot';
import { cheer, encourage, playClick } from '../utils/audio';
import { useProgress } from '../hooks/useProgress';

interface Card {
  id: number;
  pairId: number;
  kind: 'letter' | 'image';
  letter: string;
  emoji: string;
  color: string;
  gradient: string;
}

function buildBoard(pairs = 6): Card[] {
  const chosen = [...ALPHABET].sort(() => Math.random() - 0.5).slice(0, pairs);
  const cards: Card[] = chosen.flatMap((entry, i) => [
    { id: i * 2,     pairId: i, kind: 'letter', letter: entry.letter, emoji: entry.emoji, color: entry.color, gradient: entry.bgGradient },
    { id: i * 2 + 1, pairId: i, kind: 'image',  letter: entry.letter, emoji: entry.emoji, color: entry.color, gradient: entry.bgGradient },
  ]);
  return cards.sort(() => Math.random() - 0.5);
}

export function MemoryGame() {
  const { addGameWin } = useProgress();
  const [cards, setCards] = useState<Card[]>(() => buildBoard());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [confetti, setConfetti] = useState(false);

  const restart = () => {
    setCards(buildBoard());
    setFlipped([]);
    setMatched([]);
  };

  const tap = (card: Card) => {
    if (flipped.includes(card.id) || matched.includes(card.pairId) || flipped.length === 2) return;
    playClick();
    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length === 2) {
      const [a, b] = next.map((id) => cards.find((c) => c.id === id)!);
      if (a.pairId === b.pairId) {
        setTimeout(() => {
          cheer();
          setMatched((m) => [...m, a.pairId]);
          setFlipped([]);
        }, 350);
      } else {
        setTimeout(() => {
          encourage();
          setFlipped([]);
        }, 800);
      }
    }
  };

  const allMatched = matched.length > 0 && matched.length === cards.length / 2;

  useEffect(() => {
    if (allMatched) {
      addGameWin();
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 1800);
      return () => clearTimeout(t);
    }
  }, [allMatched, addGameWin]);

  const board = useMemo(() => cards, [cards]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="font-display text-3xl font-bold text-pink-700 dark:text-pink-200">
        Find the matching pairs
      </h2>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {board.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.pairId);
          return (
            <motion.button
              key={card.id}
              onClick={() => tap(card)}
              whileTap={{ scale: 0.95 }}
              className="relative h-24 w-20 sm:h-32 sm:w-28"
              aria-label={isFlipped ? `Card showing ${card.letter}` : 'Hidden card'}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-fuchsia-500 text-4xl text-white shadow-cute"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  ❓
                </div>
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-4xl font-bold shadow-cute sm:text-5xl`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', color: card.color }}
                >
                  {card.kind === 'letter' ? card.letter : <span aria-hidden>{card.emoji}</span>}
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {allMatched ? (
        <Mascot message="You found them all! 🎉" />
      ) : (
        <Mascot message="Tap two cards to find a pair!" />
      )}

      <BigButton size="md" variant="ghost" onClick={restart}>
        🔄 New board
      </BigButton>

      <Confetti show={confetti} />
    </div>
  );
}
