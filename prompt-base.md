Build a complete kids alphabet learning website using ReactJS + Vite + TailwindCSS.

The website is for a small child who has difficulty recognizing English alphabet letters visually.
The goal is to help children learn A-Z through visual associations, animation, sound, and mini games.

Design requirements:
- Very colorful and friendly UI
- Large rounded buttons
- Cute cartoon style
- Optimized for tablet and mobile
- Minimal text
- Smooth animations
- Big letters in the center
- Child-safe and distraction-free design

Tech stack:
- ReactJS
- Vite
- TailwindCSS
- Framer Motion for animations
- Howler.js for sound effects and pronunciation
- React Router
- TypeScript

Features:

1. Alphabet Learning Cards
For each letter A-Z:
- Display a huge uppercase letter
- Display a visual object that resembles the letter shape
- Display an actual object word
- Play pronunciation sound when clicked
- Animate the letter when entering screen

Examples:
- A → mountain / tent / rocket
- B → butterfly / glasses
- C → moon / cookie
- D → door
- E → comb
- F → flag

Each card should contain:
- Letter
- Cartoon illustration
- Pronunciation button
- Example word
- Short hint like:
  "A looks like a mountain"

2. Tracing Practice
- Allow child to trace letters using mouse or touch
- Show dotted guideline
- Detect approximate tracing
- Reward with stars/confetti animation

3. Mini Games
Include:
- Choose the correct letter
- Match image with letter
- Memory card game
- Drag and drop letter puzzle

4. Progress System
- Save learned letters in localStorage
- Show stars/rewards
- Unlock next letters gradually

5. Audio
- Button click sound
- Success sound
- Pronunciation audio
- Encouraging voice feedback:
  "Great job!"
  "Awesome!"
  "Try again!"

6. Accessibility
- Very large touch targets
- High contrast colors
- No complex navigation
- Child-friendly font

7. Pages
Create:
- Home page
- Learn page
- Practice page
- Games page
- Progress page

8. Project Structure
Use clean scalable structure:

src/
  assets/
  components/
  pages/
  hooks/
  data/
  utils/
  types/

9. Data Structure
Create alphabet data object:

{
  letter: "A",
  word: "Apple",
  hint: "A looks like a mountain",
  image: "...",
  sound: "...",
  color: "...",
}

10. UI Details
- Floating animations
- Gradient backgrounds
- Cute clouds/stars/shapes
- Smooth page transitions
- Rounded cards
- Soft shadows

11. Additional Requirements
- Use reusable components
- Use TypeScript properly
- Add comments for important sections
- Make the app production-ready
- Include sample placeholder illustrations
- Include responsive layout
- Include dark mode toggle for parents

12. Deliverables
Generate:
- Complete ReactJS source code
- Tailwind config
- Routing setup
- Sample data
- Reusable components
- Game logic
- Animation setup
- README with setup instructions

13. Extra Feature
Add a "Story Mode":
- A cute mascot guides the child through letters
- Example:
  "Today we will learn the letter A!"

Make the final result feel like a premium educational app for preschool children.