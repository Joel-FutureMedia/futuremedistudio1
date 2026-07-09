import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 24, className = "", once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted ${className}`}>
      <span className="h-px w-8 bg-brand/30" />
      {children}
    </span>
  );
}

function parseTo(href) {
  if (!href.startsWith("/")) return href;
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return href;
  return {
    pathname: href.slice(0, hashIndex) || "/",
    hash: href.slice(hashIndex),
  };
}

export function CTA({ children, href = "/book", variant = "primary", className = "", onClick }) {
  const base = "group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium transition-all duration-200";
  const styles =
    variant === "primary" || variant === "solid"
      ? "bg-brand text-white hover:bg-brand-dark shadow-card hover:shadow-card-hover"
      : "border border-brand-faint bg-white text-brand hover:border-brand/30 hover:bg-brand-surface";
  const arrow = (
    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  if (href.startsWith("/")) {
    return (
      <Link to={parseTo(href)} onClick={onClick} className={`${base} ${styles} ${className}`}>
        {children}
        {arrow}
      </Link>
    );
  }

  return (
    <a href={href} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
      {arrow}
    </a>
  );
}

export function BulletList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-brand-light">
          <span className="fm-bullet" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
