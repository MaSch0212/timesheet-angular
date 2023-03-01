import { Page } from '@playwright/test';
import { LoginView } from './home/login.map';
import { RegisterView } from './home/register.map';

export class HomePage {
  public readonly login: LoginView;
  public readonly register: RegisterView;

  constructor(page: Page) {
    this.login = new LoginView(page);
    this.register = new RegisterView(page);
  }
}
