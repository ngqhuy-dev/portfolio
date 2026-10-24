import type { ReactNode } from 'react';
import { buildRootMetadata, rootViewport, SiteShell } from '@/components/layout/SiteShell';

export const metadata = buildRootMetadata('en');
export const viewport = rootViewport;

export default function EnRootLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
