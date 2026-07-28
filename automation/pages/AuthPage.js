import { BasePage } from './BasePage.js';

export class AuthPage extends BasePage {
  get emailInput() { return 'input[type="email"]'; }
  get passwordInput() { return 'input[type="password"]'; }
  get submitButton() { return 'button[type="submit"]'; }
  get errorMessage() { return '.auth-error, [role="alert"]'; }

  async login(email, password) {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.tap(this.submitButton);
  }
}
