import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Eyebrow } from "./primitives";
import { api } from "../api/client";

const DOW = ["M", "T", "W", "T", "F", "S", "S"];
const STEPS = ["Package", "Date", "Details", "Confirmed"];

function formatPrice(price) {
  const n = Number(price);
  return isNaN(n) ? price : n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function IconDescription() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheckItem() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Calendar({ month, year, selectedDate, onSelect, availableDates }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < offset; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [offset, daysInMonth]);

  const monthLabel = new Date(year, month).toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <p className="mb-4 text-sm font-medium text-brand">{monthLabel}</p>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-brand-muted">
        {DOW.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (!d) return <span key={`e-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const dateObj = new Date(year, month, d);
          const hasSlots = availableDates.has(dateStr);
          const disabled = dateObj < today || !hasSlots;
          const active = selectedDate === dateStr;
          return (
            <button key={d} disabled={disabled} onClick={() => onSelect(dateStr)}
              className={`flex aspect-square items-center justify-center rounded-lg text-sm transition-all ${
                disabled ? "cursor-not-allowed text-brand-faint" : active ? "bg-brand font-semibold text-white shadow-card" : "text-brand-light hover:bg-brand-surface"
              }`}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Booking() {
  const [step, setStep] = useState(0);
  const [packages, setPackages] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [pkgId, setPkgId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotId, setSlotId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isCompany, setIsCompany] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const calMonth = new Date().getMonth();
  const calYear = new Date().getFullYear();

  useEffect(() => {
    api.getPackages()
      .then((res) => {
        const pkgs = res.data || [];
        setPackages(pkgs);
        if (pkgs.length) setPkgId(pkgs[0].id);
      })
      .catch(() => setError("Could not load packages. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (step >= 1) {
      api.getAvailableSlots().then((res) => setSlots(res.data || [])).catch(() => setSlots([]));
    }
  }, [step]);

  const availableDates = useMemo(() => {
    const set = new Set();
    slots.forEach((s) => set.add(s.slotDate));
    return set;
  }, [slots]);

  const timesForDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter((s) => s.slotDate === selectedDate);
  }, [slots, selectedDate]);

  const chosen = packages.find((p) => p.id === pkgId);
  const chosenSlot = slots.find((s) => s.id === slotId);

  const canNext =
    (step === 0 && pkgId) ||
    (step === 1 && selectedDate && slotId) ||
    (step === 2 && name && email && phone && (!isCompany || (companyName && companyAddress)));

  const next = async () => {
    if (step === 2) {
      setSubmitting(true);
      setError("");
      try {
        await api.createBooking({
          packageId: pkgId, slotId, clientName: name, clientEmail: email, clientPhone: phone,
          companyBooking: isCompany,
          companyName: isCompany ? companyName : null,
          contactPhone: isCompany ? phone : null,
          companyAddress: isCompany ? companyAddress : null,
        });
        setStep(3);
      } catch (e) {
        setError(e.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const reset = () => {
    setStep(0); setSelectedDate(null); setSlotId(null);
    setName(""); setEmail(""); setPhone(""); setIsCompany(false);
    setCompanyName(""); setCompanyAddress(""); setError("");
    api.getAvailableSlots().then((res) => setSlots(res.data || []));
  };

  if (loading) {
    return (
      <section id="book" className="bg-brand-surface py-24 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-faint border-t-brand" />
          <p className="mt-4 text-sm text-brand-muted">Loading packages…</p>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="bg-brand-surface py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <Reveal><div className="flex justify-center"><Eyebrow>Book the studio</Eyebrow></div></Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tightest text-brand">
              Reserve your production in four steps.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center justify-between">
              {STEPS.map((label, i) => (
                <div key={label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex items-center gap-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                      i < step ? "bg-brand text-white" : i === step ? "bg-brand text-white ring-4 ring-brand/15" : "border border-brand-faint bg-white text-brand-muted"
                    }`}>
                      {i < step ? "✓" : i + 1}
                    </span>
                    <span className={`hidden text-sm sm:block ${i <= step ? "font-medium text-brand" : "text-brand-muted"}`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="mx-3 h-px flex-1 bg-brand-faint">
                      <div className={`h-px bg-brand transition-all duration-500 ${i < step ? "w-full" : "w-0"}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="fm-card p-6 md:p-8">
              {error && (
                <div className="mb-4 rounded-xl border border-brand/20 bg-brand-surface px-4 py-3 text-sm text-brand">{error}</div>
              )}

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                    className="grid gap-4 sm:grid-cols-2">
                    {packages.length === 0 ? (
                      <p className="col-span-full py-12 text-center text-brand-muted">No packages available yet.</p>
                    ) : packages.map((p) => {
                      const active = pkgId === p.id;
                      return (
                        <motion.button
                          key={p.id}
                          type="button"
                          onClick={() => setPkgId(p.id)}
                          whileHover={active ? undefined : { y: -4, scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 400, damping: 28 }}
                          className={`relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                            active
                              ? "border-brand bg-white shadow-card-hover ring-4 ring-brand/20"
                              : "border-brand-faint bg-white hover:border-brand/50 hover:shadow-card"
                          }`}
                        >
                          {active && (
                            <>
                              <span className="absolute inset-x-0 top-0 h-1.5 bg-brand" aria-hidden="true" />
                              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Selected
                              </span>
                            </>
                          )}
                          {p.featured && (
                            <span className="mb-3 inline-block rounded-lg bg-brand px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                              Popular
                            </span>
                          )}
                          <h4 className="pr-24 text-lg font-semibold text-brand">{p.name}</h4>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-2xl font-semibold text-brand">N${formatPrice(p.price)}</span>
                            <span className="text-xs text-brand-muted">/ {p.duration}</span>
                          </div>
                          <div className="mt-3 flex gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-brand-surface text-brand">
                              <IconDescription />
                            </span>
                            <p className="pt-1 text-sm leading-relaxed text-brand-light">{p.description}</p>
                          </div>
                          <ul className="mt-4 space-y-3">
                            {(p.items || []).map((item) => (
                              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-brand">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand/15 bg-brand/10 text-brand">
                                  <IconCheckItem />
                                </span>
                                <span className="pt-0.5 text-brand-light">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                    className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl border border-brand-faint bg-brand-surface p-5">
                      <Calendar month={calMonth} year={calYear} selectedDate={selectedDate}
                        onSelect={(d) => { setSelectedDate(d); setSlotId(null); }} availableDates={availableDates} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand">Pick a session time</p>
                      <p className="mt-1 text-sm text-brand-muted">Available slots from our team.</p>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        {timesForDate.length === 0 ? (
                          <p className="col-span-2 text-sm text-brand-muted">{selectedDate ? "No times for this date." : "Select a date first."}</p>
                        ) : timesForDate.map((s) => {
                          const t = s.startTime?.slice(0, 5);
                          const active = slotId === s.id;
                          return (
                            <button key={s.id} onClick={() => setSlotId(s.id)}
                              className={`rounded-xl border py-3 text-sm font-medium transition-all ${active ? "border-brand bg-brand text-white" : "border-brand-faint text-brand-light hover:border-brand/30 hover:bg-brand-surface"}`}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-6 rounded-xl border border-brand-faint bg-brand-surface p-4 text-sm text-brand-muted">
                        <span className="font-medium text-brand">{chosen?.name}</span>
                        {" · "}{selectedDate || "select date"}{chosenSlot ? ` · ${chosenSlot.startTime?.slice(0, 5)}` : ""}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                    className="mx-auto max-w-md space-y-4">
                    <div>
                      <label className="fm-label">Your name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" className="fm-input mt-2" />
                    </div>
                    <div>
                      <label className="fm-label">Email</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="alex@brand.com" className="fm-input mt-2" />
                    </div>
                    <div>
                      <label className="fm-label">Phone number</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+264 81 123 4567" className="fm-input mt-2" />
                    </div>
                    <label className="flex cursor-pointer items-center gap-3">
                      <input type="checkbox" checked={isCompany} onChange={(e) => setIsCompany(e.target.checked)} className="h-4 w-4 rounded accent-brand" />
                      <span className="text-sm text-brand-light">Booking on behalf of a company</span>
                    </label>
                    {isCompany && (
                      <>
                        <div><label className="fm-label">Company name</label><input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="fm-input mt-2" /></div>
                        <div><label className="fm-label">Company address</label><textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} rows={2} className="fm-input mt-2 resize-none" /></div>
                      </>
                    )}
                    <div className="rounded-xl border border-brand-faint bg-brand-surface p-4 text-sm">
                      <div className="flex justify-between text-brand-muted"><span>Package</span><span className="font-medium text-brand">{chosen?.name}</span></div>
                      <div className="mt-2 flex justify-between text-brand-muted"><span>When</span><span className="font-medium text-brand">{selectedDate}{chosenSlot ? `, ${chosenSlot.startTime?.slice(0, 5)}` : ""}</span></div>
                      <div className="mt-2 flex justify-between text-brand-muted"><span>Price</span><span className="font-semibold text-brand">N${formatPrice(chosen?.price)}</span></div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl text-white">✓</div>
                    <h3 className="mt-6 text-2xl font-semibold text-brand">Booking request submitted</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-muted">
                      Dear {name.split(" ")[0]}, your request for {chosen?.name} on {selectedDate} at {chosenSlot?.startTime?.slice(0, 5)} has been sent. Check {email} for your invoice.
                    </p>
                    <div className="mt-6 flex items-center gap-2 rounded-full border border-brand-faint bg-brand-surface px-4 py-2 text-xs text-brand-muted">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" /> Confirmation email sent
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step < 3 && (
                <div className="mt-8 flex items-center justify-between">
                  <button onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}
                    className="text-sm text-brand-muted transition-colors hover:text-brand disabled:opacity-30">Back</button>
                  <button onClick={next} disabled={!canNext || submitting}
                    className={`fm-btn-primary ${!canNext || submitting ? "pointer-events-none opacity-40" : ""}`}>
                    {submitting ? "Submitting…" : step === 2 ? "Confirm booking" : "Continue"}
                  </button>
                </div>
              )}
              {step === 3 && (
                <div className="mt-4 flex justify-center">
                  <button onClick={reset} className="text-sm text-brand-muted hover:text-brand">Book another</button>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
