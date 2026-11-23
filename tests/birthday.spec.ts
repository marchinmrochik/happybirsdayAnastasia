import { test, expect, type Page } from '@playwright/test';

async function start(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Начать поздравление/ }).click();
  await expect(page.getByRole('heading', { name: 'Лотерея на пожелания' })).toBeVisible();
}
async function chooseThree(page: Page) {
  await start(page);
  for (const i of [1, 3, 5]) {
    await page.getByRole('button', { name: `Открыть подарок ${i}`, exact: true }).click();
    await expect(page.locator(`.revealed[data-gift="${i - 1}"]`)).toBeVisible();
  }
}

test('complete greeting: three gifts, full letter, real video and final', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await chooseThree(page);
  await expect(page.locator('.revealed')).toHaveCount(3);
  await expect(page.locator('.gift.closed:disabled')).toHaveCount(3);
  const wishes = await page.locator('.wish-paper strong').allTextContents();
  expect(new Set(wishes).size).toBe(3);
  await page.getByRole('button', { name: /Перейти далее/ }).click();
  await expect(page.locator('.letter-paper p')).toHaveCount(16);
  await expect(page.getByText(/А какое же забавное было наше знакомство/)).toBeVisible();
  await expect(page.getByText(/P.S. Рома и Максим/)).toBeVisible();
  await page.getByRole('button', { name: /Перейти далее/ }).click();
  await page.getByRole('button', { name: 'Включить поздравительное видео' }).click();
  await expect(page.locator('#video-error')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'С днём рождения!' })).toBeVisible({ timeout: 20000 });
  await page.getByRole('button', { name: 'Мои пожелания' }).click();
  await expect(page.locator('.wish-paper strong')).toHaveText(wishes);
  expect(errors).toEqual([]);
});

test('partial and completed selections survive reload; fourth gift is locked', async ({ page }) => {
  await start(page);
  await expect(page.locator('#lottery-next')).toBeHidden();
  await page.getByRole('button', { name: 'Открыть подарок 2', exact: true }).click();
  await expect(page.locator('.revealed')).toHaveCount(1);
  const savedWish = await page.locator('.wish-paper strong').textContent();
  await page.reload();
  await page.getByRole('button', { name: /Начать поздравление/ }).click();
  await expect(page.locator('.wish-paper strong')).toHaveText(savedWish!);
  for (const i of [4, 6]) {
    await page.getByRole('button', { name: `Открыть подарок ${i}`, exact: true }).click();
    await expect(page.locator('#counter')).toHaveText(`Открыто ${i === 4 ? 2 : 3} из 3`);
  }
  await page.reload();
  await page.getByRole('button', { name: /Начать поздравление/ }).click();
  await expect(page.locator('.revealed')).toHaveCount(3);
  await expect(page.locator('.gift.closed:disabled')).toHaveCount(3);
  await expect(page.locator('#lottery-next')).toBeVisible();
});

test('rapid clicks and reload during animation cannot reroll or exceed three gifts', async ({ page }) => {
  await start(page);
  await page.locator('.gift.closed').evaluateAll(buttons => buttons.forEach(b => (b as HTMLButtonElement).click()));
  await page.reload();
  await page.getByRole('button', { name: /Начать поздравление/ }).click();
  await expect(page.locator('.revealed')).toHaveCount(1);
  await expect(page.locator('#counter')).toHaveText('Открыто 1 из 3');
});

test('unavailable storage and damaged saved data do not break the greeting', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
  });
  await chooseThree(page);
  await expect(page.locator('.storage-note')).toBeVisible();
  await expect(page.locator('#lottery-next')).toBeVisible();
});

test('invalid persisted state is replaced by a valid lottery', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('anastasia-birthday:v1', JSON.stringify({ version: 1, order: [0, 0, 0, 0, 0, 0], opened: [99] })));
  await page.reload();
  await page.getByRole('button', { name: /Начать поздравление/ }).click();
  await expect(page.locator('.revealed')).toHaveCount(0);
  await expect(page.locator('.gift.closed:enabled')).toHaveCount(6);
});

test('small and landscape screens scroll without horizontal overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await chooseThree(page);
  for (const viewport of [{ width: 320, height: 568 }, { width: 844, height: 390 }, { width: 1024, height: 768 }]) {
    await page.setViewportSize(viewport);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  await page.getByRole('button', { name: /Перейти далее/ }).click();
  await page.setViewportSize({ width: 320, height: 568 });
  await page.evaluate(() => { document.documentElement.style.fontSize = '125%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole('button', { name: /Перейти далее/ }).click();
  await expect(page.locator('video')).toBeVisible();
});

test('video error offers retry and a direct link', async ({ page }) => {
  await page.route('**/media/birthday-video.mp4', route => route.abort());
  await chooseThree(page);
  await page.getByRole('button', { name: /Перейти далее/ }).click();
  await page.getByRole('button', { name: /Перейти далее/ }).click();
  await expect(page.locator('#video-error')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Открыть видео' })).toHaveAttribute('href', './media/birthday-video.mp4');
  await page.unroute('**/media/birthday-video.mp4');
  await page.getByRole('button', { name: 'Попробовать ещё раз' }).click();
  await page.getByRole('button', { name: 'Включить поздравительное видео' }).click();
  await expect(page.getByRole('heading', { name: 'С днём рождения!' })).toBeVisible({ timeout: 20000 });
});
