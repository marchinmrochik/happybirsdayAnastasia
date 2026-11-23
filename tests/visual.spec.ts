import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('capture readable greeting screens with settled fonts', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const directory = '.local/qa';
  await mkdir(directory, { recursive: true });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${directory}/${info.project.name}-cover.png`, fullPage: true });
  await page.getByRole('button', { name: /Начать поздравление/ }).click();
  for (const i of [1, 3, 5]) {
    await page.getByRole('button', { name: `Открыть подарок ${i}`, exact: true }).click();
    await expect(page.locator(`.revealed[data-gift="${i - 1}"]`)).toBeVisible();
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${directory}/${info.project.name}-lottery.png`, fullPage: true });
  await page.getByRole('button', { name: /Перейти далее/ }).click();
  await page.screenshot({ path: `${directory}/${info.project.name}-letter.png` });
  await page.getByRole('button', { name: /Перейти далее/ }).click();
  await page.screenshot({ path: `${directory}/${info.project.name}-video.png`, fullPage: true });
});
