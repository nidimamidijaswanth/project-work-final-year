import Page from './Page.js';

class AuthPage extends Page {
  get emailInput() { return $('input[type="email"]'); }
  get passwordInput() { return $('input[type="password"]'); }
  get loginSubmitBtn() { return $('button[type="submit"]'); }
  get toggleSignupLink() { return $('text="Don\'t have an account? Sign up"'); }
  get nameInput() { return $('input[placeholder*="Name" i]'); }
  get errorMessageBanner() { return $('.auth-error, [role="alert"]'); }
  get logoutBtn() { return $('button=Logout'); }

  async login(email, password) {
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.loginSubmitBtn.click();
  }

  async signup(name, email, password) {
    if (await this.toggleSignupLink.isDisplayed()) {
      await this.toggleSignupLink.click();
    }
    await this.nameInput.setValue(name);
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.loginSubmitBtn.click();
  }
}

export default new AuthPage();
