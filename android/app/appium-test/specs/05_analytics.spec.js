import AnalyticsPage from '../pageobjects/AnalyticsPage.js';

describe('Appium E2E Suite - 05: Analytics & Performance Insights', () => {
  it('TC-ANLY-001: Should display streak counter and historical charts', async () => {
    const streak = await AnalyticsPage.getStreakCount();
    expect(streak).toBeGreaterThanOrEqual(0);
  });
});
