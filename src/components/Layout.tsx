import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';
import { cn } from '../utils/cn';
import { FloatingShapes } from './FloatingShapes';
import { playClick } from '../utils/audio';

const NAV = [
  { to: '/', label: 'Home', emoji: '🏠' },
  { to: '/learn', label: 'Learn', emoji: '🔤' },
  { to: '/practice', label: 'Trace', emoji: '✏️' },
  { to: '/games', label: 'Games', emoji: '🎮' },
  { to: '/progress', label: 'Stars', emoji: '⭐' },
];

export function Layout() {
  const { dark, toggle } = useDarkMode();
  const location = useLocation();

  return (
    <div className={cn('relative min-h-screen overflow-hidden')}
      style={{
        backgroundImage: dark
          ? 'radial-gradient(circle at top, #4338ca 0%, #1e1b4b 60%)'
          : 'radial-gradient(circle at top, #fde68a 0%, #fbcfe8 50%, #bae6fd 100%)',
      }}
    >
      <FloatingShapes />

      <header className="relative z-10 flex items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6">
        <Link to="/" className="flex items-center gap-2 sm:gap-3" onClick={() => playClick()}>
          <motion.span
            initial={{ rotate: -10 }}
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-3xl sm:text-4xl"
            aria-hidden
          >
            🐻
          </motion.span>
          <span className="font-display text-2xl font-bold text-pink-600 drop-shadow sm:text-3xl dark:text-pink-200">
            KidKa
          </span>
        </Link>
        <button
          onClick={() => {
            playClick();
            toggle();
          }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-cute ring-2 ring-pink-200 backdrop-blur transition-transform hover:scale-110 dark:bg-slate-800/80 dark:ring-pink-700"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? '🌞' : '🌙'}
        </button>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="sticky bottom-0 z-20 mt-8 border-t border-white/40 bg-white/70 px-2 py-2 backdrop-blur dark:border-slate-700/40 dark:bg-slate-900/70">
        <ul className="mx-auto flex max-w-2xl items-center justify-between gap-1">
          {NAV.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={() => playClick()}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-bold transition',
                    isActive
                      ? 'bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white shadow-cute'
                      : 'text-slate-600 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-slate-800/70',
                  )
                }
              >
                <span className="text-2xl leading-none" aria-hidden>
                  {item.emoji}
                </span>
                <span className="leading-none">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
