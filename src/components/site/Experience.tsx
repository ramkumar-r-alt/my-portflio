import { experience } from "@/lib/portfolio-data";
import { Reveal, Section, SectionHeading } from "./Reveal";

export function Experience() {
  const items = experience.filter((item) => item.company !== "");

  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="(02) — Experience"
        title={
          <>
            Three years of shipping <em>things people rely on.</em>
          </>
        }
      />

      <ol className="mt-20 border-b border-border lg:mt-28">
        {items.map((item, i) => (
          <li key={item.company + item.period}>
            <Reveal>
              <article className="grid gap-6 border-t border-border py-10 lg:grid-cols-[0.28fr_1fr] lg:gap-10 lg:py-14">
                <div className="flex items-start justify-between gap-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] lg:flex-col lg:justify-start">
                  <span>{item.period}</span>
                  <span className="text-muted-foreground">
                    ({String(i + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")})
                  </span>
                </div>

                <div>
                  <h3 className="display-heading text-[clamp(2.2rem,4.6vw,4.2rem)]">
                    {item.role}
                  </h3>
                  <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {item.company}
                    {item.location ? ` — ${item.location}` : ""}
                  </p>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed">{item.detail}</p>

                  <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
                    {item.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-3 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span aria-hidden className="mt-[0.45em] h-px w-3 shrink-0 bg-foreground" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
