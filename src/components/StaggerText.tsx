import React, { useEffect, useRef, useState } from 'react';

interface StaggerTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3';
  /**
   * 'word': memecah per kata (untuk bahasa Latin seperti ID & EN).
   * 'char': memecah per karakter.
   */
  mode?: 'word' | 'char';
  /** Delay awal sebelum animasi dimulai (detik) */
  delay?: number;
  /** Jarak waktu antar kata/karakter (detik) */
  stagger?: number;
  /** Jika true (misal di dalam Modal), langsung jalankan animasi fade-in saat komponen muncul */
  autoTrigger?: boolean;
}

// Deteksi apakah string mengandung karakter CJK (Jepang / Mandarin) yang tidak memakai spasi antar kalimat
const CJK_REGEX = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

/**
 * StaggerText (Zero-Lag 144Hz Architecture + Multi-Script CJK & Latin Line-Wrapping):
 * - Untuk bahasa Latin (ID/EN): membungkus setiap kata dengan `whitespace-nowrap`
 *   agar kata tidak pernah terbelah di tengah (seperti "Machin-e"), dan memisahkan
 *   antar kata dengan spasi normal sehingga tetap bebas ganti baris (wrap).
 * - Untuk bahasa Jepang/Mandarin (JPN/CHN): TIDAK membungkus kalimat panjang dalam
 *   `whitespace-nowrap` karena kalimat CJK tidak memiliki spasi; setiap karakter
 *   dirender sebagai inline span yang bebas membungkus (wrap) di batas kanan layar
 *   tanpa pernah keluar dari container.
 */
export const StaggerText: React.FC<StaggerTextProps> = ({
  text,
  className = '',
  as: Tag = 'span',
  mode = 'word',
  delay = 0,
  stagger,
  autoTrigger = false
}) => {
  const [selfTriggered, setSelfTriggered] = useState(false);

  useEffect(() => {
    if (!autoTrigger) return;
    setSelfTriggered(false);
    const raf = requestAnimationFrame(() => {
      setSelfTriggered(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [autoTrigger, text]);

  const hasCJK = CJK_REGEX.test(text);
  const baseDelayMs = delay * 1000;

  // Jika teks mengandung huruf Jepang / Mandarin (CJK), render per karakter yang bisa wrap bebas di mana saja
  if (hasCJK) {
    const chars = Array.from(text);
    // Batasi maksimum total stagger 650ms agar kalimat panjang Jepang/China tetap responsif
    const stepMs = Math.min((stagger ?? 0.008) * 1000, Math.max(4, Math.floor(650 / Math.max(chars.length, 1))));

    return (
      <Tag
        aria-label={text}
        data-focused={autoTrigger ? (selfTriggered ? 'true' : 'false') : undefined}
        className={`inline break-words ${className}`}
      >
        {chars.map((ch, idx) => {
          if (ch === ' ') {
            return <span key={idx} aria-hidden="true">{' '}</span>;
          }
          const delayMs = Math.round(baseDelayMs + idx * stepMs);
          return (
            <span
              key={`${idx}-${ch}`}
              aria-hidden="true"
              style={{ '--stagger-delay': `${delayMs}ms` } as React.CSSProperties}
              className="stagger-token"
            >
              {ch}
            </span>
          );
        })}
      </Tag>
    );
  }

  // Untuk teks Latin (ID / EN): pecah berdasarkan spasi agar setiap kata utuh namun bebas wrap antar kata
  const words = text.split(' ');
  const stepMs = (stagger ?? (mode === 'char' ? 0.011 : 0.015)) * 1000;
  let charCursor = 0;

  return (
    <Tag
      aria-label={text}
      data-focused={autoTrigger ? (selfTriggered ? 'true' : 'false') : undefined}
      className={`inline ${className}`}
    >
      {words.map((word, wordIdx) => {
        if (mode === 'char') {
          const chars = Array.from(word);
          const startIdx = charCursor;
          charCursor += chars.length + 1;

          return (
            <React.Fragment key={`${wordIdx}-${word}`}>
              <span className="inline-block whitespace-nowrap max-w-full" aria-hidden="true">
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
        threshold: 0.06,
        rootMargin: '0px 0px -5% 0px'
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
