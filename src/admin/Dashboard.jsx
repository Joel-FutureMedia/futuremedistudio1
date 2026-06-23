import { useState, useEffect } from "react";
import { api } from "../api/client";
import {
  StatCard, PageHeader, StatusBadge, LoadingSpinner, EmptyState,
  IconBtn, IconEye, IconCheck, IconX, formatCurrency, formatDate,
  bookingCompany, bookingContact,
} from "./ui";

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [dashRes, bookingsRes] = await Promise.all([api.getDashboard(), api.getAllBookings()]);
      setStats(dashRes.data);
      setPending((bookingsRes.data || []).filter((b) => b.status === "PENDING"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try { await api.approveBooking(id); setMsg("Booking approved"); load(); }
    catch (e) { setMsg(e.message); }
  };

  const reject = async (id) => {
    try { await api.rejectBooking(id); setMsg("Booking rejected"); load(); }
    catch (e) { setMsg(e.message); }
  };

  if (loading) return <LoadingSpinner label="Loading dashboard…" />;

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Overview of studio bookings and revenue" />

      {msg && <div className="rounded-xl border border-brand/15 bg-brand-surface px-4 py-3 text-sm text-brand">{msg}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Bookings" value={stats?.totalBookings ?? 0} />
        <StatCard label="Pending Approvals" value={stats?.pending ?? 0} />
        <StatCard label="Approved Bookings" value={stats?.approved ?? 0} />
        <StatCard label="Rejected Bookings" value={stats?.rejected ?? 0} />
        <StatCard label="Total Revenue" value={formatCurrency(stats?.totalRevenue)} sub="Approved bookings only" />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand">Pending Approvals</h2>
          {pending.length > 0 && (
            <button onClick={() => onNavigate?.("bookings")} className="text-sm text-brand-muted hover:text-brand">View all →</button>
          )}
        </div>

        {pending.length === 0 ? (
          <EmptyState title="No pending approvals" description="New booking requests will appear here for review." />
        ) : (
          <div className="admin-table-wrap overflow-x-auto">
            <table className="admin-table min-w-[800px]">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Contact Person</th>
                  <th>Package</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((b) => (
                  <tr key={b.id}>
                    <td className="font-medium">{bookingCompany(b)}</td>
                    <td>{bookingContact(b)}</td>
                    <td>{b.studioPackage?.name}</td>
                    <td>{formatDate(b.bookingSlot?.slotDate)}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      <div className="flex gap-1">
                        <IconBtn title="View" onClick={() => onNavigate?.("bookings", b.id)}><IconEye /></IconBtn>
                        <IconBtn title="Approve" variant="success" onClick={() => approve(b.id)}><IconCheck /></IconBtn>
                        <IconBtn title="Reject" variant="warning" onClick={() => reject(b.id)}><IconX /></IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
