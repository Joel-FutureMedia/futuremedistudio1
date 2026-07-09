const ITEMS = [
  "Podcasts", "Interviews", "Talking Heads", "YouTube Shows",
  "Short-Form", "Corporate", "Branded Films", "Documentary",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section className="relative overflow-hidden border-y border-white/20 bg-[#313e4a] py-5">
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-[marquee_32s_linear_infinite] items-center gap-10 pr-10">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap text-lg font-medium tracking-tight text-white">
              {t}
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          ))}
        </div>
        <div className="flex shrink-0 animate-[marquee_32s_linear_infinite] items-center gap-10 pr-10" aria-hidden>
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap text-lg font-medium tracking-tight text-white">
              {t}
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-100%) } }`}</style>
    </section>
  );
}
