/**
 * Base Page Object containing common selectors and methods for FocusAI hybrid app.
 */
export default class Page {
  /**
   * Switch into WebView context if hybrid Capacitor app.
   */
  async switchToWebView() {
    const contexts = await driver.getContexts();
    const webViewContext = contexts.find((ctx) => ctx.includes('WEBVIEW'));
    if (webViewContext) {
      await driver.switchContext(webViewContext);
    }
  }

  /**
   * Switch back to native NATIVE_APP context.
   */
  async switchToNative() {
    await driver.switchContext('NATIVE_APP');
  }

  /**
   * Wait for an element to be displayed.
   */
  async waitForElement(selector, timeout = 5000) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout });
    return el;
  }
}
