import { Locator, Page } from '@playwright/test';
import { MatCheckboxControl } from '../../controls/mat-checkbox.map';
import { MatInputControl } from '../../controls/mat-input.map';

export class LoginView {
  public readonly locator: Locator;
  public readonly username: MatInputControl;
  public readonly password: MatInputControl;
  public readonly rememberUsername: MatCheckboxControl;
  public readonly stayLoggedIn: MatCheckboxControl;
  public readonly loginButton: Locator;

  public readonly loginFailedError: Locator;
  public readonly missingFieldsError: Locator;

  constructor(page: Page) {
    this.locator = page.locator('masch-login');

    this.username = new MatInputControl(this.locator.locator('#username'));
    this.password = new MatInputControl(this.locator.locator('#password'));
    this.rememberUsername = new MatCheckboxControl(this.locator.locator('#rememberUsername'));
    this.stayLoggedIn = new MatCheckboxControl(this.locator.locator('#stayLoggedIn'));
    this.loginButton = this.locator.locator('#loginButton');

    this.loginFailedError = this.locator.locator('#loginFailedError');
    this.missingFieldsError = this.locator.locator('#missingFieldsError');
  }

  public async login(username: string, password: string, options?: { rememberUsername?: boolean; stayLoggedIn?: boolean }) {
    await this.username.setInputValue(username);
    await this.password.setInputValue(password);
    if (options?.rememberUsername !== undefined) {
      await this.rememberUsername.setChecked(options.rememberUsername);
    }
    if (options?.stayLoggedIn !== undefined) {
      await this.stayLoggedIn.setChecked(options.stayLoggedIn);
    }
    await this.loginButton.click();
  }
}
