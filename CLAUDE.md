# Claude Project Guide

## Project Overview
This repository is Rimah Boukarroum's personal portfolio: a single-page static site (hero, projects, about/skills, writing, contact). It's deployed via GitHub Pages at rimahboukarroum.com (see `CNAME`).

The current design was converted from a Claude Design canvas source (`Portfolio.dc.html`) into a plain static page — no framework, no build step. The canvas file, its runtime (`support.js`), and the sync log (`github.md`) are kept as the design source for iterating in Claude Design; they are **not** part of the deployed site and aren't linked from `index.html`.

## Main Files
- `index.html` — the entire site: hero, Projects, About, Writing, Contact, footer
- `assets/css/style.css` — all styles (CSS custom properties for the OKLCH color palette, layout, hover states, reveal-on-scroll states)
- `assets/js/main.js` — vanilla JS: scroll-reveal (IntersectionObserver), cursor glow, magnetic buttons, project-card 3D tilt — each gated behind `prefers-reduced-motion` and, where only meaningful with a mouse, `(pointer: fine)`
- `images/` — project screenshots and the About photo
- `assets/Rimah_Boukarroum_CV.pdf` — the CV linked from the header and Contact section
- `Portfolio.dc.html`, `support.js`, `github.md`, `.thumbnail`, `uploads/` — Claude Design canvas source, not part of the deployed page

## Tech Stack
- Plain HTML5, CSS3 (OKLCH colors, `clamp()`, CSS Grid), vanilla JavaScript
- Google Fonts (Space Grotesk + Inter) loaded via `<link>`
- No build system, no framework, no jQuery

## How to Run
Open `index.html` directly in a browser, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Editing Guidance
- This is a **single page** — new content goes into a `<section>` in `index.html` plus matching rules in `style.css`, not a new HTML file.
- Reuse existing patterns: `.button-pill` (`--primary` / `--ghost`) for CTAs, `.section-label` + `.section-title` for section headers, `[data-reveal="…"]` on any block that should fade/slide in on scroll (wire nothing extra in JS — the existing `IntersectionObserver` picks up every `[data-reveal]` element automatically).
- Interactive effects (`.magnetic`, `.project-card` tilt, `.cursor-glow`) are opt-in via class/selector — new elements only get them if you add the class, and everything already respects `prefers-reduced-motion` and pointer type. Keep that guarding when adding more.
- Color/spacing tokens live in `:root` in `style.css` — reuse the existing `var(--…)` names rather than hardcoding new OKLCH values.

## Content Notes
- Rimah Boukarroum is a Computer and Communications Engineering student in Beirut, Lebanon.
- Projects: FM Transceiver Application (Proteus), AI Document Assistant (Python/Streamlit/Ollama), Self Defense App (MIT App Inventor). Each project card needs a `title`, `desc`, `tool`, and a screenshot from `images/`.
- Contact details and social links live directly in the Contact section markup.

## Constraints
- Do not introduce a framework or build step.
- Keep new interactions in vanilla JS, following the existing pattern (feature-detect, respect reduced motion, only touch `transform`/`opacity`/class toggles per frame).
- Prefer semantic HTML and CSS over JavaScript for anything that isn't inherently interactive.

## Validation
The site is mostly visual — check changes by opening the page locally (or via a local server) and confirming both scroll-reveal and hover interactions still work, and that the page is still readable/usable with `prefers-reduced-motion` enabled and on a touch device (no mouse-only effect should be required to use the site).
