import { useState } from "react";
import { motion } from "framer-motion";
import { LOGO } from "../constants/brand";
import { api, saveAuth } from "../api/client";
import { getAdminTheme, setAdminTheme } from "./useAdminTheme";
import { Alert } from "./ui";

function ThemeToggle({ theme, onChange }) {
  return (
    <div className="flex justify-center gap-2">
      {["light", "dark"].map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`rounded-lg px-4 py-2 text-xs font-medium capitalize transition-colors ${
            theme === t ? "bg-brand text-white" : "border border-brand-faint text-brand-muted hover:text-brand"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(getAdminTheme);

  const changeTheme = (next) => {
    setAdminTheme(next);
    setTheme(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login(email, password);
      saveAuth(res.data);
      onLogin(res.data);
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const shellClass = `admin-shell flex min-h-screen items-center justify-center px-6 ${theme === "dark" ? "admin-theme-dark" : ""}`;

  return (
    <div className={shellClass}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <ThemeToggle theme={theme} onChange={changeTheme} />
        </div>
        <div className="mb-8 text-center">
          <img src={LOGO} alt="Future Media" className="mx-auto h-24 w-auto sm:h-28 object-contain" />
          <h1 className="mt-6 text-2xl font-semibold text-brand">Admin Portal</h1>
          <p className="mt-2 text-sm text-brand-muted">Sign in to manage studio bookings</p>
        </div>
        <form onSubmit={handleSubmit} className="fm-card space-y-5 p-8">
          {error && <Alert type="error">{error}</Alert>}
          <div>
            <label className="fm-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="fm-input mt-2" />
          </div>
          <div>
            <label className="fm-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="fm-input mt-2" />
          </div>
          <button type="submit" disabled={loading} className="fm-btn-primary w-full disabled:opacity-50">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-brand-muted">
          <a href="/" className="hover:text-brand transition-colors">← Back to website</a>
        </p>
      </motion.div>
    </div>
  );
}
