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

## Clean URLs
Pages are linked as `/about`, `/portfolio`, … without `.html`.
- Vercel: `"cleanUrls": true` in `vercel.json`; `/about.html` redirects to `/about`.
- Netlify: Pretty URLs are on by default. Cloudflare Pages does this automatically.
- New pages: link them as `/<name>` and add the clean URL to `sitemap.xml`.
- Asset paths are root-absolute (`/assets/...`) so they resolve on any route.

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
- `/about` returns 200, `/about.html` redirects to `/about`, an unknown path returns `404.html`.
- `curl -I https://nqhuy.dev/` shows the security headers.
- Share preview renders `assets/img/og-cover.png` (e.g. opengraph.xyz).
- Update `<lastmod>` in `sitemap.xml` when page content changes.
