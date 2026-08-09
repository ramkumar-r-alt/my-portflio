import { AnimatePresence, motion } from "motion/react";
import { Check, Moon, Palette, Sun, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { accentPresets, useTheme } from "./theme";

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.25 }}
          className="flex"
        >
          {mode === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function AccentPicker({ className }: { className?: string }) {
  const { accent, setAccent } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Choose accent color"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
      >
        <Palette className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass shadow-card absolute right-0 top-12 z-50 w-64 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <p className="eyebrow">Accent color</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close color picker"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {accentPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  title={preset.name}
                  aria-label={preset.name}
                  onClick={() => setAccent(preset.value)}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border transition-transform duration-200 hover:scale-110"
                  style={{ backgroundColor: preset.value }}
                >
                  {accent.toLowerCase() === preset.value.toLowerCase() ? (
                    <Check className="h-4 w-4 text-background" />
                  ) : null}
                </button>
              ))}
            </div>

            <label className="mt-4 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              Custom
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-8 w-14 cursor-pointer rounded-md border border-border bg-transparent"
                aria-label="Custom accent color"
              />
            </label>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
