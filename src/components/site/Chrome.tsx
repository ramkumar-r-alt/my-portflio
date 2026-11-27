import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-white mix-blend-difference"
      aria-hidden
    />
  );
}

/**
 * Two-part cursor in difference blend (so it is ink on paper, paper on ink):
 *  - a precise dot that tracks the pointer 1:1
 *  - a trailing ring that stretches along its direction of travel
 * Over `[data-cursor="Label"]` the ring becomes a solid disc showing the label
 * (the black text punches the backdrop back through); over other links and
 * buttons it swells. Everything runs on refs + rAF, with no React re-renders per move.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    if (!fine.matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("custom-cursor");

    const pos = { x: -200, y: -200 };
    const trail = { x: -200, y: -200 };
    let size = 36; // current ring diameter
    let targetSize = 36;
    let mode: "idle" | "hover" | "label" = "idle";
    let pressed = false;
    let visible = false;
    let raf = 0;

    const setMode = (el: Element | null) => {
      const labelled = el?.closest<HTMLElement>("[data-cursor]");
      const text = labelled?.getAttribute("data-cursor") ?? "";
      if (labelled && text) {
        mode = "label";
        label.textContent = text;
        targetSize = 96;
      } else if (el?.closest("a,button,[data-magnetic],[data-cursor]")) {
        mode = "hover";
        targetSize = 64;
      } else {
        mode = "idle";
        targetSize = 36;
      }
      ring.setAttribute("data-mode", mode);
    };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        trail.x = pos.x;
        trail.y = pos.y;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      setMode(e.target as Element | null);
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dx = pos.x - trail.x;
      const dy = pos.y - trail.y;
      trail.x += dx * 0.18;
      trail.y += dy * 0.18;
      size += ((pressed ? targetSize * 0.8 : targetSize) - size) * 0.2;

      // Stretch along the velocity vector while idle — a little liquid lag.
      const speed = Math.min(Math.hypot(dx, dy), 140);
      const stretch = mode === "idle" ? speed / 220 : 0;
      const angle = Math.atan2(dy, dx);

      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${mode === "idle" ? 1 : 0})`;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch * 0.5})`;
      label.style.transform = `rotate(${-angle}rad)`;
    };
    tick();

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[85] mix-blend-difference">
      <div
        ref={ringRef}
        data-mode="idle"
        className="cursor-ring absolute left-0 top-0 flex items-center justify-center rounded-full opacity-0"
      >
        <span
          ref={labelRef}
          className="cursor-label font-mono text-[0.65rem] uppercase tracking-[0.16em] text-black"
        />
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white opacity-0" />
    </div>
  );
}

/** Ink curtain with a 0→100 counter that lifts away to reveal the page. */
export function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {done ? null : (
        <motion.div
          key="preloader"
          aria-hidden
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="invert-tone fixed inset-0 z-[95] flex flex-col justify-between bg-background p-5 text-foreground sm:p-8 lg:p-12"
        >
          <div className="flex justify-between font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            <span>Ramkumar R</span>
            <span>Full Stack Engineer</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="display-heading text-[clamp(5rem,22vw,20rem)] leading-[0.8] tabular-nums">
              {String(count).padStart(3, "0")}
            </span>
            <span className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              Loading portfolio
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
