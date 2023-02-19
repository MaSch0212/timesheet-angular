import { Locator } from '@playwright/test';

export class MatCheckboxControl {
  public readonly input: Locator;

  constructor(public readonly locator: Locator) {
    this.input = locator.locator('input');
  }

  public check(): Promise<void> {
    return this.input.check();
  }

  public isChecked(): Promise<boolean> {
    return this.input.isChecked();
  }

  public setChecked(checked: boolean): Promise<void> {
    return this.input.setChecked(checked);
  }

  public uncheck(): Promise<void> {
    return this.input.uncheck();
  }
}
