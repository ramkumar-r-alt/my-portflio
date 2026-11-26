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

// New key: the old one may hold "dark" from the blue-accent design, and the
// monochrome redesign should open on paper for first-time visitors.
export const MODE_KEY = "portfolio-mode-v2";

type ThemeContextValue = {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyMode(mode: Mode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.classList.toggle("light", mode === "light");
}

/** Runs in <head> before paint so a stored dark preference never flashes paper. */
export const themeBootScript = `try{var m=localStorage.getItem("${MODE_KEY}");if(m==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.add("light")}}catch(e){}`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(MODE_KEY);
    const next: Mode = stored === "dark" ? "dark" : "light";
    setModeState(next);
    applyMode(next);
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    window.localStorage.setItem(MODE_KEY, m);
    applyMode(m);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode(mode === "dark" ? "light" : "dark"),
    }),
    [mode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
