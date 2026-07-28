import BasePage from './BasePage.js';

class MobileAuthPage extends BasePage {
  get emailInput() { return $('input[type="email"]'); }
  get passwordInput() { return $('input[type="password"]'); }
  get submitBtn() { return $('button[type="submit"]'); }
  get errorMessage() { return $('.auth-error, [role="alert"]'); }
  get logoutBtn() { return $('button=Logout'); }

  async login(email, password) {
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.submitBtn.click();
  }
}

export default new MobileAuthPage();
