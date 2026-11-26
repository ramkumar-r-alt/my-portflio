import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/lib/portfolio-data";
import { ThemeToggle } from "./ThemeControls";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#work", label: "Work" },
  { href: "/#contact", label: "Contact" },
];

function useLocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const time = useLocalTime();

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  return (
    <>
      {/* Difference blend keeps the header legible on both paper and ink sections. */}
      <header className="fixed inset-x-0 top-0 z-[70] text-white mix-blend-difference">
        <div className="mx-auto flex w-full max-w-[1600px] items-start justify-between gap-6 px-[max(1.25rem,env(safe-area-inset-left))] pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 lg:px-12 lg:pb-7 lg:pt-7">
          <Link to="/" className="display-heading text-2xl leading-none sm:text-[1.7rem]">
            Ramkumar<span className="italic"> R</span>
            <sup className="ml-0.5 font-mono text-[0.55rem] not-italic">©</sup>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative font-mono text-[0.7rem] uppercase tracking-[0.16em]"
              >
                <span className="mr-1 opacity-50">0{i + 1}</span>
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5 font-mono text-[0.7rem] uppercase tracking-[0.16em]">
            <span className="hidden tabular-nums xl:inline">Bengaluru {time} IST</span>
            <ThemeToggle />
            <a href={profile.resume} download className="hidden underline-offset-4 hover:underline sm:inline">
              Résumé ↓
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.nav
            aria-label="Mobile"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="invert-tone fixed inset-0 z-[65] flex flex-col justify-end overflow-y-auto bg-background px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28 text-foreground sm:px-8"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => {
                  // Restart Lenis before its own click handler runs so the anchor eases there.
                  window.__lenis?.start();
                  setOpen(false);
                }}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline gap-4 border-t border-border py-3"
              >
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <span className="display-heading text-[clamp(2.5rem,12vw,4.5rem)]">{l.label}</span>
              </motion.a>
            ))}
            <a
              href={profile.resume}
              download
              className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"
            >
              Download résumé ↓
            </a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
