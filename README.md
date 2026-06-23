# Future Media Studio - Content Division

A premium content-production studio landing site. Dark, cinematic, minimalist
(Apple / Linear / Stripe / Porsche-inspired). React + Vite + Tailwind + Framer Motion.

## Sections
- Cinematic full-screen hero with crossfading motion-video backgrounds, parallax, animated headline reveal
- Animated marquee of content formats
- Bento service grid (Podcasts, Interviews, Talking Heads, Short-Form, Corporate) with floating hover cards + parallax imagery
- Bento portfolio with hover-to-play video previews
- "Inside the Studio" sticky-scroll showcase with camera-like transitions (Stage / Capture / Audio / Post)
- Animated stats band
- Luxury 4-step booking flow (package cards, calendar + time, details, floating confirmation)
- Cinematic footer CTA

All visual media in public/media/ is AI-generated (no stock).

## Run / Build
Use the standard Vite scripts in package.json: install deps, run the dev server, or production-build to dist/.
The contents of dist/ are a static site - host on any static host
(Cloudflare Pages, Netlify, Vercel, S3+CloudFront, GitHub Pages).

NOTE: framer-motion is pinned to 11.x. React 19 + framer-motion 12 has a known
MotionValue mount crash; keep the pin in place.
