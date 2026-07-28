export const config = {
  runner: 'local',
  port: 4723,
  specs: ['./tests/**/*.test.js'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': 'Android Emulator',
      'appium:automationName': 'UiAutomator2',
      'appium:app': '../app/build/outputs/apk/debug/app-debug.apk',
      'appium:appPackage': 'com.focusai.app',
      'appium:appActivity': 'com.focusai.app.MainActivity',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 300,
    },
  ],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  async afterTest(test, context, { error, result, duration, passed }) {
    if (!passed) {
      await driver.takeScreenshot();
    }
  },
};
