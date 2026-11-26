import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { currentRole, profile } from "@/lib/portfolio-data";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "LinkedIn", value: "ramkumar-r-052b92179", href: profile.linkedin },
  { label: "GitHub", value: "ramkumar-r-alt", href: profile.github },
];

const ease = [0.16, 1, 0.3, 1] as const;

function BigLine({ children, delay, inView }: { children: React.ReactNode; delay: number; inView: boolean }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={{ y: "100%" }}
        animate={inView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Contact() {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section id="contact" className="invert-tone relative bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pt-40">
        <Reveal>
          <span className="eyebrow">(06) — Contact</span>
        </Reveal>

        <h2 ref={ref} className="display-heading mt-8 text-[clamp(3.4rem,12vw,12.5rem)] leading-[0.86]">
          <BigLine delay={0} inView={inView}>
            Let&rsquo;s build
          </BigLine>
          <BigLine delay={0.08} inView={inView}>
            something <em>worth</em>
          </BigLine>
          <BigLine delay={0.16} inView={inView}>
            <em>shipping.</em>
          </BigLine>
        </h2>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[1fr_1fr] lg:items-end">
          <Reveal>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Currently building at {currentRole.company}. Always happy to talk about thoughtful products,
              engineering and collaboration.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton href={`mailto:${profile.email}`} variant="primary">
                Start a conversation <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href={profile.resume} variant="ghost" download>
                Download résumé
              </MagneticButton>
            </div>
          </Reveal>

          <ul className="border-b border-border">
            {channels.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 0.06}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="group flex items-center justify-between gap-4 border-t border-border py-5"
                >
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {c.label}
                  </span>
                  <span className="flex items-center gap-3 text-right">
                    <span className="display-heading truncate text-[clamp(1.25rem,2.2vw,2rem)] transition-transform duration-500 group-hover:-translate-x-2 group-hover:italic">
                      {c.value}
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="invert-tone relative overflow-hidden bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 border-t border-border py-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name} — {profile.title}
          </p>
          <div className="flex items-center gap-6">
            <a href={profile.github} target="_blank" rel="noreferrer noopener" className="hover:text-foreground">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" className="hover:text-foreground">
              LinkedIn
            </a>
            <a href="#hero" className="hover:text-foreground">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
      <p
        aria-hidden
        className="display-heading select-none whitespace-nowrap px-2 pb-[env(safe-area-inset-bottom)] text-center text-[19.5vw] leading-[0.78] tracking-[-0.045em]"
      >
        Ramkumar <em>R</em>
      </p>
    </footer>
  );
}
