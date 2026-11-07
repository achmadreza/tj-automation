import { expect, type Locator, type Page } from '@playwright/test';
import { webTablesLocators as loc } from '../locators/insertUser.locators';

export interface TableUser {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

export class BulkInsertUserPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/webtables');
    await expect(this.page.locator(loc.addButton)).toBeVisible();
  }

  async openAddUserForm(): Promise<void> {
    await this.page.locator(loc.addButton).click();
    await expect(this.page.locator(loc.firstNameInput)).toBeVisible();
  }

  async fillUserForm(user: TableUser): Promise<void> {
    await this.page.locator(loc.firstNameInput).fill(user.firstName);
    await this.page.locator(loc.lastNameInput).fill(user.lastName);
    await this.page.locator(loc.userEmailInput).fill(user.email);
    await this.page.locator(loc.ageInput).fill(user.age);
    await this.page.locator(loc.salaryInput).fill(user.salary);
    await this.page.locator(loc.departmentInput).fill(user.department);
  }

  async submitUserForm(): Promise<void> {
    await this.page.locator(loc.submitButton).click();
    await expect(this.page.locator(loc.modalDialog)).toBeHidden();
  }

  async addUser(user: TableUser): Promise<void> {
    await this.openAddUserForm();
    await this.fillUserForm(user);
    await this.submitUserForm();
  }

  async searchUser(query: string): Promise<void> {
    await this.page.locator(loc.searchBox).fill(query);
  }

  async clearSearch(): Promise<void> {
    await this.page.locator(loc.searchBox).fill('');
  }

  userRow(email: string): Locator {
    return this.page
      .locator(loc.tableBodyRow)
      .filter({ has: this.page.locator(loc.tableCell, { hasText: email }) });
  }

  async expectUserInTable(user: TableUser): Promise<void> {
    await this.searchUser(user.email);

    const rows = this.page.locator(loc.tableBodyRow);
    await expect(rows).toHaveCount(1);

    const cells = rows.first().locator(loc.tableCell);
    await expect(cells.nth(0)).toHaveText(user.firstName);
    await expect(cells.nth(1)).toHaveText(user.lastName);
    await expect(cells.nth(2)).toHaveText(user.age);
    await expect(cells.nth(3)).toHaveText(user.email);
    await expect(cells.nth(4)).toHaveText(user.salary);
    await expect(cells.nth(5)).toHaveText(user.department);

    await this.clearSearch();
  }
}


