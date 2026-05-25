import type { Progress } from '../types';

const KEY = 'kidka-progress-v1';

export const emptyProgress = (): Progress => ({
  learned: [],
  traced: [],
  stars: {},
  gameWins: 0,
});

export const loadProgress = (): Progress => {
  if (typeof window === 'undefined') return emptyProgress();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...emptyProgress(), ...parsed };
  } catch {
    return emptyProgress();
  }
};

export const saveProgress = (p: Progress) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage might be disabled; ignore.
  }
};

export const resetProgress = () => {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
};
