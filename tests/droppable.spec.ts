import { test } from '@playwright/test';
import { DroppablePage } from '../pages/DroppablePage';

test.describe('Droppable - Drag and Drop', () => {
  test('should drag the box into the droppable area', async ({ page }) => {
    const droppablePage = new DroppablePage(page);

    await droppablePage.goto();
    await droppablePage.dragBoxToTargetWithRetry();
    await droppablePage.expectDropped();
  });
});
