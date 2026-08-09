import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { achievements } from "@/lib/portfolio-data";
import { Reveal, Section, SectionHeading } from "./Reveal";

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [display, setDisplay] = useState("0");
  const numeric = parseFloat(value.replace(/[^\d.]/g, ""));
  const prefix = value.startsWith("-") ? "-" : "";
  const suffix = value.replace(/^-?[\d.]+/, "");

  useEffect(() => {
    if (!inView || Number.isNaN(numeric)) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(String(Math.round(numeric * eased)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric]);

  return (
    <span ref={ref} className="display-heading text-5xl text-gradient sm:text-6xl">
      {prefix}
      {Number.isNaN(numeric) ? value : display}
      {suffix}
    </span>
  );
}

export function Achievements() {
  return (
    <Section id="achievements">
      <SectionHeading eyebrow="05 — Achievements" title="Numbers behind the work." />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08}>
            <div className="glass shadow-card h-full rounded-2xl p-7">
              <Counter value={item.value} />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
