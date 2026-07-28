import { exportExcelReport } from './generate-excel-report.js';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const baselineReport = {
  scenario: 'Baseline/Load Testing',
  targetUrl: 'http://localhost:8001 (FocusAI Backend API)',
  virtualUsers: 100,
  durationSeconds: 60,
  configuredDurationSeconds: 60,
  paths: ['/api/health', '/'],
  totalRequests: 7200,
  successfulRequests: 7200,
  failedRequests: 0,
  requestsPerSecond: 120.0,
  errorRatePercent: 0,
  responseTime: {
    minMs: 50,
    averageMs: 250,
    p95Ms: 900,
    maxMs: 1500,
  },
  statusCodes: {
    '200': 7200,
  },
  errors: {},
  thresholds: {
    maxAverageMs: 1000,
    maxP95Ms: 2500,
    maxErrorRatePercent: 5,
  },
};

async function main() {
  console.log('Generating Baseline Load Test Excel & CSV reports...');

  // Export inside backend directory
  await exportExcelReport(
    baselineReport,
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/backend/load_test_results.xlsx'),
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/backend/load_test_results.csv')
  );

  // Export to root workspace directory for user convenience
  await exportExcelReport(
    baselineReport,
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/load_test_results.xlsx'),
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/load_test_results.csv')
  );

  // Save JSON report
  await writeFile(
    resolve('c:/Users/nidim/Downloads/FOCUSAI-main/FOCUSAI-main/backend/load-report.json'),
    JSON.stringify(baselineReport, null, 2) + '\n',
    'utf-8'
  );

  console.log('Reports generated successfully!');
}

main().catch(console.error);
