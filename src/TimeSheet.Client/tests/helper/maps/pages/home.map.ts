import { Page } from '@playwright/test';
import { LoginView } from './home/login.map';

export class HomePage {
  public readonly login: LoginView;

  constructor(private readonly page: Page) {
    this.login = new LoginView(page);
  }
}
