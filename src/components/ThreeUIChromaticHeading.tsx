import React, { useEffect, useRef, useState, useCallback } from 'react';

// Exact PRNG and easing functions from ThreeUI (creator-studio-intro.html)
function rng(s: number) {
  let a = s >>> 0;
  return function () {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a || 1e-6), 0, 1);
const eOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface CharData {
  char: string;
  isSpace: boolean;
  jit: [number, number, number]; // [xJitter, yJitter, delayJitter]
}

interface WordData {
  chars: CharData[];
}

interface LineData {
  words: WordData[];
  isGold?: boolean;
}

export interface ThreeUIChromaticHeadingProps {
  line1?: string;
  line2?: string;
  className?: string;
  duration?: number; // Duration of assemble in ms (default ~1800ms)
  delay?: number; // Initial delay in ms before starting
  interactive?: boolean; // Hover to trigger re-assembly
}

export const ThreeUIChromaticHeading: React.FC<ThreeUIChromaticHeadingProps> = ({
  line1 = "INDIA'S INGREDIENTS.",
  line2 = "THE WORLD'S MARKETS.",
  className = '',
  duration = 1800,
  delay = 150,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const [isAssembled, setIsAssembled] = useState(false);

  // Parse lines into structured words and characters with deterministic PRNG jitter
  const linesData = React.useMemo<LineData[]>(() => {
    const generator = rng(7719); // ThreeUI canonical seed
    const parseLine = (text: string, isGold = false): LineData => {
      const words = text.split(' ').map((wordStr) => ({
        chars: Array.from(wordStr).map((char) => ({
          char,
          isSpace: false,
          jit: [generator() * 2 - 1, generator() * 2 - 1, generator()] as [number, number, number],
        })),
      }));
      return { words, isGold };
    };

    return [
      parseLine(line1, false),
      parseLine(line2, true),
    ];
  }, [line1, line2]);

  // Flatten characters for sequential access in animation frame
  const flatChars = React.useMemo(() => {
    const list: { charData: CharData; isGold: boolean }[] = [];
    linesData.forEach((line) => {
      line.words.forEach((word) => {
        word.chars.forEach((c) => {
          list.push({ charData: c, isGold: !!line.isGold });
        });
      });
    });
    return list;
  }, [linesData]);

  const runAnimation = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsAssembled(true);
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setIsAssembled(false);
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = clamp((elapsed - delay) / duration, 0, 1);

      // ThreeUI exact character transformation step
      flatChars.forEach((item, index) => {
        const el = spanRefs.current[index];
        if (!el) return;

        const j = item.charData.jit;
        // Segmented ease-out with staggered character jitter
        const a = eOut(clamp(seg(progress, 0.02, 0.58) * 1.5 - j[2] * 0.45, 0, 1));

        if (a >= 0.999 && progress >= 1) {
          // Fully settled state
          el.style.transform = 'none';
          el.style.opacity = '1';
          el.style.textShadow = 'none';
          el.style.filter = 'none';
        } else {
          // Chromatic assembly flight
          const translateX = (j[0] * 56 * (1 - a)).toFixed(1);
          const translateY = (j[1] * 32 * (1 - a)).toFixed(1);
          const scale = lerp(1.22, 1, a).toFixed(3);
          const opacity = Math.min(1, a * 1.8).toFixed(3);
          const sep = (1 - a) * 11;

          el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
          el.style.opacity = opacity;

          if (sep > 0.4) {
            // ThreeUI Chromatic aberration text-shadow
            const s1 = (-sep).toFixed(1);
            const s2 = sep.toFixed(1);
            const s3 = (sep * 0.55).toFixed(1);
            el.style.textShadow = `${s1}px 0 rgba(255, 64, 72, 0.85), ${s2}px 0 rgba(64, 255, 190, 0.8), 0 ${s3}px rgba(96, 124, 255, 0.8)`;
          } else {
            el.style.textShadow = 'none';
          }

          el.style.filter = sep > 0.7 ? `blur(${(sep * 0.28).toFixed(2)}px)` : 'none';
        }
      });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setIsAssembled(true);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [flatChars, delay, duration]);

  useEffect(() => {
    runAnimation();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [runAnimation]);

  let globalCharIndex = 0;

  return (
    <h1
      ref={containerRef}
      aria-label={`${line1} ${line2}`}
      onClick={interactive ? runAnimation : undefined}
      className={`font-serif font-bold tracking-tight select-none cursor-default ${className}`}
    >
      {linesData.map((line, lineIndex) => (
        <span
          key={`line-${lineIndex}`}
          className={`block leading-[1.08] ${
            line.isGold
              ? 'text-[#f2a900] bg-gradient-to-r from-[#f2a900] via-[#fbbf24] to-[#d97706] bg-clip-text text-transparent'
              : 'text-[#fdfcf0]'
          }`}
        >
          {line.words.map((word, wordIndex) => (
            <span
              key={`word-${lineIndex}-${wordIndex}`}
              className="inline-block whitespace-nowrap mr-[0.26em] last:mr-0"
            >
              {word.chars.map((c, charIndex) => {
                const currentIndex = globalCharIndex++;
                return (
                  <span
                    key={`c-${currentIndex}`}
                    ref={(el) => {
                      spanRefs.current[currentIndex] = el;
                    }}
                    className={`inline-block will-change-transform ${
                      line.isGold ? 'text-[#f2a900]' : 'text-[#fdfcf0]'
                    }`}
                    style={{
                      display: 'inline-block',
                      transition: isAssembled ? 'color 0.2s ease' : undefined,
                    }}
                  >
                    {c.char}
                  </span>
                );
              })}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
};
