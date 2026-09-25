# Deployment

Static site with no build step. The repository root is the publish directory.

## Vercel
- Framework Preset: **Other**
- Build Command: none
- Output Directory: `.` (repository root)
- `vercel.json` sets security headers and cache rules.

## Netlify / Cloudflare Pages
- Build Command: none
- Publish Directory: `.`
- `_headers` mirrors the rules in `vercel.json`. Keep the two files in sync.

## Caching
File names are not content-hashed, so CSS, JS and JSON data use
`max-age=0, must-revalidate` (served from cache, revalidated with ETag).
Do not switch them to `immutable` unless file names gain a content hash.

## Contact form
`contact.html` ships with `action="#"`, which opens the visitor's mail app
with the message prefilled. To receive messages directly, create a Formspree
form and set `action="https://formspree.io/f/<form-id>"`. The CSP already
allows `https://formspree.io`.

## Content Security Policy
Scripts and styles must be local files (no inline `<script>` or `style=""`).
Adding a new third-party origin (analytics, images, fonts) requires updating
the CSP in both `vercel.json` and `_headers`.

## Post-deploy checks
- Every page and the CV download return 200; an unknown path returns `404.html`.
- `curl -I https://nqhuy.dev/` shows the security headers.
- Share preview renders `assets/img/og-cover.png` (e.g. opengraph.xyz).
- Update `<lastmod>` in `sitemap.xml` when page content changes.
