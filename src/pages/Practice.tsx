import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ALPHABET, getLetter } from '../data/alphabet';
import { LetterCard } from '../components/LetterCard';
import { BigButton } from '../components/BigButton';
import { PageTitle } from '../components/PageTitle';
import { Confetti } from '../components/Confetti';
import { Mascot } from '../components/Mascot';
import { useProgress } from '../hooks/useProgress';
import { cheer, encourage, speak } from '../utils/audio';

export function Practice() {
  const { letter } = useParams<{ letter?: string }>();
  const navigate = useNavigate();
  const { progress, markTraced } = useProgress();

  if (!letter) {
    return (
      <>
        <PageTitle emoji="✏️" title="Trace a Letter" subtitle="Pick a letter and draw with your finger!" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {ALPHABET.map((entry) => (
            <LetterCard
              key={entry.letter}
              entry={entry}
              size="md"
              stars={progress.stars[entry.letter] ?? 0}
              onClick={() => navigate(`/practice/${entry.letter}`)}
            />
          ))}
        </div>
      </>
    );
  }

  const entry = getLetter(letter);
  if (!entry) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold">Letter not found 😢</p>
        <BigButton className="mt-6" onClick={() => navigate('/practice')}>Back</BigButton>
      </div>
    );
  }

  return (
    <TracePad
      key={entry.letter}
      letter={entry.letter}
      color={entry.color}
      onSuccess={() => markTraced(entry.letter)}
      onNext={() => {
        const idx = ALPHABET.findIndex((e) => e.letter === entry.letter);
        const next = ALPHABET[(idx + 1) % ALPHABET.length];
        navigate(`/practice/${next.letter}`);
      }}
    />
  );
}

interface PadProps {
  letter: string;
  color: string;
  onSuccess: () => void;
  onNext: () => void;
}

// Simple tracing pad: draw an outlined letter and let the user paint over it.
// We approximate "tracing" by measuring how many drawn pixels fall inside the
// outlined letter region versus how many pixels of the letter are covered.
function TracePad({ letter, color, onSuccess, onNext }: PadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Render the dotted letter outline and build a hidden mask.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    // Dotted outline guide
    ctx.font = `bold ${size * 0.85}px Fredoka, Comic Sans MS, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 6;
    ctx.setLineDash([8, 14]);
    ctx.strokeStyle = color;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(letter, size / 2, size / 2);
    ctx.strokeText(letter, size / 2, size / 2);
    ctx.setLineDash([]);

    // Hidden mask: solid filled letter used to measure coverage.
    const mask = document.createElement('canvas');
    mask.width = size;
    mask.height = size;
    const mctx = mask.getContext('2d')!;
    mctx.font = `bold ${size * 0.85}px Fredoka, Comic Sans MS, sans-serif`;
    mctx.textAlign = 'center';
    mctx.textBaseline = 'middle';
    mctx.lineWidth = 38; // generous tolerance
    mctx.strokeStyle = '#000';
    mctx.fillStyle = '#000';
    mctx.fillText(letter, size / 2, size / 2);
    mctx.strokeText(letter, size / 2, size / 2);
    maskRef.current = mask;

    setScore(0);
    setCompleted(false);

    // Speak gentle prompt
    const t = setTimeout(() => speak(`Trace the letter ${letter}`), 300);
    return () => clearTimeout(t);
  }, [letter, color]);

  const pointerPos = (e: PointerEvent | React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.PointerEvent) => {
    if (completed) return;
    drawing.current = true;
    lastPoint.current = pointerPos(e);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const moveDraw = (e: React.PointerEvent) => {
    if (!drawing.current || completed) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = pointerPos(e);
    const last = lastPoint.current ?? pos;
    ctx.strokeStyle = color;
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPoint.current = pos;
  };

  const endDraw = () => {
    if (!drawing.current) return;
    drawing.current = false;
    evaluate();
  };

  const evaluate = () => {
    const canvas = canvasRef.current;
    const mask = maskRef.current;
    if (!canvas || !mask) return;
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    const ctx = canvas.getContext('2d')!;

    // Read drawn pixels at logical resolution
    const drawn = ctx.getImageData(0, 0, size * dpr, size * dpr).data;
    const mctx = mask.getContext('2d')!;
    const maskData = mctx.getImageData(0, 0, size, size).data;

    let totalMask = 0;
    let coveredMask = 0;
    // Sample on a coarse grid for speed
    const step = 4;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const mi = (y * size + x) * 4 + 3; // alpha channel
        if (maskData[mi] > 50) {
          totalMask++;
          const dx = Math.floor(x * dpr);
          const dy = Math.floor(y * dpr);
          const di = (dy * size * dpr + dx) * 4 + 3;
          if (drawn[di] > 80) coveredMask++;
        }
      }
    }
    const ratio = totalMask ? coveredMask / totalMask : 0;
    const percent = Math.round(ratio * 100);
    setScore(percent);
    if (percent >= 55 && !completed) {
      setCompleted(true);
      onSuccess();
      cheer();
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const size = canvas.clientWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // re-render guide
    ctx.font = `bold ${size * 0.85}px Fredoka, Comic Sans MS, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 6;
    ctx.setLineDash([8, 14]);
    ctx.strokeStyle = color;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(letter, size / 2, size / 2);
    ctx.strokeText(letter, size / 2, size / 2);
    ctx.setLineDash([]);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <PageTitle emoji="✏️" title={`Trace the letter ${letter}`} subtitle="Follow the dotted line with your finger!" />

      <div className="relative w-full max-w-xl">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="aspect-square w-full rounded-[3rem] bg-white shadow-pop ring-4 ring-pink-200 dark:bg-slate-100"
        >
          <canvas
            ref={canvasRef}
            className="trace-canvas h-full w-full rounded-[3rem]"
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
            onPointerCancel={endDraw}
          />
        </motion.div>

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-pink-600 shadow">
          {score}% covered
        </div>
      </div>

      <Confetti show={completed} />

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <BigButton variant="soft" onClick={clear}>
          🧽 Clear
        </BigButton>
        <BigButton variant="accent" onClick={evaluate}>
          ✅ Check
        </BigButton>
        <BigButton
          variant="primary"
          onClick={() => {
            if (!completed) {
              encourage();
            }
            onNext();
          }}
        >
          ➡️ Next letter
        </BigButton>
      </div>

      {completed ? (
        <Mascot message="Amazing! You traced it! ⭐" />
      ) : (
        <Mascot message="Use your finger to trace the dotted letter." bouncing={false} />
      )}
    </div>
  );
}
