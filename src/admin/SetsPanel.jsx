import { useState, useEffect } from "react";
import { api } from "../api/client";
import { PageHeader, Alert, EmptyState } from "./ui";

export default function SetsPanel() {
  const [sets, setSets] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", description: "", imageUrl: "", active: true });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => api.getAllSets().then((r) => setSets(r.data || []));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.updateSet(editing, form);
      else await api.createSet(form);
      setMsg(editing ? "Set updated" : "Set created");
      setForm({ name: "", category: "", description: "", imageUrl: "", active: true });
      setEditing(null);
      load();
    } catch (err) { setMsg(err.message); }
  };

  const startEdit = (s) => {
    setEditing(s.id);
    setForm({
      name: s.name,
      category: s.category,
      description: s.description || "",
      imageUrl: s.imageUrl || "",
      active: s.active,
    });
  };

  const remove = async (id) => {
    if (!confirm("Deactivate this set?")) return;
    await api.deleteSet(id);
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Studio Sets" description="Manage studio sets showcased on the website by category" />
      {msg && <Alert type="success">{msg}</Alert>}

      <form onSubmit={submit} className="rounded-2xl border border-brand-faint bg-white p-6 shadow-card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input placeholder="Set name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="fm-input" />
          <input placeholder="Category (e.g. Chairs, Tables)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="fm-input" />
          <input placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="fm-input sm:col-span-2" />
        </div>
        <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="fm-input resize-none" />
        <label className="flex items-center gap-2 text-sm text-brand-light">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-brand" />
          Active (visible on website)
        </label>
        <div className="flex gap-3">
          <button type="submit" className="fm-btn-primary">{editing ? "Update" : "Create set"}</button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ name: "", category: "", description: "", imageUrl: "", active: true }); }} className="fm-btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      {sets.length === 0 ? (
        <EmptyState title="No sets" description="Create your first studio set above." />
      ) : (
        <div className="admin-table-wrap overflow-x-auto">
          <table className="admin-table min-w-[600px]">
            <thead><tr><th>Name</th><th>Category</th><th>Description</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {sets.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.category}</td>
                  <td className="max-w-xs truncate text-brand-muted">{s.description || "—"}</td>
                  <td>{s.active ? "Yes" : "No"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(s)} className="text-xs font-medium text-brand hover:underline">Edit</button>
                      <button type="button" onClick={() => remove(s.id)} className="text-xs font-medium text-brand-muted hover:text-brand">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
