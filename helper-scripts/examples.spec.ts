import { expect, test } from '@playwright/test';
import examples from '../webpack.example-list';

const RENDER_TIME_MS = 3000;

for (const { name } of examples) {
    test(`example "${name}" renders without errors`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') errors.push(message.text());
        });

        await page.goto(`/${name}.html`);
        const canvas = page.locator('#aisa-canvas');
        await expect(canvas).toBeVisible({ timeout: 30_000 });
        await page.waitForTimeout(RENDER_TIME_MS);

        await canvas.screenshot({ path: `test-results/screenshots/${name}.png` });
        expect(errors, errors.join('\n')).toEqual([]);
    });
}