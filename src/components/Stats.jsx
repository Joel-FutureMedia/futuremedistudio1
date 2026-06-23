import { Reveal } from "./primitives";

const STATS = [
  { v: "480M+", l: "Views produced" },
  { v: "1,200", l: "Episodes shipped" },
  { v: "48h", l: "Avg. turnaround" },
  { v: "98%", l: "Rebook rate" },
];

export default function Stats() {
  return (
    <section className="border-y border-brand-faint bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.06}>
            <div className="flex flex-col items-center justify-center border-brand-faint px-4 py-12 text-center md:border-r last:md:border-r-0">
              <span className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tightest text-brand">{s.v}</span>
              <span className="mt-2 text-xs font-medium uppercase tracking-wider text-brand-muted">{s.l}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
