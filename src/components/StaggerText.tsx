import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface StaggerTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3';
  /**
   * 'word': memecah per kata (aman dari pemotongan huruf di tengah kata).
   * 'char': memecah per karakter TETAPI setiap kata tetap dibungkus dalam
   *         <span className="inline-block whitespace-nowrap"> sehingga sebuah kata
   *         TIDAK PERNAH terpotong di tengah (seperti "Machin-e" atau "Cik-arang").
   */
  mode?: 'word' | 'char';
  /** Delay awal sebelum animasi dimulai (detik) */
  delay?: number;
  /** Jarak waktu antar kata/karakter (detik) */
  stagger?: number;
}

export const StaggerText: React.FC<StaggerTextProps> = ({
  text,
  className = '',
  as: Tag = 'span',
  mode = 'word',
  delay = 0,
  stagger
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInFocus(true);
          } else {
            const rect = entry.boundingClientRect;
            if (rect.top > window.innerHeight || rect.bottom < 0) {
              setInFocus(false);
            }
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');
  const stepDelay = stagger ?? (mode === 'char' ? 0.011 : 0.016);

  // Hitung kumulatif indeks karakter agar animasi mode="char" tetap berurutan per huruf
  let charCursor = 0;

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      aria-label={text}
      className={`inline ${className}`}
    >
      {words.map((word, wordIdx) => {
        if (mode === 'char') {
          const chars = Array.from(word);
          const startIdx = charCursor;
          charCursor += chars.length + 1;

          return (
            <React.Fragment key={`${wordIdx}-${word}`}>
              <span className="inline-block whitespace-nowrap" aria-hidden="true">
                {chars.map((ch, chIdx) => {
                  const globalCharIdx = startIdx + chIdx;
                  return (
                    <motion.span
                      key={`${chIdx}-${ch}`}
                      initial={{ opacity: 0.08, y: 3, filter: 'blur(1px)' }}
                      animate={
                        inFocus
                          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                          : { opacity: 0.14, y: 2, filter: 'blur(0.5px)' }
                      }
                      transition={{
                        duration: 0.24,
                        delay: inFocus ? delay + globalCharIdx * stepDelay : 0,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="inline-block will-change-[transform,opacity,filter] transform-gpu"
                    >
                      {ch}
                    </motion.span>
                  );
                })}
              </span>
              {wordIdx < words.length - 1 && ' '}
            </React.Fragment>
          );
        }

        // Mode 'word': setiap kata adalah 1 unit utuh dengan spasi normal di antaranya
        return (
          <React.Fragment key={`${wordIdx}-${word}`}>
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0.08, y: 3, filter: 'blur(1px)' }}
              animate={
                inFocus
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0.14, y: 2, filter: 'blur(0.5px)' }
              }
              transition={{
                duration: 0.26,
                delay: inFocus ? delay + wordIdx * stepDelay : 0,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="inline-block whitespace-nowrap will-change-[transform,opacity,filter] transform-gpu"
            >
              {word}
            </motion.span>
            {wordIdx < words.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </Tag>
  );
};

interface FocusSectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const FocusBlock: React.FC<FocusSectionProps> = ({
  id,
  className = '',
  children
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsFocused(entry.isIntersecting);
        });
      },
      {
        threshold: 0.08,
        rootMargin: '-4% 0px -8% 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0.15, y: 8 }}
      animate={
        isFocused
          ? { opacity: 1, y: 0 }
          : { opacity: 0.42, y: 3 }
      }
      transition={{
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`will-change-[transform,opacity] transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};
