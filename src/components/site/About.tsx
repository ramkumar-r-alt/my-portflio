import { profile, skillGroups } from "@/lib/portfolio-data";
import { Reveal, Section, SectionHeading } from "./Reveal";

export function About() {
  return (
    <Section id="about">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="01 — About" title="Engineering depth meets interface craft." />
          <Reveal delay={0.2}>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{profile.about}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {[
                { k: "Based in", v: "India · Remote" },
                { k: "Focus", v: "Product engineering" },
                { k: "Experience", v: profile.experience },
              ].map((item) => (
                <div key={item.k}>
                  <p className="eyebrow">{item.k}</p>
                  <p className="mt-2 font-display text-base">{item.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="space-y-4">
          {skillGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.08}>
              <div className="glass shadow-card rounded-2xl p-6 transition-colors duration-500 hover:border-primary/40">
                <p className="eyebrow">{group.label}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
