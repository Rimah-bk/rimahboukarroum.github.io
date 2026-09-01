# Claude Project Guide

## Project Overview
This repository is a personal portfolio website built as a static HTML/CSS/JS site based on the Hyperspace template from HTML5 UP. It is designed to showcase projects, about information, and contact details for Rimah Boukarroum.

## Main Files
- `index.html` — landing page with portfolio sections and contact form
- `generic.html` — generic content page used by project detail links
- `elements.html` — template demo page with HTML elements and layout examples
- `assets/css/main.css` — main site styles
- `assets/js/main.js` — interactive behavior and responsive scripts
- `images/` — project and portfolio images

## Tech Stack
- Plain HTML5
- CSS3
- JavaScript
- jQuery-based template scripts
- No build system or framework required

## How to Run
Open `index.html` directly in a browser, or serve the folder locally for a cleaner preview:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Editing Guidance
- Preserve the existing static-site structure and responsive layout.
- Prefer small, targeted edits to the HTML and CSS instead of large rewrites.
- Keep the design consistent with the Hyperspace theme colors, spacing, and typography.
- When updating project content, maintain the current personal branding and the same structure of sections.
- If adding new sections or pages, reuse the same styling conventions from the existing `.wrapper`, `.style*`, and `.button` classes.

## Content Notes
- The site currently presents Rimah Boukarroum as a Computer and Communications Engineering student in Beirut.
- Projects are written as portfolio callouts and should remain concise, practical, and technical.
- Social links and contact details can be updated in `index.html`.

## Constraints
- Do not introduce a framework unless specifically requested.
- Keep changes lightweight and compatible with the original static site template.
- Prefer semantic HTML and clean CSS over unnecessary JavaScript.

## Validation
Check the result by opening the page locally. The site is mostly visual, so browser preview and manual inspection are the main validation methods.
