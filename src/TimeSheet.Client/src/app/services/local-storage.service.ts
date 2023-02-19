import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly prefix = 'TimeSheet.';
  private readonly tokenName = this.prefix + 'token';
  private readonly rememberUsernameName = this.prefix + 'rememberUsername';
  private readonly usernameName = this.prefix + 'username';

  constructor() {}

  public get token(): string {
    return localStorage.getItem(this.tokenName);
  }
  public set token(value: string) {
    localStorage.setItem(this.tokenName, value);
  }
  public removeToken() {
    localStorage.removeItem(this.tokenName);
  }

  public get rememberUsername(): string {
    return localStorage.getItem(this.rememberUsernameName);
  }
  public set rememberUsername(value: string) {
    localStorage.setItem(this.rememberUsernameName, value);
  }
  public removeRememberUsername() {
    localStorage.removeItem(this.rememberUsernameName);
  }

  public get username(): string {
    return localStorage.getItem(this.usernameName);
  }
  public set username(value: string) {
    localStorage.setItem(this.usernameName, value);
  }
  public removeUsername() {
    localStorage.removeItem(this.usernameName);
  }
}
