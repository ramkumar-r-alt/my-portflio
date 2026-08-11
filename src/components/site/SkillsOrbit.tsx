import { motion } from "motion/react";
import { orbitSkills } from "@/lib/portfolio-data";
import { Reveal, Section, SectionHeading } from "./Reveal";

export function SkillsOrbit() {
  const rings = [
    { diameter: "min(54vw, 264px)", items: orbitSkills.slice(0, 5), duration: 34 },
    { diameter: "min(86vw, 420px)", items: orbitSkills.slice(5, 12), duration: 52 },
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
          <div className="relative mx-auto flex aspect-square w-full max-w-[min(520px,calc(100vw-2rem))] items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-[90px]" aria-hidden />
            <div className="glass flex h-24 w-24 items-center justify-center rounded-full text-center font-display text-[11px] shadow-glow sm:h-28 sm:w-28 sm:text-sm">
              Core
              <br />
              Stack
            </div>

            {rings.map((ring) => (
              <div
                key={ring.diameter}
                className="pointer-events-none absolute inset-0 m-auto rounded-full border border-border"
                style={{ width: ring.diameter, height: ring.diameter }}
                aria-hidden
              />
            ))}

            {rings.map((ring) => (
              <motion.div
                key={`items-${ring.diameter}`}
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
                        transform: `rotate(${angle}deg) translateX(calc(${ring.diameter} / 2)) rotate(-${angle}deg)`,
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
