import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Props {
  count?: number;
  show: boolean;
}

const COLORS = ['#f472b6', '#facc15', '#34d399', '#60a5fa', '#a78bfa', '#fb7185'];

// Lightweight CSS-animated confetti — no extra library needed.
export function Confetti({ count = 32, show }: Props) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.2 + Math.random() * 1.2,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        size: 8 + Math.random() * 10,
      })),
    [count],
  );

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: 4,
          }}
        />
      ))}
    </div>
  );
}
