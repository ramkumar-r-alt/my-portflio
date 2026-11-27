import { useEffect, useRef } from "react";

/*
 * Hero illustration: a (2,3) torus knot rendered entirely in monospace
 * characters. Pure DOM text, no WebGL, so it inherits `currentColor` and
 * flips with light/dark mode for free.
 *
 *  - The character grid is sized from the container and the measured glyph
 *    box, so it stays crisp on any screen; sampling density scales with it.
 *  - Pointer rotates the knot, scrolling adds spin, and characters near the
 *    cursor scramble into code glyphs.
 *  - Paused while off screen; a single static frame for reduced motion.
 */

const RAMP = " .:-=+*#%@";
const GLYPHS = "01{}[]<>/\\=+*#$%&;:";
const P = 2;
const Q = 3;
/** Camera distance: far enough that perspective adds depth without distortion. */
const CAM = 11;

type Vec = [number, number, number];

function curve(t: number): Vec {
  const r = Math.cos(Q * t) + 2.2;
  return [r * Math.cos(P * t), r * Math.sin(P * t), -Math.sin(Q * t) * 1.15];
}
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: Vec): Vec => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** Surface samples of the knot tube: position + normal, packed in one array. */
function buildKnot(steps: number, around: number, tube = 0.4) {
  const out = new Float32Array(steps * around * 6);
  let k = 0;
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const e = 0.001;
    const c0 = curve(t);
    const c1 = curve(t + e);
    const cm = curve(t - e);
    const T = norm(sub(c1, cm));
    const acc = sub(sub(c1, c0), sub(c0, cm));
    const B = norm(cross(T, acc));
    const N = norm(cross(B, T));
    for (let j = 0; j < around; j++) {
      const a = (j / around) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const nx = N[0] * ca + B[0] * sa;
      const ny = N[1] * ca + B[1] * sa;
      const nz = N[2] * ca + B[2] * sa;
      out[k++] = c0[0] + nx * tube;
      out[k++] = c0[1] + ny * tube;
      out[k++] = c0[2] + nz * tube;
      out[k++] = nx;
      out[k++] = ny;
      out[k++] = nz;
    }
  }
  return out;
}

