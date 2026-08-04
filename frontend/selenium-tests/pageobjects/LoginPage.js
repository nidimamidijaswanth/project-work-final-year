import { By, until } from 'selenium-webdriver';

export class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.emailInputLoc = By.css('input[type="email"]');
    this.passwordInputLoc = By.css('input[type="password"]');
    this.submitBtnLoc = By.css('button[type="submit"]');
    this.toggleSignupLinkLoc = By.xpath("//button[contains(text(), 'Sign up') or contains(text(), 'Create account')]");
    this.nameInputLoc = By.css('input[placeholder*="Name" i]');
    this.errorMessageLoc = By.css('.auth-error, [role="alert"]');
    this.brandLogoLoc = By.css('.app-header, .brand-title, h1');
  }

  async open(baseUrl = process.env.BASE_URL || 'http://localhost:5173') {
    await this.driver.get(baseUrl);
    await this.driver.wait(until.elementLocated(this.emailInputLoc), 15000);
  }

  async login(email, password) {
    const emailEl = await this.driver.findElement(this.emailInputLoc);
    await emailEl.clear();
    await emailEl.sendKeys(email);

    const passEl = await this.driver.findElement(this.passwordInputLoc);
    await passEl.clear();
    await passEl.sendKeys(password);

    const submitBtn = await this.driver.findElement(this.submitBtnLoc);
    await submitBtn.click();
  }

  async signup(name, email, password) {
    try {
      const toggleBtn = await this.driver.findElement(this.toggleSignupLinkLoc);
      await toggleBtn.click();
    } catch (e) {
      // already in signup view
    }

    try {
      const nameEl = await this.driver.wait(until.elementLocated(this.nameInputLoc), 3000);
      await nameEl.sendKeys(name);
    } catch (e) {}

    const emailEl = await this.driver.findElement(this.emailInputLoc);
    await emailEl.sendKeys(email);

    const passEl = await this.driver.findElement(this.passwordInputLoc);
    await passEl.sendKeys(password);

    const submitBtn = await this.driver.findElement(this.submitBtnLoc);
    await submitBtn.click();
  }

  async getErrorMessage() {
    try {
      const errorEl = await this.driver.wait(until.elementLocated(this.errorMessageLoc), 3000);
      return await errorEl.getText();
    } catch (e) {
      return '';
    }
  }

  async isEmailFieldDisplayed() {
    try {
      const el = await this.driver.findElement(this.emailInputLoc);
      return await el.isDisplayed();
    } catch (e) {
      return false;
    }
  }
}
