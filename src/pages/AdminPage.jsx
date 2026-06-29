import { useState, useEffect } from "react";
import { getAdmin, clearAuth } from "../api/client";
import LoginScreen from "../admin/LoginScreen";
import AdminLayout from "../admin/AdminLayout";

export default function AdminPage() {
  const [admin, setAdmin] = useState(getAdmin());

  useEffect(() => {
    const onExpired = () => setAdmin(null);
    window.addEventListener("fm-auth-expired", onExpired);
    return () => window.removeEventListener("fm-auth-expired", onExpired);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setAdmin(null);
  };

  if (!admin?.token && !localStorage.getItem("fm_token")) {
    return <LoginScreen onLogin={setAdmin} />;
  }

  return <AdminLayout admin={admin} onLogout={handleLogout} />;
}
