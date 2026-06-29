import { useState, useEffect, useMemo } from "react";
import { api } from "../api/client";
import {
  PageHeader, StatusBadge, Alert, EmptyState, LoadingSpinner,
  IconBtn, IconEye, IconCheck, IconTrash, formatDate,
} from "./ui";

const PAGE_SIZE = 10;

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-brand-faint bg-white p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-brand">{title}</h3>
          <button type="button" onClick={onClose} className="text-brand-muted hover:text-brand">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="border-b border-brand-faint py-2">
      <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">{label}</p>
      <p className="mt-1 text-sm text-brand whitespace-pre-wrap">{value || "—"}</p>
    </div>
  );
}

export default function VideoProductionRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [viewRequest, setViewRequest] = useState(null);
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    api.getAllVideoProductionRequests()
      .then((r) => setRequests(r.data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = [...requests];
    if (statusFilter !== "ALL") list = list.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        [r.clientName, r.clientEmail, r.projectTitle, r.accountantManager?.name, r.jobType?.name]
          .some((v) => v?.toLowerCase().includes(q))
      );
    }
    return list;
  }, [requests, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openRequest = (r) => {
    setViewRequest(r);
    setInternalNotes(r.internalNotes || "");
    setMsg("");
    setError("");
  };

  const approve = async (id) => {
    try {
      await api.approveVideoProductionRequest(id);
      setMsg("Request approved — client has been emailed");
      load();
      setViewRequest(null);
    } catch (e) { setError(e.message); }
  };

  const reject = async (id) => {
    if (!confirm("Reject this request?")) return;
    try {
      await api.rejectVideoProductionRequest(id);
      setMsg("Request rejected");
      load();
      setViewRequest(null);
    } catch (e) { setError(e.message); }
  };

  const saveNotes = async (id) => {
    setSaving(true);
    setError("");
    try {
      await api.updateVideoProductionRequest(id, { internalNotes });
      setMsg("Notes saved");
      load();
      setViewRequest(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this request permanently?")) return;
    try {
      await api.deleteVideoProductionRequest(id);
      setMsg("Deleted");
      load();
      setViewRequest(null);
    } catch (e) { setError(e.message); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader title="Video Production Requests" description="Review and approve incoming video production requests" />
      {msg && <Alert type="success">{msg}</Alert>}
      {error && !viewRequest && <Alert type="error">{error}</Alert>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search requests…"
          className="fm-input max-w-sm"
        />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="fm-input max-w-[180px]">
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <span className="text-sm text-brand-muted">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No requests found" description="Video production requests will appear here when submitted." />
      ) : (
        <div className="admin-table-wrap max-h-[70vh] overflow-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Project</th>
                <th>Date</th>
                <th>Accountant</th>
                <th>Job Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.clientName}</td>
                  <td>{r.clientEmail}</td>
                  <td>{r.projectTitle}</td>
                  <td>{formatDate(r.requestDate)}</td>
                  <td>{r.accountantManager?.name}</td>
                  <td>{r.jobType?.name}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{formatDate(r.createdAt)}</td>
                  <td>
                    <div className="flex gap-1">
                      <IconBtn label="View" onClick={() => openRequest(r)}><IconEye /></IconBtn>
                      {r.status === "PENDING" && (
                        <IconBtn label="Approve" variant="success" onClick={() => approve(r.id)}><IconCheck /></IconBtn>
                      )}
                      <IconBtn label="Delete" variant="danger" onClick={() => remove(r.id)}><IconTrash /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="fm-btn-secondary py-1.5 text-xs">Prev</button>
          <span className="text-sm text-brand-muted">Page {page} of {totalPages}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="fm-btn-secondary py-1.5 text-xs">Next</button>
        </div>
      )}

      {viewRequest && (
        <Modal title={`Request — ${viewRequest.projectTitle}`} onClose={() => setViewRequest(null)}>
          {error && <Alert type="error">{error}</Alert>}
          <div className="space-y-1">
            <Field label="Client" value={viewRequest.clientName} />
            <Field label="Email" value={viewRequest.clientEmail} />
            <Field label="Project Title" value={viewRequest.projectTitle} />
            <Field label="Date" value={formatDate(viewRequest.requestDate)} />
            <Field label="Accountant Manager" value={viewRequest.accountantManager?.name} />
            <Field label="Contract Duration" value={viewRequest.contractDuration} />
            <Field label="Start Date" value={formatDate(viewRequest.startDate)} />
            <Field label="End Date" value={formatDate(viewRequest.endDate)} />
            <Field label="Job Type" value={viewRequest.jobType?.name} />
            <Field label="Script Length" value={viewRequest.scriptLength?.name} />
            <Field label="Objective of Ad/Live read" value={viewRequest.objectiveOfAd} />
            <Field label="General Info" value={viewRequest.generalInfo} />
            <Field label="Target Audience" value={viewRequest.targetAudience} />
            <Field label="Voice/Actor" value={viewRequest.voiceActor?.name} />
            <Field label="Music" value={viewRequest.musicType?.name} />
            <Field label="The One Thing" value={viewRequest.theOneThing} />
            <Field label="Specific Inclusions" value={viewRequest.specificInclusions} />
            <Field label="Additional Info" value={viewRequest.additionalInfo} />
            <Field label="Status" value={viewRequest.status} />
          </div>

          <div className="mt-4">
            <label className="fm-label">Internal notes</label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={3}
              className="fm-input mt-2 w-full resize-none"
              placeholder="Notes visible only to admins…"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => saveNotes(viewRequest.id)}
              disabled={saving}
              className="fm-btn-secondary disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save notes"}
            </button>
            {viewRequest.status === "PENDING" && (
              <>
                <button type="button" onClick={() => approve(viewRequest.id)} className="fm-btn-primary">
                  Approve
                </button>
                <button type="button" onClick={() => reject(viewRequest.id)} className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                  Reject
                </button>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
