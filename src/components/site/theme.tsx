import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Mode = "dark" | "light";

export const accentPresets = [
  { name: "Electric Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Pink", value: "#ec4899" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Yellow", value: "#eab308" },
  { name: "Teal", value: "#14b8a6" },
];

const MODE_KEY = "portfolio-theme-mode";
const ACCENT_KEY = "portfolio-theme-accent";
const DEFAULT_ACCENT = accentPresets[0]!.value;

type ThemeContextValue = {
  mode: Mode;
  accent: string;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  setAccent: (hex: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(mode: Mode, accent: string) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.classList.toggle("light", mode === "light");
  root.style.setProperty("--primary", accent);
  root.style.setProperty("--ring", `color-mix(in oklab, ${accent} 55%, transparent)`);
  root.style.setProperty("--glow", `color-mix(in oklab, ${accent} 35%, transparent)`);
  root.style.colorScheme = mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");
  const [accent, setAccentState] = useState<string>(DEFAULT_ACCENT);

  useEffect(() => {
    const storedMode = window.localStorage.getItem(MODE_KEY) as Mode | null;
    const storedAccent = window.localStorage.getItem(ACCENT_KEY);
    const nextMode: Mode = storedMode === "light" || storedMode === "dark" ? storedMode : "dark";
    const nextAccent = storedAccent || DEFAULT_ACCENT;
    setModeState(nextMode);
    setAccentState(nextAccent);
    applyTheme(nextMode, nextAccent);
  }, []);

  const setMode = useCallback(
    (m: Mode) => {
      setModeState(m);
      window.localStorage.setItem(MODE_KEY, m);
      applyTheme(m, accent);
    },
    [accent],
  );

  const setAccent = useCallback(
    (hex: string) => {
      setAccentState(hex);
      window.localStorage.setItem(ACCENT_KEY, hex);
      applyTheme(mode, hex);
    },
    [mode],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      accent,
      setMode,
      setAccent,
      toggleMode: () => setMode(mode === "dark" ? "light" : "dark"),
    }),
    [mode, accent, setMode, setAccent],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
