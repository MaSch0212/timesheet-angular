import { Locator, Page } from '@playwright/test';

export class TimeSheetPage {
  public readonly locator: Locator;

  constructor(page: Page) {
    this.locator = page.locator('masch-time-sheet');
  }
}
