import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type MouseEvent } from "react";
import { profile } from "@/lib/portfolio-data";
import { Reveal, Section } from "./Reveal";
import { MagneticButton } from "./MagneticButton";

const cards = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    Icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "ramkumar-r-052b92179",
    href: profile.linkedin,
    Icon: Linkedin,
  },
  {
    label: "GitHub",
    value: "ramkumar-r-alt",
    href: profile.github,
    Icon: Github,
  },
];

function SocialCard({ card, index }: { card: (typeof cards)[number]; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.12);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.12);
  };

  const { Icon } = card;

  return (
    <Reveal delay={index * 0.08}>
      <motion.a
        ref={ref}
        href={card.href}
        target={card.href.startsWith("http") ? "_blank" : undefined}
        rel={card.href.startsWith("http") ? "noreferrer noopener" : undefined}
        data-magnetic
        style={{ x, y }}
        onMouseMove={onMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="glass shadow-card group relative flex h-full flex-col items-start gap-5 overflow-hidden rounded-3xl p-8 text-left transition-colors duration-500 hover:border-primary/50"
      >
        <span
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/25 opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </span>
        <span className="relative">
          <span className="eyebrow block">{card.label}</span>
          <span className="mt-2 block font-display text-lg transition-colors group-hover:text-primary">
            {card.value}
          </span>
        </span>
        <ArrowUpRight className="relative mt-auto h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </motion.a>
    </Reveal>
  );
}

export function Contact() {
  return (
    <Section id="contact" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative text-center">
        <Reveal>
          <span className="eyebrow">08 — Contact</span>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="display-heading mx-auto mt-6 max-w-4xl text-[clamp(2.4rem,7vw,5.5rem)]">
            Let's build something <span className="text-gradient">worth shipping.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Open to senior full stack and product engineering roles, plus selective freelance work.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton href={`mailto:${profile.email}`} variant="primary">
              {profile.email} <Mail className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href={profile.resume} variant="ghost" download>
              Download Resume <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-16 grid gap-6 md:grid-cols-3">
        {cards.map((card, i) => (
          <SocialCard key={card.label} card={card} index={i} />
        ))}
      </div>
    </Section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          © {new Date().getFullYear()} {profile.name} · {profile.title}
        </p>
        <div className="flex items-center gap-5">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="#hero"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
