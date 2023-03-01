import { test, expect } from '@playwright/test';
import { HomePage, TimeSheetPage, AppPage, TimeSheetStub } from 'time-sheet-client/test/helper';
import { ErrorResponse } from 'playwright-easy-network-stub';
import { LoginResponse } from 'helper/models/login-response.model';
import { LoginRequest } from 'helper/models/login-request.model';
import { RegisterData } from 'helper/maps/pages/home/register.map';
import { RegisterRequest } from 'helper/models/register-request.model';

test('login', async ({ page }) => {
  const username = 'myUser';
  const password = 'myPassword';
  const token = 'myToken';
  const home = new HomePage(page);
  const app = new AppPage(page);
  const timesheet = new TimeSheetPage(page);

  await page.goto('');

  // Test missing username
  await home.login.login('', password);
  await expect(home.login.missingFieldsError).toBeVisible();

  // Test bad login data
  TimeSheetStub.init(page).auth.stubLogin((x) => {
    return <ErrorResponse<LoginResponse>>{ statusCode: 401, content: { isSuccess: false, token: undefined } };
  });
  await home.login.login(username, password);
  await expect(home.login.loginFailedError).toBeVisible();

  // Login without remembering username
  TimeSheetStub.init(page)
    .auth.stubLogin((x) => {
      expect(x.body).toEqual(<LoginRequest>{
        username,
        password,
        stayLoggedIn: false,
      });
      return <LoginResponse>{ isSuccess: true, token };
    })
    .stubCheck((r) => {
      expect(r.headers['authorization']).toBe(`Bearer ${token}`);
    });
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
  TimeSheetStub.init(page)
    .auth.stubLogin((x) => {
      expect(x.body).toEqual(<LoginRequest>{
        username,
        password,
        stayLoggedIn: true,
      });
      return <LoginResponse>{ isSuccess: true, token };
    })
    .stubCheck();
  await home.login.login(username, password, { stayLoggedIn: true });
  await expect(timesheet.locator).toBeVisible();
});

test('register', async ({ page }) => {
  const data: RegisterData = {
    givenName: 'Max',
    surname: 'Mustermann',
    email: 'max.mustermann@example.io',
    username: 'max.mustermann',
    password: 'max123$',
    passwordRepeat: 'max123$',
  };
  const token = 'myToken';
  const home = new HomePage(page);
  const app = new AppPage(page);
  const timesheet = new TimeSheetPage(page);

  await page.goto('');

  // Test form validation
  await home.register.register({ ...data, givenName: '' });
  await expect(home.register.missingFieldsError).toBeVisible();
  await home.register.register({ ...data, surname: '' });
  await expect(home.register.missingFieldsError).toBeVisible();
  await home.register.register({ ...data, email: '' });
  await expect(home.register.missingFieldsError).toBeVisible();
  await home.register.register({ ...data, username: '' });
  await expect(home.register.missingFieldsError).toBeVisible();
  await home.register.register({ ...data, password: '', passwordRepeat: '' });
  await expect(home.register.missingFieldsError).toBeVisible();
  await home.register.register({ ...data, password: 'blub', passwordRepeat: 'blib' });
  await expect(home.register.missingFieldsError).toBeVisible();

  // Test register failed
  TimeSheetStub.init(page).auth.stubRegister((x) => {
    return <ErrorResponse<undefined>>{ statusCode: 409 };
  });
  await home.register.register(data);
  await expect(home.register.registerFailedError).toBeVisible();

  // Successful register
  TimeSheetStub.init(page)
    .auth.stubRegister(({ body }) => {
      expect(body).toEqual(<RegisterRequest>{
        username: data.username,
        password: data.password,
        userInfo: {
          id: undefined,
          givenName: data.givenName,
          surname: data.surname,
          email: data.email,
        },
      });
      return <LoginResponse>{ isSuccess: true, token };
    })
    .stubCheck((r) => {
      expect(r.headers['authorization']).toBe(`Bearer ${token}`);
    });
  await home.register.register(data);
  await expect(timesheet.locator).toBeVisible();
});
