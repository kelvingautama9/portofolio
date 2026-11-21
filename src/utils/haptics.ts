/**
 * Immersive Haptic & Micro-Acoustic Feedback Engine
 * Uses navigator.vibrate on supported touch devices paired with a subtle,
 * ultra-short low-frequency tactile pulse via Web Audio API so desktop and iOS
 * users also experience physical-feeling tactile feedback.
 */

type HapticPattern = 'tick' | 'tap' | 'confirm';

class HapticEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public trigger(pattern: HapticPattern = 'tap'): void {
    if (!this.enabled || typeof window === 'undefined') return;

    // 1. Native hardware vibration where supported
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        if (pattern === 'tick') {
          navigator.vibrate(5);
        } else if (pattern === 'tap') {
          navigator.vibrate(10);
        } else if (pattern === 'confirm') {
          navigator.vibrate([10, 28, 14]);
        }
      } catch {
        // Ignore security or unsupported errors
      }
    }

    // 2. Subtle sub-perceptual tactile click (Taptic-like low membrane thump)
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';

      if (pattern === 'tick') {
        osc.frequency.setValueAtTime(135, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.014);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.015);
      } else if (pattern === 'tap') {
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(48, now + 0.022);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.024);
      } else if (pattern === 'confirm') {
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.018);
        osc.frequency.setValueAtTime(190, now + 0.028);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.052);

        gain.gain.setValueAtTime(0.055, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.02);
        gain.gain.setValueAtTime(0.07, now + 0.028);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.056);
      }
    } catch {
      // Ignore audio context errors on restricted autoplay
    }
  }
}

export const haptics = new HapticEngine();
