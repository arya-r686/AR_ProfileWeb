# Arya Raut — Cinematic Portfolio

A cinematic, WebGL-powered personal portfolio site built with vanilla JavaScript, Three.js, and Tailwind CSS. Features an animated hero scene, an interactive tech-stack visualization, a canvas-based scroll-driven "MSI" image sequence, and a shader-driven contact section.

**Live site:** https://araut.netlify.app

## Features

- **Hero section** — real-time Three.js WebGL scene (`three-hero.js`)
- **Tech stack visualization** — interactive Three.js scene, lazy-initialized via `IntersectionObserver` so it only renders once scrolled into view (`three-tech.js`)
- **Scrollytelling image sequence** — a 240-frame canvas animation ("MSI") driven by scroll position, with lazy frame loading and a preloader (`msi-scroll-reveal.js`)
- **Shader-based contact section** — animated canvas shader background (`shader-contact.js`)
- **Tilt interactions** — [vanilla-tilt](https://micku7zu.github.io/vanilla-tilt.js/) for hover-based card tilt effects (desktop/hover-capable devices only)
- **Sections:** Hero, About, Tech Stack, Skills, Education, Certificates, MSI Scrollytelling, Contact
- Custom dark theme with a Material Design–inspired color system (Tailwind CDN + inline config)
- SEO basics included: `robots.txt`, `sitemap.xml`, meta description, and security-related meta headers

## Tech Stack

| Layer | Tool |
|---|---|
| Build tool | [Vite](https://vitejs.dev/) 5 |
| 3D / WebGL | [Three.js](https://threejs.org/) 0.168 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) (via CDN, with a custom theme config) |
| Interactions | [vanilla-tilt](https://www.npmjs.com/package/vanilla-tilt) |
| Fonts | Inter, JetBrains Mono, Material Symbols (Google Fonts) |

## Project Structure

```
AR_ProfileWeb-main/
├── index.html                  # Single-page markup, Tailwind theme config, inline styles
├── vite.config.js              # Vite config (relative base path for static hosting)
├── package.json
├── src/
│   ├── main.js                 # Entry point — wires up all modules on DOMContentLoaded
│   ├── three-hero.js           # Hero section WebGL scene
│   ├── three-tech.js           # Tech-stack WebGL scene (lazy-loaded on scroll)
│   ├── msi-scroll-reveal.js    # Canvas scroll-driven frame sequence player
│   └── shader-contact.js       # Contact section canvas shader
└── public/
    ├── arya-portrait.jpeg
    ├── certificates/           # Certificate images/PDFs (Google AI, IBM GenAI, etc.)
    ├── msi-frames/             # 240 JPG frames for the scrollytelling sequence
    ├── robots.txt
    └── sitemap.xml
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ and npm

### Installation

```bash
git clone https://github.com/<your-username>/AR_ProfileWeb.git
cd AR_ProfileWeb
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server with hot module reload (default: `http://localhost:5173`).

### Production Build

```bash
npm run build
```

Outputs a static, production-ready build to `dist/`.

### Preview the Build

```bash
npm run preview
```

Serves the contents of `dist/` locally to sanity-check the production build.

## Deployment

The Vite config uses a relative base path (`base: './'`), so the built `dist/` folder can be deployed as-is to:
- **GitHub Pages**
- **Netlify** / **Vercel** (build command: `npm run build`, output directory: `dist`)
- Any static file host / custom domain

## Notes

- Tailwind CSS is loaded via the CDN `<script>` tag with an inline `tailwind.config` in `index.html`, rather than a local Tailwind build — no PostCSS/Tailwind config files are needed.
- The MSI scrollytelling section lazily loads its 240 frames and only animates while the section is in the viewport, to minimize performance impact.
- The tech-stack Three.js scene similarly initializes lazily via `IntersectionObserver`.

## Contact

- Email: arpremium25@gmail.com
- GitHub: [@arya-r686](https://github.com/arya-r686)
- LinkedIn: [aryaraut25](https://www.linkedin.com/in/aryaraut25)
- Instagram: [@_raut_arya_](https://instagram.com/_raut_arya_)

## License

No license specified. All rights reserved by the author unless otherwise noted.
