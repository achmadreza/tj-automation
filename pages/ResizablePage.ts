import { expect, type Page } from '@playwright/test';
import { resizableLocators as loc } from '../locators/resizable.locators';

export class ResizablePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/resizable');
    await expect(this.page.locator(loc.resizableBox)).toBeVisible();
  }

  async resizeTo(width: number, height: number): Promise<void> {
    const container = this.page.locator(loc.resizableBox);
    const handle = this.page.locator(loc.resizeHandle);

    await container.evaluate((el) =>
      el.scrollIntoView({ block: 'center', inline: 'center' }),
    );
    await this.page.waitForTimeout(200);

    const containerBox = await container.boundingBox();
    const handleBox = await handle.boundingBox();
    if (!containerBox || !handleBox) {
      throw new Error('Resizable container or handle is not visible');
    }

    const deltaX = width - containerBox.width;
    const deltaY = height - containerBox.height;

    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(startX + deltaX, startY + deltaY, { steps: 15 });
    await this.page.mouse.up();
  }

  async expectSize(width: number, height: number, tolerance = 3): Promise<void> {
    const box = await this.page.locator(loc.resizableBox).boundingBox();
    if (!box) {
      throw new Error('Resizable container is not visible');
    }

    expect(
      Math.abs(box.width - width),
      `Container width should be ${width}px, got ${box.width}px`,
    ).toBeLessThanOrEqual(tolerance);
    expect(
      Math.abs(box.height - height),
      `Container height should be ${height}px, got ${box.height}px`,
    ).toBeLessThanOrEqual(tolerance);
  }
}
