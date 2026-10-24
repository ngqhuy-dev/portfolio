'use client';

import Script from 'next/script';
import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';
import { installPlausibleQueue, trackEvent } from '@/lib/analytics';

function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // CLS is a unitless score; scale it so it survives integer rounding.
    const value = metric.name === 'CLS' ? metric.value * 1000 : metric.value;
    trackEvent('Web Vitals', {
      metric: metric.name,
      value: Math.round(value),
      rating: metric.rating ?? 'unknown',
      page: window.location.pathname,
    });
  });
  return null;
}

export function Analytics({ domain, src }: { domain: string; src: string }) {
  useEffect(() => {
    installPlausibleQueue();
  }, []);

  return (
    <>
      <Script src={src} data-domain={domain} strategy="afterInteractive" />
      <WebVitalsReporter />
    </>
  );
}
