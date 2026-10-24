# Deployment

`npm run build` produces a fully static site in `out/`:
`next build` → `scripts/finalize-og-images.mjs` (adds `.png` to generated OG images) →
`scripts/inject-csp.mjs` (per-page CSP).

Live site: https://ngqhuy-dev.github.io/portfolio/ (GitHub Pages, served under `/portfolio/`).

## GitHub Pages (default)

`.github/workflows/ci.yml` runs on every push and pull request: lint, typecheck, format check,
unit tests, build, Playwright (E2E + axe + SEO) and Lighthouse budgets. Reports are uploaded as the
`quality-reports` artifact. Pushes to `master` then deploy `out/` to Pages.

One-time setup:

1. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Optional repository variables (Settings → Secrets and variables → Actions → **Variables**):

| Variable             | Effect                                                       |
| -------------------- | ------------------------------------------------------------ |
| `CONTACT_ENDPOINT`   | Form posts to this URL (e.g. `https://formspree.io/f/<id>`)  |
| `TURNSTILE_SITE_KEY` | Adds a Cloudflare Turnstile challenge to the form            |
| `PLAUSIBLE_DOMAIN`   | Enables Plausible pageviews, contact events and Web Vitals   |
| `PLAUSIBLE_SRC`      | Custom Plausible script URL (self-hosted or per-site script) |

All values are public (they end up in the client bundle) — never put secrets here.

## URLs and paths

- Pages export as `<route>/index.html` (`trailingSlash: true`). `/about` redirects to `/about/`, so
  the old extension-less links keep working.
- English lives at `/`, Vietnamese at `/vi/`. Every page declares `hreflang` alternates.
- Internal routes: `next/link` + `localizedPath(locale, '/about')`; the base path is added.
- Files in `public/`: wrap with `assetPath('/assets/...')` from `src/config/site.ts`.
- Never hardcode the base path (`/portfolio`).

## Site URL

The site uses the GitHub Pages domain only. CI reads the real Pages URL with
`actions/configure-pages` (`base_path`, `base_url`), so the build always matches the repository it
deploys from — e.g. `nqhuy-stack/Student-Portfolio` → `https://nqhuy-stack.github.io/Student-Portfolio/`.
Canonical, hreflang, OG images, JSON-LD, sitemap and robots all follow automatically.

The `/portfolio` + `ngqhuy-dev.github.io` defaults in `next.config.ts` / `src/config/site.ts` only
apply to local builds; override them with `NEXT_PUBLIC_BASE_PATH` / `NEXT_PUBLIC_SITE_URL` to
preview another repository's URL.

## Contact form

- No endpoint: the form validates input and opens the visitor's mail app (mailto).
- With `CONTACT_ENDPOINT`: the form posts `FormData` with `Accept: application/json` (the Formspree
  contract). A honeypot field `_gotcha` is always included.
- With `TURNSTILE_SITE_KEY` as well: the widget adds a `cf-turnstile-response` field and the form
  refuses to send without it. **The token only protects you if the endpoint verifies it
  server-side with the Turnstile secret key** — check that your form provider supports Turnstile
  verification before enabling it; otherwise rely on the honeypot and the provider's spam filter.
- Test keys: Cloudflare documents always-pass site keys (e.g. `1x00000000000000000000AA`) for local
  testing.

## Analytics

Plausible is cookie-less, so no consent banner is required for it. When `PLAUSIBLE_DOMAIN` is set:
pageviews (including client-side navigations), `Contact` events (`method: form | mailto`) and a
`Web Vitals` event per metric (`metric`, `value` in ms — CLS × 1000 —, `rating`, `page`).
Create matching custom properties in the Plausible dashboard to break them down.

## Content Security Policy

GitHub Pages cannot set headers, so `scripts/inject-csp.mjs` writes a
`<meta http-equiv="Content-Security-Policy">` into every HTML file:

- `script-src` lists the SHA-256 hash of each page's inline Next.js bootstrap scripts — no
  `'unsafe-inline'` for scripts.
- Third-party origins are derived from the same env vars as the app: Formspree (`connect-src`,
  `form-action`), Plausible (`script-src`, `connect-src`) and Turnstile (`script-src`,
  `connect-src`, `frame-src`) are only allowed when enabled.
- `style-src` allows `'unsafe-inline'` because per-project accent colors are style attributes.
- `frame-ancestors` only works as a header and is set in `vercel.json` / `public/_headers`.

## Vercel / Netlify / Cloudflare Pages

Build at the domain root: set `NEXT_PUBLIC_BASE_PATH=""` and `NEXT_PUBLIC_SITE_URL`.

- Vercel: framework preset **Next.js**; `vercel.json` adds security and cache headers.
- Netlify / Cloudflare Pages: build `npm run build`, publish `out`; `public/_headers` is copied
  into `out/`. Keep it in sync with `vercel.json`.

## Known limitations

- The app-wide 404 uses Next's `experimental.globalNotFound` (required with two root layouts).
  Re-check it when upgrading Next.js; `e2e/smoke.spec.ts` covers it.
- Switching language is a full page load (different root layouts), by design.
- Visual baselines (`e2e/visual.spec.ts-snapshots`) are Linux/Chrome specific and are not run in CI.

## Post-deploy checks

- `/about` redirects to `/about/`, `/vi/` renders Vietnamese, an unknown path renders the 404 page.
- No CSP violations in DevTools → Console.
- Share preview of a case study shows its generated image (e.g. opengraph.xyz).
- `sitemap.xml` lists EN and VI URLs with the production domain.
