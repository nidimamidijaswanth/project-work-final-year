import { exportAppiumExcelReport } from './generate-appium-excel.js';
import { resolve } from 'node:path';

async function main() {
  console.log('Generating Appium E2E Automation Excel report with 305 test cases...');

  // Target 1: inside android/app/appium-test/
  await exportAppiumExcelReport(
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/android/app/appium-test/appium_e2e_test_report.xlsx'),
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/android/app/appium-test/appium_e2e_test_report.csv')
  );

  // Target 2: inside workspace root directory for user convenience
  await exportAppiumExcelReport(
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/appium_e2e_test_report.xlsx'),
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/appium_e2e_test_report.csv')
  );

  console.log('All 305 Test Cases generated cleanly in Excel & CSV formats!');
}

main().catch(console.error);
