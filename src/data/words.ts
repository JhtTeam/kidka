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
  {
    id: 'actions',
    title: 'Actions',
    emoji: '🤸',
    bgGradient: 'from-orange-200 via-amber-200 to-yellow-200',
    words: [
      {
        word: 'swim',
        display: 'Swim',
        emoji: '🏊',
        sentence: 'I can swim in the water.',
        color: '#0ea5e9',
        bgGradient: 'from-sky-200 via-blue-200 to-indigo-200',
      },
      {
        word: 'crawl',
        display: 'Crawl',
        emoji: '👶',
        sentence: 'The baby can crawl on the floor.',
        color: '#f59e0b',
        bgGradient: 'from-amber-200 via-yellow-200 to-orange-200',
      },
      {
        word: 'walk',
        display: 'Walk',
        emoji: '🚶',
        sentence: 'I walk to school every day.',
        color: '#22c55e',
        bgGradient: 'from-lime-200 via-green-200 to-emerald-200',
      },
      {
        word: 'jump',
        display: 'Jump',
        emoji: '🤾',
        sentence: 'I jump up very high.',
        color: '#a855f7',
        bgGradient: 'from-violet-200 via-purple-200 to-fuchsia-200',
      },
      {
        word: 'run',
        display: 'Run',
        emoji: '🏃',
        sentence: 'I run very fast.',
        color: '#ef4444',
        bgGradient: 'from-rose-200 via-red-200 to-orange-200',
      },
    ],
  },
  {
    id: 'fun-words',
    title: 'Fun Words',
    emoji: '🎈',
    bgGradient: 'from-pink-200 via-rose-200 to-red-200',
    words: [
      {
        word: 'duck',
        display: 'Duck',
        emoji: '🦆',
        sentence: 'The duck says quack, quack!',
        color: '#facc15',
        bgGradient: 'from-amber-200 via-yellow-200 to-lime-200',
      },
      {
        word: 'egg',
        display: 'Egg',
        emoji: '🥚',
        sentence: 'The egg is white and round.',
        color: '#f97316',
        bgGradient: 'from-orange-200 via-amber-200 to-yellow-200',
      },
      {
        word: 'five',
        display: 'Five',
        emoji: '5️⃣',
        sentence: 'I can count to five.',
        color: '#3b82f6',
        bgGradient: 'from-blue-200 via-indigo-200 to-violet-200',
      },
      {
        word: 'family',
        display: 'Family',
        emoji: '👨‍👩‍👧‍👦',
        sentence: 'I love my family very much.',
        color: '#ec4899',
        bgGradient: 'from-pink-200 via-rose-200 to-red-200',
      },
      {
        word: 'garden',
        display: 'Garden',
        emoji: '🌷',
        sentence: 'Flowers grow in the garden.',
        color: '#22c55e',
        bgGradient: 'from-lime-200 via-green-200 to-emerald-200',
      },
      {
        word: 'grab',
        display: 'Grab',
        emoji: '🤲',
        sentence: 'I grab the ball with my hands.',
        color: '#f97316',
        bgGradient: 'from-orange-200 via-amber-200 to-yellow-200',
      },
      {
        word: 'feed',
        display: 'Feed',
        emoji: '🍽️',
        sentence: 'I feed my pet every day.',
        color: '#14b8a6',
        bgGradient: 'from-teal-200 via-cyan-200 to-sky-200',
      },
      {
        word: 'hen',
        display: 'Hen',
        emoji: '🐔',
        sentence: 'The hen lays an egg.',
        color: '#ef4444',
        bgGradient: 'from-rose-200 via-red-200 to-orange-200',
      },
      {
        word: 'iguana',
        display: 'Iguana',
        emoji: '🦎',
        sentence: 'The iguana is a big green lizard.',
        color: '#84cc16',
        bgGradient: 'from-lime-200 via-emerald-200 to-teal-200',
      },
      {
        word: 'insects',
        display: 'Insects',
        emoji: '🐛',
        sentence: 'Insects have six little legs.',
        color: '#a855f7',
        bgGradient: 'from-violet-200 via-purple-200 to-fuchsia-200',
      },
    ],
  },
];

export const getTopic = (id: string): WordTopic | undefined =>
  WORD_TOPICS.find((t) => t.id === id);

export const allWords = (): WordEntry[] => WORD_TOPICS.flatMap((t) => t.words);
