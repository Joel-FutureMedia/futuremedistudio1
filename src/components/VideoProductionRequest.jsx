import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Eyebrow } from "./primitives";
import { api } from "../api/client";

const GREEN_SCREEN_AVOID = [
  "Kindly check with your Client Relationship Manager whether the Vodcast recording in the studio will be using a ‘Green Screen’ (this allows any background to be projected behind the Presenter and guests in-studio). If so, kindly avoid wearing anything green, including make-up and jewellery.",
  "Avoid ‘shiny’ material e.g. silk, sequins, velvet etc.",
  "Avoid loose fitting clothing / accessories e.g. polar necks / scarfs",
  "Avoid white full on white outfits (white outfit with a solid dark colour jacket works)",
  "Avoid excessively red outfits",
  "Avoid ‘busy’ outfits i.e. too many colours / busy patterns / stripes / chequered patterns",
  "Avoid too many pieces of jewellery",
];

const NON_GREEN_SCREEN_AVOID = [
  "Avoid white full on white outfits (white outfit with a solid dark colour jacket works)",
  "Avoid excessively red outfits",
  "Avoid ‘busy’ outfits i.e. too many colours / busy patterns / stripes / chequered patterns",
  "Avoid loose fitting clothing / accessories e.g. polar necks / scarfs",
  "Avoid too many pieces of jewellery",
];

const TV_COLOURS_GREEN = ["Blues", "Purples", "Greys", "Browns", "Non-bright Yellows", "Non-bright Orange"];
const TV_COLOURS_NON_GREEN = ["Blues", "Purples", "Greys", "Browns", "Non-bright Yellows", "Non-bright Oranges"];

const ARTWORK_SPECS = [
  { label: "TV Artwork", value: "Frame size – 1920 × 1080 or 16:9" },
  { label: "PSD Files", value: "300 ppi" },
  { label: "AI Files", value: "300 ppi" },
  { label: "PDF Files", value: "Maximum quality" },
];

const EMPTY_FORM = {
  clientName: "",
  clientEmail: "",
  projectTitle: "",
  requestDate: "",
  accountantManagerId: "",
  contractDuration: "",
  startDate: "",
  endDate: "",
  jobTypeId: "",
  scriptLengthId: "",
  objectiveOfAd: "",
  generalInfo: "",
  targetAudience: "",
  voiceActorId: "",
  musicTypeId: "",
  theOneThing: "",
  specificInclusions: "",
  additionalInfo: "",
};

function SelectField({ label, name, value, onChange, options, required = true }) {
  return (
    <div>
      <label htmlFor={name} className="fm-label">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="fm-input mt-2"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </div>
  );
}

function TextField({ label, name, value, onChange, type = "text", required = true }) {
  return (
    <div>
      <label htmlFor={name} className="fm-label">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="fm-input mt-2"
      />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, required = false, rows = 3 }) {
  return (
    <div>
      <label htmlFor={name} className="fm-label">{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="fm-input mt-2 resize-none"
      />
    </div>
  );
}

function GuidelineList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-brand-light">
          <span className="fm-bullet mt-2 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ColourPills({ colours }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {colours.map((colour) => (
        <span key={colour} className="rounded-lg border border-brand-faint bg-brand-surface px-3 py-1.5 text-xs font-medium text-brand">
          {colour}
        </span>
      ))}
    </div>
  );
}

