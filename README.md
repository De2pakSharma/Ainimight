# Ainimight — Design Studio website

Website for Ainimight, a branding, packaging, illustration, animation and publishing studio in Chandigarh, working worldwide. Contact: contact@ainimight.com

Built with Next.js 15, React 19, TypeScript, GSAP + ScrollTrigger, three.js and motion.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build a static site

```bash
npm run build    # writes the static site to out/
```

`out/` can be hosted on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

## Where things are

- `components/ainimight.tsx`: the whole site: content, scenes, scroll engine, styles
- `components/*`: React Bits pieces (CircularGallery, TextPressure, ClickSpark, BounceCards, ScrollVelocity)
- `app/`: Next.js layout (fonts, metadata) and page
- `public/work/`: project images (each has a full-size and a `-sm` version)
