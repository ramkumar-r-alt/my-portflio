import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, Download, Mail } from "lucide-react";
import { useRef } from "react";
import { heroBadges, profile } from "@/lib/portfolio-data";
import { MagneticButton } from "./MagneticButton";
import { HeroArt } from "./HeroArt";

const letters = profile.headline.split("");

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-hero-glow"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
      <div
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary/20 blur-[120px] animate-float-slow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-16 h-80 w-80 rounded-full bg-primary/10 blur-[130px] animate-float-slow"
        aria-hidden
      />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-20 text-center sm:px-6 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-10 lg:py-32 lg:text-left"
      >
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for full stack engineering{"\u00A0"} roles
          </motion.span>

          <h1 className="display-heading mt-8 text-[clamp(3rem,9vw,7rem)]">
            <span className="sr-only">{profile.headline}</span>
            <span aria-hidden className="relative inline-block whitespace-nowrap pb-[0.12em]">
              <motion.span
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 2.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[0.09em] origin-left rounded-full bg-gradient-to-r from-primary via-primary/70 to-transparent shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
              />

              {letters.map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  className="inline-block text-gradient drop-shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.05, duration: 0.7 }}
            className="mt-4 font-mono text-sm uppercase tracking-[0.4em] text-primary sm:text-base"
          >
            {profile.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            {profile.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.35, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <MagneticButton href="#work" variant="primary">
              View My Work <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href={profile.resume} variant="ghost" download>
              Download Resume <Download className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              Get In Touch <Mail className="h-4 w-4" />
            </MagneticButton>
          </motion.div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {heroBadges.map((badge, i) => (
              <motion.span
                key={badge}
                initial={{ opacity: 0, y: 14, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -7, 0],
                }}
                transition={{
                  opacity: { delay: 2.5 + i * 0.06, duration: 0.5 },
                  scale: { delay: 2.5 + i * 0.06, duration: 0.5 },
                  y: {
                    delay: 2.5 + i * 0.06,
                    duration: 4 + (i % 4),
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="glass rounded-full px-4 py-2 text-xs text-muted-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <HeroArt />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="flex justify-center lg:col-span-2"
        >
          <ArrowDown className="h-5 w-5 animate-bounce text-primary" aria-hidden />
        </motion.div>
      </motion.div>
    </section>
  );
}

