import { BrowserContext, Page } from '@playwright/test';
import { User } from 'helper/models/user.model';
import { RouteResponseCallback } from 'playwright-easy-network-stub';
import { BaseStub } from './base.stub';

export class UserStub extends BaseStub {
  constructor(context?: BrowserContext | Page) {
    super(/\/api\/user\//, context);
  }

  public stubGetUserInfo(callback?: RouteResponseCallback<'', undefined>): UserStub {
    return this.stub('GET', '', callback);
  }

  public stubEditUserInfo(callback?: RouteResponseCallback<'edit', User>): UserStub {
    return this.stub2()('POST', 'edit', callback);
  }
}
