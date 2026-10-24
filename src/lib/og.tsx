import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';
import type { Project } from '@/data/types';
import { getDictionary, type Locale } from '@/i18n';

export const ogSize = { width: siteConfig.ogImage.width, height: siteConfig.ogImage.height };
export const ogContentType = 'image/png';

type PageKey = 'home' | 'about' | 'portfolio' | 'resume' | 'contact';
type FontWeight = 400 | 800 | 900;

const COLORS = { bg: '#050505', text: '#f9fafb', muted: '#a1a1aa', accent: '#00f5ff' };

// Satori reads WOFF but not WOFF2; latin + vietnamese subsets are registered under one family name.
const FONT_FILES: { name: string; weight: FontWeight; file: string }[] = [
  { name: 'Inter Tight', weight: 900, file: 'inter-tight/files/inter-tight-latin-900-normal.woff' },
  {
    name: 'Inter Tight',
    weight: 900,
    file: 'inter-tight/files/inter-tight-vietnamese-900-normal.woff',
  },
  {
    name: 'JetBrains Mono',
    weight: 400,
    file: 'jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff',
  },
  {
    name: 'JetBrains Mono',
    weight: 400,
    file: 'jetbrains-mono/files/jetbrains-mono-vietnamese-400-normal.woff',
  },
];

let fontsPromise: ReturnType<typeof loadFonts> | undefined;

async function loadFonts() {
  const fontDir = path.join(process.cwd(), 'node_modules', '@fontsource');
  return Promise.all(
    FONT_FILES.map(async ({ name, weight, file }) => ({
      name,
      weight,
      style: 'normal' as const,
      data: await readFile(path.join(fontDir, file)),
    })),
  );
}

interface OgContent {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
}

export async function renderOgImage({
  eyebrow,
  title,
  description,
  accent = COLORS.accent,
}: OgContent) {
  fontsPromise ??= loadFonts();
  const fonts = await fontsPromise;

  return new ImageResponse(
    <div
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: `radial-gradient(circle at 100% 0%, ${accent}66, transparent 60%)`,
        color: COLORS.text,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '72px 80px',
        width: '100%',
      }}
    >
      <div
        style={{
          color: COLORS.accent,
          display: 'flex',
          fontFamily: 'JetBrains Mono',
          fontSize: 26,
        }}
      >
        {`</> ${eyebrow}`}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Inter Tight',
            fontSize: title.length > 32 ? 64 : 84,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: COLORS.muted,
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 26,
            lineHeight: 1.45,
            maxWidth: 1000,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          borderTop: '2px solid rgba(255,255,255,0.08)',
          color: COLORS.muted,
          display: 'flex',
          fontFamily: 'JetBrains Mono',
          fontSize: 22,
          justifyContent: 'space-between',
          paddingTop: 28,
        }}
      >
        <span>{siteConfig.name}</span>
        <span style={{ color: COLORS.accent }}>{siteConfig.url.replace(/^https?:\/\//, '')}</span>
      </div>
    </div>,
    { ...ogSize, fonts },
  );
}

const PAGE_EYEBROWS: Record<PageKey, string> = {
  home: '~/',
  about: '~/about',
  portfolio: '~/portfolio',
  resume: '~/resume',
  contact: '~/contact',
};

export function renderPageOgImage(locale: Locale, page: PageKey) {
  const meta = getDictionary(locale).meta;
  const pageMeta = meta[page];
  return renderOgImage({
    eyebrow: PAGE_EYEBROWS[page],
    title: 'title' in pageMeta ? pageMeta.title : siteConfig.name,
    description: page === 'home' ? `${meta.jobTitle} — React · React Native` : pageMeta.social,
  });
}

export function renderProjectOgImage(locale: Locale, project: Project) {
  return renderOgImage({
    eyebrow: `~/portfolio/${project.slug}`,
    title: project.title,
    description: project.summary[locale],
    accent: project.accent,
  });
}
