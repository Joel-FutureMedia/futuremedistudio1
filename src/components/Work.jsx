import { useEffect, useRef, useState } from "react";
import { Reveal, Eyebrow } from "./primitives";

export default function Work() {
  const videoRef = useRef(null);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!loadVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => {});
    };

    video.addEventListener("canplay", play);
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) play();

    return () => video.removeEventListener("canplay", play);
  }, [loadVideo]);

  return (
    <section id="work" className="bg-[#313e4a] pb-16 pt-6 md:pb-20 md:pt-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal><Eyebrow className="text-white [&>span:first-child]:bg-white/40">Our studio</Eyebrow></Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tightest text-white">Inside the studio.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-xs text-sm text-white/75">Press play for a look inside the room where it all comes together.</p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-brand-faint bg-white shadow-card">
            <video
              ref={videoRef}
              src={loadVideo ? "/media/our-studio.mp4" : undefined}
              poster="/media/our-studio-poster.jpg"
              controls
              autoPlay
              loop
              muted
              playsInline
              preload={loadVideo ? "metadata" : "none"}
              className="aspect-video w-full bg-brand object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
