import { expect, test } from '@playwright/test';
import { projects } from '../src/data/projects';
import { pageUrl } from './routes';

test('should switch language and keep the current page', async ({ page }) => {
  await page.goto(pageUrl('en', '/resume'));
  await page.getByRole('link', { name: /Đọc bằng tiếng Việt/ }).click();

  await expect(page).toHaveURL(/\/vi\/resume\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
  await expect(page.locator('h1')).toHaveText('Kinh nghiệm và dự án.');

  await page.getByRole('link', { name: /Read in English/ }).click();
  await expect(page).toHaveURL(/(?<!\/vi)\/resume\/$/);
});

test('should filter projects and open a case study', async ({ page }) => {
  await page.goto(pageUrl('en', '/portfolio'));
  await page.getByRole('button', { name: 'Realtime' }).click();

  const realtime = projects.filter((project) => project.category === 'realtime');
  await expect(page.locator('article')).toHaveCount(realtime.length);

  const first = realtime[0];
  if (!first) throw new Error('expected at least one realtime project');
  await page.getByRole('link', { name: `Read the ${first.title} case study` }).click();

  await expect(page).toHaveURL(new RegExp(`/portfolio/${first.slug}/$`));
  await expect(page.locator('h1')).toHaveText(first.title);
  // Nav menus can be hidden on mobile, so query by attribute rather than accessible role.
  await expect(page.locator('header a[aria-current="page"]').first()).toHaveText('02 // projects');
});

test('should move between case studies with the pager', async ({ page }) => {
  const [first, second] = projects;
  if (!first || !second) throw new Error('expected at least two projects');
  await page.goto(pageUrl('en', `/portfolio/${first.slug}`));
  await page.getByRole('navigation', { name: 'More projects' }).getByRole('link').last().click();
  await expect(page.locator('h1')).toHaveText(second.title);
});

test('should download the CV as a PDF', async ({ page, request }) => {
  await page.goto(pageUrl('en', '/resume'));
  const href = await page.getByRole('link', { name: 'Download CV as PDF' }).getAttribute('href');
  const response = await request.get(new URL(href ?? '', page.url()).toString());
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('application/pdf');
});

test('should validate the contact form before handing off to the mail app', async ({ page }) => {
  await page.goto(pageUrl('vi', '/contact'));
  await page.getByRole('button', { name: 'Gửi tin nhắn' }).click();

  const form = page.locator('form');
  await expect(form.getByRole('alert')).toHaveText('Vui lòng điền đầy đủ các trường.');
  await expect(page.getByLabel('Họ tên')).toBeFocused();
});

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'hamburger only exists below 900px');

  test('should open, trap scroll, close on Escape and navigate', async ({ page }) => {
    await page.goto('./');
    const toggle = page.getByRole('button', { name: 'Toggle menu' });
    const menu = page.locator('#mobile-menu');

    await toggle.click();
    await expect(menu).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();

    await toggle.click();
    await menu.getByRole('link', { name: '01 // about' }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(menu).toBeHidden();
  });
});
