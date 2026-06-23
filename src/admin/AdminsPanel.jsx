import { useState, useEffect } from "react";
import { api } from "../api/client";
import { PageHeader, Alert, EmptyState } from "./ui";

export default function AdminsPanel() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [msg, setMsg] = useState("");
  const load = () => api.getAdmins().then((r) => setAdmins(r.data || []));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try { await api.createAdmin(form); setForm({ email: "", password: "", fullName: "" }); setMsg("Admin added"); load(); }
    catch (e) { setMsg(e.message); }
  };

  const remove = async (id) => {
    if (!confirm("Remove this admin?")) return;
    try { await api.deleteAdmin(id); load(); } catch (e) { setMsg(e.message); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Users" description="Add or remove admin accounts" />
      {msg && <Alert type="success">{msg}</Alert>}

      <form onSubmit={create} className="grid gap-3 rounded-2xl border border-brand-faint bg-white p-6 shadow-card sm:grid-cols-4">
        <input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required className="fm-input" />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="fm-input" />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="fm-input" />
        <button type="submit" className="fm-btn-primary">Add admin</button>
      </form>

      {admins.length === 0 ? (
        <EmptyState title="No admins" description="Add admin users above." />
      ) : (
        <div className="admin-table-wrap overflow-x-auto">
          <table className="admin-table min-w-[400px]">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium">{a.fullName}</td>
                  <td className="text-brand-muted">{a.email}</td>
                  <td>{a.superAdmin ? <span className="text-xs font-semibold text-brand">Super Admin</span> : "Admin"}</td>
                  <td>{!a.superAdmin && <button onClick={() => remove(a.id)} className="text-xs font-medium text-brand-muted hover:text-brand">Remove</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
