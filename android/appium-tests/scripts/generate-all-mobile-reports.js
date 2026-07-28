import { exportMobileExcelAnalysis } from './generate-appium-excel-analysis.js';
import { resolve } from 'node:path';

async function main() {
  console.log('Generating Appium Mobile E2E Excel Analysis report with 305 test cases...');

  // Target 1: inside android/appium-tests/
  await exportMobileExcelAnalysis(
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/android/appium-tests/appium_e2e_excel_analysis.xlsx'),
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/android/appium-tests/appium_e2e_excel_analysis.csv')
  );

  // Target 2: inside workspace root directory for user convenience
  await exportMobileExcelAnalysis(
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/appium_e2e_excel_analysis.xlsx'),
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/appium_e2e_excel_analysis.csv')
  );

  console.log('All 305 Appium Mobile Test Cases generated cleanly in Excel Analysis & CSV formats!');
}

main().catch(console.error);
