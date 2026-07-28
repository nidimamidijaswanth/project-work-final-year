import { exportWebExcelAnalysis } from './generate-selenium-excel-analysis.js';
import { resolve } from 'node:path';

async function main() {
  console.log('Generating Selenium Web E2E Excel Analysis report with 305 test cases...');

  // Target 1: inside selenium-web-tests/
  await exportWebExcelAnalysis(
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/selenium-web-tests/selenium_e2e_excel_analysis.xlsx'),
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/selenium-web-tests/selenium_e2e_excel_analysis.csv')
  );

  // Target 2: inside workspace root directory for user convenience
  await exportWebExcelAnalysis(
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/selenium_e2e_excel_analysis.xlsx'),
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/selenium_e2e_excel_analysis.csv')
  );

  console.log('All 305 Selenium Web Test Cases generated cleanly in Excel Analysis & CSV formats!');
}

main().catch(console.error);
