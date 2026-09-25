# Deployment

Static site with no build step. The repository root is the publish directory.

Live site: https://ngqhuy-dev.github.io/portfolio/ (GitHub Pages, served under `/portfolio/`).

## Paths — keep them relative
The site must work both at a domain root and under a sub-path, so every link,
asset and `fetch()` uses a relative path: `assets/css/base.css`, `about`, `./`.
Never start a path with `/` — on GitHub Pages `/assets/...` points outside
`/portfolio/` and the page loads without CSS.

## GitHub Pages
- Settings → Pages → Deploy from branch `master`, folder `/ (root)`.
- `.nojekyll` skips Jekyll processing.
- `/portfolio/about` serves `about.html` automatically.
- Custom headers are not supported: `vercel.json` and `_headers` are ignored.
  The CSP is duplicated as a `<meta http-equiv>` tag in every page
  (`frame-ancestors` only works as a header). Cache is fixed at 10 minutes.
- If you move to a custom domain, replace `https://ngqhuy-dev.github.io/portfolio`
  in canonical/OG tags, JSON-LD, `sitemap.xml` and `robots.txt`.

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
Pages are linked as `about`, `portfolio`, … without `.html`.
- Vercel: `"cleanUrls": true` in `vercel.json`; `/about.html` redirects to `/about`.
- Netlify: Pretty URLs are on by default. Cloudflare Pages does this automatically.
- New pages: link them as `<name>` (relative) and add the clean URL to `sitemap.xml`.

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
the CSP in `vercel.json`, `_headers` and the `<meta http-equiv>` tag of every page.

## Post-deploy checks
- `/about` returns 200, `/about.html` redirects to `/about`, an unknown path returns `404.html`.
- Pages load with styles under `/portfolio/` (no 404 in DevTools → Network).
- Share preview renders `assets/img/og-cover.png` (e.g. opengraph.xyz).
- Update `<lastmod>` in `sitemap.xml` when page content changes.
