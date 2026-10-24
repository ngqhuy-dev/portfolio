import { expect, test } from '@playwright/test';
import { allPages } from './routes';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ngqhuy-dev.github.io/portfolio';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/portfolio';

test.describe('SEO metadata', () => {
  for (const { url } of allPages) {
    test(`should expose canonical, hreflang and a PNG OG image on ${url}`, async ({
      page,
      request,
    }) => {
      await page.goto(url);
      const expectedCanonical = `${SITE_URL}/${url === './' ? '' : url}`;

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        expectedCanonical,
      );
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toMatch(/\.png\?/);
      // Fetch the image from the local server rather than production.
      const localImage = (ogImage ?? '').replace(SITE_URL, new URL(page.url()).origin + BASE_PATH);
      const response = await request.get(localImage);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toBe('image/png');
    });
  }
});

test('should list every page in the sitemap', async ({ request }) => {
  const sitemap = await (await request.get('sitemap.xml')).text();
  for (const { url } of allPages) {
    expect(sitemap).toContain(`<loc>${SITE_URL}/${url === './' ? '' : url}</loc>`);
  }
});
