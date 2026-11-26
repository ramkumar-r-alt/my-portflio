import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Pill link that leans toward the cursor. On hover an ink (or paper) disc
 * rises from below and the label colour flips — pure two-tone.
 */
export function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
  download,
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
  download?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.25);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const primary = variant === "primary";

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      data-magnetic
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn(
        "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-7 py-3.5 text-sm font-medium transition-colors duration-500",
        primary
          ? "border-foreground bg-foreground text-background hover:text-foreground"
          : "border-foreground/25 text-foreground hover:text-background",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 top-full -z-10 aspect-square w-[140%] -translate-x-1/2 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[70%]",
          primary ? "bg-background" : "bg-foreground",
        )}
      />
      {children}
    </motion.a>
  );
}
