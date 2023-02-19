import { BrowserContext, Page } from '@playwright/test';
import { PlaywrightEasyNetworkStub, RouteResponseCallback } from 'playwright-easy-network-stub';

export interface LoginRequest {
  username: string;
  password: string;
  stayLoggedIn: boolean;
}

export interface LoginResponse {
  isSuccess: boolean;
  token: string;
}

export class AuthApiStub {
  private readonly _stub: PlaywrightEasyNetworkStub;

  private constructor() {
    this._stub = new PlaywrightEasyNetworkStub(/\/api\/auth/);
  }

  public stubLogin(callback: RouteResponseCallback<'login', LoginRequest>): AuthApiStub {
    this._stub.stub2<LoginRequest>()('POST', 'login', callback);
    return this;
  }

  public stubCheck(callback: RouteResponseCallback<'check', undefined>): AuthApiStub {
    this._stub.stub('GET', 'check', callback);
    return this;
  }

  public static init(context: BrowserContext | Page): AuthApiStub {
    const stub = new AuthApiStub();
    stub._stub.init((context as any).context?.() || context);
    return stub;
  }
}
