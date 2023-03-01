import { BrowserContext, Page } from '@playwright/test';
import { getContext } from '../helpers';
import { HttpMethod, PlaywrightEasyNetworkStub, RouteResponseCallback } from 'playwright-easy-network-stub';

export abstract class BaseStub {
  private readonly _stub: PlaywrightEasyNetworkStub;
  private readonly _context?: BrowserContext;
  private isStubInitialized = false;

  constructor(urlMatch: RegExp | string, context?: BrowserContext | Page) {
    this._stub = new PlaywrightEasyNetworkStub(urlMatch);
    this._context = context ? getContext(context) : undefined;
  }

  protected stub<Route extends string>(method: HttpMethod, route: Route, response?: RouteResponseCallback<Route, any>): this {
    this.ensureStubInitialized();
    this._stub.stub(method, route, response || (() => {}));
    return this;
  }

  protected stub2<T>(): <Route extends string>(method: HttpMethod, route: Route, response?: RouteResponseCallback<Route, T>) => this {
    return <Route extends string>(method: HttpMethod, route: Route, response?: RouteResponseCallback<Route, T>) => {
      this.ensureStubInitialized();
      this._stub.stub2()(method, route, response || (() => {}));
      return this;
    };
  }

  public init(context: BrowserContext | Page): this {
    this._stub.init(getContext(context));
    return this;
  }

  private ensureStubInitialized(): void {
    if (!this.isStubInitialized) {
      if (!this._context) {
        throw new Error('This stub has no context. Either initialize this class with a context for execute the "init" method.');
      }
      this._stub.init(this._context);
      this.isStubInitialized = true;
    }
  }
}
