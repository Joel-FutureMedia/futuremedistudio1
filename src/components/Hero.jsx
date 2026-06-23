import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CTA } from "./primitives";

export default function Hero() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => {});
    };

    video.addEventListener("canplay", play);
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) play();

    return () => video.removeEventListener("canplay", play);
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[92svh] w-full overflow-hidden bg-[#323e4a]"
    >
      {/* Full-bleed background video */}
      <motion.div style={{ y: yBg }} className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/media/hero-bg.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Subtle white-balanced overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      {/* Soft left scrim for text contrast */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#323e4a]/60 via-[#323e4a]/25 to-transparent" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-center px-6 pb-16 pt-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-white md:text-base"
        >
          Future Media Video Production
        </motion.p>

        <h1 className="max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-tightest text-[#ffffff]">
          {["Create content", "that commands", "attention."].map((line, i) => (
            <motion.span
              key={i}
              className="block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.1 }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-6 max-w-xl text-base leading-[1.75] text-[#ffffff] md:text-lg"
        >
          A broadcast-quality production studio for podcasts, interviews, and branded films engineered to look premium on every screen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <CTA href="#book" className="!bg-[#323e4a] !text-white shadow-card hover:!bg-[#28333e] hover:shadow-card-hover">
            Book a Studio
          </CTA>
          <CTA href="#work" className="!bg-[#323e4a] !text-white shadow-card hover:!bg-[#28333e] hover:shadow-card-hover">
            See the work
          </CTA>
        </motion.div>
      </motion.div>
    </section>
  );
}
