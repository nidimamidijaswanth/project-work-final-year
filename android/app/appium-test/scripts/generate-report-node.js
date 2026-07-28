import { exportAppiumExcelReport } from './generate-appium-excel.js';
import { resolve } from 'node:path';

async function generate() {
  console.log('Generating complete 305 Appium E2E test cases Excel spreadsheet...');

  const appiumFolderXlsx = resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/android/app/appium-test/appium_e2e_test_report.xlsx');
  const appiumFolderCsv = resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/android/app/appium-test/appium_e2e_test_report.csv');
  const rootXlsx = resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/appium_e2e_test_report.xlsx');
  const rootCsv = resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/appium_e2e_test_report.csv');

  await exportAppiumExcelReport(appiumFolderXlsx, appiumFolderCsv);
  await exportAppiumExcelReport(rootXlsx, rootCsv);

  console.log('Excel & CSV generation completed for 305 test cases!');
}

generate().catch(console.error);
