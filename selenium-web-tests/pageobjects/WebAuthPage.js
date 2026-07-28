import { By, until } from 'selenium-webdriver';
import { WebBasePage } from './WebBasePage.js';

export class WebAuthPage extends WebBasePage {
  constructor(driver) {
    super(driver);
    this.emailInputLoc = By.css('input[type="email"]');
    this.passwordInputLoc = By.css('input[type="password"]');
    this.submitBtnLoc = By.css('button[type="submit"]');
    this.errorMessageLoc = By.css('.auth-error, [role="alert"]');
  }

  async login(email, password) {
    const emailEl = await this.waitForElement(this.emailInputLoc);
    await emailEl.clear();
    await emailEl.sendKeys(email);

    const passEl = await this.driver.findElement(this.passwordInputLoc);
    await passEl.clear();
    await passEl.sendKeys(password);

    const submitBtn = await this.driver.findElement(this.submitBtnLoc);
    await submitBtn.click();
  }

  async isEmailInputVisible() {
    return await this.isElementDisplayed(this.emailInputLoc);
  }
}
