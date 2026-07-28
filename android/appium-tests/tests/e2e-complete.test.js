import MobileAuthPage from '../pageobjects/MobileAuthPage.js';
import MobileFocusPage from '../pageobjects/MobileFocusPage.js';

describe('FocusAI Mobile Appium E2E Automation - Full Application Flow', () => {
  before(async () => {
    await MobileAuthPage.switchToWebView();
  });

  it('Step 1: Should launch app and display mobile authentication screen', async () => {
    const isEmailVisible = await MobileAuthPage.emailInput.isDisplayed();
    expect(isEmailVisible).toBe(true);
  });

  it('Step 2: Should authenticate valid mobile user into focus dashboard', async () => {
    await MobileAuthPage.login('test.user@focusai.com', 'Password123!');
    const isLogoutVisible = await MobileAuthPage.logoutBtn.isDisplayed();
    expect(isLogoutVisible).toBe(true);
  });

  it('Step 3: Should initiate 25-minute Pomodoro focus session', async () => {
    await MobileFocusPage.startFocusSession();
    const isPauseVisible = await MobileFocusPage.pauseBtn.isDisplayed();
    expect(isPauseVisible).toBe(true);
  });

  it('Step 4: Should pause and resume active timer during mobile session', async () => {
    await MobileFocusPage.pauseBtn.click();
    expect(await MobileFocusPage.resumeBtn.isDisplayed()).toBe(true);

    await MobileFocusPage.resumeBtn.click();
    expect(await MobileFocusPage.pauseBtn.isDisplayed()).toBe(true);
  });

  it('Step 5: Should end session and log out user cleanly', async () => {
    await MobileFocusPage.endBtn.click();
    await MobileAuthPage.logoutBtn.click();
    expect(await MobileAuthPage.emailInput.isDisplayed()).toBe(true);
  });
});
