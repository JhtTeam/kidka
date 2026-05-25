import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTitle } from '../components/PageTitle';
import { BigButton } from '../components/BigButton';
import type { GameKind } from '../types';
import { ChooseLetterGame } from '../games/ChooseLetterGame';
import { MatchImageGame } from '../games/MatchImageGame';
import { MemoryGame } from '../games/MemoryGame';
import { PuzzleGame } from '../games/PuzzleGame';

const GAMES: { kind: GameKind; emoji: string; title: string; subtitle: string; gradient: string }[] = [
  { kind: 'choose-letter', emoji: '🎯', title: 'Hear & Pick', subtitle: 'Tap the letter you hear', gradient: 'from-pink-400 to-rose-500' },
  { kind: 'match-image',   emoji: '🖼️', title: 'Match It',   subtitle: 'Match the picture to a letter', gradient: 'from-amber-300 to-orange-500' },
  { kind: 'memory',        emoji: '🧠', title: 'Memory',     subtitle: 'Find the matching pairs', gradient: 'from-emerald-400 to-teal-500' },
  { kind: 'puzzle',        emoji: '🧩', title: 'Puzzle',     subtitle: 'Drag the letter home', gradient: 'from-sky-400 to-indigo-500' },
];

export function Games() {
  const [active, setActive] = useState<GameKind | null>(null);

  if (active) {
    return (
      <div className="flex flex-col gap-5">
        <BigButton size="md" variant="ghost" className="self-start" onClick={() => setActive(null)}>
          ⬅️ Back to games
        </BigButton>
        {active === 'choose-letter' && <ChooseLetterGame />}
        {active === 'match-image' && <MatchImageGame />}
        {active === 'memory' && <MemoryGame />}
        {active === 'puzzle' && <PuzzleGame />}
      </div>
    );
  }

  return (
    <>
      <PageTitle emoji="🎮" title="Mini Games" subtitle="Pick a game to play!" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GAMES.map((g, i) => (
          <motion.button
            key={g.kind}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 240, damping: 18 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActive(g.kind)}
            className={`flex items-center gap-4 rounded-[2rem] bg-gradient-to-br ${g.gradient} p-6 text-left text-white shadow-pop`}
          >
            <span className="text-6xl drop-shadow" aria-hidden>{g.emoji}</span>
            <div>
              <div className="font-display text-2xl font-bold sm:text-3xl">{g.title}</div>
              <div className="text-sm font-semibold opacity-90 sm:text-base">{g.subtitle}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </>
  );
}
