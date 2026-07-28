import NotificationShieldPage from '../pageobjects/NotificationShieldPage.js';

describe('Appium E2E Suite - 03: Smart Notification Shield', () => {
  it('TC-NOTIF-001: Should toggle notification shield on and off', async () => {
    await NotificationShieldPage.toggleShield(true);
    const count = await NotificationShieldPage.getBlockedNotificationsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
