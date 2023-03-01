import { BrowserContext, Page } from '@playwright/test';
import { Settings } from 'helper/models/settings.model';
import { RouteResponseCallback } from 'playwright-easy-network-stub';
import { BaseStub } from './base.stub';

export class SettingsStub extends BaseStub {
  constructor(context?: BrowserContext | Page) {
    super(/\/api\/settings/, context);
  }

  public stubGetSettings(callback?: RouteResponseCallback<'', undefined>): SettingsStub {
    return this.stub('GET', '', callback);
  }

  public stubUpdateSettings(callback?: RouteResponseCallback<'edit', Settings>): SettingsStub {
    return this.stub2()('POST', 'edit', callback);
  }

  public stubCreateApiKey(callback?: RouteResponseCallback<'createapikey', string>): SettingsStub {
    return this.stub2()('POST', 'createapikey', callback);
  }

  public stubDeleteApiKey(callback?: RouteResponseCallback<'deleteapikey', number>): SettingsStub {
    return this.stub2()('POST', 'deleteapikey', callback);
  }
}
