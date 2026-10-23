import { expect, test } from '@playwright/test';

test('game boots with a canvas and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('./');

  const canvas = page.locator('#game canvas');
  await expect(canvas).toBeVisible();

  // Give the Preload and Game scenes time to fetch the map and tileset,
  // so a missing asset or a crash on level build shows up as an error.
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  expect(errors).toEqual([]);
});