function GuidelineSection({ title, children }) {
  return (
    <section className="rounded-xl border border-brand-faint bg-brand-surface/50 p-5 md:p-6">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-brand">{title}</h4>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function StudioGuidelinesModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand/50 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="studio-guidelines-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-brand-faint bg-white shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-brand-faint bg-brand px-6 py-5 md:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Reference</p>
                  <h3 id="studio-guidelines-title" className="mt-1 text-xl font-semibold tracking-tight text-white md:text-2xl">
                    Studio Guidelines
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white transition-colors hover:bg-white/10"
                  aria-label="Close guidelines"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6 md:space-y-6 md:px-8 md:py-7">
              <GuidelineSection title="Wardrobe Guide for Green Screen">
                <GuidelineList items={GREEN_SCREEN_AVOID} />
                <p className="mt-4 text-sm font-medium text-brand">Pastel colours work great for TV</p>
                <p className="mt-2 text-sm text-brand-muted">Colours that work well for TV include:</p>
                <ColourPills colours={TV_COLOURS_GREEN} />
              </GuidelineSection>

              <GuidelineSection title="Wardrobe Guide for Non-Green Screen">
                <GuidelineList items={NON_GREEN_SCREEN_AVOID} />
                <p className="mt-4 text-sm font-medium text-brand">Pastel colours work great for TV</p>
                <p className="mt-2 text-sm text-brand-muted">Colours that work well for TV include:</p>
                <ColourPills colours={TV_COLOURS_NON_GREEN} />
                <p className="mt-4 rounded-lg border border-brand/15 bg-white px-4 py-3 text-sm leading-relaxed text-brand-light">
                  <strong className="font-semibold text-brand">NB:</strong> If in doubt, kindly bring 2–3 wardrobe options along so we can check what will work best for you individually and collectively on-screen.
                </p>
              </GuidelineSection>

              <GuidelineSection title="Make-up">
                <p className="text-sm leading-relaxed text-brand-light">
                  Kindly style your hair as you would like it to appear on camera. A make-up artist will be available for touch-ups. Men will only receive a light powder (removed after filming) to reduce skin shine while appearing on-camera.
                </p>
              </GuidelineSection>

              <GuidelineSection title="Revisions & Amendments Disclaimer">
                <p className="text-sm leading-relaxed text-brand-light">
                  This project includes up to <strong className="font-semibold text-brand">two (2) revision rounds</strong> after the first draft has been delivered. Any additional revision requests from the third revision round onwards will be billed at <strong className="font-semibold text-brand">N$2,500 per session</strong>.
                </p>
              </GuidelineSection>

              <GuidelineSection title="Artwork Specifications">
                <div className="divide-y divide-brand-faint rounded-lg border border-brand-faint bg-white">
                  {ARTWORK_SPECS.map((spec) => (
                    <div key={spec.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">{spec.label}</span>
                      <span className="text-sm font-medium text-brand">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </GuidelineSection>
            </div>

            <div className="border-t border-brand-faint bg-brand-surface px-6 py-4 md:px-8">
              <button type="button" onClick={onClose} className="fm-btn-primary w-full sm:w-auto">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function VideoProductionRequest() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [options, setOptions] = useState({
    accountants: [],
    jobTypes: [],
    scriptLengths: [],
    voiceActors: [],
    musicTypes: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  useEffect(() => {
    api.getVideoProductionOptions()
      .then((res) => {
        const data = res.data || {};
        const next = {
          accountants: data.accountants || [],
          jobTypes: data.jobTypes || [],
          scriptLengths: data.scriptLengths || [],
          voiceActors: data.voiceActors || [],
          musicTypes: data.musicTypes || [],
        };
        setOptions(next);
        const total = Object.values(next).reduce((sum, list) => sum + list.length, 0);
        if (total === 0) {
          setError("No form options are available yet. Please ask an admin to add them under Form Options.");
        }
      })
      .catch(() => setError("Could not load form options. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const body = {
        ...form,
        accountantManagerId: Number(form.accountantManagerId),
        jobTypeId: Number(form.jobTypeId),
        scriptLengthId: Number(form.scriptLengthId),
        voiceActorId: Number(form.voiceActorId),
        musicTypeId: Number(form.musicTypeId),
      };
      await api.createVideoProductionRequest(body);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section id="video-production-request" className="bg-white py-24 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-faint border-t-brand" />
          <p className="mt-4 text-sm text-brand-muted">Loading form…</p>
        </div>
      </section>
    );
  }

  return (
    <section id="video-production-request" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <Reveal><div className="flex justify-center"><Eyebrow>Video production</Eyebrow></div></Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tightest text-brand">
              Submit your video production request.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-4 max-w-xl text-base text-brand-muted">
              Tell us about your project and our team will review your request and get in touch.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="fm-card mx-auto max-w-2xl p-10 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-brand">Request submitted</h3>
              <p className="mt-3 text-brand-muted">
                Thank you for your video production request. Our team will review it and contact you once approved.
              </p>
              <button type="button" onClick={() => setSubmitted(false)} className="fm-btn-secondary mt-8">
                Submit another request
              </button>
            </motion.div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowGuidelines(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-600 bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 hover:border-red-700"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Studio Guidelines
                </button>
              </div>

              <form onSubmit={handleSubmit} className="fm-card space-y-6 p-8 md:p-10">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <TextField label="Client name" name="clientName" value={form.clientName} onChange={handleChange} />
                <TextField label="Email" name="clientEmail" type="email" value={form.clientEmail} onChange={handleChange} />
                <TextField label="Project title" name="projectTitle" value={form.projectTitle} onChange={handleChange} />
                <TextField label="Date" name="requestDate" type="date" value={form.requestDate} onChange={handleChange} />
                <SelectField label="Accountant manager" name="accountantManagerId" value={form.accountantManagerId} onChange={handleChange} options={options.accountants || []} />
                <TextField label="Contract duration" name="contractDuration" value={form.contractDuration} onChange={handleChange} />
                <TextField label="Start date" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
                <TextField label="End date" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
                <SelectField label="Job type" name="jobTypeId" value={form.jobTypeId} onChange={handleChange} options={options.jobTypes || []} />
                <SelectField label="Script length" name="scriptLengthId" value={form.scriptLengthId} onChange={handleChange} options={options.scriptLengths || []} />
                <SelectField label="Voice/Actor" name="voiceActorId" value={form.voiceActorId} onChange={handleChange} options={options.voiceActors || []} />
                <SelectField label="Music" name="musicTypeId" value={form.musicTypeId} onChange={handleChange} options={options.musicTypes || []} />
              </div>

              <TextAreaField label="Objective of Ad/Live read" name="objectiveOfAd" value={form.objectiveOfAd} onChange={handleChange} required rows={4} />
              <TextAreaField label="General info" name="generalInfo" value={form.generalInfo} onChange={handleChange} rows={3} />
              <TextAreaField label="Target audience" name="targetAudience" value={form.targetAudience} onChange={handleChange} rows={3} />
              <TextAreaField label="The one thing" name="theOneThing" value={form.theOneThing} onChange={handleChange} rows={3} />
              <TextAreaField label="Specific inclusions" name="specificInclusions" value={form.specificInclusions} onChange={handleChange} rows={3} />
              <TextAreaField label="Additional info" name="additionalInfo" value={form.additionalInfo} onChange={handleChange} rows={3} />

              <div className="pt-2">
                <button type="submit" disabled={submitting} className="fm-btn-primary w-full sm:w-auto">
                  {submitting ? "Submitting…" : "Submit request"}
                </button>
              </div>
            </form>
            </div>
          )}
        </Reveal>

        <StudioGuidelinesModal open={showGuidelines} onClose={() => setShowGuidelines(false)} />
      </div>
    </section>
  );
}
