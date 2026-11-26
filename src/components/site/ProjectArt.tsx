import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

/*
 * Generative monochrome illustrations, one motif per project, drawn in
 * `currentColor` so they invert with their container. Each motif takes a
 * `seed`: changing it regenerates the drawing and replays its entrance, which
 * is what clicking an illustration does (see InteractiveProjectArt). The
 * seeded PRNG keeps server and client renders identical.
 */

function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const W = 400;
const H = 300;
const ease = [0.16, 1, 0.3, 1] as const;

type MotifProps = { seed: number; origin: { x: number; y: number } };

/** Trade57 — a new trading session: candles grow in, then the trend line draws. */
function Candles({ seed }: MotifProps) {
  const bars = useMemo(() => {
    const r = rng(57 + seed * 13);
    let price = 150 + r() * 30;
    return Array.from({ length: 22 }, (_, i) => {
      const open = price;
      price = Math.min(250, Math.max(60, price + (r() - 0.45) * 36));
      const close = price;
      const high = Math.min(open, close) - r() * 18;
      const low = Math.max(open, close) + r() * 18;
      return { x: 30 + i * 16, open, close, high, low, up: close < open };
    });
  }, [seed]);
  return (
    <g>
      {[60, 110, 160, 210, 260].map((y) => (
        <line key={y} x1="16" x2={W - 16} y1={y} y2={y} strokeWidth="0.6" strokeDasharray="2 4" opacity="0.45" />
      ))}
      {bars.map((b, i) => (
        <motion.g
          key={b.x}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: i * 0.035, duration: 0.6, ease }}
          style={{ originY: `${(b.open + b.close) / 2}px`, transformBox: "view-box" }}
        >
          <line x1={b.x} x2={b.x} y1={b.high} y2={b.low} strokeWidth="1" />
          <rect
            x={b.x - 4.5}
            y={Math.min(b.open, b.close)}
            width="9"
            height={Math.max(2, Math.abs(b.close - b.open))}
            fill={b.up ? "currentColor" : "var(--art-bg)"}
            strokeWidth="1"
          />
        </motion.g>
      ))}
      <motion.path
        d={`M ${bars.map((b) => `${b.x} ${(b.open + b.close) / 2}`).join(" L ")}`}
        fill="none"
        strokeWidth="1.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
      />
    </g>
  );
}

/** flowwork.ai — packets race along the workflow graph from inputs to outputs. */
function Graph({ seed }: MotifProps) {
  const { nodes, edges } = useMemo(() => {
    const r = rng(11 + seed * 7);
    const cols = [60, 150, 250, 340];
    const nodes = cols.flatMap((x, c) => {
      const count = c === 0 || c === 3 ? 2 : 3 + Math.round(r());
      return Array.from({ length: count }, (_, j) => ({
        x: x + (r() - 0.5) * 16,
        y: 40 + ((j + 0.5) * (H - 80)) / count + (r() - 0.5) * 12,
        c,
      }));
    });
    const edges = nodes.flatMap((a, i) =>
      nodes
        .filter((b) => b.c === a.c + 1)
        .filter(() => r() > 0.25)
        .map((b, j) => ({
          key: `${i}-${j}`,
          c: a.c,
          d: `M ${a.x} ${a.y} C ${(a.x + b.x) / 2} ${a.y}, ${(a.x + b.x) / 2} ${b.y}, ${b.x} ${b.y}`,
          dur: 0.9 + r() * 0.8,
        })),
    );
    return { nodes, edges };
  }, [seed]);
  return (
    <g>
      {edges.map((e) => (
        <g key={e.key}>
          <motion.path
            d={e.d}
            fill="none"
            strokeWidth="0.7"
            opacity="0.65"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: e.c * 0.25, duration: 0.6, ease }}
          />
          <circle r="2.6" fill="currentColor" stroke="none">
            <animateMotion
              dur={`${e.dur}s`}
              begin={`${0.4 + e.c * 0.35}s`}
              repeatCount="indefinite"
              path={e.d}
            />
          </circle>
        </g>
      ))}
      {nodes.map((n, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: n.c * 0.25, type: "spring", stiffness: 300, damping: 16 }}
          style={{ originX: `${n.x}px`, originY: `${n.y}px`, transformBox: "view-box" }}
        >
          <circle cx={n.x} cy={n.y} r={n.c === 1 || n.c === 2 ? 9 : 13} fill="var(--art-bg)" strokeWidth="1.2" />
          {n.c === 3 ? <circle cx={n.x} cy={n.y} r="5" fill="currentColor" /> : null}
        </motion.g>
      ))}
    </g>
  );
}

