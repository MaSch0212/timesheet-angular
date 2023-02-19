import { Locator, Page } from '@playwright/test';

export class TimeSheetPage {
  public readonly locator: Locator;

  constructor(private readonly page: Page) {
    this.locator = page.locator('masch-time-sheet');
  }
}
