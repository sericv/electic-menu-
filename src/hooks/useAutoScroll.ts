import { useEffect, useRef } from "react";

interface UseAutoScrollOptions {
  /** Pixels scrolled per frame at 60fps. Keep subtle. */
  speed?: number;
  /** Delay before auto-scroll resumes after user interaction stops. */
  resumeDelay?: number;
  /** When true, auto-scroll is fully disabled (e.g. while filtering). */
  disabled?: boolean;
}

/**
 * Slowly auto-scrolls a container when the user is idle.
 * Any pointer/wheel/touch/key interaction stops it immediately.
 * Auto-scroll resumes after `resumeDelay` of inactivity, unless `disabled`.
 */
export function useAutoScroll<T extends HTMLElement>(
  { speed = 0.4, resumeDelay = 3500, disabled = false }: UseAutoScrollOptions = {}
) {
  const ref = useRef<T | null>(null);
  const frameRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tick = () => {
      if (!pausedRef.current && !disabled && el) {
        const atBottom =
          Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
        if (!atBottom) {
          el.scrollTop += speed;
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    const pause = () => {
      pausedRef.current = true;
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      if (!disabled) {
        resumeTimerRef.current = window.setTimeout(() => {
          pausedRef.current = false;
        }, resumeDelay);
      }
    };

    const events: Array<keyof HTMLElementEventMap> = [
      "wheel",
      "touchstart",
      "pointerdown",
    ];
    events.forEach((evt) => el.addEventListener(evt, pause, { passive: true }));

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      events.forEach((evt) => el.removeEventListener(evt, pause));
    };
  }, [speed, resumeDelay, disabled]);

  // When disabled externally (e.g. category filter active), pause immediately.
  useEffect(() => {
    if (disabled) {
      pausedRef.current = true;
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    } else {
      pausedRef.current = false;
    }
  }, [disabled]);

  return ref;
}
