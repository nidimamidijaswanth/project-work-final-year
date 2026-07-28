import FocusPage from '../pageobjects/FocusPage.js';

describe('Appium E2E Suite - 02: Focus Mode & Timer Management', () => {
  beforeEach(async () => {
    await FocusPage.switchToWebView();
  });

  it('TC-FOCUS-001: Should start a 25-minute focus session', async () => {
    await FocusPage.startFocusSession('25m', 'Deep Work');
    const isTimerActive = await FocusPage.pauseSessionBtn.isDisplayed();
    expect(isTimerActive).toBe(true);
  });

  it('TC-FOCUS-002: Should pause and resume an active focus timer', async () => {
    await FocusPage.pauseSession();
    expect(await FocusPage.resumeSessionBtn.isDisplayed()).toBe(true);

    await FocusPage.resumeSession();
    expect(await FocusPage.pauseSessionBtn.isDisplayed()).toBe(true);
  });

  it('TC-FOCUS-003: Should terminate active focus session when user clicks end button', async () => {
    await FocusPage.endSession();
    expect(await FocusPage.startSessionBtn.isDisplayed()).toBe(true);
  });
});
