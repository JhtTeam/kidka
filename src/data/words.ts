// Vocabulary review content, grouped by topic.
//
// This is separate from the 26-letter ALPHABET in alphabet.ts: here a child
// revisits whole words they've met, each with a picture, a short sentence and
// spoken pronunciation. New topics (Family, Animals, …) can be added by pushing
// another entry onto WORD_TOPICS — the Review page renders them automatically.
//
// Images: `image` points to a file under public/images/words/. Until a real
// picture is dropped in there, the page falls back to `emoji`, so every word
// renders correctly today and upgrades to the real art the moment the file
// appears (see WordImage in pages/Review.tsx).

export interface WordEntry {
  word: string;     // lowercase key, also drives the image filename + audio slug
  display: string;  // how the word is shown / spoken, e.g. "Teacher"
  emoji: string;    // fallback illustration until a real image is added
  image?: string;   // optional real picture, e.g. "images/words/teacher.jpeg"
  sentence: string; // short, child-friendly example sentence
  color: string;    // hex accent color for the card
  bgGradient: string; // Tailwind gradient classes for the card background
}

export interface WordTopic {
  id: string;       // url slug, e.g. "at-school"
  title: string;    // shown on the topic card, e.g. "At School"
  emoji: string;    // topic icon
  bgGradient: string;
  words: WordEntry[];
}

export const WORD_TOPICS: WordTopic[] = [
  {
    id: 'at-school',
    title: 'At School',
    emoji: '🏫',
    bgGradient: 'from-sky-200 via-blue-200 to-indigo-200',
    words: [
      {
        word: 'teacher',
        display: 'Teacher',
        emoji: '🧑‍🏫',
        image: 'images/words/teacher.jpeg',
        sentence: 'My teacher helps me learn.',
        color: '#0ea5e9',
        bgGradient: 'from-sky-200 via-blue-200 to-indigo-200',
      },
      {
        word: 'bell',
        display: 'Bell',
        emoji: '🔔',
        image: 'images/words/bell.jpeg',
        sentence: 'The bell goes ding, ding!',
        color: '#f59e0b',
        bgGradient: 'from-amber-200 via-yellow-200 to-orange-200',
      },
      {
        word: 'librarian',
        display: 'Librarian',
        emoji: '👩‍🏫',
        image: 'images/words/librarian.jpeg',
        sentence: 'The librarian takes care of the books.',
        color: '#a855f7',
        bgGradient: 'from-violet-200 via-purple-200 to-fuchsia-200',
      },
      {
        word: 'library',
        display: 'Library',
        emoji: '📚',
        image: 'images/words/library.jpeg',
        sentence: 'We read books in the library.',
        color: '#22c55e',
        bgGradient: 'from-lime-200 via-green-200 to-emerald-200',
      },
      {
        word: 'clock',
        display: 'Clock',
        emoji: '🕐',
        image: 'images/words/clock.jpeg',
        sentence: 'The clock tells us the time.',
        color: '#ef4444',
        bgGradient: 'from-rose-200 via-red-200 to-orange-200',
      },
      {
        word: 'desk',
        display: 'Desk',
        emoji: '🪑',
        image: 'images/words/desk.jpeg',
        sentence: 'I write at my desk.',
        color: '#14b8a6',
        bgGradient: 'from-teal-200 via-cyan-200 to-sky-200',
      },
    ],
  },
];

export const getTopic = (id: string): WordTopic | undefined =>
  WORD_TOPICS.find((t) => t.id === id);

export const allWords = (): WordEntry[] => WORD_TOPICS.flatMap((t) => t.words);
