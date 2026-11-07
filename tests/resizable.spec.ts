import { test } from '@playwright/test';
import { ResizablePage } from '../pages/ResizablePage';

test.describe('Resizable - Resize Element', () => {
  test('should resize the element to 400x200 pixels', async ({ page }) => {
    const resizablePage = new ResizablePage(page);

    await resizablePage.goto();
    await resizablePage.resizeTo(400, 200);
    await resizablePage.expectSize(400, 200);
  });
});
