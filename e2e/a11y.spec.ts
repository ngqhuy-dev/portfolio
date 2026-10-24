import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { allPages } from './routes';

test.describe('accessibility', () => {
  for (const { url } of allPages) {
    test(`should have no serious axe violations on ${url}`, async ({ page }) => {
      await page.goto(url);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const blocking = violations.filter(
        ({ impact }) => impact === 'serious' || impact === 'critical',
      );
      expect(blocking.map(({ id, nodes }) => `${id} (${nodes.length})`)).toEqual([]);
    });
  }
});
