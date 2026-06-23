import { useState, useEffect } from "react";
import { api } from "../api/client";
import { PageHeader, Alert, EmptyState } from "./ui";

export default function SlotsPanel() {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => api.getAllSlots().then((r) => setSlots(r.data || []));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.createSlot({ slotDate: date, startTime: time + ":00", endTime: null });
      setDate(""); setTime(""); setMsg("Slot created"); load();
    } catch (e) { setMsg(e.message); }
  };

  const remove = async (id) => {
    if (!confirm("Delete this slot?")) return;
    try { await api.deleteSlot(id); load(); } catch (e) { setMsg(e.message); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Booking Slots" description="Manage available studio session times" />
      {msg && <Alert type="success">{msg}</Alert>}

      <form onSubmit={create} className="flex flex-wrap gap-3 rounded-2xl border border-brand-faint bg-white p-6 shadow-card">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="fm-input max-w-[200px]" />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="fm-input max-w-[160px]" />
        <button type="submit" className="fm-btn-primary">Add slot</button>
      </form>

      {slots.length === 0 ? (
        <EmptyState title="No slots" description="Add booking slots for clients to reserve." />
      ) : (
        <div className="admin-table-wrap overflow-x-auto">
          <table className="admin-table min-w-[500px]">
            <thead><tr><th>Date</th><th>Time</th><th>Available</th><th></th></tr></thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s.id}>
                  <td>{s.slotDate}</td>
                  <td>{s.startTime?.slice(0, 5)}</td>
                  <td><span className={s.available ? "font-medium text-brand" : "text-brand-muted"}>{s.available ? "Available" : "Booked"}</span></td>
                  <td><button onClick={() => remove(s.id)} className="text-xs font-medium text-brand-muted hover:text-brand">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
