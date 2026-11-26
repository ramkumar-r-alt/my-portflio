import { cn } from "@/lib/utils";
import { useTheme } from "./theme";

/** Text toggle — reads as part of the mono nav rather than an icon button. */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em]",
        className,
      )}
    >
      <span
        aria-hidden
        className="relative inline-block h-3 w-3 overflow-hidden rounded-full border border-current"
      >
        <span
          className={cn(
            "absolute inset-y-0 left-0 w-1/2 bg-current transition-transform duration-500",
            mode === "dark" ? "translate-x-full" : "translate-x-0",
          )}
        />
      </span>
      <span className="hidden sm:inline">{mode === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
