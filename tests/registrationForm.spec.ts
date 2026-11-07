import * as fs from 'fs';
import * as path from 'path';
import { test } from '@playwright/test';
import {
  RegistrationFormPage,
  type StudentData,
} from '../pages/RegistrationFormPage';

function loadStudentData(): StudentData {
  const dataPath = path.join(process.cwd(), 'data', 'student.json');
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as StudentData;
}

function formatDateOfBirthForPopup(date: string): string {
  const months: Record<string, string> = {
    Jan: 'January',
    Feb: 'February',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December',
  };
  return date.replace(/\b(\w{3})\b/, (abbr) => months[abbr] ?? abbr).replace(/ (\d{4})$/, ',$1');
}

test.describe('Student Registration Form', () => {
  test('should fill and submit the form and verify the confirmation popup', async ({
    page,
  }) => {
    const student = loadStudentData();
    const formPage = new RegistrationFormPage(page);

    await formPage.goto();
    await formPage.fillForm(student);

    await formPage.expectConfirmationModal();
    await formPage.expectConfirmationField(
      'Student Name',
      `${student.firstName} ${student.lastName}`,
    );
    await formPage.expectConfirmationField('Student Email', student.email);
    await formPage.expectConfirmationField('Gender', student.gender);
    await formPage.expectConfirmationField('Mobile', student.phone);
    await formPage.expectConfirmationField(
      'Date of Birth',
      formatDateOfBirthForPopup(student.dateOfBirth),
    );
    await formPage.expectConfirmationField('Subjects', student.subjects.join(', '));
    await formPage.expectConfirmationField('Hobbies', student.hobbies.join(', '));
    await formPage.expectConfirmationField(
      'State and City',
      `${student.state} ${student.city}`,
    );
    await formPage.expectConfirmationField('Address', student.address);
  });
});
