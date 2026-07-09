import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HEADER_OFFSET = 92;

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToElement(id) {
  const tryScroll = (attempt = 0) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
      return;
    }
    if (attempt < 30) requestAnimationFrame(() => tryScroll(attempt + 1));
  };
  tryScroll();
}

export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      if (id) scrollToElement(id);
      return;
    }
    scrollToTop();
  }, [pathname, hash]);

  return null;
}