export default function HeroAscii({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const pre = preRef.current;
    if (!host || !pre) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0;
    let rows = 0;
    let charW = 7;
    let charH = 12;
    let scale = 1;
    let pts = new Float32Array(0);
    let screen = new Uint8Array(0); // ramp index per cell
    let zbuf = new Float32Array(0);

    const measure = () => {
      const probe = document.createElement("span");
      probe.textContent = "M".repeat(20);
      probe.style.visibility = "hidden";
      pre.appendChild(probe);
      const r = probe.getBoundingClientRect();
      probe.remove();
      charW = r.width / 20 || 7;
      charH = parseFloat(getComputedStyle(pre).lineHeight) || r.height || 12;
    };

    const resize = () => {
      measure();
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      cols = Math.max(20, Math.min(200, Math.floor(width / charW)));
      rows = Math.max(12, Math.min(110, Math.floor(height / charH)));
      const minPx = Math.min(cols * charW, rows * charH);
      // Knot radius ≈ 3.9 units. Scale for the *nearest* point (z = -3.9) so
      // perspective never pushes the knot out of its box.
      scale = (minPx * 0.5 * (CAM - 2.5)) / 3.7;
      // Enough samples that the surface never shows holes at this grid size.
      const steps = Math.round(Math.min(1400, Math.max(360, (minPx / charW) * 3.2)));
      const around = Math.round(Math.min(64, Math.max(18, (minPx / charW) * 0.42)));
      pts = buildKnot(steps, around);
      screen = new Uint8Array(cols * rows);
      zbuf = new Float32Array(cols * rows);
    };

    // Pointer in grid cells for the scramble halo; NaN when absent.
    const cursor = { x: Number.NaN, y: Number.NaN };
    const target = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      const r = pre.getBoundingClientRect();
      cursor.x = (e.clientX - r.left) / charW;
      cursor.y = (e.clientY - r.top) / charH;
    };
    const onLeave = () => {
      cursor.x = Number.NaN;
      cursor.y = Number.NaN;
    };

    let lastScroll = window.scrollY;
    let spin = 0;
    const onScroll = () => {
      const y = window.scrollY;
      spin += (y - lastScroll) * 0.0035;
      lastScroll = y;
    };

    const light = norm([-0.45, -0.65, -1]);
    let ry = 0;
    let rx = 0;
    let autoRot = 0;

    const draw = (time: number) => {
      const t = time * 0.001;
      // Spin in the knot's own plane (so the trefoil always reads) and only
      // wobble out of plane — never turning edge-on.
      autoRot += 0.006 + spin;
      spin *= 0.9;
      ry += (target.x * 0.7 + Math.sin(t * 0.45) * 0.45 - ry) * 0.06;
      rx += (target.y * 0.5 + Math.cos(t * 0.35) * 0.3 - rx) * 0.06;

      const cz = Math.cos(autoRot);
      const sz = Math.sin(autoRot);
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      screen.fill(0);
      zbuf.fill(0);

      const halfC = cols / 2;
      const halfR = rows / 2;
      const kx = scale / charW;
      const ky = scale / charH;
      const last = RAMP.length - 1;

      for (let k = 0; k < pts.length; k += 6) {
        const ox = pts[k]!;
        const oy = pts[k + 1]!;
        const pz = pts[k + 2]!;
        // rotate Z (in-plane spin), then Y, then X
        const px = ox * cz - oy * sz;
        const py = ox * sz + oy * cz;
        const x1 = px * cy + pz * sy;
        const z1 = -px * sy + pz * cy;
        const y2 = py * cx - z1 * sx;
        const z2 = py * sx + z1 * cx;
        const ooz = 1 / (z2 + CAM);
        const col = (halfC + x1 * ooz * kx) | 0;
        const row = (halfR + y2 * ooz * ky) | 0;
        if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
        const idx = row * cols + col;
        if (ooz <= zbuf[idx]!) continue;
        zbuf[idx] = ooz;
        const onx = pts[k + 3]!;
        const ony = pts[k + 4]!;
        const nz = pts[k + 5]!;
        const nx = onx * cz - ony * sz;
        const ny = onx * sz + ony * cz;
        const nx1 = nx * cy + nz * sy;
        const nz1 = -nx * sy + nz * cy;
        const ny2 = ny * cx - nz1 * sx;
        const nz2 = ny * sx + nz1 * cx;
        const lum = -(nx1 * light[0] + ny2 * light[1] + nz2 * light[2]);
        // Bias toward denser glyphs so the form reads solid in ink on paper.
        const level = Math.round(Math.pow(lum * 0.5 + 0.5, 0.45) * (last - 1)) + 1;
        screen[idx] = level < 1 ? 1 : level > last ? last : level;
      }

      const hasCursor = !Number.isNaN(cursor.x);
      const radius = Math.max(4, cols * 0.06);
      let out = "";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const v = screen[idx]!;
          let ch = RAMP[v]!;
          if (v > 0 && hasCursor) {
            const dx = c - cursor.x;
            const dy = (r - cursor.y) * (charH / charW);
            if (dx * dx + dy * dy < radius * radius && Math.random() < 0.55) {
              ch = GLYPHS[(Math.random() * GLYPHS.length) | 0]!;
            }
          }
          out += ch;
        }
        out += "\n";
      }
      pre.textContent = out;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    ro.observe(host);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    io.observe(host);

    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let lastFrame = 0;
    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || time - lastFrame < 33) return; // ~30fps is plenty for type
      lastFrame = time;
      draw(time);
    };

    if (reduceMotion) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={hostRef} className={className} aria-hidden>
      <pre
        ref={preRef}
        className="m-0 h-full w-full select-none overflow-hidden whitespace-pre font-mono text-[clamp(6px,0.82vw,11px)] leading-[1.15]"
      />
    </div>
  );
}
