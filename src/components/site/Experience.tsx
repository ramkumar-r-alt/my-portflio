import { experience } from "@/lib/portfolio-data";
import { Reveal, Section, SectionHeading } from "./Reveal";

export function Experience() {
  return (
    <Section id="experience" className="overflow-hidden">
      <SectionHeading
        eyebrow="02 — Experience"
        title="Three years of shipping things people rely on."
      />

      <div className="relative mx-auto mt-20 max-w-5xl">
        {/* Background decorative orbs */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"
          aria-hidden
        />

        {/* Timeline spine */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-border to-transparent lg:left-1/2 lg:block lg:-translate-x-1/2"
          aria-hidden
        />

        <div className="relative space-y-16 lg:space-y-24">
          {experience
            .filter((item) => item.company !== "")
            .map((item, i) => {
              const isEven = i % 2 === 0;
              const isActive = i === 0;

              return (
                <Reveal key={item.company + item.period} delay={i * 0.12}>
                  <div className="group relative flex flex-col items-start lg:flex-row lg:items-center">
                    {/* Text column */}
                    <div
                      className={`lg:w-1/2 ${
                        isEven
                          ? "lg:pr-16 lg:text-right"
                          : "lg:pl-16 lg:text-left lg:order-2"
                      }`}
                    >
                      <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                        {item.period}
                      </span>
                      <h3 className="display-heading mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
                        {item.role}
                      </h3>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.company}
                        {item.location ? (
                          <span className="text-border px-2">|</span>
                        ) : null}
                        {item.location}
                      </p>
                    </div>

                    {/* Timeline node */}
                    <div
                      className={`absolute top-0 hidden h-4 w-4 items-center justify-center rounded-full border-2 bg-background lg:flex ${
                        isActive
                          ? "border-primary shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
                          : "border-border group-hover:border-primary"
                      } ${
                        isEven
                          ? "lg:left-1/2 lg:-translate-x-1/2"
                          : "lg:left-1/2 lg:-translate-x-1/2"
                      }`}
                      aria-hidden
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-primary" : "bg-border group-hover:bg-primary"
                        }`}
                      />
                    </div>

                    {/* Card column */}
                    <div
                      className={`lg:w-1/2 ${
                        isEven
                          ? "lg:pl-16"
                          : "lg:pr-16 lg:order-1"
                      } mt-6 lg:mt-0`}
                    >
                      <div className="group/card relative overflow-hidden rounded-2xl border border-border/60 bg-card/30 p-6 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:bg-card/50">
                        {/* Card glow sweep */}
                        <div
                          className="pointer-events-none absolute -inset-px bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
                          aria-hidden
                        />

                        <p className="relative z-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                          {item.detail}
                        </p>

                        <ul className="relative z-10 mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
                          {item.highlights.map((h) => (
                            <li
                              key={h}
                              className="flex items-start gap-3 text-xs text-muted-foreground"
                            >
                              <span
                                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                                  isActive ? "bg-primary" : "bg-primary/50"
                                }`}
                              />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
        </div>
      </div>
    </Section>
  );
}
