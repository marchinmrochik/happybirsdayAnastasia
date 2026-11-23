import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function start(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Начать поздравление/ }).click();
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))); });
}

test('opening does not dim other gifts or move cells and locked SVGs stay sized', async ({ page }, info) => {
  await start(page);
  const positions = () => page.locator('.gift').evaluateAll(cells => cells.map(cell => {
    const rect = cell.getBoundingClientRect();
    return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height };
  }));
  const original = await positions();
  const untouched = page.locator('[data-gift="0"]');
  const opacity = await untouched.evaluate(el => getComputedStyle(el).opacity);
  for (const [count, index] of [4, 1, 3].entries()) {
    const button = page.getByRole('button', { name: `Открыть подарок ${index + 1}`, exact: true });
    await button.scrollIntoViewIfNeeded();
    const scroll = await page.evaluate(() => scrollY);
    await button.click();
    if (count === 0) expect.soft(await untouched.evaluate(el => getComputedStyle(el).opacity)).toBe(opacity);
    await expect(page.locator('.revealed')).toHaveCount(count + 1);
    const current = await positions();
    for (let i = 0; i < 6; i++) {
      expect(current[i].x).toBeCloseTo(original[i].x, 0);
      expect(current[i].y).toBeCloseTo(original[i].y, 0);
      expect(current[i].height).toBeCloseTo(original[i].height, 0);
    }
    expect(Math.abs(await page.evaluate(() => scrollY) - scroll)).toBeLessThan(3);
  }
  const locked = page.locator('.gift.closed:disabled');
  await expect(locked).toHaveCount(3);
  for (const art of await locked.locator('svg').all()) {
    const rect = await art.boundingBox();
    expect(rect!.width).toBeGreaterThan(90);
    expect(rect!.height).toBeGreaterThan(90);
  }
  await mkdir('.local/qa', { recursive: true });
  await page.locator('.gifts-grid').screenshot({ path: `.local/qa/${info.project.name}-stable-gifts.png` });
});

test('garland stays above the text and scrolls away with the page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 640 });
  await start(page);
  const bunting = page.locator('.bunting');
  const initial = await bunting.boundingBox();
  const heading = await page.locator('.section-heading').boundingBox();
  expect(initial!.y + initial!.height).toBeLessThanOrEqual(heading!.y);
  await page.evaluate(() => window.scrollTo(0, 200));
  const scrolled = await bunting.boundingBox();
  const scroll = await page.evaluate(() => scrollY);
  expect(scrolled!.y).toBeCloseTo(initial!.y - scroll, 0);
});


