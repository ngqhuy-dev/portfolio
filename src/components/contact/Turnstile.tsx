'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

export const TURNSTILE_RESPONSE_FIELD = 'cf-turnstile-response';
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  render(
    container: HTMLElement,
    options: { sitekey: string; theme?: 'light' | 'dark' | 'auto'; language?: string },
  ): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Renders the widget inside the form; it adds a hidden `cf-turnstile-response` input. */
export function Turnstile({ siteKey, language }: { siteKey: string; language: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!isScriptReady || !container || !window.turnstile) return;
    const widgetId = window.turnstile.render(container, {
      sitekey: siteKey,
      theme: 'dark',
      language,
    });
    return () => window.turnstile?.remove(widgetId);
  }, [isScriptReady, siteKey, language]);

  return (
    <>
      <Script src={TURNSTILE_SCRIPT} strategy="lazyOnload" onReady={() => setIsScriptReady(true)} />
      <div ref={containerRef} />
    </>
  );
}
