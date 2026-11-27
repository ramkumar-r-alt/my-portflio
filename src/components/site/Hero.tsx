import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { currentRole, heroBadges, profile } from "@/lib/portfolio-data";
import { HeroOutline } from "./HeroOutline";
import { MagneticButton } from "./MagneticButton";

// Client-only and lazily loaded; if the chunk fails, the hero falls back to
// pure typography rather than letting the route error boundary take over.
const HeroAscii = lazy(() =>
  import("./HeroAscii").catch(() => ({
    default: (_: { className?: string }): React.JSX.Element | null => null,
  })),
);

/** Time the preloader takes to clear; hero entrances are staged after it. */
export const INTRO_DELAY = 1.55;
const ease = [0.16, 1, 0.3, 1] as const;
const GLYPHS = "01{}[]<>/\\=+*#$%&;:";

/**
 * The name "decodes" out of the same code glyphs the ASCII knot is drawn
 * with. Each letter reserves its final width (rendered invisibly), so the
 * line never reflows while the glyphs cycle on top.
 */
function DecodeLine({
  text,
  delay,
  className,
  italic = false,
}: {
  text: string;
  delay: number;
  className?: string;
  italic?: boolean;
}) {
  const [resolved, setResolved] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setResolved(text.length);
      return;
    }
    const start = performance.now() + delay * 1000;
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      if (elapsed < -400) return; // start cycling just before the reveal
      const n = Math.max(0, Math.min(text.length, Math.floor(elapsed / 85)));
      setResolved(n);
      setTick((t) => t + 1);
      if (n >= text.length) window.clearInterval(id);
    }, 55);
    return () => window.clearInterval(id);
  }, [text, delay]);

  return (
    <span
      aria-hidden
      data-glass-line
      data-italic={italic ? "true" : "false"}
      className={`block whitespace-nowrap ${className ?? ""}`}
    >
      {text.split("").map((char, i) => {
        const done = i < resolved;
        return (
          <span key={`${char}-${i}`} className="relative inline-block">
            <span data-glass-char className="transition-opacity duration-300" style={{ opacity: done ? 1 : 0 }}>
              {char === " " ? " " : char}
            </span>
            {!done ? (
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[0.42em] not-italic">
                {GLYPHS[(Math.random() * GLYPHS.length) | 0]}
              </span>
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Sizes the name so "Ramkumar" exactly fills the space the illustration
 * leaves beside it (desktop) or the full width (mobile), capped by viewport
 * height so it never crowds short/landscape screens.
 */
function useFitName(text: string) {
  const boxRef = useRef<HTMLHeadingElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const measure = measureRef.current;
    if (!box || !measure) return;
    const fit = () => {
      const natural = measure.getBoundingClientRect().width; // at 100px
      const available = box.clientWidth;
      if (!natural || !available) return;
      const byWidth = (available / natural) * 100 * 0.985;
      const byHeight = window.innerHeight * (window.innerWidth >= 1024 ? 0.34 : 0.24);
      setSize(Math.max(40, Math.min(byWidth, byHeight, 320)));
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [text]);

  return { boxRef, measureRef, size };
}

function ScrollBadge() {
  const label = "Scroll to explore · Scroll to explore · ";
  return (
    <a
      href="#about"
      aria-label="Scroll to the About section"
      className="relative flex h-28 w-28 items-center justify-center rounded-full"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id="scroll-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-current font-mono text-[8.4px] uppercase tracking-[0.18em]">
          <textPath href="#scroll-circle">{label}</textPath>
        </text>
      </svg>
      <ArrowDownRight className="h-5 w-5" aria-hidden />
    </a>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { boxRef, measureRef, size } = useFitName("Ramkumar");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const artOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen min-h-[100svh] overflow-hidden">
      <div className="relative mx-auto flex min-h-screen min-h-[100svh] w-full max-w-[1600px] flex-col px-5 pb-8 pt-24 sm:px-8 lg:px-12 lg:pt-28">
        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: INTRO_DELAY + 0.5, duration: 0.8, ease }}
          className="grid grid-cols-2 gap-6 border-t border-foreground/80 pt-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] sm:grid-cols-3"
        >
          <p>
            <span className="text-muted-foreground">(Portfolio)</span>
            <br />
            Vol. {new Date().getFullYear()}
          </p>
          <p className="hidden sm:block">
            <span className="text-muted-foreground">(Role)</span>
            <br />
            {profile.title}
          </p>
          <p className="text-right">
            <span className="text-muted-foreground">(Currently)</span>
            <br />
            <span className="inline-flex items-center justify-end gap-2">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
              </span>
              <span>
                <span className="hidden sm:inline">{currentRole.title} </span>@ {currentRole.company}
              </span>
            </span>
          </p>
        </motion.div>

        {/* Name, full width. The ASCII knot (below) is layered over it. */}
        <div className="flex flex-1 items-end pb-8 pt-[16svh] sm:pt-[26svh] [@media(max-height:520px)]:items-center [@media(max-height:520px)]:py-8 lg:items-center lg:py-6">
          <motion.h1
            ref={boxRef}
            style={{ y: nameY, fontSize: size ?? undefined }}
            className="display-heading relative w-full text-[clamp(3.5rem,17vw,16rem)]"
          >
            <span className="sr-only">
              {profile.headline} — {profile.title}
            </span>
            {/* Invisible ruler: natural width of the name at 100px. */}
            <span
              ref={measureRef}
              aria-hidden
              className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap text-[100px]"
            >
              Ramkumar
            </span>
            <DecodeLine text="Ramkumar" delay={INTRO_DELAY} className="leading-[0.84]" />
            <span className="flex items-end gap-[0.12em]">
              <DecodeLine text="R." delay={INTRO_DELAY + 0.55} italic className="italic leading-[0.84]" />
              <motion.span
                aria-hidden
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: INTRO_DELAY + 0.9, duration: 0.9, ease }}
                className="mb-[0.08em] max-w-[15ch] font-sans text-[clamp(0.8rem,0.09em,1.2rem)] leading-snug tracking-normal text-muted-foreground"
              >
                Full stack engineer crafting fast, considered products.
              </motion.span>
            </span>
          </motion.h1>
        </div>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: INTRO_DELAY + 0.7, duration: 0.9, ease }}
          className="grid items-end gap-6 border-t border-border pt-6 lg:grid-cols-[1.1fr_1fr_auto] lg:gap-8"
        >
          <div>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              {profile.subtitle}
            </p>
            <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
              {heroBadges.slice(0, 6).join(" / ")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton href="#work" variant="primary">
              Selected work <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href={profile.resume} variant="ghost" download>
              Résumé
            </MagneticButton>
          </div>

          <div className="hidden lg:block">
            <ScrollBadge />
          </div>
        </motion.div>
      </div>

      {/*
        ASCII knot layered OVER the name in difference blend: its glyphs read
        as ink on paper and invert to paper inside the black letterforms, so
        the knot visibly weaves through the name while the name stays legible.
      */}
      <motion.div
        ref={artRef}
        style={{ y: artY, opacity: artOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: INTRO_DELAY - 0.2, duration: 1.6 }}
        className="pointer-events-none absolute inset-x-0 top-[21svh] z-20 h-[36svh] text-white mix-blend-difference sm:top-[13svh] sm:h-[46svh] [@media(max-height:520px)]:left-auto [@media(max-height:520px)]:right-[2%] [@media(max-height:520px)]:top-[16%] [@media(max-height:520px)]:h-[62%] [@media(max-height:520px)]:w-[55%] lg:inset-x-auto lg:right-[2%] lg:top-[10%] lg:h-[78%] lg:w-[58%]"
      >
        {mounted ? (
          <Suspense fallback={null}>
            <HeroAscii className="h-full w-full" />
          </Suspense>
        ) : null}
      </motion.div>

      {/* Where the knot crosses the name, the letters turn to outlines. */}
      {mounted ? (
        <HeroOutline
          sectionRef={ref}
          nameRef={boxRef}
          artRef={artRef}
          nameY={nameY}
          artY={artY}
          delay={INTRO_DELAY + 1.3}
        />
      ) : null}
    </section>
  );
}
