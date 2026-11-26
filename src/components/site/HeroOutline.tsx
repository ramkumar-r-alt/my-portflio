import { motion, type MotionValue } from "motion/react";
import { useEffect, useState, type RefObject } from "react";

/*
 * Outlined letterforms where the ASCII knot crosses the name.
 *
 * Inline SVG <text> (which can use the page's web fonts) redraws the name
 * as paper-filled outlines. Glyph positions are read from the DOM letter by
 * letter and baselines derived from the font's metrics, so the outlines land
 * exactly on the HTML letters. A radial mask confines the effect to the
 * knot's footprint: inside it the letters are hollow and the knot runs
 * through them; toward the edge they feather back to solid.
 */

type Glyph = { ch: string; x: number; y: number };
type Line = { italic: boolean; fontSize: number; glyphs: Glyph[] };
type Geometry = {
  w: number;
  h: number;
  lines: Line[];
  mask: { cx: number; cy: number; rx: number; ry: number };
};

export function HeroOutline({
  sectionRef,
  nameRef,
  artRef,
  nameY,
  artY,
  delay,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  nameRef: RefObject<HTMLElement | null>;
  artRef: RefObject<HTMLElement | null>;
  nameY: MotionValue<number>;
  artY: MotionValue<number>;
  delay: number;
}) {
  const [geo, setGeo] = useState<Geometry | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const name = nameRef.current;
    const art = artRef.current;
    if (!section || !name || !art) return;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;

    const measure = () => {
      const s = section.getBoundingClientRect();
      const ny = nameY.get();
      const ay = artY.get();
      const lines: Line[] = [...name.querySelectorAll<HTMLElement>("[data-glass-line]")].map((line) => {
        const italic = line.getAttribute("data-italic") === "true";
        const fontSize = parseFloat(getComputedStyle(line).fontSize);
        ctx.font = `${italic ? "italic " : ""}400 ${fontSize}px "Instrument Serif"`;
        const m = ctx.measureText("Rk");
        const ascent = m.fontBoundingBoxAscent;
        const descent = m.fontBoundingBoxDescent;
        const glyphs = [...line.querySelectorAll<HTMLElement>("[data-glass-char]")].map((el) => {
          const r = el.getBoundingClientRect();
          // CSS centres the font's content box in the line box (half-leading).
          const baseline = r.top + (r.height - (ascent + descent)) / 2 + ascent;
          return { ch: el.textContent ?? "", x: r.left - s.left, y: baseline - s.top - ny };
        });
        return { italic, fontSize, glyphs };
      });
      const a = art.getBoundingClientRect();
      // The knot is drawn into a square ~92% of the box's short side.
      const knotR = Math.min(a.width, a.height) * 0.5;
      setGeo({
        w: s.width,
        h: s.height,
        lines,
        mask: {
          cx: a.left - s.left + a.width / 2,
          cy: a.top - s.top - ay + a.height / 2,
          rx: knotR,
          ry: knotR,
        },
      });
    };

    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(name);
    ro.observe(art);
    return () => ro.disconnect();
  }, [sectionRef, nameRef, artRef, nameY, artY]);

  if (!geo) return null;

  const { mask } = geo;
  // Solid core inside the knot, feathering back to the normal letters.
  const maskImage = `radial-gradient(${mask.rx}px ${mask.ry}px at ${mask.cx}px ${mask.cy}px, #000 78%, transparent 92%)`;

  return (
    <motion.div
      aria-hidden
      style={{ y: nameY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1.2 }}
      className="pointer-events-none absolute inset-0 z-[15]"
    >
      {/*
        Sits between the name (below) and the knot (above): re-draws the
        letters as paper-filled outlines, hollowing them out so the knot
        passes through crisp strokes. The radial mask limits it to the knot.
      */}
      <svg
        className="absolute left-0 top-0 overflow-visible"
        width={geo.w}
        height={geo.h}
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        {geo.lines.map((line, i) => (
          <text
            key={i}
            x={line.glyphs.map((g) => g.x.toFixed(1)).join(" ")}
            y={line.glyphs.map((g) => g.y.toFixed(1)).join(" ")}
            fontFamily='"Instrument Serif", serif'
            fontSize={line.fontSize}
            fontStyle={line.italic ? "italic" : "normal"}
            fontWeight={400}
            fill="var(--background)"
            stroke="var(--foreground)"
            strokeWidth={Math.max(1.6, line.fontSize * 0.008)}
            strokeLinejoin="round"
          >
            {line.glyphs.map((g) => g.ch).join("")}
          </text>
        ))}
      </svg>
    </motion.div>
  );
}
