export default class BasePage {
  async switchToWebView() {
    const contexts = await driver.getContexts();
    const webViewContext = contexts.find((ctx) => ctx.includes('WEBVIEW'));
    if (webViewContext) {
      await driver.switchContext(webViewContext);
    }
  }

  async switchToNative() {
    await driver.switchContext('NATIVE_APP');
  }

  async waitForElement(selector, timeout = 8000) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout });
    return el;
  }
}
