const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/portfolio';
const origin = `http://localhost:8080${basePath}`;

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node scripts/preview.mjs',
      startServerReadyPattern: 'Preview:',
      url: ['/', '/portfolio/', '/portfolio/linora/', '/vi/contact/'].map((path) => origin + path),
      numberOfRuns: 3,
      settings: { chromeFlags: '--headless=new --no-sandbox' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median-run' }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
    // Reports stay local / in CI artifacts instead of a public upload.
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
};