/** E2E Workforce — the team reshuffles in a ripple spreading from the click. */
function People({ seed, origin }: MotifProps) {
  const dots = useMemo(() => {
    const r = rng(23 + seed * 31);
    const out: { x: number; y: number; k: number }[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 13; col++) {
        out.push({ x: 40 + col * 27, y: 46 + row * 30, k: r() });
      }
    }
    return out;
  }, [seed]);
  return (
    <g>
      {dots.map((d, i) => {
        const dist = Math.hypot(d.x - origin.x, d.y - origin.y);
        return (
          <motion.g
            key={i}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: dist / 900, type: "spring", stiffness: 380, damping: 14 }}
            style={{ originX: `${d.x}px`, originY: `${d.y}px`, transformBox: "view-box" }}
          >
            {d.k > 0.72 ? (
              <circle cx={d.x} cy={d.y} r="8" fill="currentColor" />
            ) : d.k > 0.4 ? (
              <circle cx={d.x} cy={d.y} r="8" fill="none" strokeWidth="1" />
            ) : (
              <circle cx={d.x} cy={d.y} r="2" fill="currentColor" />
            )}
          </motion.g>
        );
      })}
    </g>
  );
}

/** E2E Hiring — rings stack into a funnel, then a candidate drops through. */
function Funnel({ seed }: MotifProps) {
  const lean = useMemo(() => (rng(5 + seed)() - 0.5) * 30, [seed]);
  const rings = Array.from({ length: 11 }, (_, i) => i);
  const bottom = 50 + 10 * 19;
  return (
    <g>
      {rings.map((i) => {
        const rx = 160 - i * 13.5;
        const y = 50 + i * 19;
        return (
          <motion.ellipse
            key={i}
            cx={W / 2 + (lean * i) / 10}
            cy={y}
            rx={rx}
            ry={rx * 0.16}
            fill="none"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: i * 0.06, duration: 0.7, ease }}
          />
        );
      })}
      <line x1={W / 2 - 160} y1="50" x2={W / 2 - 25 + lean} y2={bottom} strokeWidth="0.8" />
      <line x1={W / 2 + 160} y1="50" x2={W / 2 + 25 + lean} y2={bottom} strokeWidth="0.8" />
      <motion.circle
        r="7"
        fill="currentColor"
        initial={{ cx: W / 2, cy: 10, opacity: 0 }}
        animate={{ cx: W / 2 + lean, cy: bottom + 26, opacity: 1 }}
        transition={{ delay: 0.75, duration: 1.1, ease: [0.5, 0, 0.2, 1] }}
      />
      <motion.text
        x={W / 2 + lean + 16}
        y={bottom + 30}
        fill="currentColor"
        stroke="none"
        fontSize="10"
        fontFamily="var(--font-mono)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        HIRED
      </motion.text>
    </g>
  );
}

const motifs: Record<string, (p: MotifProps) => React.JSX.Element> = {
  trade57: Candles,
  "flowwork-ai": Graph,
  "e2e-workforce": People,
  "e2e-hiring": Funnel,
};

export function ProjectArt({
  slug,
  className,
  seed = 0,
  origin = { x: W / 2, y: H / 2 },
}: {
  slug: string;
  className?: string;
  seed?: number;
  origin?: { x: number; y: number };
}) {
  const Motif = motifs[slug] ?? Graph;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      fill="none"
      stroke="currentColor"
      style={{ ["--art-bg" as string]: "var(--background)" }}
      aria-hidden
    >
      {/* Keyed by seed so every run remounts and replays its entrance. */}
      <g key={seed}>
        <Motif seed={seed} origin={origin} />
      </g>
    </svg>
  );
}

const actions: Record<string, string> = {
  trade57: "New trading session",
  "flowwork-ai": "Run the workflow",
  "e2e-workforce": "Reshuffle the team",
  "e2e-hiring": "Hire a candidate",
};

/** Click to regenerate: replays the motif from a new seed with a shockwave. */
export function InteractiveProjectArt({ slug, className }: { slug: string; className?: string }) {
  const [seed, setSeed] = useState(0);
  const [origin, setOrigin] = useState({ x: W / 2, y: H / 2 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const ref = useRef<HTMLButtonElement>(null);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    // Keyboard activation reports 0,0 — fall back to the centre.
    const fromKeyboard = e.clientX === 0 && e.clientY === 0;
    const x = fromKeyboard ? rect.width / 2 : px;
    const y = fromKeyboard ? rect.height / 2 : py;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setOrigin({ x: (x / rect.width) * W, y: (y / rect.height) * H });
    setSeed((s) => s + 1);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      data-cursor="Play"
      aria-label={`${actions[slug] ?? "Regenerate"} — replay the illustration`}
      className={cn("relative block w-full overflow-hidden text-left", className)}
    >
      <ProjectArt slug={slug} seed={seed} origin={origin} className="w-full" />
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full border border-current"
            style={{ left: r.x, top: r.y, width: 20, height: 20, marginLeft: -10, marginTop: -10 }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 28, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.2, 0.6, 0.3, 1] }}
            onAnimationComplete={() => setRipples((all) => all.filter((x) => x.id !== r.id))}
          />
        ))}
      </AnimatePresence>
      <span className="mt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
        <span>↻ {actions[slug] ?? "Regenerate"}</span>
        <span className="tabular-nums">Run {String(seed + 1).padStart(2, "0")}</span>
      </span>
    </button>
  );
}
