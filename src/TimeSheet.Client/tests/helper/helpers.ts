import { BrowserContext, Page } from '@playwright/test';

export const getContext = (context: BrowserContext | Page): BrowserContext => {
  return (context as any).context?.() || context;
};
