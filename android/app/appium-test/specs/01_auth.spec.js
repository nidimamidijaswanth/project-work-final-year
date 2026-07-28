import AuthPage from '../pageobjects/AuthPage.js';

describe('Appium E2E Suite - 01: Authentication & Onboarding', () => {
  beforeEach(async () => {
    await AuthPage.switchToWebView();
  });

  it('TC-AUTH-001: Should launch app and display login form', async () => {
    const isDisplayed = await AuthPage.emailInput.isDisplayed();
    expect(isDisplayed).toBe(true);
  });

  it('TC-AUTH-002: Should show error banner when submitting empty login credentials', async () => {
    await AuthPage.loginSubmitBtn.click();
    const errorBanner = await AuthPage.errorMessageBanner;
    expect(await errorBanner.isDisplayed()).toBe(true);
  });

  it('TC-AUTH-003: Should log in successfully with valid test account', async () => {
    await AuthPage.login('test.user@focusai.com', 'Password123!');
    const logoutBtn = await AuthPage.logoutBtn;
    await logoutBtn.waitForDisplayed({ timeout: 10000 });
    expect(await logoutBtn.isDisplayed()).toBe(true);
  });
});
