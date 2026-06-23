import { useState, useEffect, useMemo } from "react";
import { api } from "../api/client";
import {
  PageHeader, StatusBadge, Alert, EmptyState, LoadingSpinner,
  IconBtn, IconEye, IconCheck, IconX, IconTrash, IconEdit, IconDownload,
  BANKING, formatCurrency, formatDate, bookingCompany, bookingContact,
} from "./ui";

const PAGE_SIZE = 10;

export default function BookingsPanel({ highlightId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [viewBooking, setViewBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);

  const load = () => {
    setLoading(true);
    api.getAllBookings()
      .then((r) => setBookings(r.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (highlightId && bookings.length) {
      const b = bookings.find((x) => x.id === highlightId);
      if (b) setViewBooking(b);
    }
  }, [highlightId, bookings]);

  const filtered = useMemo(() => {
    let list = [...bookings];
    if (statusFilter !== "ALL") list = list.filter((b) => b.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        [b.clientName, b.clientEmail, b.companyName, b.studioPackage?.name, b.invoiceNumber]
          .some((v) => v?.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      let av, bv;
      switch (sortKey) {
        case "company": av = bookingCompany(a); bv = bookingCompany(b); break;
        case "contact": av = bookingContact(a); bv = bookingContact(b); break;
        case "amount": av = Number(a.price); bv = Number(b.price); break;
        case "date": av = a.bookingSlot?.slotDate || ""; bv = b.bookingSlot?.slotDate || ""; break;
        default: av = a.createdAt || ""; bv = b.createdAt || "";
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [bookings, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const approve = async (id) => {
    try { await api.approveBooking(id); setMsg("Approved"); load(); setViewBooking(null); }
    catch (e) { setMsg(e.message); }
  };

  const reject = async (id) => {
    try { await api.rejectBooking(id); setMsg("Rejected"); load(); setViewBooking(null); }
    catch (e) { setMsg(e.message); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this booking permanently?")) return;
    try { await api.deleteBooking(id); setMsg("Deleted"); load(); setViewBooking(null); }
    catch (e) { setMsg(e.message); }
  };

  const downloadInvoice = async (id) => {
    try {
      const blob = await api.downloadInvoice(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) { setMsg(e.message); }
  };

  const SortTh = ({ label, col }) => (
    <th>
      <button type="button" onClick={() => toggleSort(col)} className="flex items-center gap-1 text-brand-muted hover:text-brand">
        {label}
        {sortKey === col && <span className="text-brand">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </button>
    </th>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader title="Booking Management" description="Search, filter, and manage all studio bookings" />

      {msg && <Alert type="success">{msg}</Alert>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search bookings…"
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
        <EmptyState title="No bookings found" description="Try adjusting your search or filters." />
      ) : (
        <div className="admin-table-wrap max-h-[70vh] overflow-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <SortTh label="Company" col="company" />
                <SortTh label="Contact" col="contact" />
                <th>Email</th>
                <th>Phone</th>
                <th>Package</th>
                <SortTh label="Date" col="date" />
                <th>Time</th>
                <SortTh label="Amount" col="amount" />
                <th>Status</th>
                <SortTh label="Created" col="createdAt" />
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((b) => (
                <tr key={b.id}>
                  <td className="font-medium">{bookingCompany(b)}</td>
                  <td>{bookingContact(b)}</td>
                  <td className="text-brand-muted">{b.clientEmail}</td>
                  <td className="text-brand-muted">{b.clientPhone || b.contactPhone || "—"}</td>
                  <td>{b.studioPackage?.name}</td>
                  <td>{formatDate(b.bookingSlot?.slotDate)}</td>
                  <td>{b.bookingSlot?.startTime?.slice(0, 5) || "—"}</td>
                  <td className="font-semibold">{formatCurrency(b.price)}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td className="text-brand-muted text-xs">{formatDate(b.createdAt?.slice(0, 10))}</td>
                  <td>
                    <div className="flex gap-1">
                      <IconBtn title="View" onClick={() => setViewBooking(b)}><IconEye /></IconBtn>
                      <IconBtn title="Edit" onClick={() => setEditBooking(b)}><IconEdit /></IconBtn>
                      {b.status === "PENDING" && (
                        <>
                          <IconBtn title="Approve" variant="success" onClick={() => approve(b.id)}><IconCheck /></IconBtn>
                          <IconBtn title="Reject" variant="warning" onClick={() => reject(b.id)}><IconX /></IconBtn>
                        </>
                      )}
                      <IconBtn title="Delete" variant="danger" onClick={() => remove(b.id)}><IconTrash /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
            className="fm-btn-secondary px-4 py-2 text-sm disabled:opacity-40">Previous</button>
          <span className="text-sm text-brand-muted">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
            className="fm-btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next</button>
        </div>
      )}

      {viewBooking && (
        <Modal title={`Booking — ${viewBooking.invoiceNumber}`} onClose={() => setViewBooking(null)}>
          <DetailGrid booking={viewBooking} />
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => downloadInvoice(viewBooking.id)} className="fm-btn-secondary text-sm">
              <IconDownload /> Download invoice
            </button>
            {viewBooking.status === "PENDING" && (
              <>
                <button onClick={() => approve(viewBooking.id)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Approve
                </button>
                <button onClick={() => reject(viewBooking.id)} className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                  Reject
                </button>
              </>
            )}
          </div>
        </Modal>
      )}

      {editBooking && (
        <Modal title="Booking details" onClose={() => setEditBooking(null)}>
          <DetailGrid booking={editBooking} />
          <p className="mt-4 text-xs text-brand-muted">Contact the client directly to modify booking details. Use approve/reject for status changes.</p>
        </Modal>
      )}
    </div>
  );
}

function DetailGrid({ booking: b }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Contact" value={bookingContact(b)} />
        <Field label="Email" value={b.clientEmail} />
        <Field label="Company" value={bookingCompany(b)} />
        <Field label="Phone" value={b.clientPhone || b.contactPhone || "—"} />
        <Field label="Package" value={b.studioPackage?.name} />
        <Field label="Amount" value={formatCurrency(b.price)} />
        <Field label="Session" value={`${formatDate(b.bookingSlot?.slotDate)} at ${b.bookingSlot?.startTime?.slice(0, 5) || "—"}`} />
        <Field label="Status" value={<StatusBadge status={b.status} />} />
        {b.companyAddress && <Field label="Address" value={b.companyAddress} className="sm:col-span-2" />}
      </div>
      <div className="rounded-xl border border-brand-faint bg-brand-surface p-4">
        <p className="fm-label mb-2">Banking details</p>
        <div className="grid gap-1 text-brand-light sm:grid-cols-2">
          <p>Bank: {BANKING.bank}</p>
          <p>Account Type: {BANKING.accountType}</p>
          <p>Account No: {BANKING.accountNo}</p>
          <p>Branch Code: {BANKING.branchCode}</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wider text-brand-muted">{label}</p>
      <p className="mt-1 text-brand">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-brand-faint bg-white p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-brand">{title}</h3>
          <button onClick={onClose} className="text-brand-muted hover:text-brand">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
