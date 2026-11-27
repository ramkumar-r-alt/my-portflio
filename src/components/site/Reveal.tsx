import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "li";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Heading whose lines rise out of a mask as it scrolls into view. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={cn("max-w-5xl", className)}>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <h2 className="display-heading mt-6 overflow-hidden pb-[0.08em] text-[clamp(2.75rem,7vw,6.75rem)]">
        <motion.span
          className="block"
          initial={{ y: "100%" }}
          animate={inView ? { y: 0 } : { y: "100%" }}
          transition={{ duration: 1.1, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.span>
      </h2>
      {description ? (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  inverted,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  /** Flip to the opposite ink for a full-bleed contrast band. */
  inverted?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        inverted && "invert-tone bg-background text-foreground",
      )}
    >
      <div
        className={cn(
          "relative mx-auto w-full max-w-[1600px] px-5 py-28 sm:px-8 lg:px-12 lg:py-40",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
