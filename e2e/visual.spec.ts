import { expect, test } from '@playwright/test';
import { pageUrl } from './routes';

const PAGES = ['/', '/about', '/portfolio', '/resume', '/contact'];

test.describe('visual regression @visual', () => {
  for (const path of PAGES) {
    test(`should match the baseline for ${path}`, async ({ page }) => {
      await page.goto(pageUrl('en', path));
      await page.evaluate(() => document.fonts.ready);
      await expect(page).toHaveScreenshot(`${path === '/' ? 'home' : path.slice(1)}.png`, {
        fullPage: true,
      });
    });
  }
});
