type EventProps = Record<string, string | number>;

type PlausibleFn = ((event: string, options?: { props?: EventProps }) => void) & {
  q?: unknown[][];
};

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/** Queues calls made before the Plausible script loads; the script replays `plausible.q`. */
export function installPlausibleQueue(): void {
  if (window.plausible) return;
  const queue: PlausibleFn = (...args) => {
    (queue.q ??= []).push(args);
  };
  window.plausible = queue;
}

/** No-op unless analytics is enabled, so callers never need to check. */
export function trackEvent(name: string, props?: EventProps): void {
  if (typeof window === 'undefined' || !window.plausible) return;
  window.plausible(name, props ? { props } : undefined);
}
