import { expect, type Page, test } from '@playwright/test';
import { allPages } from './routes';

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

test.describe('every page', () => {
  for (const { locale, url } of allPages) {
    test(`should render ${url} without errors or CSP violations`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(url);

      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(1);
      expect(errors).toEqual([]);
    });
  }
});

test('should keep legacy extension-less URLs working via redirect', async ({ page }) => {
  await page.goto('about');
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.locator('h1')).toHaveText('Frontend developer.');
});

test('should render the bilingual 404 page for unknown routes', async ({ page }) => {
  const response = await page.goto('does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found.');
  await expect(page.getByText('Trang bạn tìm không tồn tại')).toBeVisible();
});
