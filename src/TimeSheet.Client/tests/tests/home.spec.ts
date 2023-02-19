import { test, expect } from '@playwright/test';
import { AuthApiStub, HomePage, LoginRequest, TimeSheetPage, LoginResponse, AppPage } from 'time-sheet-client/test/helper';
import { ErrorResponse } from 'playwright-easy-network-stub';

test('login', async ({ page }) => {
  const username = 'myUser';
  const password = 'myPassword';
  const home = new HomePage(page);
  const app = new AppPage(page);
  const timesheet = new TimeSheetPage(page);

  await page.goto('');

  // Test missing username
  await home.login.login('', password);
  await expect(home.login.missingFieldsError).toBeVisible();

  // Test bad login data
  AuthApiStub.init(page).stubLogin((x) => {
    return <ErrorResponse<LoginResponse>>{ statusCode: 401, content: { isSuccess: false, token: undefined } };
  });
  await home.login.login(username, password);
  await expect(home.login.loginFailedError).toBeVisible();

  // Login without remembering username
  AuthApiStub.init(page)
    .stubLogin((x) => {
      expect(x.body).toEqual(<LoginRequest>{
        username,
        password,
        stayLoggedIn: false,
      });
      return <LoginResponse>{ isSuccess: true, token: 'myToken' };
    })
    .stubCheck(() => {});
  await home.login.login(username, password, { rememberUsername: false });
  await expect(timesheet.locator).toBeVisible();
  await app.logoffMenuItem.click();
  await expect(home.login.locator).toBeVisible();
  await expect(home.login.username.input).toHaveValue('');

  // Login with remembering username
  await home.login.login(username, password, { rememberUsername: true });
  await expect(timesheet.locator).toBeVisible();
  await app.logoffMenuItem.click();
  await expect(home.login.locator).toBeVisible();
  await expect(home.login.username.input).toHaveValue(username);

  // Login with stayLoggedIn
  AuthApiStub.init(page)
    .stubLogin((x) => {
      expect(x.body).toEqual(<LoginRequest>{
        username,
        password,
        stayLoggedIn: true,
      });
      return <LoginResponse>{ isSuccess: true, token: 'myToken' };
    })
    .stubCheck(() => {});
  await home.login.login(username, password, { stayLoggedIn: true });
  await expect(timesheet.locator).toBeVisible();
});
