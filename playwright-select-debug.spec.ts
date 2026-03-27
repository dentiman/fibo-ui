import { expect, test } from 'playwright/test';

test('debug select overlay', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => logs.push(`pageerror: ${err.message}`));

  await page.goto('http://127.0.0.1:4200/playground', { waitUntil: 'networkidle' });
  await page.getByRole('combobox').first().click();
  await page.waitForTimeout(1000);

  const state = await page.evaluate(() => ({
    overlays: document.querySelectorAll('[data-overlay-container-id]').length,
    listboxes: document.querySelectorAll('[role="listbox"]').length,
    popovers: document.querySelectorAll('.popover-container').length,
    bodyText: document.body.innerText.slice(0, 500),
  }));

  console.log(JSON.stringify({ state, logs }, null, 2));
  expect(state.overlays).toBeGreaterThan(0);
});
