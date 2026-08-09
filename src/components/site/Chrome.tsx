import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { sections } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-primary"
      aria-hidden
    />
  );
}

export function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target as HTMLElement | null;
      setActive(Boolean(el?.closest("a,button,[data-magnetic]")));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden rounded-full border border-primary/60 mix-blend-screen lg:block"
      animate={{
        x: pos.x - (active ? 24 : 9),
        y: pos.y - (active ? 24 : 9),
        width: active ? 48 : 18,
        height: active ? 48 : 18,
        backgroundColor: active ? "var(--glow)" : "transparent",
      }}
      transition={{ type: "spring", stiffness: 500, damping: 34, mass: 0.4 }}
    />
  );
}

export function SectionDots() {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-30% 0px -30% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
    >
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="group flex items-center gap-3"
          aria-current={activeId === s.id ? "true" : undefined}
        >
          <span className="translate-x-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            {s.label}
          </span>
          <span
            className={cn(
              "h-1.5 rounded-full bg-muted-foreground/40 transition-all duration-300",
              activeId === s.id ? "w-6 bg-primary" : "w-1.5 group-hover:bg-foreground",
            )}
          />
        </a>
      ))}
    </nav>
  );
}

export function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 1 }}
      animate={done ? { opacity: 0, pointerEvents: "none" } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.svg
          width="86"
          height="86"
          viewBox="0 0 100 100"
          initial={{ rotate: -8, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.path
            d="M26 78 V22 h24 a16 16 0 0 1 0 32 H32 l30 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </motion.svg>
        <div className="h-px w-40 overflow-hidden bg-border">
          <motion.div
            className="h-full bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ originX: 0 }}
            transition={{ duration: 1.3, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
