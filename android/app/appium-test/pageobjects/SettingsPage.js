import Page from './Page.js';

class SettingsPage extends Page {
  get themeToggle() { return $('button.theme-toggle, input.theme-switch'); }
  get backendUrlInput() { return $('input[name="apiUrl"]'); }
  get saveSettingsBtn() { return $('button*=Save Settings'); }
  get notificationSoundToggle() { return $('input[name="soundEnabled"]'); }

  async setBackendUrl(url) {
    await this.backendUrlInput.setValue(url);
    await this.saveSettingsBtn.click();
  }
}

export default new SettingsPage();
