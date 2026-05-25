import { useCallback, useEffect, useState } from 'react';
import type { Progress } from '../types';
import { emptyProgress, loadProgress, resetProgress, saveProgress } from '../utils/storage';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => emptyProgress());

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markLearned = useCallback((letter: string) => {
    setProgress((p) => {
      if (p.learned.includes(letter)) return { ...p, lastVisited: letter };
      return { ...p, learned: [...p.learned, letter], lastVisited: letter };
    });
  }, []);

  const markTraced = useCallback((letter: string) => {
    setProgress((p) => {
      const stars = { ...p.stars, [letter]: Math.min((p.stars[letter] ?? 0) + 1, 3) };
      const traced = p.traced.includes(letter) ? p.traced : [...p.traced, letter];
      return { ...p, traced, stars };
    });
  }, []);

  const addGameWin = useCallback(() => {
    setProgress((p) => ({ ...p, gameWins: p.gameWins + 1 }));
  }, []);

  const reset = useCallback(() => {
    resetProgress();
    setProgress(emptyProgress());
  }, []);

  return { progress, markLearned, markTraced, addGameWin, reset };
}
