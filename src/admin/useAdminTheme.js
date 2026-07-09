const STORAGE_KEY = "fm_admin_theme";

export function getAdminTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light") return "light";
    return "dark";
  } catch {
    return "dark";
  }
}

export function setAdminTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme === "dark" ? "dark" : "light");
}

export function toggleAdminTheme(current) {
  const next = current === "dark" ? "light" : "dark";
  setAdminTheme(next);
  return next;
}
