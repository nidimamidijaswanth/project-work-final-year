export class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async switchToWebView() {
    if (!this.driver) return;
    const contexts = await this.driver.getContexts();
    const webViewContext = contexts.find((ctx) => ctx.includes('WEBVIEW'));
    if (webViewContext) {
      await this.driver.switchContext(webViewContext);
    }
  }

  async switchToNative() {
    if (!this.driver) return;
    await this.driver.switchContext('NATIVE_APP');
  }

  async waitForElement(selector, timeout = 10000) {
    if (!this.driver) return null;
    const el = await this.driver.$(selector);
    await el.waitForDisplayed({ timeout });
    return el;
  }

  async tap(selector) {
    const el = await this.waitForElement(selector);
    if (el) await el.click();
  }

  async type(selector, text) {
    const el = await this.waitForElement(selector);
    if (el) {
      await el.clearValue();
      await el.setValue(text);
    }
  }
}
