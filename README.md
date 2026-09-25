# nqhuy.dev

Personal portfolio of Nguyễn Quốc Huy — frontend developer (React, React Native).
Plain HTML, CSS and vanilla JavaScript; no build step.

## Structure
```
index.html, about.html, portfolio.html, resume.html, contact.html, 404.html
assets/
  css/base.css           reset + layout primitives
  css/professional.css   design tokens and theme (loaded last, wins)
  css/<page>.css         page-specific tweaks
  js/main.js             nav, project cards, filters, contact form
  js/professional.js     card entrance animation
  data/projects.json     project list rendered on home + portfolio
  files/NguyenQuocHuy-CV.pdf
  img/                   OG cover and app icons
favicon.svg, favicon.ico, apple-touch-icon.png, site.webmanifest
robots.txt, sitemap.xml
vercel.json, _headers    security + cache headers
```

## Run locally
`fetch()` needs HTTP, so serve the folder instead of opening files directly:
```bash
python3 -m http.server 8080
```

## Editing content
- Projects: edit `assets/data/projects.json`. `accent` tints the card cover;
  set `github` to a real URL to show a "Source" link, or `#` for private repos.
- CV: replace `assets/files/NguyenQuocHuy-CV.pdf`, keeping the file name.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for hosting, caching and CSP notes.
