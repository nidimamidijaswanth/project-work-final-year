import Page from './Page.js';

class NotificationShieldPage extends Page {
  get shieldToggle() { return $('input[type="checkbox"].shield-toggle, button.toggle-shield'); }
  get blockedCountLabel() { return $('.blocked-notifications-count'); }
  get appWhitelistList() { return $('.whitelisted-apps-list'); }
  get addAppBtn() { return $('button*=Add App'); }
  get InterruptionCostBadge() { return $('.interruption-cost'); }

  async toggleShield(enable = true) {
    const isChecked = await this.shieldToggle.isSelected();
    if (isChecked !== enable) {
      await this.shieldToggle.click();
    }
  }

  async getBlockedNotificationsCount() {
    const text = await this.blockedCountLabel.getText();
    return parseInt(text.replace(/\D/g, ''), 10) || 0;
  }
}

export default new NotificationShieldPage();
