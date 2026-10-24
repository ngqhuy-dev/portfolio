import { defineConfig, devices } from '@playwright/test';

const PORT = 8080;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/portfolio';

// Runs against the production build (npm run build) served like GitHub Pages.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  // Pixel baselines depend on the OS font stack; run them explicitly with `npm run test:visual`.
  grepInvert: process.env.VISUAL ? undefined : /@visual/,
  grep: process.env.VISUAL ? /@visual/ : undefined,
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  use: {
    baseURL: `http://localhost:${PORT}${BASE_PATH}/`,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: 'node scripts/preview.mjs',
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
