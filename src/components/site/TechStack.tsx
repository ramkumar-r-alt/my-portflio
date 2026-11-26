import { Fragment } from "react";
import { skillGroups } from "@/lib/portfolio-data";

const all = skillGroups.flatMap((g) => g.items);
const half = Math.ceil(all.length / 2);
const rowA = all.slice(0, half);
const rowB = all.slice(half);

function Star() {
  return (
    <svg viewBox="0 0 40 40" className="mx-[0.35em] inline-block h-[0.5em] w-[0.5em] align-middle" aria-hidden>
      <path d="M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z" fill="currentColor" />
    </svg>
  );
}

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex w-max shrink-0 items-center whitespace-nowrap ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {doubled.map((item, i) => (
          <Fragment key={`${item}-${i}`}>
            <span className={i % 2 === 0 ? "" : "text-outline italic"}>{item}</span>
            <Star />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/** Two counter-running marquees of oversized type — the stack as texture. */
export function TechStack() {
  return (
    <section id="stack" aria-label="Tech stack" className="overflow-hidden border-y border-border py-10 lg:py-14">
      <p className="sr-only">Tools I use: {all.join(", ")}</p>
      <div aria-hidden className="display-heading space-y-2 text-[clamp(3.5rem,10vw,9.5rem)] leading-[1]">
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </section>
  );
}
