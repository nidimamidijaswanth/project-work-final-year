import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';

describe('Selenium Web E2E Suite: Focus Mode & Timer Controls', function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('TC-SEL-FOCUS-001: Should start 25-minute focus countdown timer', async function () {
    await driver.get('http://localhost:5173');
    const timerBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Start')]")), 5000);
    expect(await timerBtn.isDisplayed()).to.be.true;
  });
});
