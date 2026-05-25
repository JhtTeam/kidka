import { motion } from 'framer-motion';

// Decorative floating clouds, stars and shapes for a playful background.
// Pointer-events disabled so they never block tapping.
export function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute left-6 top-10 text-5xl"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☁️
      </motion.div>
      <motion.div
        className="absolute right-10 top-24 text-4xl"
        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute left-1/4 bottom-20 text-4xl"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute right-6 bottom-32 text-5xl"
        animate={{ y: [0, -14, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        🌈
      </motion.div>
      <motion.div
        className="absolute left-12 bottom-10 text-3xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute right-1/3 top-1/2 text-3xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
      >
        🌟
      </motion.div>
    </div>
  );
}
