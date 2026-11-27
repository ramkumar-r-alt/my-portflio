import { useEffect, useMemo, useRef } from "react";
import { orbitSkills, skillGroups } from "@/lib/portfolio-data";
import { Reveal, Section, SectionHeading } from "./Reveal";

/**
 * A rotating 3D sphere of skill words. Points sit on a Fibonacci sphere and
 * are projected by hand each frame (no WebGL) — words nearer the viewer get
 * larger and fully opaque. Drag (or move the pointer over it) to spin it.
 */
function WordSphere({ words }: { words: string[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const points = useMemo(() => {
    const n = words.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    return words.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });
  }, [words]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ax = 0.0025; // rotation velocity around X
    let ay = 0.004; // rotation velocity around Y
    let rotX = 0.3;
    let rotY = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let visible = true;
    let raf = 0;

    const render = () => {
      const radius = host.clientWidth * 0.4;
      const cx = Math.cos(rotX);
      const sx = Math.sin(rotX);
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);
      points.forEach((p, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        // rotate around Y then X
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 back → 1 front
        const scale = 0.55 + depth * 0.65;
        el.style.transform = `translate3d(${x1 * radius}px, ${y2 * radius}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(0.18 + depth * 0.82);
        el.style.zIndex = String(Math.round(depth * 100));
      });
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (!dragging) {
        ax += (0.0025 - ax) * 0.02;
        ay += (0.004 - ay) * 0.02;
      }
      rotX += ax;
      rotY += ay;
      render();
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      host.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      ay = (e.clientX - lastX) * 0.004;
      ax = (e.clientY - lastY) * 0.004;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };

    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    io.observe(host);

    render();
    if (!reduce) tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
    };
  }, [points]);

  return (
    <div
      ref={hostRef}
      data-cursor="Drag"
      className="relative mx-auto aspect-square w-full max-w-[min(620px,calc(100vw-2.5rem))] cursor-grab touch-pan-y select-none active:cursor-grabbing"
      aria-hidden
    >
      {/* Drafting guides */}
      <div className="absolute inset-[10%] rounded-full border border-border" />
      <div className="absolute inset-[10%] rounded-full border border-border [transform:rotateX(72deg)]" />
      <div className="absolute left-1/2 top-[6%] bottom-[6%] w-px bg-border" />
      <div className="absolute top-1/2 left-[6%] right-[6%] h-px bg-border" />

      <div className="absolute left-1/2 top-1/2">
        {words.map((w, i) => (
          <span
            key={w}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="display-heading absolute left-0 top-0 whitespace-nowrap text-[clamp(1rem,2.4vw,1.75rem)] will-change-transform"
          >
            {i % 3 === 0 ? <em>{w}</em> : w}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsSphere() {
  const words = useMemo(
    () => Array.from(new Set([...orbitSkills, ...skillGroups.flatMap((g) => g.items)])),
    [],
  );

  return (
    <Section id="skills" inverted>
      <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="(03) — Skills"
            title={
              <>
                A stack chosen for <em>speed</em> and longevity.
              </>
            }
            description="Frontend systems, API design, relational modelling, caching and asynchronous processing — the full path from pixel to queue."
          />
          <Reveal delay={0.2}>
            <p className="mt-10 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              ↻ Drag the sphere — {words.length} tools in rotation
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <WordSphere words={words} />
        </Reveal>
      </div>
    </Section>
  );
}
