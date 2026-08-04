import { By, until } from 'selenium-webdriver';

export class DashboardPage {
  constructor(driver) {
    this.driver = driver;
    this.logoutBtnLoc = By.xpath("//button[contains(text(), 'Logout') or contains(text(), 'Sign Out')]");
    this.focusTimerContainerLoc = By.css('.timer-display, .focus-timer');
  }

  async isLogoutButtonDisplayed() {
    try {
      const el = await this.driver.wait(until.elementLocated(this.logoutBtnLoc), 5000);
      return await el.isDisplayed();
    } catch (e) {
      return false;
    }
  }

  async logout() {
    const el = await this.driver.findElement(this.logoutBtnLoc);
    await el.click();
  }
}
