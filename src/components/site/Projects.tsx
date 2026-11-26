import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { Plus } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { projects, type Project } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { InteractiveProjectArt, ProjectArt } from "./ProjectArt";
import { Reveal, Section, SectionHeading } from "./Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {items.map((it) => (
          <li key={it} className="flex gap-3">
            <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-foreground" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="grid gap-10 pb-12 pt-2 lg:grid-cols-[0.42fr_1fr] lg:gap-14">
      <div className="invert-tone self-start rounded-2xl bg-background p-6 text-foreground lg:sticky lg:top-28">
        <InteractiveProjectArt slug={project.slug} />
      </div>

      <div className="space-y-10">
        <p className="display-heading text-[clamp(1.5rem,2.4vw,2.2rem)] leading-tight">{project.overview}</p>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="eyebrow">Problem</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.problem}</p>
          </div>
          <div>
            <p className="eyebrow">Solution</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.solution}</p>
          </div>
          <DetailList title="Features" items={project.features} />
          <DetailList title="Architecture" items={project.architecture} />
          <DetailList title="Challenges" items={project.challenges} />
          <DetailList title="Performance" items={project.optimizations} />
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <DetailList title="Learnings" items={project.lessons} />
          <div>
            <p className="eyebrow">Stack</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="rounded-full border border-border px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.1em]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const [open, setOpen] = useState<string | null>(projects[0]?.slug ?? null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Cursor-following preview card (desktop pointers only — hidden via CSS below lg).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 220, damping: 26, mass: 0.6 });
  const y = useSpring(py, { stiffness: 220, damping: 26, mass: 0.6 });
  const onMove = (e: MouseEvent) => {
    px.set(e.clientX);
    py.set(e.clientY);
  };

  return (
    <Section id="work">
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow="(04) — Selected work"
          title={
            <>
              Products built <em>for scale.</em>
            </>
          }
          description="The business problem, the architecture, the trade-offs and the learnings — open any project to read the full breakdown."
        />
        <Reveal>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            ({String(projects.length).padStart(2, "0")}) Projects · 2023 — 2026
          </p>
        </Reveal>
      </div>

      <ul className="mt-20 border-b border-border lg:mt-28" onMouseMove={onMove} onMouseLeave={() => setHovered(null)}>
        {projects.map((project, i) => {
          const isOpen = open === project.slug;
          return (
            <li key={project.slug} className="border-t border-border">
              <Reveal>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  data-cursor={isOpen ? "Close" : "Open"}
                  aria-controls={`project-${project.slug}`}
                  onClick={() => setOpen(isOpen ? null : project.slug)}
                  onMouseEnter={() => setHovered(project.slug)}
                  onMouseLeave={() => setHovered(null)}
                  className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-8 text-left sm:gap-8 lg:py-10"
                >
                  <span className="font-mono text-[0.7rem] tracking-[0.16em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="display-heading block text-[clamp(2.6rem,8vw,7.5rem)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:italic">
                      {project.name}
                    </span>
                    <span className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                      <span>{project.tagline}</span>
                      <span>{project.accentLabel}</span>
                      <span>{project.year}</span>
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all duration-500 group-hover:bg-foreground group-hover:text-background sm:h-16 sm:w-16",
                      isOpen && "rotate-45 bg-foreground text-background",
                    )}
                    aria-hidden
                  >
                    <Plus className="h-5 w-5" />
                  </span>
                </button>
              </Reveal>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={`project-${project.slug}`}
                    key="detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease }}
                    className="overflow-hidden"
                  >
                    <ProjectDetail project={project} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* Floating preview */}
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden lg:block"
      >
        <AnimatePresence>
          {hovered && hovered !== open ? (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 6 }}
              transition={{ duration: 0.45, ease }}
              className="invert-tone ml-8 mt-8 w-[300px] rounded-2xl bg-background p-5 text-foreground"
            >
              <ProjectArt slug={hovered} className="w-full" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
