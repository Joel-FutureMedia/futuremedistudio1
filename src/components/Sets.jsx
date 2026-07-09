import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Eyebrow } from "./primitives";
import { SET_CATEGORIES, STUDIO_SETS } from "../constants/setsGallery";

const EASE = [0.22, 1, 0.36, 1];

function categoryCount(categoryId) {
  if (categoryId === "all") return STUDIO_SETS.length;
  return STUDIO_SETS.filter((s) => s.category === categoryId).length;
}

function SetCard({ set, index, onSelect }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.45, ease: EASE }}
      onClick={() => onSelect(set)}
      className="group relative overflow-hidden rounded-2xl border border-brand-faint bg-white text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
    >
      <div className="aspect-[4/3] overflow-hidden bg-brand-surface">
        <img
          src={set.image}
          alt={set.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/70 via-brand/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-block rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
            {SET_CATEGORIES.find((c) => c.id === set.category)?.label}
          </span>
          <p className="mt-2 text-sm font-semibold text-white">{set.name}</p>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <p className="text-sm font-semibold text-brand">{set.name}</p>
        <p className="mt-1 text-xs text-brand-muted">
          {SET_CATEGORIES.find((c) => c.id === set.category)?.label}
        </p>
      </div>
    </motion.button>
  );
}

function Lightbox({ set, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={set.name}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-brand/80 text-white transition-colors hover:bg-brand"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <img src={set.image} alt={set.name} className="max-h-[75vh] w-full object-contain bg-brand-surface" />
        <div className="border-t border-brand-faint px-6 py-4">
          <p className="text-lg font-semibold text-brand">{set.name}</p>
          <p className="mt-1 text-sm text-brand-muted">
            {SET_CATEGORIES.find((c) => c.id === set.category)?.label}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Sets() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return STUDIO_SETS;
    return STUDIO_SETS.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="sets" className="bg-[#313e4a] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <Reveal><div className="flex justify-center"><Eyebrow className="text-white [&>span:first-child]:bg-white/40">Studio inventory</Eyebrow></div></Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tightest text-white">
              Sets available in our studio.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/75">
              Browse chairs, tables, lounge sets, and decor — everything ready for your next production.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {SET_CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              const count = categoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-white text-[#313e4a] shadow-card"
                      : "border border-white/30 bg-[#313e4a] text-white/80 hover:border-white/60 hover:text-white"
                  }`}
                >
                  {cat.label}
                  <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                    active ? "bg-[#313e4a]/15 text-[#313e4a]" : "bg-white/10 text-white/80"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {SET_CATEGORIES.find((c) => c.id === activeCategory)?.label}
              </h3>
              <span className="text-sm text-white/70">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((set, i) => (
                <SetCard key={set.id} set={set} index={i} onSelect={setSelected} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && <Lightbox set={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
