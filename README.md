# Portfolio — Nguyễn Quốc Huy

Live: Vercel (canonical) and https://ngqhuy-dev.github.io/portfolio/ · Tiếng Việt: add `/vi/`

Personal portfolio of Nguyễn Quốc Huy — frontend developer (React, React Native).
Built with Next.js (App Router, static export), React 19, TypeScript and CSS Modules, in English and
Vietnamese.

## Stack

| Concern     | Tool                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| Framework   | Next.js 16 — `output: 'export'`, every route prerendered                   |
| Language    | TypeScript (strict)                                                        |
| i18n        | EN at `/`, VI at `/vi` — two root layouts, typed dictionaries, hreflang    |
| Styling     | CSS Modules + design tokens in `src/styles/globals.css`                    |
| Fonts       | `next/font` (self-hosted Inter, Inter Tight, JetBrains Mono, Vietnamese)   |
| SEO         | Metadata API, per-page OG images, JSON-LD, `sitemap.ts`, `robots.ts`       |
| Contact     | Formspree-compatible endpoint + Cloudflare Turnstile, mailto fallback      |
| Analytics   | Plausible (cookie-less) + Core Web Vitals, opt-in via env                  |
| Unit tests  | Vitest + Testing Library                                                   |
| E2E / a11y  | Playwright + axe-core, visual regression baselines                         |
| Performance | Lighthouse CI budgets (perf ≥ 90, a11y/best-practices/SEO ≥ 95, CLS < 0.1) |
| Git hooks   | Husky + lint-staged + commitlint (Conventional Commits)                    |
| CI / Deploy | GitHub Actions (quality gates) → GitHub Pages; Vercel Git integration      |
| Security    | Per-page CSP with script hashes, env-driven third-party origins            |

## Getting started

Requires Node.js 20.9+ (`.nvmrc` pins 24) and Google Chrome for the browser tests.

```bash
npm ci                # also installs the git hooks
npm run dev           # http://localhost:3000/portfolio
npm run build         # static site in out/ (OG images finalized, CSP injected)
npm run preview       # serves out/ like GitHub Pages: http://localhost:8080/portfolio/
```

## Quality checks

```bash
npm run check         # lint + typecheck + format + unit tests
npm run test:e2e      # Playwright: every page × EN/VI × desktop/mobile, axe, SEO (needs a build)
npm run test:visual   # pixel baselines; update with: npm run test:visual -- --update-snapshots
npm run lhci          # Lighthouse budgets on the production build
```

Commits must follow Conventional Commits (`feat(scope): …`, header ≤ 72 chars); the pre-commit
hook runs ESLint and Prettier on staged files.

## Structure

```
src/
  app/(en)/             English routes (root layout, lang="en"): /, /about, /portfolio, /portfolio/[slug], …
  app/vi/               Vietnamese routes (root layout, lang="vi"): /vi, /vi/about, …
  app/global-not-found  bilingual 404; sitemap.ts, robots.ts, manifest.ts, icons
  views/                page content shared by both locales (HomeView, ProjectDetailView, …)
  components/           layout (SiteShell, Header, Footer), projects, contact, Analytics
  i18n/                 locale config + typed EN/VI dictionaries
  data/                 projects.json, experience.ts, skills.ts (localized content)
  lib/                  metadata, OG image renderer, contact validation, analytics
  config/site.ts        name, URLs, links, feature flags from env
e2e/                    Playwright specs + visual baselines
scripts/                finalize-og-images.mjs, inject-csp.mjs (postbuild), preview.mjs
```

## Editing content

- **Projects** — `src/data/projects.json`. Each entry needs a unique kebab-case `slug` (its case
  study lives at `/portfolio/<slug>/`), `summary` and `content` in both `en` and `vi`. Screenshots go
  in `public/assets/img/projects/<slug>/` and are listed in `images` as `/assets/img/...` paths;
  the build rejects remote URLs.
- **UI copy** — `src/i18n/dictionaries/en.ts`; `vi.ts` must have the same shape (type-checked).
- **Experience / skills** — `src/data/experience.ts`, `src/data/skills.ts` (one list for every page).
- **Contact details** — `src/config/site.ts`. **CV** — replace `public/assets/files/NguyenQuocHuy-CV.pdf`.

## Environment

All variables are optional and read at build time — see `.env.example`.

| Variable                         | Default                                   |
| -------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_BASE_PATH`          | `/portfolio` (`""` for a root domain)     |
| `NEXT_PUBLIC_SITE_URL`           | `https://ngqhuy-dev.github.io/portfolio`  |
| `NEXT_PUBLIC_CONTACT_ENDPOINT`   | empty → form opens the visitor's mail app |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | empty → no captcha                        |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`   | empty → no analytics                      |
| `NEXT_PUBLIC_PLAUSIBLE_SRC`      | `https://plausible.io/js/script.js`       |

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for hosting, custom domain, CSP and feature setup.
