import { BrowserContext, Page, Route } from '@playwright/test';
import { TimeSheetEntry } from 'helper/models/time-sheet-entry.model';
import { RouteResponseCallback } from 'playwright-easy-network-stub';
import { BaseStub } from './base.stub';

export class EntriesStub extends BaseStub {
  constructor(context?: BrowserContext | Page) {
    super(/\/api\/entries/, context);
  }

  public stubGetEntries(callback?: RouteResponseCallback<'?{skip?:number}{take?:number}{desc?:boolean}', undefined>) {
    return this.stub('GET', '?{skip?:number}{take?:number}{desc?:boolean}', callback);
  }

  public stubGetOvertime(callback?: RouteResponseCallback<'overtime', undefined>): EntriesStub {
    return this.stub('GET', 'overtime', callback);
  }

  public stubCheckIn(callback?: RouteResponseCallback<'checkin', undefined>): EntriesStub {
    return this.stub('POST', 'checkin', callback);
  }

  public stubCheckOut(callback?: RouteResponseCallback<'checkout', undefined>): EntriesStub {
    return this.stub('POST', 'checkout', callback);
  }

  public stubPostAction(callback?: RouteResponseCallback<'action?{status:string}', undefined>): EntriesStub {
    return this.stub('POST', 'action?{status:string}', callback);
  }

  public stubDeleteEntry(callback?: RouteResponseCallback<'delete?{id:number}', undefined>): EntriesStub {
    return this.stub('POST', 'delete?{id:number}', callback);
  }

  public stubAddEntry(callback?: RouteResponseCallback<'add', TimeSheetEntry>): EntriesStub {
    return this.stub('POST', 'add', callback);
  }

  public stubEditEntry(callback?: RouteResponseCallback<'edit', TimeSheetEntry>): EntriesStub {
    return this.stub('POST', 'edit', callback);
  }
}
