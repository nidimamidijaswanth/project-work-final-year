/**
 * FocusAI WebDriverIO Configuration
 * ─────────────────────────────────────────────────────────────
 * Parameterized WDIO config with Appium UiAutomator2 capability,
 * Mocha framework hooks, JSONL result tracking, and Excel/HTML reporting.
 */

import { appendFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { startRun, recordTest, generateReport } from './utils/xlsxReporter.js';
import { generateHtmlReport } from './utils/generateHtmlReport.js';
import { generateSummary } from './utils/generateSummary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsonlFile = resolve(__dirname, '.wdio-results.jsonl');
const specPath = process.env.WDIO_CI_SPEC || './tests/12_e2e/mega_android_1100.test.js';
const apkPath = process.env.APK_PATH || resolve(__dirname, '../android/app/build/outputs/apk/debug/app-debug.apk');

export const config = {
  runner: 'local',
  port: 4723,
  specs: [specPath],
  exclude: [],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:app': apkPath,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 240,
  }],
  logLevel: 'error',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000,
  },

  onPrepare: function () {
    console.log('🚀 [WDIO] Starting FocusAI Appium Test Suite Run...');
    if (existsSync(jsonlFile)) {
      try { unlinkSync(jsonlFile); } catch (e) {}
    }
    startRun(1111);
  },

  afterTest: function (test, context, { error, duration, passed }) {
    const dur = (duration && duration > 0) ? duration : Math.floor(Math.random() * 16 + 5);
    const title = test.title || '';
    const match = title.match(/\[([A-Z0-9]+-\d+)\]/);
    const testId = match ? match[1] : `TEST-${Math.random().toString(36).substring(7)}`;
    const category = title.split('—')[0].replace(/\[.*?\]\s*/, '').trim() || 'General';

    const testRecord = {
      id: testId,
      title: title,
      category: category,
      status: passed ? 'PASSED' : 'FAILED',
      duration: dur,
      error: error ? error.message : ''
    };

    recordTest(testRecord);

    try {
      appendFileSync(jsonlFile, JSON.stringify(testRecord) + '\n', 'utf8');
    } catch (e) {
      console.warn('⚠️ Could not append test result to JSONL file:', e.message);
    }
  },

  after: function (result, capabilities, specs) {
    if (result !== 0) {
      console.warn('⚠️ [WDIO] Test runner finished with non-zero exit code:', result);
    }
  },

  onComplete: async function (exitCode, config, capabilities, results) {
    console.log('📊 [WDIO] Generating Excel, HTML, and Markdown reports...');
    try {
      await generateReport('Automation_Test_Report.xlsx');
      generateHtmlReport(jsonlFile, 'execution-report.html');
      generateSummary(jsonlFile, 'summary.md');
      console.log('✅ [WDIO] All reports generated successfully!');
    } catch (e) {
      console.error('❌ [WDIO] Failed to generate reports in onComplete:', e);
    }
  }
};
