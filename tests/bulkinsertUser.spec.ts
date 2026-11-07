import * as fs from 'fs';
import * as path from 'path';
import {  test } from '@playwright/test';
import { BulkInsertUserPage,TableUser} from '../pages/BulkInsertUserPage';

function loadUsersFromCsv(): TableUser[] {
  const csvPath = path.join(process.cwd(), 'data', 'users.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');

  return content
    .split(/\r?\n/)
    .slice(1)
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [firstName, lastName, email, age, salary, department] = line.split(',');
      return { firstName, lastName, email, age, salary, department };
    });
}

test.describe('Web Tables - Bulk Insert User', () => {
  const users = loadUsersFromCsv();

  test('should add multiple users from CSV and verify all appear in the table', async ({
    page,
  }) => {
    const bulkInsertUserPage = new BulkInsertUserPage(page);
    await bulkInsertUserPage.goto();

    for (const user of users) {
      await test.step(`Add user ${user.firstName} ${user.lastName}`, async () => {
        await bulkInsertUserPage.addUser(user);
      });
    }

    for (const user of users) {
      await test.step(`Verify user ${user.email} exists in table`, async () => {
        await bulkInsertUserPage.expectUserInTable(user);
      });
    }
  });
});
