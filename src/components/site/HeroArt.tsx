import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import orbitAnimation from "@/assets/hero-orbit.lottie.json";
import { useTheme } from "./theme";

type LottieRef = {
  setSpeed: (s: number) => void;
  setDirection: (d: 1 | -1) => void;
  goToAndPlay: (v: number, isFrame?: boolean) => void;
  play: () => void;
};

type LottieProps = {
  animationData: unknown;
  loop?: boolean;
  className?: string;
  lottieRef?: { current: LottieRef | null };
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full || "3b82f6", 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function mix([r, g, b]: [number, number, number], t: number, target: number) {
  return [r + (target - r) * t, g + (target - g) * t, b + (target - b) * t] as [
    number,
    number,
    number,
  ];
}

/** Recolor every fill/stroke in the Lottie doc with a palette derived from the theme accent. */
function recolor(data: unknown, accent: string, isLight: boolean): unknown {
  const base = hexToRgb(accent);
  const palette: [number, number, number][] = [
    base,
    mix(base, 0.45, 1), // lighter tint
    mix(base, isLight ? 0.25 : 0.35, isLight ? 0 : 1), // contrast partner
  ];
  let i = 0;
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      const obj = node as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) out[k] = walk(v);
      if ((obj["ty"] === "fl" || obj["ty"] === "st") && obj["c"]) {
        const c = out["c"] as { a: number; k: number[] };
        const picked = palette[i++ % palette.length]!;
        out["c"] = { ...c, k: [picked[0], picked[1], picked[2], 1] };
      }
      return out;
    }
    return node;
  };
  return walk(data);
}

export function HeroArt() {
  const { accent, mode } = useTheme();
  const [Lottie, setLottie] = useState<ComponentType<LottieProps> | null>(null);
  const lottieRef = useRef<LottieRef | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let alive = true;
    void import("lottie-react").then((mod) => {
      const raw = mod as unknown as { default?: unknown };
      const inner = (raw.default as { default?: unknown } | undefined)?.default ?? raw.default;
      if (alive && typeof inner === "function") setLottie(() => inner as ComponentType<LottieProps>);
    });
    return () => {
      alive = false;
    };
  }, []);

  const themedAnimation = useMemo(
    () => recolor(orbitAnimation, accent, mode === "light"),
    [accent, mode],
  );

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-16, 16]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        mx.set(nx);
        my.set(ny);
        // cursor distance from the core drives orbital speed & direction
        const d = Math.min(1, Math.hypot(nx, ny) * 2);
        lottieRef.current?.setDirection(nx >= 0 ? 1 : -1);
        lottieRef.current?.setSpeed(0.5 + d * 2.2);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
        lottieRef.current?.setDirection(1);
        lottieRef.current?.setSpeed(1);
      }}
      onPointerDown={() => {
        setPulse((p) => p + 1);
        lottieRef.current?.goToAndPlay(0, true);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative mx-auto aspect-square w-full max-w-[26rem] cursor-pointer select-none"
    >
      <div className="pointer-events-none absolute inset-6 rounded-full bg-primary/20 blur-[90px] transition-opacity duration-500 group-hover:opacity-80" />
      <div className="glass absolute inset-0 rounded-[2.5rem] border-primary/20 transition-colors duration-500 group-hover:border-primary/50" />

      {/* click ripple, themed */}
      <motion.span
        key={pulse}
        initial={{ opacity: pulse ? 0.5 : 0, scale: 0.3 }}
        animate={{ opacity: 0, scale: 1.15 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 m-auto aspect-square w-full rounded-full border border-primary"
        aria-hidden
      />

      <div className="absolute inset-0 grid place-items-center p-4">
        {Lottie ? (
          <Lottie
            key={accent + mode}
            lottieRef={lottieRef}
            animationData={themedAnimation}
            loop
            className="h-full w-full"
          />
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-x-8 bottom-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>full stack</span>
        <span className="text-primary">3+ yrs</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        move · click to pulse
      </div>
    </motion.div>
  );
}
