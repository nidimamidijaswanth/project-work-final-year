import { By, until } from 'selenium-webdriver';

export class WebBasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url = 'http://localhost:5173') {
    await this.driver.get(url);
  }

  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async isElementDisplayed(locator) {
    try {
      const el = await this.driver.findElement(locator);
      return await el.isDisplayed();
    } catch (e) {
      return false;
    }
  }
}
