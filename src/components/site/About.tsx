import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { profile, skillGroups } from "@/lib/portfolio-data";
import { Reveal, Section } from "./Reveal";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/** Statement that inks in word by word as it scrolls through the viewport. */
function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p
      ref={ref}
      className="display-heading text-[clamp(1.9rem,4.2vw,4rem)] leading-[1.08] tracking-[-0.015em]"
    >
      {words.map((w, i) => (
        <Word
          key={`${w}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {w}
        </Word>
      ))}
    </p>
  );
}

export function About() {
  return (
    <Section id="about">
      <div className="grid gap-10 lg:grid-cols-[0.28fr_1fr]">
        <Reveal>
          <span className="eyebrow">(01) — About</span>
        </Reveal>
        <ScrollStatement text={profile.about} />
      </div>

      <div className="mt-24 grid gap-10 lg:mt-36 lg:grid-cols-[0.28fr_1fr]">
        <Reveal>
          <div className="space-y-6 font-mono text-[0.7rem] uppercase tracking-[0.16em]">
            {[
              { k: "Based in", v: "India · Remote" },
              { k: "Focus", v: "Product engineering" },
              { k: "Experience", v: profile.experience },
            ].map((item) => (
              <div key={item.k}>
                <p className="text-muted-foreground">{item.k}</p>
                <p className="mt-1">{item.v}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <dl className="border-b border-border">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.05}>
              <div className="group grid gap-3 border-t border-border py-6 transition-colors sm:grid-cols-[12rem_1fr] sm:gap-8">
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  0{i + 1} / {group.label}
                </dt>
                <dd className="display-heading text-[clamp(1.5rem,2.6vw,2.4rem)] leading-tight transition-transform duration-500 group-hover:translate-x-2">
                  {group.items.join(", ")}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
