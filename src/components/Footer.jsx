import { Link } from "react-router-dom";
import { Reveal, CTA } from "./primitives";
import { LOGO } from "../constants/brand";

export default function Footer() {
  return (
    <footer className="border-t border-white/20 bg-[#313e4a] pt-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-tight tracking-tightest text-white">
              Let us make the best thing on your feed.
            </h2>
            <p className="mt-5 max-w-md text-base text-white/75">
              Tell us what you want the world to watch. We will build the studio day, shoot it, and finish it.
            </p>
            <div className="mt-8"><CTA href="/book">Book a Studio</CTA></div>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/20 py-10 md:flex-row">
          <img src={LOGO} alt="Future Media" className="h-14 w-auto sm:h-16" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            {[
              { l: "Services", to: { pathname: "/", hash: "#services" } },
              { l: "Work", to: { pathname: "/", hash: "#work" } },
              { l: "Sets", to: "/sets" },
              { l: "Video Production Request", to: "/video-production-request" },
            ].map(({ l, to }) => (
              <Link key={l} to={to} className="transition-colors hover:text-white">{l}</Link>
            ))}
          </div>
          <span className="text-xs text-white/70">© 2026 Future Media</span>
        </div>
      </div>
    </footer>
  );
}
