import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { playClick } from '../utils/audio';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'accent' | 'soft' | 'ghost';
  size?: 'md' | 'lg' | 'xl';
  className?: string;
  type?: 'button' | 'submit';
  'aria-label'?: string;
}

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white shadow-cute hover:from-pink-500 hover:to-fuchsia-600',
  accent: 'bg-gradient-to-br from-amber-300 to-orange-400 text-amber-900 shadow-cute hover:from-amber-400 hover:to-orange-500',
  soft: 'bg-white text-pink-600 ring-4 ring-pink-200 shadow-cute hover:ring-pink-300 dark:bg-slate-800 dark:text-pink-200 dark:ring-pink-700',
  ghost: 'bg-white/70 text-slate-700 backdrop-blur hover:bg-white dark:bg-slate-800/70 dark:text-slate-100 dark:hover:bg-slate-800',
};

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  md: 'px-6 py-3 text-lg rounded-2xl',
  lg: 'px-8 py-4 text-xl rounded-3xl',
  xl: 'px-10 py-5 text-2xl rounded-[2rem]',
};

// Large, rounded, tactile button for tiny fingers.
export function BigButton({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  className,
  type = 'button',
  ...rest
}: Props) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      onClick={() => {
        playClick();
        onClick?.();
      }}
      className={cn(
        'font-display font-bold tracking-wide select-none transition-colors',
        'inline-flex items-center justify-center gap-3',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
