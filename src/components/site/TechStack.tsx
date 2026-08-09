import { skillGroups } from "@/lib/portfolio-data";
import { Reveal, Section, SectionHeading } from "./Reveal";

const all = skillGroups.flatMap((g) => g.items);

export function TechStack() {
  return (
    <Section id="stack" className="overflow-hidden">
      <SectionHeading eyebrow="06 — Tech stack" title="Tools I reach for daily." />
      <Reveal delay={0.15}>
        <div className="relative mt-14 overflow-hidden py-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
          <div className="flex w-max animate-marquee gap-4">
            {[...all, ...all].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="glass whitespace-nowrap rounded-full px-6 py-3 font-display text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
