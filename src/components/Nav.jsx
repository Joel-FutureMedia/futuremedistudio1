import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOGO } from "../constants/brand";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Set Package", href: "#packages" },
  { label: "Book", href: "#book" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${
          scrolled ? "border border-brand-faint bg-white/95 shadow-nav backdrop-blur-md" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <a href="#top" className="flex items-center" aria-label="Future Media home">
          <img src={LOGO} alt="Future Media" className="h-14 w-auto sm:h-16 md:h-[4.5rem]" />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="rounded-lg px-4 py-2 text-base text-brand-light transition-colors hover:bg-brand-surface hover:text-brand">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a href="#book" className="fm-btn-primary px-5 py-2.5">Book a Studio</a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-white text-[#323e4a] shadow-sm md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-[4.5rem] left-4 right-4 z-50 rounded-2xl border border-brand-faint bg-white p-3 shadow-card md:hidden"
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-base text-brand-light hover:bg-brand-surface hover:text-brand">
                {l.label}
              </a>
            ))}
            <a href="#book" onClick={() => setOpen(false)} className="fm-btn-primary mt-2 w-full">Book a Studio</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
