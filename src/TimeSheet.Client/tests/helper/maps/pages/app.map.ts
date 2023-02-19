import { Locator, Page } from '@playwright/test';

export class AppPage {
  public readonly locator: Locator;
  public readonly timeSheetMenuItem: Locator;
  public readonly settingsMenuItem: Locator;
  public readonly logoffMenuItem: Locator;

  constructor(private readonly page: Page) {
    this.locator = page.locator('masch-root');

    this.timeSheetMenuItem = this.locator.locator('#timeSheetMenuItem');
    this.settingsMenuItem = this.locator.locator('#settingsMenuItem');
    this.logoffMenuItem = this.locator.locator('#logoffMenuItem');
  }
}
