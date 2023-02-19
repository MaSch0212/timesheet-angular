import { Locator, Page } from '@playwright/test';

export class MatInputControl {
  public readonly input: Locator;

  constructor(public readonly locator: Locator) {
    this.input = locator.locator('input');
    this.input.type;
  }

  public clear(): Promise<void> {
    return this.input.clear();
  }

  public type(text: string): Promise<void> {
    return this.input.type(text);
  }

  public inputValue(): Promise<string> {
    return this.input.inputValue();
  }

  public async setInputValue(text: string): Promise<void> {
    await this.input.clear();
    await this.input.type(text);
  }
}
