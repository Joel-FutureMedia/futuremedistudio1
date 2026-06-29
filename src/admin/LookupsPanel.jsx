import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { PageHeader, Alert, EmptyState, LoadingSpinner } from "./ui";

const LOOKUPS = [
  { id: "accountants", label: "Accountants", get: api.getAccountants, create: api.createAccountant, update: api.updateAccountant, remove: api.deleteAccountant },
  { id: "jobTypes", label: "Job Types", get: api.getJobTypes, create: api.createJobType, update: api.updateJobType, remove: api.deleteJobType },
  { id: "scriptLengths", label: "Script Lengths", get: api.getScriptLengths, create: api.createScriptLength, update: api.updateScriptLength, remove: api.deleteScriptLength },
  { id: "voiceActors", label: "Voice/Actor", get: api.getVoiceActors, create: api.createVoiceActor, update: api.updateVoiceActor, remove: api.deleteVoiceActor },
  { id: "musicTypes", label: "Music Types", get: api.getMusicTypes, create: api.createMusicType, update: api.updateMusicType, remove: api.deleteMusicType },
];

function LookupSection({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    config.get()
      .then((r) => setItems(r.data || []))
      .catch((err) => {
        setItems([]);
        setError(err.message || "Failed to load items");
      })
      .finally(() => setLoading(false));
  }, [config]);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");
    try {
      if (editing) await config.update(editing, { name });
      else await config.create({ name });
      setMsg(editing ? "Updated" : "Created");
      setName("");
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setName(item.name);
    setMsg("");
    setError("");
  };

  const remove = async (id) => {
    if (!confirm("Delete this item?")) return;
    setError("");
    try {
      await config.remove(id);
      setMsg("Deleted");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {msg && <Alert type="success">{msg}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={submit} className="flex gap-3">
        <input
          placeholder={`${config.label} name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="fm-input flex-1"
        />
        <button type="submit" disabled={saving} className="fm-btn-primary whitespace-nowrap disabled:opacity-50">
          {saving ? "Saving…" : editing ? "Update" : "Add"}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setName(""); }} className="fm-btn-secondary">
            Cancel
          </button>
        )}
      </form>

      {items.length === 0 ? (
        <EmptyState title={`No ${config.label.toLowerCase()}`} description="Add your first item above." />
      ) : (
        <div className="admin-table-wrap overflow-x-auto">
          <table className="admin-table min-w-[400px]">
            <thead><tr><th>Name</th><th></th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium">{item.name}</td>
                  <td>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(item)} className="text-xs font-medium text-brand hover:underline">Edit</button>
                      <button type="button" onClick={() => remove(item.id)} className="text-xs font-medium text-brand-muted hover:text-brand">Delete</button>
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

export default function LookupsPanel() {
  const [tab, setTab] = useState("accountants");
  const active = LOOKUPS.find((l) => l.id === tab);

  return (
    <div className="space-y-6">
      <PageHeader title="Form Options" description="Manage dropdown options for the video production request form" />

      <div className="flex flex-wrap gap-2">
        {LOOKUPS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setTab(l.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === l.id ? "bg-brand text-white" : "border border-brand-faint text-brand-muted hover:text-brand"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-faint bg-white p-6 shadow-card">
        {active && <LookupSection key={active.id} config={active} />}
      </div>
    </div>
  );
}
