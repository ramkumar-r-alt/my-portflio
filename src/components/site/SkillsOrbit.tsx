import { motion } from "motion/react";
import { orbitSkills } from "@/lib/portfolio-data";
import { Reveal, Section, SectionHeading } from "./Reveal";

export function SkillsOrbit() {
  const rings = [
    { radius: 132, items: orbitSkills.slice(0, 5), duration: 34 },
    { radius: 210, items: orbitSkills.slice(5, 12), duration: 52 },
  ];

  return (
    <Section id="skills">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <SectionHeading
          eyebrow="03 — Skills"
          title="A stack chosen for speed and longevity."
          description="Frontend systems, API design, relational modelling, caching and asynchronous processing — the full path from pixel to queue."
        />

        <Reveal delay={0.15}>
          <div className="relative mx-auto flex aspect-square w-full max-w-[520px] items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-[90px]" aria-hidden />
            <div className="glass flex h-28 w-28 items-center justify-center rounded-full text-center font-display text-sm shadow-glow">
              Core
              <br />
              Stack
            </div>

            {rings.map((ring) => (
              <div
                key={ring.radius}
                className="pointer-events-none absolute rounded-full border border-border"
                style={{ width: ring.radius * 2, height: ring.radius * 2 }}
                aria-hidden
              />
            ))}

            {rings.map((ring) => (
              <motion.div
                key={`items-${ring.radius}`}
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: ring.duration, ease: "linear", repeat: Infinity }}
              >
                {ring.items.map((skill, i) => {
                  const angle = (360 / ring.items.length) * i;
                  return (
                    <motion.div
                      key={skill}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `rotate(${angle}deg) translateX(${ring.radius}px) rotate(-${angle}deg)`,
                      }}
                    >
                      <div style={{ transform: "translate(-50%, -50%)" }}>
                        <motion.span
                          className="glass block whitespace-nowrap rounded-full px-3 py-1.5 text-xs"
                          animate={{ rotate: -360 }}
                          transition={{
                            duration: ring.duration,
                            ease: "linear",
                            repeat: Infinity,
                          }}
                        >
                          {skill}
                        </motion.span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
