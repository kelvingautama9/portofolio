import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface StaggerTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3';
  /** Mode 'word' untuk paragraf panjang agar performa 144Hz mulus, 'char' untuk judul/teks pendek seperti ketikan */
  mode?: 'word' | 'char';
  /** Delay awal sebelum animasi dimulai (detik) */
  delay?: number;
  /** Jarak waktu antar kata/karakter (detik) */
  stagger?: number;
}

/**
 * StaggerText:
 * Menampilkan teks secara bertahap (fade-in dari transparan menjadi normal + micro-translate3d)
 * berderet seperti ketikan halus ketika elemen masuk ke area fokus layar saat di-scroll.
 * Menggunakan compositor-only properties (opacity + transform: translate3d) agar berjalan
 * di native refresh rate perangkat (60Hz / 120Hz / 144Hz) tanpa frame drop.
 */
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
          // Trigger ketika elemen masuk ke fokus viewport, dan re-focus secara halus saat di-scroll kembali
          if (entry.isIntersecting) {
            setInFocus(true);
          } else {
            // Reset jika keluar jauh dari layar agar saat di-scroll lagi tetap hidup & interaktif
            const rect = entry.boundingClientRect;
            if (rect.top > window.innerHeight || rect.bottom < 0) {
              setInFocus(false);
            }
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tokens = mode === 'char' ? Array.from(text) : text.split(' ');
  const stepDelay = stagger ?? (mode === 'char' ? 0.014 : 0.018);

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      aria-label={text}
      className={`inline-block ${className}`}
    >
      {tokens.map((token, idx) => {
        const isSpace = token === ' ';
        return (
          <motion.span
            key={`${idx}-${token}`}
            aria-hidden="true"
            initial={{ opacity: 0.08, y: 4, filter: 'blur(1.5px)' }}
            animate={
              inFocus
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0.14, y: 3, filter: 'blur(1px)' }
            }
            transition={{
              duration: 0.28,
              delay: inFocus ? delay + idx * stepDelay : 0,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block will-change-[transform,opacity,filter] transform-gpu"
          >
            {isSpace ? '\u00A0' : token}
            {mode === 'word' && idx < tokens.length - 1 ? '\u00A0' : ''}
          </motion.span>
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
 * FocusSection:
 * Mengatur fokus visual (opacity & transform GPU) berdasarkan posisi scroll pada layar,
 * sehingga bagian yang sedang dibaca tampil tajam sedangkan bagian yang baru masuk
 * muncul bertahap secara mulus hingga 144Hz.
 */
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
      initial={{ opacity: 0.15, y: 10 }}
      animate={
        isFocused
          ? { opacity: 1, y: 0 }
          : { opacity: 0.38, y: 4 }
      }
      transition={{
        duration: 0.34,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`will-change-[transform,opacity] transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );
};
