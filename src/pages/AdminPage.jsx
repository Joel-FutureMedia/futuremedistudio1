import { useState } from "react";
import { getAdmin, clearAuth } from "../api/client";
import LoginScreen from "../admin/LoginScreen";
import AdminLayout from "../admin/AdminLayout";

export default function AdminPage() {
  const [admin, setAdmin] = useState(getAdmin());

  const handleLogout = () => {
    clearAuth();
    setAdmin(null);
  };

  if (!admin?.token) {
    return <LoginScreen onLogin={setAdmin} />;
  }

  return <AdminLayout admin={admin} onLogout={handleLogout} />;
}
