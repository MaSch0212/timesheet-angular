import { Locator, Page } from '@playwright/test';
import { MatInputControl } from '../../controls/mat-input.map';

export interface RegisterData {
  givenName?: string;
  surname?: string;
  email?: string;
  username?: string;
  password?: string;
  passwordRepeat?: string;
}

export class RegisterView {
  public readonly locator: Locator;

  public readonly givenName: MatInputControl;
  public readonly surname: MatInputControl;
  public readonly email: MatInputControl;
  public readonly username: MatInputControl;
  public readonly password: MatInputControl;
  public readonly passwordRepeat: MatInputControl;
  public readonly registerButton: Locator;

  public readonly registerFailedError: Locator;
  public readonly missingFieldsError: Locator;

  constructor(page: Page) {
    this.locator = page.locator('masch-register');

    this.givenName = new MatInputControl(this.locator.locator('#givenName'));
    this.surname = new MatInputControl(this.locator.locator('#surname'));
    this.email = new MatInputControl(this.locator.locator('#email'));
    this.username = new MatInputControl(this.locator.locator('#username'));
    this.password = new MatInputControl(this.locator.locator('#password'));
    this.passwordRepeat = new MatInputControl(this.locator.locator('#passwordRepeat'));
    this.registerButton = this.locator.locator('#registerButton');

    this.registerFailedError = this.locator.locator('#registerFailedError');
    this.missingFieldsError = this.locator.locator('#missingFieldsError');
  }

  public async fillInData(registerData: RegisterData): Promise<void> {
    if (registerData.givenName !== undefined) {
      await this.givenName.setInputValue(registerData.givenName);
    }
    if (registerData.surname !== undefined) {
      await this.surname.setInputValue(registerData.surname);
    }
    if (registerData.email !== undefined) {
      await this.email.setInputValue(registerData.email);
    }
    if (registerData.username !== undefined) {
      await this.username.setInputValue(registerData.username);
    }
    if (registerData.password !== undefined) {
      await this.password.setInputValue(registerData.password);
    }
    if (registerData.passwordRepeat !== undefined) {
      await this.passwordRepeat.setInputValue(registerData.passwordRepeat);
    }
  }

  public async register(registerData: RegisterData): Promise<void> {
    await this.fillInData(registerData);
    await this.registerButton.click();
  }
}
