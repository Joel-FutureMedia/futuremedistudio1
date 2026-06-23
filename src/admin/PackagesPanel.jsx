import { useState, useEffect } from "react";
import { api } from "../api/client";
import { PageHeader, Alert, EmptyState } from "./ui";

export default function PackagesPanel() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", duration: "", description: "", items: [""], featured: false });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () => api.getAllPackages().then((r) => setPackages(r.data || []));
  useEffect(() => { load(); }, []);

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, ""] }));
  const removeItem = (i) => setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, val) => setForm((f) => ({ ...f, items: f.items.map((it, idx) => idx === i ? val : it) }));

  const submit = async (e) => {
    e.preventDefault();
    const body = { ...form, price: parseFloat(form.price), items: form.items.filter(Boolean), accent: "from-brand/10" };
    try {
      if (editing) await api.updatePackage(editing, body);
      else await api.createPackage(body);
      setMsg(editing ? "Package updated" : "Package created");
      setForm({ name: "", price: "", duration: "", description: "", items: [""], featured: false });
      setEditing(null);
      load();
    } catch (e) { setMsg(e.message); }
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, price: p.price, duration: p.duration, description: p.description, items: p.items?.length ? p.items : [""], featured: p.featured });
  };

  const remove = async (id) => {
    if (!confirm("Deactivate this package?")) return;
    await api.deletePackage(id);
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Packages" description="Create and manage studio booking packages" />
      {msg && <Alert type="success">{msg}</Alert>}

      <form onSubmit={submit} className="rounded-2xl border border-brand-faint bg-white p-6 shadow-card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input placeholder="Package name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="fm-input" />
          <input placeholder="Price (N$)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="fm-input" />
          <input placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required className="fm-input sm:col-span-2" />
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={2} className="fm-input resize-none" />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="fm-label">Items included</label>
            <button type="button" onClick={addItem} className="text-xs font-medium text-brand hover:underline">+ Add item</button>
          </div>
          {form.items.map((item, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input placeholder="Item name" value={item} onChange={(e) => updateItem(i, e.target.value)} className="fm-input" />
              {form.items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)} className="px-3 text-brand-muted hover:text-brand">×</button>
              )}
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-brand-light">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-brand" />
          Featured package
        </label>
        <div className="flex gap-3">
          <button type="submit" className="fm-btn-primary">{editing ? "Update" : "Create package"}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: "", price: "", duration: "", description: "", items: [""], featured: false }); }} className="fm-btn-secondary">Cancel</button>}
        </div>
      </form>

      {packages.length === 0 ? (
        <EmptyState title="No packages" description="Create your first studio package above." />
      ) : (
        <div className="admin-table-wrap overflow-x-auto">
          <table className="admin-table min-w-[600px]">
            <thead><tr><th>Name</th><th>Price</th><th>Duration</th><th>Items</th><th></th></tr></thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.name} {p.featured && <span className="ml-1 text-[10px] font-semibold text-brand-muted">FEATURED</span>}</td>
                  <td>N${Number(p.price).toLocaleString()}</td>
                  <td>{p.duration}</td>
                  <td className="text-brand-muted">{(p.items || []).length}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="text-xs font-medium text-brand hover:underline">Edit</button>
                      <button onClick={() => remove(p.id)} className="text-xs font-medium text-brand-muted hover:text-brand">Remove</button>
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
