import { useEffect, useState } from "react";

type LenisLike = {
  raf: (t: number) => void;
  destroy: () => void;
  stop: () => void;
  start: () => void;
};

declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

/**
 * Inertial smooth scrolling. `lerp` gives a soft, continuous glide; `anchors`
 * routes in-page links (#about, #work…) through Lenis so they ease too instead
 * of jumping. The instance is exposed on window so overlays can pause it.
 */
export function useLenis() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: LenisLike | null = null;
    let frame = 0;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
        anchors: { offset: -20, duration: 1.6 },
      }) as unknown as LenisLike;
      window.__lenis = lenis;
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
