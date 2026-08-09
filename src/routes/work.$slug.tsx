import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { caseStudies, type Project } from "@/lib/portfolio-data";
import { Reveal } from "@/components/site/Reveal";
import { SiteFooter } from "@/components/site/Contact";
import { ScrollProgress } from "@/components/site/Chrome";
import { useLenis } from "@/components/site/useLenis";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }): Project => {
    const project = caseStudies.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.name} — Case Study | Ramkumar R`
      : "Case Study | Ramkumar R";
    const description = loaderData?.overview ?? "Engineering case study by Ramkumar R.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CaseStudy,
});

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="border-t border-border py-12">
        <p className="eyebrow">{title}</p>
        <div className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

function List({ items, dim }: { items: string[]; dim?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((c) => (
        <li key={c} className="flex gap-3">
          <span
            className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${dim ? "bg-primary/60" : "bg-primary"}`}
          />
          {c}
        </li>
      ))}
    </ul>
  );
}

function CaseStudy() {
  useLenis();
  const project = Route.useLoaderData() as Project;
  const index = caseStudies.findIndex((p) => p.slug === project.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <>
      <ScrollProgress />
      <main className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-hero-glow"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-16 pt-28 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>

          <Reveal delay={0.05}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <span className="eyebrow">{project.accentLabel}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">{project.role}</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="display-heading mt-6 text-[clamp(2.6rem,7vw,5rem)]">{project.name}</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-2xl text-xl text-muted-foreground">{project.tagline}</p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-10 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="glass rounded-full px-4 py-2 text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="mt-16">
            <Block title="Overview">{project.overview}</Block>
            <Block title="Business problem">{project.problem}</Block>
            <Block title="Solution">{project.solution}</Block>
            <Block title="Features">
              <List items={project.features} />
            </Block>

            <Reveal>
              <section className="border-t border-border py-12">
                <p className="eyebrow">Architecture diagram</p>
                <div className="glass mt-5 flex h-64 items-center justify-center rounded-3xl border-dashed text-sm text-muted-foreground">
                  Architecture diagram placeholder
                </div>
                <div className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  <List items={project.architecture} dim />
                </div>
              </section>
            </Reveal>

            <Block title="Challenges">
              <List items={project.challenges} />
            </Block>

            <Block title="Performance optimizations">
              <List items={project.optimizations} dim />
            </Block>

            <Reveal>
              <section className="border-t border-border py-12">
                <p className="eyebrow">Results</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {project.results.map((m) => (
                    <div key={m.label} className="glass shadow-card rounded-2xl p-6">
                      <p className="display-heading text-4xl text-gradient">{m.value}</p>
                      <p className="mt-3 text-sm text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            <Block title="Learnings">
              <List items={project.lessons} />
            </Block>
          </div>

          {next ? (
            <Reveal>
              <Link
                to="/work/$slug"
                params={{ slug: next.slug }}
                className="glass group mt-10 flex items-center justify-between rounded-3xl p-8 transition-colors hover:border-primary/50"
              >
                <div>
                  <p className="eyebrow">Next case study</p>
                  <p className="display-heading mt-3 text-3xl">{next.name}</p>
                </div>
                <ArrowUpRight className="h-6 w-6 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Reveal>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
