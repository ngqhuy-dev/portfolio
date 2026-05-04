# NovaFolio — Portfolio Template

> Polished documentation generated from the uploaded project.

## Overview
Personal/agency portfolio with projects grid, case studies, about/resume, and contact form.

## Tech Stack
- HTML5, CSS3, JavaScript
- Optional: Bootstrap/Tailwind, AOS, Isotope, Fancybox, Swiper (if referenced below)

## Structure
```
portfolio-template/
├─ assets
│  ├─ css
│  │  ├─ about.css
│  │  ├─ base.css
│  │  ├─ blog.css
│  │  ├─ contact.css
│  │  ├─ index.css
│  │  ├─ portfolio.css
│  │  ├─ post.css
│  │  ├─ project.css
│  │  ├─ resume.css
│  │  ├─ services.css
│  │  └─ testimonials.css
│  ├─ data
│  │  ├─ posts.json
│  │  ├─ projects.json
│  │  └─ testimonials.json
│  └─ js
│     └─ main.js
├─ about.html
├─ blog.html
├─ contact.html
├─ index.html
├─ portfolio.html
├─ post.html
├─ project.html
├─ resume.html
├─ services.html
└─ testimonials.html
```

## Pages & Assets
- `about.html` — **About • Student Portfolio Starter** (H1: About Me)
  - CSS: `assets/css/base.css`, `assets/css/about.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Navigation
  - Counts: tables=0, forms=0
- `blog.html` — **Blog • Student Portfolio Starter** (H1: Blog)
  - CSS: `assets/css/base.css`, `assets/css/blog.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Navigation
  - Counts: tables=0, forms=0
- `contact.html` — **Contact • Student Portfolio Starter** (H1: Contact)
  - CSS: `assets/css/base.css`, `assets/css/contact.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Form(s), Navigation
  - Counts: tables=0, forms=1
- `index.html` — **Home • Student Portfolio Starter** (H1: Show your work with confidence.)
  - CSS: `assets/css/base.css`, `assets/css/index.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Navigation
  - Counts: tables=0, forms=0
- `portfolio.html` — **Portfolio • Student Portfolio Starter** (H1: Projects)
  - CSS: `assets/css/base.css`, `assets/css/portfolio.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Navigation
  - Counts: tables=0, forms=0
- `post.html` — **Post • Student Portfolio Starter**
  - CSS: `assets/css/base.css`, `assets/css/post.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Navigation
  - Counts: tables=0, forms=0
- `project.html` — **Project • Student Portfolio Starter**
  - CSS: `assets/css/base.css`, `assets/css/project.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Navigation
  - Counts: tables=0, forms=0
- `resume.html` — **Resume • Student Portfolio Starter** (H1: Resume)
  - CSS: `assets/css/base.css`, `assets/css/resume.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Navigation
  - Counts: tables=0, forms=0
- `services.html` — **Services • Student Portfolio Starter** (H1: Services)
  - CSS: `assets/css/base.css`, `assets/css/services.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Navigation
  - Counts: tables=0, forms=0
- `testimonials.html` — **Testimonials • Student Portfolio Starter** (H1: Testimonials)
  - CSS: `assets/css/base.css`, `assets/css/testimonials.css`
  - JS: `https://code.jquery.com/jquery-3.7.1.min.js`, `assets/js/main.js`
  - Features: Portfolio strings detected, Navigation
  - Counts: tables=0, forms=0

## Local Development
1. Open `index.html` directly or serve locally for accurate relative paths:

   - Python: `python3 -m http.server 5173`

   - Node: `npx serve .`

2. Visit `http://localhost:5173/`

## Dependencies (from asset paths)
- **jQuery** — e.g., `https://code.jquery.com/jquery-3.7.1.min.js`


## Notes
- Optimize project thumbnails and hero images; prefer modern formats where possible.

- If using a filterable grid (Isotope), pin CDN versions and add SRI.

- Run Lighthouse on Home/Projects for performance and a11y.


See **DEPLOYMENT.md** for hosting instructions.
