import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface Props {
  message?: string;
  className?: string;
  size?: number;
  bouncing?: boolean;
}

// A cute mascot bear that guides the child through the app.
export function Mascot({ message, className, size = 96, bouncing = true }: Props) {
  return (
    <div className={cn('flex items-end gap-3', className)}>
      <motion.div
        animate={bouncing ? { y: [0, -8, 0] } : undefined}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg viewBox="0 0 120 120" width={size} height={size}>
          <defs>
            <radialGradient id="face" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
          {/* Ears */}
          <circle cx="28" cy="32" r="16" fill="#b45309" />
          <circle cx="92" cy="32" r="16" fill="#b45309" />
          <circle cx="28" cy="32" r="9" fill="#fcd34d" />
          <circle cx="92" cy="32" r="9" fill="#fcd34d" />
          {/* Head */}
          <circle cx="60" cy="64" r="42" fill="url(#face)" />
          {/* Cheeks */}
          <circle cx="36" cy="74" r="7" fill="#fda4af" opacity="0.7" />
          <circle cx="84" cy="74" r="7" fill="#fda4af" opacity="0.7" />
          {/* Eyes */}
          <circle cx="46" cy="60" r="5" fill="#1f2937" />
          <circle cx="74" cy="60" r="5" fill="#1f2937" />
          <circle cx="47.5" cy="58.5" r="1.6" fill="#fff" />
          <circle cx="75.5" cy="58.5" r="1.6" fill="#fff" />
          {/* Snout */}
          <ellipse cx="60" cy="78" rx="14" ry="10" fill="#fde68a" />
          <circle cx="60" cy="74" r="3.5" fill="#1f2937" />
          {/* Smile */}
          <path d="M52 82 Q60 90 68 82" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
      {message ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="relative max-w-xs rounded-3xl bg-white px-5 py-3 text-base font-semibold text-slate-700 shadow-cute ring-2 ring-pink-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-pink-700"
        >
          <span className="absolute -left-2 bottom-3 h-4 w-4 rotate-45 bg-white ring-2 ring-pink-200 dark:bg-slate-800 dark:ring-pink-700" />
          <span className="relative">{message}</span>
        </motion.div>
      ) : null}
    </div>
  );
}
