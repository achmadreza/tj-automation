import { expect, type Page } from '@playwright/test';
import { droppableLocators as loc } from '../locators/droppable.locators';

export class DroppablePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/droppable');
    await expect(this.page.locator(loc.draggableBox)).toBeVisible();
    await expect(this.page.locator(loc.droppableArea)).toBeVisible();
  }

  async dragBoxToTarget(): Promise<void> {
    const source = this.page.locator(loc.draggableBox);
    const target = this.page.locator(loc.droppableArea);

    await source.scrollIntoViewIfNeeded();
    await target.scrollIntoViewIfNeeded();

    await source.dragTo(target, { targetPosition: { x: 20, y: 20 } });
  }

  async dragBoxToTargetWithRetry(maxAttempts = 3): Promise<void> {
    const target = this.page.locator(loc.droppableArea);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.dragBoxToTarget();
      await this.page.waitForTimeout(300);
      if ((await target.textContent())?.includes('Dropped!')) {
        return;
      }
    }
  }

  async expectDropped(): Promise<void> {
    await expect(this.page.locator(loc.droppableArea)).toContainText('Dropped!');
  }
}
