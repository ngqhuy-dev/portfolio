export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const siteConfig = {
  name: 'Nguyễn Quốc Huy',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ngqhuy-dev.github.io/portfolio').replace(
    /\/+$/,
    '',
  ),
  email: 'nguyenquochuy812003@gmail.com',
  location: 'Huế, Vietnam',
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '',
  /** Cloudflare Turnstile site key; the widget only renders when this and contactEndpoint are set. */
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
  analytics: {
    /** Plausible site domain; analytics stays off when empty. */
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? '',
    plausibleSrc: process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js',
  },
  ogImage: { width: 1200, height: 630 },
  cv: {
    path: '/assets/files/NguyenQuocHuy-CV.pdf',
    downloadName: 'CV Nguyễn Quốc Huy - Fullstack Developer.pdf',
  },
  links: {
    github: 'https://github.com/ngqhuy-dev',
    facebook: 'https://www.facebook.com/nqhuy.it',
    bitbucket: 'https://bitbucket.org/crossplatformdev/workspace/projects/EJ',
  },
} as const;

export const navItems = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/portfolio', key: 'portfolio' },
  { href: '/resume', key: 'resume' },
  { href: '/contact', key: 'contact' },
] as const;

/** Prefixes a public/ file path with the deploy sub-path; next/link does this for routes only. */
export function assetPath(path: string): string {
  return `${basePath}${path}`;
}

/** Routes get a trailing slash to match the export layout (trailingSlash: true); files keep their name. */
export function absoluteUrl(path = '/'): string {
  const isFile = /\.[a-z0-9]+$/i.test(path);
  const suffix = isFile || path.endsWith('/') ? '' : '/';
  return `${siteConfig.url}${path}${suffix}`;
}
