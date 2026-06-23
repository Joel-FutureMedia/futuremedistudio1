import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOGO } from "../constants/brand";
import { getAdminTheme, setAdminTheme } from "./useAdminTheme";
import Dashboard from "./Dashboard";
import BookingsPanel from "./BookingsPanel";
import PackagesPanel from "./PackagesPanel";
import SlotsPanel from "./SlotsPanel";
import AdminsPanel from "./AdminsPanel";

const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "bookings", label: "Bookings" },
  { id: "packages", label: "Packages" },
  { id: "slots", label: "Slots" },
  { id: "admins", label: "Admins" },
];

function ThemeToggle({ theme, onChange }) {
  return (
    <div className="rounded-xl border border-brand-faint bg-brand-surface p-1">
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => onChange("light")}
          className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            theme === "light" ? "bg-brand text-white" : "text-brand-muted hover:text-brand"
          }`}
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => onChange("dark")}
          className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            theme === "dark" ? "bg-brand text-white" : "text-brand-muted hover:text-brand"
          }`}
        >
          Dark
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ admin, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [highlightId, setHighlightId] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [theme, setTheme] = useState(getAdminTheme);

  const changeTheme = (next) => {
    setAdminTheme(next);
    setTheme(next);
  };

  const navigate = (id, bookingId) => {
    setTab(id);
    setHighlightId(bookingId || null);
    setMobileNav(false);
  };

  const shellClass = `admin-shell flex min-h-screen ${theme === "dark" ? "admin-theme-dark" : ""}`;

  return (
    <div className={shellClass}>
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-brand-faint bg-white transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="border-b border-brand-faint p-6 pb-8">
          <img src={LOGO} alt="Future Media" className="h-16 w-auto object-contain sm:h-20" />
          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-brand-muted">Studio Admin</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => navigate(n.id)}
              className={`admin-nav-link${tab === n.id ? " is-active" : ""}`}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="space-y-4 border-t border-brand-faint p-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-brand-muted">Theme</p>
            <ThemeToggle theme={theme} onChange={changeTheme} />
          </div>
          <div>
            <p className="text-sm font-medium text-brand">{admin?.fullName}</p>
            <p className="text-xs text-brand-muted">{admin?.email}</p>
            <button onClick={onLogout} className="fm-btn-secondary mt-4 w-full py-2 text-xs">Sign out</button>
          </div>
        </div>
      </aside>

      {mobileNav && <div className="fixed inset-0 z-30 bg-brand/30 lg:hidden" onClick={() => setMobileNav(false)} />}

      <div className="flex flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-brand-faint bg-white/95 px-6 py-4 backdrop-blur-md">
          <button onClick={() => setMobileNav(true)} className="rounded-lg border border-brand-faint p-2 lg:hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ThemeToggle theme={theme} onChange={changeTheme} />
            </div>
            <a href="/" className="text-sm text-brand-muted hover:text-brand">← Website</a>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {tab === "dashboard" && <Dashboard onNavigate={navigate} />}
              {tab === "bookings" && <BookingsPanel highlightId={highlightId} />}
              {tab === "packages" && <PackagesPanel />}
              {tab === "slots" && <SlotsPanel />}
              {tab === "admins" && <AdminsPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
