import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LOGO } from "../constants/brand";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: { pathname: "/", hash: "#services" } },
  { label: "Work", to: { pathname: "/", hash: "#work" } },
  { label: "Sets", to: "/sets" },
  { label: "Video Production Request", to: "/video-production-request" },
];

function IconPhone() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 w-full"
    >
      <div className="w-full border-b border-white/10 bg-[#27333d]">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-1.5 text-xs sm:justify-between">
          <a
            href="tel:+27830001000"
            className="inline-flex items-center gap-1.5 text-white/90 transition-colors hover:text-white"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white">
              <IconPhone />
            </span>
            083 000 1000
          </a>
          <span className="inline-flex items-center gap-1.5 text-white/85">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
              <IconLocation />
            </span>
            <span>42 &amp; 44 Hyper Motor City Path, Windhoek</span>
          </span>
        </div>
      </div>

      <nav className="w-full border-b border-white/10 bg-[#313e4a] shadow-nav">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-1.5">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Future Media home">
            <img src={LOGO} alt="Future Media" className="h-9 w-auto sm:h-10 md:h-11" />
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="rounded-md px-2.5 py-1.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white xl:px-3 xl:text-sm"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/book"
              className="hidden rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#313e4a] transition-colors hover:bg-white/90 sm:inline-flex xl:px-3.5 xl:py-2 xl:text-sm"
            >
              Book a Studio
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white lg:hidden"
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
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/10 bg-[#313e4a] lg:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base text-white/85 hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/book"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-2.5 text-base font-medium text-[#313e4a] hover:bg-white/90"
              >
                Book a Studio
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
