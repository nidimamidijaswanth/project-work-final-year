import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { WebAuthPage } from '../pageobjects/WebAuthPage.js';
import { WebDashboardPage } from '../pageobjects/WebDashboardPage.js';

describe('Selenium Web E2E Automation - Full End-to-End Application Flow', function () {
  this.timeout(60000);
  let driver;
  let authPage;
  let dashboardPage;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    authPage = new WebAuthPage(driver);
    dashboardPage = new WebDashboardPage(driver);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Step 1: Should navigate to FocusAI web landing page and load auth form', async function () {
    await authPage.open('http://localhost:5173');
    const isVisible = await authPage.isEmailInputVisible();
    expect(isVisible).to.be.true;
  });

  it('Step 2: Should authenticate user and verify local storage JWT bearer token', async function () {
    await authPage.login('test.user@focusai.com', 'Password123!');
    const isDashboardLoaded = await dashboardPage.isLogoutButtonVisible();
    expect(isDashboardLoaded).to.be.true;

    const token = await driver.executeScript("return localStorage.getItem('token') || localStorage.getItem('focusai_token');");
    expect(token).to.not.be.null;
  });

  it('Step 3: Should initiate 25-minute Pomodoro focus session on dashboard', async function () {
    await dashboardPage.startFocusSession();
    const isPauseBtnVisible = await dashboardPage.isElementDisplayed(By.xpath("//button[contains(text(), 'Pause')]"));
    expect(isPauseBtnVisible).to.be.true;
  });

  it('Step 4: Should perform user logout and verify state cleanup', async function () {
    await dashboardPage.logout();
    const isAuthVisible = await authPage.isEmailInputVisible();
    expect(isAuthVisible).to.be.true;
  });
});
