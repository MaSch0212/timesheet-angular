import { BrowserContext, Page } from '@playwright/test';
import { getContext } from '../helpers';
import { AuthApiStub as AuthStub } from './auth.stub';
import { EntriesStub } from './entries.stub';
import { SettingsStub } from './settings.stub';
import { UserStub } from './user.stub';

export class TimeSheetStub {
  private readonly _context: BrowserContext;
  private _auth?: AuthStub;
  private _entries?: EntriesStub;
  private _settings?: SettingsStub;
  private _user?: UserStub;

  private constructor(context: BrowserContext | Page) {
    this._context = getContext(context);
  }

  public get auth(): AuthStub {
    return (this._auth ||= new AuthStub(this._context));
  }

  public get entries(): EntriesStub {
    return (this._entries ||= new EntriesStub(this._context));
  }

  public get settings(): SettingsStub {
    return (this._settings ||= new SettingsStub(this._context));
  }

  public get user(): UserStub {
    return (this._user ||= new UserStub(this._context));
  }

  public apply(action: (stub: TimeSheetStub) => void): TimeSheetStub {
    action(this);
    return this;
  }

  public static init(context: BrowserContext | Page): TimeSheetStub {
    return new TimeSheetStub(context);
  }
}
