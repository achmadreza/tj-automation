import { expect, type Page } from '@playwright/test';
import { registrationFormLocators as loc } from '../locators/registrationForm.locators';

export interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  dateOfBirth: string;
  subjects: string[];
  hobbies: string[];
  address: string;
  state: string;
  city: string;
}

const GENDER_RADIOS: Record<StudentData['gender'], string> = {
  Male: loc.genderRadioMale,
  Female: loc.genderRadioFemale,
  Other: loc.genderRadioOther,
};

export class RegistrationFormPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/automation-practice-form');
    await expect(this.page.locator(loc.firstNameInput)).toBeVisible();
  }

  async fillPersonalInfo(data: StudentData): Promise<void> {
    await this.page.locator(loc.firstNameInput).fill(data.firstName);
    await this.page.locator(loc.lastNameInput).fill(data.lastName);
    await this.page.locator(loc.userEmailInput).fill(data.email);
    await this.page.locator(GENDER_RADIOS[data.gender]).check({ force: true });
    await this.page.locator(loc.userNumberInput).fill(data.phone);
  }

  async setDateOfBirth(date: string): Promise<void> {
    const input = this.page.locator(loc.dateOfBirthInput);
    await input.click();
    await input.fill(date);
    await input.press('Tab');
  }

  async selectSubjects(subjects: string[]): Promise<void> {
    for (const subject of subjects) {
      await this.page.locator(loc.subjectsInput).pressSequentially(subject, { delay: 40 });
      await this.page
        .locator(loc.subjectsOption)
        .filter({ hasText: subject })
        .first()
        .click();
    }
  }

  async selectHobbies(hobbies: string[]): Promise<void> {
    for (const hobby of hobbies) {
      await this.page
        .locator(loc.hobbiesWrapper)
        .getByText(hobby, { exact: true })
        .click();
    }
  }

  async fillAddressAndUpload(data: StudentData): Promise<void> {
    await this.page.locator(loc.currentAddressTextarea).fill(data.address);
    await this.page.locator(loc.uploadPictureInput).setInputFiles({
      name: 'student-photo.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64',
      ),
    });
  }

  async selectState(state: string): Promise<void> {
    await this.page.locator(loc.stateDropdown).click();
    await this.page.getByRole('option', { name: state, exact: true }).click();
  }

  async selectCity(city: string): Promise<void> {
    await this.page.locator(loc.cityDropdown).click();
    await this.page.getByRole('option', { name: city, exact: true }).click();
  }

  async submitForm(): Promise<void> {
    await this.page.locator(loc.submitButton).click();
  }

  async fillForm(data: StudentData): Promise<void> {
    await this.fillPersonalInfo(data);
    await this.setDateOfBirth(data.dateOfBirth);
    await this.selectSubjects(data.subjects);
    await this.selectHobbies(data.hobbies);
    await this.fillAddressAndUpload(data);
    await this.selectState(data.state);
    await this.selectCity(data.city);
    await this.submitForm();
  }

  async expectConfirmationModal(): Promise<void> {
    await expect(this.page.locator(loc.confirmationModal)).toBeVisible();
    await expect(this.page.locator(loc.confirmationTitle)).toHaveText(
      'Thanks for submitting the form',
    );
  }

  async expectConfirmationField(field: string, value: string): Promise<void> {
    const row = this.page
      .locator(loc.confirmationModal)
      .getByRole('row')
      .filter({ hasText: field })
      .first();
    await expect(row).toContainText(value);
  }
}
