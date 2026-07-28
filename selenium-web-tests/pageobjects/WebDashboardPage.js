import { By, until } from 'selenium-webdriver';
import { WebBasePage } from './WebBasePage.js';

export class WebDashboardPage extends WebBasePage {
  constructor(driver) {
    super(driver);
    this.logoutBtnLoc = By.xpath("//button[contains(text(), 'Logout') or contains(text(), 'Sign Out')]");
    this.startTimerBtnLoc = By.xpath("//button[contains(text(), 'Start')]");
    this.pauseTimerBtnLoc = By.xpath("//button[contains(text(), 'Pause')]");
    this.endTimerBtnLoc = By.xpath("//button[contains(text(), 'End')]");
  }

  async isLogoutButtonVisible() {
    try {
      await this.waitForElement(this.logoutBtnLoc, 8000);
      return true;
    } catch (e) {
      return false;
    }
  }

  async startFocusSession() {
    const btn = await this.waitForElement(this.startTimerBtnLoc);
    await btn.click();
  }

  async logout() {
    const btn = await this.waitForElement(this.logoutBtnLoc);
    await btn.click();
  }
}
