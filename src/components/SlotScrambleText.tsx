import React, { useEffect, useRef } from 'react';

interface SlotScrambleTextProps {
  text: string;
  /** Jeda waktu (ms) setelah seluruh huruf selesai terkunci sebelum looping berikutnya dimulai */
  pauseDurationMs?: number;
  className?: string;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * SlotScrambleText:
 * Menampilkan teks (misal "KELVIN'S PORTFOLIO") dengan animasi putaran abjad acak
 * seperti gacha / mesin slot yang mengunci huruf satu per satu dari kiri ke kanan,
 * kemudian berhenti selama `pauseDurationMs` (5000ms = 5 detik) sebelum mengulang loop.
 *
 * Dijalankan langsung melalui direct DOM textContent mutation di dalam requestAnimationFrame
 * sehingga 0% membebani React re-render dan tetap super ringan pada layar 144Hz.
 */
export const SlotScrambleText: React.FC<SlotScrambleTextProps> = ({
  text,
  pauseDurationMs = 5000,
  className = ''
}) => {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const chars = Array.from(text);

  useEffect(() => {
    let rafId: number | null = null;
    let timeoutId: number | null = null;
    let isCancelled = false;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    // Parameter durasi slot machine per karakter (dalam milidetik)
    const staggerPerCharMs = 70; // Jeda waktu penguncian antar huruf satu per satu
    const spinDurationMs = 420; // Lama putaran awal sebelum huruf pertama mengunci
    const scrambleIntervalMs = 36; // Kecepatan pergantian huruf acak (~28 fps slot roll di atas loop 144Hz)
    const totalCycleDurationMs = spinDurationMs + chars.length * staggerPerCharMs;

    const runSlotCycle = () => {
      if (isCancelled) return;

      const startTime = performance.now();
      let lastScrambleSwap = 0;

      const tick = (now: number) => {
        if (isCancelled) return;
        const elapsed = now - startTime;
        const shouldSwapRandom = now - lastScrambleSwap >= scrambleIntervalMs;

        if (shouldSwapRandom) {
          lastScrambleSwap = now;
        }

        let allLocked = true;

        for (let i = 0; i < chars.length; i++) {
          const targetChar = chars[i];
          const el = charRefs.current[i];
          if (!el) continue;

          // Spasi dan tanda kutip tidak diacak agar struktur kata tetap rapi
          if (targetChar === ' ') {
            el.textContent = '\u00A0';
            continue;
          }

          const charStartMs = i * 28;
          const charLockMs = spinDurationMs + i * staggerPerCharMs;

          if (elapsed >= charLockMs) {
            // Huruf sudah terkunci pada huruf asli
            if (el.textContent !== targetChar) {
              el.textContent = targetChar;
              el.style.opacity = '1';
              el.style.transform = 'translate3d(0, 0, 0)';
            }
          } else if (elapsed >= charStartMs) {
            allLocked = false;
            if (shouldSwapRandom) {
              // Tanda apostrof (') tetap berputar dengan karakter huruf/simbol singkat lalu mengunci ke (')
              const randomChar =
                ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
              el.textContent = randomChar;
              // Sedikit efek gerak vertikal mikro khas roda slot (compositor-only)
              const offsetY = (Math.random() - 0.5) * 2.5;
              el.style.opacity = '0.68';
              el.style.transform = `translate3d(0, ${offsetY.toFixed(1)}px, 0)`;
            }
          } else {
            allLocked = false;
          }
        }

        if (!allLocked && elapsed < totalCycleDurationMs + 60) {
          rafId = requestAnimationFrame(tick);
        } else {
          // Pastikan semua huruf terkunci bersih ke teks asli
          for (let i = 0; i < chars.length; i++) {
            const el = charRefs.current[i];
            if (!el) continue;
            el.textContent = chars[i] === ' ' ? '\u00A0' : chars[i];
            el.style.opacity = '1';
            el.style.transform = 'translate3d(0, 0, 0)';
          }

          // Jeda 5 detik (pauseDurationMs) sebelum memulai loop gacha berikutnya
          timeoutId = window.setTimeout(() => {
            runSlotCycle();
          }, pauseDurationMs);
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    // Jalankan siklus pertama saat halaman dibuka
    runSlotCycle();

    return () => {
      isCancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [text, pauseDurationMs]);

  return (
    <span aria-label={text} className={`inline-flex items-center font-mono ${className}`}>
      {chars.map((ch, idx) => (
        <span
          key={idx}
          ref={(el) => {
            charRefs.current[idx] = el;
          }}
          aria-hidden="true"
          className="inline-block will-change-[transform,opacity]"
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
};
