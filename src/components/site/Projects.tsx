import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { projects } from "@/lib/portfolio-data";
import { Reveal, Section, SectionHeading } from "./Reveal";

function TiltCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  };

  return (
    <Reveal delay={index * 0.06}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="glass shadow-card group relative h-full overflow-hidden rounded-3xl p-8 transition-colors duration-500 hover:border-primary/50"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/20 opacity-0 blur-[80px] transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />
        <div className="flex items-center justify-between">
          <span className="eyebrow">{project.accentLabel}</span>
          <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
        </div>

        <h3 className="display-heading mt-8 text-3xl sm:text-4xl">{project.name}</h3>
        <p className="mt-3 text-muted-foreground">{project.tagline}</p>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{project.overview}</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="eyebrow">Problem</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.problem}</p>
          </div>
          <div>
            <p className="eyebrow">Solution</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.solution}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="eyebrow">Features</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {project.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Architecture</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {project.architecture.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="eyebrow">Challenges</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {project.challenges.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Performance optimizations</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {project.optimizations.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p className="eyebrow">Tech stack</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* <div className="mt-6">
          <p className="eyebrow">Results</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {project.results.map((r) => (
              <div key={r.label} className="rounded-2xl border border-border px-4 py-3">
                <p className="display-heading text-2xl text-gradient">{r.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{r.label}</p>
              </div>
            ))}
          </div>
        </div> */}

        <div className="mt-6">
          <p className="eyebrow">Learnings</p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            {project.lessons.map((l) => (
              <li key={l} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {l}
              </li>
            ))}
          </ul>
        </div>

        {/* {project.caseStudy ? (
          <Link
            to="/work/$slug"
            params={{ slug: project.slug }}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Read case study
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        ) : null} */}
      </motion.div>
    </Reveal>
  );
}

export function Projects() {
  return (
    <Section id="work">
      <SectionHeading
        eyebrow="04 — Featured projects"
        title="Products built for scale, shipped end to end."
        description="The business problem, the architecture, the trade-offs and the measured outcome for each product."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <TiltCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}
