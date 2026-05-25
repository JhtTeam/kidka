import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  emoji?: string;
  title: string;
  subtitle?: ReactNode;
}

export function PageTitle({ emoji, title, subtitle }: Props) {
  return (
    <div className="mb-6 flex items-center gap-4">
      {emoji ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
          transition={{ type: 'spring', stiffness: 240, damping: 14 }}
          className="text-5xl sm:text-6xl"
          aria-hidden
        >
          {emoji}
        </motion.span>
      ) : null}
      <div>
        <h1 className="font-display text-3xl font-bold text-pink-700 drop-shadow sm:text-4xl dark:text-pink-200">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-base font-medium text-slate-700 sm:text-lg dark:text-slate-200">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
