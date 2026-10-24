import type { ReactNode } from 'react';
import { buildRootMetadata, rootViewport, SiteShell } from '@/components/layout/SiteShell';

export const metadata = buildRootMetadata('vi');
export const viewport = rootViewport;

export default function ViRootLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="vi">{children}</SiteShell>;
}
