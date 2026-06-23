export function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-brand/10 text-brand border-brand/20",
    APPROVED: "bg-brand text-white border-brand",
    REJECTED: "bg-white text-brand-muted border-brand-faint line-through decoration-brand-muted",
  };
  return (
    <span className={`inline-flex rounded-lg border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${styles[status] || "border-brand-faint text-brand-muted"}`}>
      {status}
    </span>
  );
}

export function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-brand-faint bg-white p-6 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-brand">{value}</p>
      {sub && <p className="mt-1 text-xs text-brand-muted">{sub}</p>}
    </div>
  );
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-brand">{title}</h1>
        {description && <p className="mt-1 text-sm text-brand-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Alert({ type = "info", children }) {
  const styles = {
    info: "border-brand/15 bg-brand-surface text-brand",
    success: "border-brand/20 bg-brand/5 text-brand",
    error: "border-brand/25 bg-white text-brand",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>{children}</div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-faint bg-white py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface text-brand">
        <IconInbox />
      </div>
      <p className="font-medium text-brand">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-brand-muted">{description}</p>
    </div>
  );
}

export function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-faint border-t-brand" />
      <p className="mt-4 text-sm text-brand-muted">{label}</p>
    </div>
  );
}

export function IconBtn({ title, onClick, children, variant = "ghost", className = "" }) {
  const styles = {
    ghost: "border-brand-faint bg-white text-brand-muted hover:border-brand/25 hover:bg-brand-surface hover:text-brand",
    primary: "border-brand bg-brand text-white hover:bg-brand-dark",
    success: "admin-icon-btn--success",
    danger: "admin-icon-btn--danger",
    warning: "admin-icon-btn--warning",
  };
  return (
    <button type="button" title={title} onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function IconEye() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
export function IconCheck() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>;
}
export function IconX() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>;
}
export function IconTrash() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>;
}
export function IconEdit() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
export function IconInbox() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 12h-6l-2 3H10l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>;
}
export function IconDownload() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
}

export const BANKING = {
  bank: "FIRST NATIONAL BANK OF NAMIBIA (FNB)",
  accountType: "SME CHEQUE ACCOUNT",
  accountNo: "55506266119",
  branchCode: "281872",
};

export function formatCurrency(n) {
  return `N$ ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(d) {
  if (!d) return "—";
  return new Date(d + (d.includes("T") ? "" : "T00:00:00")).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function bookingCompany(b) {
  return b.companyBooking && b.companyName ? b.companyName : "—";
}

export function bookingContact(b) {
  return b.clientName || "—";
}
