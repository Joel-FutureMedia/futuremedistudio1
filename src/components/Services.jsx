import { Reveal, Eyebrow } from "./primitives";

const SERVICES = [
  {
    n: "01", title: "Interviews",
    desc: "Cinematic multi-camera sit-downs with documentary lighting and a director who pulls the real story out.",
    tags: ["Multi-cam", "Doc lighting", "Branded set"],
    media: "/media/prod-interview.png",
  },
  {
    n: "02", title: "Podcasts",
    desc: "Multi-mic studio sessions with broadcast audio, multi-cam coverage, and clip-ready edits built for every platform.",
    tags: ["Broadcast audio", "Multi-cam", "Clip kits"],
    media: "/media/prod-podcast.png",
  },
  {
    n: "03", title: "Talking Heads",
    desc: "Founder updates, expert features, and announcements — clean, confident, and on-brand with lower-thirds and graphics.",
    tags: ["Teleprompter", "Lower-thirds", "Brand kit"],
    media: "/media/prod-talkinghead.png",
  },
];

function Card({ s }) {
  return (
    <Reveal>
      <article className="group fm-card flex h-full min-h-[380px] flex-col overflow-hidden">
        <div className="relative h-48 overflow-hidden bg-brand-surface">
          <img
            src={s.media}
            alt={s.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand/40 to-transparent" />
          <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#313e4a]">{s.n}</span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-semibold tracking-tight text-[#313e4a]">{s.title}</h3>
          <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#313e4a]/85">{s.desc}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {s.tags.map((t) => (
              <span key={t} className="rounded-lg border border-[#313e4a]/15 bg-[#f3f5f7] px-3 py-1 text-[11px] font-medium text-[#313e4a]/75">{t}</span>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Services() {
  return (
    <section id="services" className="bg-[#313e4a] pt-10 pb-8 md:pt-12 md:pb-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal><Eyebrow className="text-white [&>span:first-child]:bg-white/40">What we produce</Eyebrow></Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              One studio, one team, one finish line: content that looks like it cost ten times what it did.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{SERVICES.map((s) => <Card key={s.n} s={s} />)}</div>
      </div>
    </section>
  );
}
