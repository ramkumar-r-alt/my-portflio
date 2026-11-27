import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { achievements } from "@/lib/portfolio-data";
import { Reveal, Section } from "./Reveal";

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
      const p = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(String(Math.round(numeric * eased)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric]);

  return (
    <span ref={ref} className="display-heading block text-[clamp(4.5rem,9vw,9rem)] leading-[0.85] tabular-nums">
      {prefix}
      {Number.isNaN(numeric) ? value : display}
      <em>{suffix}</em>
    </span>
  );
}

export function Achievements() {
  return (
    <Section id="achievements" inverted className="py-24 lg:py-32">
      <Reveal>
        <span className="eyebrow">(05) — By the numbers</span>
      </Reveal>
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.08}>
            <div className="flex h-full flex-col justify-between gap-10 border-t border-border py-8 sm:border-l sm:px-6 lg:border-t-0">
              <span className="font-mono text-[0.7rem] text-muted-foreground">0{i + 1}</span>
              <div>
                <Counter value={item.value} />
                <p className="mt-4 max-w-[18ch] text-sm leading-relaxed text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
