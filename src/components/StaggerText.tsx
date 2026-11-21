import React, { useEffect, useRef, useState } from 'react';

interface StaggerTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3';
  /**
   * 'word': memecah per kata (sangat ringan, hanya ~10-30 DOM node per kalimat).
   * 'char': memecah per karakter namun tetap dibungkus per kata agar tidak pernah
   *         terpotong di tengah kata saat ganti baris.
   */
  mode?: 'word' | 'char';
  /** Delay awal sebelum animasi dimulai (detik) */
  delay?: number;
  /** Jarak waktu antar kata/karakter (detik) */
  stagger?: number;
}

/**
 * StaggerText (Zero-Lag 144Hz Architecture):
 * Menggunakan pure CSS compositor transition (`opacity` + `translate3d`) dengan
 * variabel `--stagger-delay` dan hanya 1 IntersectionObserver pada komponen induk,
 * tanpa membuat ratusan instance JS Framer Motion atau filter `blur()` yang berat.
 */
export const StaggerText: React.FC<StaggerTextProps> = ({
  text,
  className = '',
  as: Tag = 'span',
  mode = 'word',
  delay = 0,
  stagger
}) => {
  const words = text.split(' ');
  const stepMs = (stagger ?? (mode === 'char' ? 0.011 : 0.015)) * 1000;
  const baseDelayMs = delay * 1000;

  let charCursor = 0;

  return (
    <Tag aria-label={text} className={`inline ${className}`}>
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
                  const delayMs = Math.round(baseDelayMs + globalCharIdx * stepMs);
                  return (
                    <span
                      key={`${chIdx}-${ch}`}
                      style={{ '--stagger-delay': `${delayMs}ms` } as React.CSSProperties}
                      className="stagger-token"
                    >
                      {ch}
                    </span>
                  );
                })}
              </span>
              {wordIdx < words.length - 1 && ' '}
            </React.Fragment>
          );
        }

        const delayMs = Math.round(baseDelayMs + wordIdx * stepMs);
        return (
          <React.Fragment key={`${wordIdx}-${word}`}>
            <span
              aria-hidden="true"
              style={{ '--stagger-delay': `${delayMs}ms` } as React.CSSProperties}
              className="stagger-token whitespace-nowrap"
            >
              {word}
            </span>
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

/**
 * FocusBlock:
 * Satu-satunya observer per blok bagian. Mengatur atribut `data-focused="true"`
 * sehingga seluruh StaggerText di dalamnya beranimasi langsung melalui CSS GPU compositor
 * tanpa memicu React re-render pada setiap kata/huruf.
 */
export const FocusBlock: React.FC<FocusSectionProps> = ({
  id,
  className = '',
  children
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFocused(true);
          } else {
            const rect = entry.boundingClientRect;
            if (rect.top > window.innerHeight || rect.bottom < 0) {
              setIsFocused(false);
            }
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -6% 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      data-focused={isFocused ? 'true' : 'false'}
      className={`focus-block ${className}`}
    >
      {children}
    </div>
  );
};
