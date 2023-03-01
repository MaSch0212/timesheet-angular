import { BrowserContext, Page } from '@playwright/test';
import { ChangePasswordRequest } from 'helper/models/change-password-request.model';
import { LoginRequest } from 'helper/models/login-request.model';
import { RegisterRequest } from 'helper/models/register-request.model';
import { RouteResponseCallback } from 'playwright-easy-network-stub';
import { BaseStub } from './base.stub';

export class AuthApiStub extends BaseStub {
  constructor(context?: BrowserContext | Page) {
    super(/\/api\/auth/, context);
  }

  public stubLogin(callback?: RouteResponseCallback<'login', LoginRequest>): AuthApiStub {
    return this.stub2<LoginRequest>()('POST', 'login', callback);
  }

  public stubCheck(callback?: RouteResponseCallback<'check', undefined>): AuthApiStub {
    return this.stub('GET', 'check', callback);
  }

  public stubRegister(callback?: RouteResponseCallback<'register', RegisterRequest>): AuthApiStub {
    return this.stub2<RegisterRequest>()('POST', 'register', callback);
  }

  public stubChangePassword(callback?: RouteResponseCallback<'changepassword', ChangePasswordRequest>): AuthApiStub {
    return this.stub2<ChangePasswordRequest>()('POST', 'changepassword', callback);
  }
}
