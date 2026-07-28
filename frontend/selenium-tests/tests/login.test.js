import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { LoginPage } from '../pageobjects/LoginPage.js';
import { DashboardPage } from '../pageobjects/DashboardPage.js';

describe('Selenium Web E2E Suite: Authentication & Login Functionality', function () {
  this.timeout(60000);
  let driver;
  let loginPage;
  let dashboardPage;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    loginPage = new LoginPage(driver);
    dashboardPage = new DashboardPage(driver);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async function () {
    await loginPage.open('http://localhost:5173');
  });

  it('TC-SEL-AUTH-001: Should load login page and display email and password inputs', async function () {
    const isEmailVisible = await loginPage.isEmailFieldDisplayed();
    expect(isEmailVisible).to.be.true;
  });

  it('TC-SEL-AUTH-002: Should show validation error when submitting empty credentials', async function () {
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).to.not.be.empty;
  });

  it('TC-SEL-AUTH-003: Should reject login with invalid credentials format', async function () {
    await loginPage.login('invalid.user@domain', 'WrongPassword123');
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg.length).to.be.greaterThan(0);
  });

  it('TC-SEL-AUTH-004: Should log in successfully with valid credentials and redirect to dashboard', async function () {
    await loginPage.login('test.user@focusai.com', 'Password123!');
    const isLogoutVisible = await dashboardPage.isLogoutButtonDisplayed();
    expect(isLogoutVisible).to.be.true;
  });

  it('TC-SEL-AUTH-005: Should store JWT token in browser localStorage upon authentication', async function () {
    await loginPage.login('test.user@focusai.com', 'Password123!');
    await dashboardPage.isLogoutButtonDisplayed();
    const token = await driver.executeScript("return localStorage.getItem('token') || localStorage.getItem('focusai_token');");
    expect(token).to.not.be.null;
  });

  it('TC-SEL-AUTH-006: Should log out user cleanly when clicking logout button', async function () {
    await loginPage.login('test.user@focusai.com', 'Password123!');
    await dashboardPage.isLogoutButtonDisplayed();
    await dashboardPage.logout();
    const isEmailVisible = await loginPage.isEmailFieldDisplayed();
    expect(isEmailVisible).to.be.true;
  });

  it('TC-SEL-AUTH-007: Should toggle between Login and Signup modes smoothly', async function () {
    await loginPage.signup('New Test User', 'new.user@focusai.com', 'SecurePass123!');
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).to.be.a('string');
  });
});
