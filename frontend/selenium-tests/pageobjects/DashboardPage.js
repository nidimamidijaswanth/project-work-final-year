import { By, until } from 'selenium-webdriver';

export class DashboardPage {
  constructor(driver) {
    this.driver = driver;
    this.logoutBtnLoc = By.xpath("//button[contains(text(), 'Logout') or contains(text(), 'Sign Out')]");
    this.timerDisplayLoc = By.css('.timer-display, .focus-timer-clock');
    this.startTimerBtnLoc = By.xpath("//button[contains(text(), 'Start')]");
    this.pauseTimerBtnLoc = By.xpath("//button[contains(text(), 'Pause')]");
    this.focusScoreBadgeLoc = By.css('.focus-score, .score-badge');
  }

  async isLogoutButtonDisplayed() {
    try {
      const btn = await this.driver.wait(until.elementLocated(this.logoutBtnLoc), 8000);
      return await btn.isDisplayed();
    } catch (e) {
      return false;
    }
  }

  async logout() {
    const btn = await this.driver.findElement(this.logoutBtnLoc);
    await btn.click();
  }

  async startTimer() {
    const btn = await this.driver.findElement(this.startTimerBtnLoc);
    await btn.click();
  }
}
