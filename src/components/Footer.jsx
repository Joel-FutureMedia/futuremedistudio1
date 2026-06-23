import { Reveal, CTA } from "./primitives";
import { LOGO } from "../constants/brand";

export default function Footer() {
  return (
    <footer className="border-t border-brand-faint bg-brand-surface pt-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-tight tracking-tightest text-brand">
              Let us make the best thing on your feed.
            </h2>
            <p className="mt-5 max-w-md text-base text-brand-muted">
              Tell us what you want the world to watch. We will build the studio day, shoot it, and finish it.
            </p>
            <div className="mt-8"><CTA href="#book">Book a Studio</CTA></div>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-brand-faint py-10 md:flex-row">
          <img src={LOGO} alt="Future Media" className="h-14 w-auto sm:h-16" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-brand-muted">
            {[
              { l: "Services", h: "#services" },
              { l: "Work", h: "#work" },
              { l: "Set Package", h: "#packages" },
              { l: "Book", h: "#book" },
            ].map(({ l, h }) => (
              <a key={l} href={h} className="transition-colors hover:text-brand">{l}</a>
            ))}
          </div>
          <span className="text-xs text-brand-muted">© 2026 Future Media Video Production</span>
        </div>
      </div>
    </footer>
  );
}
