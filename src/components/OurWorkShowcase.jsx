import { useEffect, useRef, useState } from "react";
import { Reveal, Eyebrow } from "./primitives";
import { OUR_WORK_ROW_ONE, OUR_WORK_ROW_TWO } from "../constants/ourWorkVideos";

const MAX_CONCURRENT_LOADS = 3;
let activeLoads = 0;
const loadQueue = [];

function enqueueLoad(run) {
  return new Promise((resolve) => {
    const task = () => {
      activeLoads += 1;
      run()
        .then(resolve)
        .finally(() => {
          activeLoads -= 1;
          const next = loadQueue.shift();
          if (next) next();
        });
    };

    if (activeLoads < MAX_CONCURRENT_LOADS) task();
    else loadQueue.push(task);
  });
}

function LazyScrollerVideo({ src, label, enabled }) {
  const ref = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!videoSrc) setVideoSrc(src);
          else el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "64px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, src, videoSrc]);

  useEffect(() => {
    if (!videoSrc) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    enqueueLoad(
      () =>
        new Promise((resolve) => {
          const onReady = () => {
            el.removeEventListener("loadeddata", onReady);
            if (!cancelled) resolve();
          };
          el.addEventListener("loadeddata", onReady);
          el.load();
        })
    ).then(() => {
      if (!cancelled) el.play().catch(() => {});
    });

    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  return (
    <video
      ref={ref}
      src={videoSrc ?? undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="ourwork-video h-44 w-72 shrink-0 rounded-xl object-cover md:h-52 md:w-80"
    />
  );
}

function VideoScroller({ videos, direction, enabled }) {
  const renderVideos = (prefix) =>
    videos.map((src, i) => (
      <LazyScrollerVideo
        key={`${prefix}-${src}`}
        src={src}
        label={`Production clip ${i + 1}`}
        enabled={enabled}
      />
    ));

  return (
    <div className="ourwork-marquee-viewport overflow-hidden">
      <div className={`ourwork-marquee-track ${direction === "right" ? "ourwork-marquee-track--right" : ""}`}>
        <div className="ourwork-marquee-group">{renderVideos("a")}</div>
        <div className="ourwork-marquee-group" aria-hidden>
          {renderVideos("b")}
        </div>
      </div>
    </div>
  );
}

export default function OurWorkShowcase() {
  const sectionRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px", threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-work"
      className="overflow-hidden bg-[#313e4a] pb-8 pt-4 md:pb-10 md:pt-6"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <Eyebrow className="text-white [&>span:first-child]:bg-white/40">Our Work</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-tightest text-white">
            Recent productions from the studio.
          </h2>
        </Reveal>
      </div>

      <div className="mt-8 space-y-5">
        <VideoScroller videos={OUR_WORK_ROW_ONE} direction="left" enabled={enabled} />
        <VideoScroller videos={OUR_WORK_ROW_TWO} direction="right" enabled={enabled} />
      </div>

      <style>{`
        .ourwork-marquee-viewport {
          contain: layout style paint;
        }
        .ourwork-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          animation: ourwork-marquee-left 70s linear infinite;
        }
        .ourwork-marquee-track--right {
          animation-name: ourwork-marquee-right;
        }
        .ourwork-marquee-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-right: 1rem;
        }
        .ourwork-video {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        @keyframes ourwork-marquee-left {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes ourwork-marquee-right {
          from { transform: translate3d(-50%, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ourwork-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
