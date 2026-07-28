import { performance } from 'node:perf_hooks';

const config = {
  targetUrl: readArg('--target') || process.env.LOAD_TARGET_URL || 'http://localhost:8001',
  virtualUsers: Number(readArg('--vus') || process.env.LOAD_VUS || 100),
  durationSeconds: Number(readArg('--duration') || process.env.LOAD_DURATION_SECONDS || 60),
  paths: (readArg('--paths') || process.env.LOAD_PATHS || '/api/health')
    .split(',')
    .map((path) => path.trim())
    .filter(Boolean),
  timeoutMs: Number(readArg('--timeout') || process.env.LOAD_TIMEOUT_MS || 10000),
  maxAverageMs: Number(process.env.LOAD_MAX_AVG_MS || 1000),
  maxP95Ms: Number(process.env.LOAD_MAX_P95_MS || 2500),
  maxErrorRate: Number(process.env.LOAD_MAX_ERROR_RATE || 5),
};

if (process.argv.includes('--help')) {
  printHelp();
  process.exit(0);
}

validateConfig(config);

const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  statusCodes: new Map(),
  responseTimes: [],
  errors: new Map(),
};

const startedAt = performance.now();
const endsAt = startedAt + config.durationSeconds * 1000;

const excelPath = readArg('--excel') || process.env.LOAD_EXCEL_PATH || 'load_test_results.xlsx';
const csvPath = readArg('--csv') || process.env.LOAD_CSV_PATH || 'load_test_results.csv';

console.log('FocusAI baseline/load test starting');
console.log(`Target: ${config.targetUrl}`);
console.log(`Virtual users: ${config.virtualUsers}`);
console.log(`Duration: ${config.durationSeconds}s`);
console.log(`Paths: ${config.paths.join(', ')}`);

await Promise.all(Array.from({ length: config.virtualUsers }, (_, index) => runVirtualUser(index)));

const finishedAt = performance.now();
const durationMs = finishedAt - startedAt;
const report = buildReport(durationMs);
printReport(report);

if (process.env.LOAD_REPORT_PATH) {
  const { writeFile } = await import('node:fs/promises');
  await writeFile(process.env.LOAD_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`JSON report written to ${process.env.LOAD_REPORT_PATH}`);
}

const { exportExcelReport } = await import('./generate-excel-report.js');
await exportExcelReport(report, excelPath, csvPath);

const failedThresholds = [];
if (report.responseTime.averageMs > config.maxAverageMs) {
  failedThresholds.push(`average response ${report.responseTime.averageMs}ms > ${config.maxAverageMs}ms`);
}
if (report.responseTime.p95Ms > config.maxP95Ms) {
  failedThresholds.push(`p95 response ${report.responseTime.p95Ms}ms > ${config.maxP95Ms}ms`);
}
if (report.errorRatePercent > config.maxErrorRate) {
  failedThresholds.push(`error rate ${report.errorRatePercent}% > ${config.maxErrorRate}%`);
}

if (failedThresholds.length > 0) {
  console.error(`Load test failed thresholds: ${failedThresholds.join('; ')}`);
  process.exit(1);
}

console.log('Load test passed configured thresholds.');

async function runVirtualUser(index) {
  let requestNumber = 0;

  while (performance.now() < endsAt) {
    const path = config.paths[(index + requestNumber) % config.paths.length];
    requestNumber += 1;
    await hitEndpoint(path);
  }
}

async function hitEndpoint(path) {
  const url = new URL(path, ensureTrailingSlash(config.targetUrl)).toString();
  const requestStartedAt = performance.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'FocusAI-BaselineLoadTest/1.0',
      },
      signal: AbortSignal.timeout(config.timeoutMs),
    });
    const elapsed = performance.now() - requestStartedAt;
    metrics.totalRequests += 1;
    metrics.responseTimes.push(elapsed);
    metrics.statusCodes.set(response.status, (metrics.statusCodes.get(response.status) || 0) + 1);

    if (response.ok) {
      metrics.successfulRequests += 1;
    } else {
      metrics.failedRequests += 1;
      metrics.errors.set(`HTTP ${response.status}`, (metrics.errors.get(`HTTP ${response.status}`) || 0) + 1);
    }

    await response.arrayBuffer();
  } catch (error) {
    const elapsed = performance.now() - requestStartedAt;
    metrics.totalRequests += 1;
    metrics.failedRequests += 1;
    metrics.responseTimes.push(elapsed);
    const label = error.name === 'TimeoutError' ? 'Timeout' : error.message || 'Request failed';
    metrics.errors.set(label, (metrics.errors.get(label) || 0) + 1);
  }
}

function buildReport(durationMs) {
  const sortedTimes = [...metrics.responseTimes].sort((a, b) => a - b);
  const average = sortedTimes.length
    ? sortedTimes.reduce((sum, value) => sum + value, 0) / sortedTimes.length
    : 0;

  return {
    scenario: 'Baseline/Load Testing',
    targetUrl: config.targetUrl,
    virtualUsers: config.virtualUsers,
    durationSeconds: Number((durationMs / 1000).toFixed(2)),
    configuredDurationSeconds: config.durationSeconds,
    paths: config.paths,
    totalRequests: metrics.totalRequests,
    successfulRequests: metrics.successfulRequests,
    failedRequests: metrics.failedRequests,
    requestsPerSecond: round(metrics.totalRequests / (durationMs / 1000)),
    errorRatePercent: round((metrics.failedRequests / Math.max(1, metrics.totalRequests)) * 100),
    responseTime: {
      minMs: round(sortedTimes[0] || 0),
      averageMs: round(average),
      p95Ms: round(percentile(sortedTimes, 95)),
      maxMs: round(sortedTimes[sortedTimes.length - 1] || 0),
    },
    statusCodes: Object.fromEntries(metrics.statusCodes),
    errors: Object.fromEntries(metrics.errors),
    thresholds: {
      maxAverageMs: config.maxAverageMs,
      maxP95Ms: config.maxP95Ms,
      maxErrorRatePercent: config.maxErrorRate,
    },
  };
}

function printReport(report) {
  console.log('\nFocusAI Baseline/Load Test Report');
  console.log('--------------------------------');
  console.log(`Virtual users: ${report.virtualUsers}`);
  console.log(`Duration: ${report.durationSeconds}s`);
  console.log(`Total requests: ${report.totalRequests}`);
  console.log(`Requests/sec: ${report.requestsPerSecond}`);
  console.log(`Successful: ${report.successfulRequests}`);
  console.log(`Failed: ${report.failedRequests}`);
  console.log(`Error rate: ${report.errorRatePercent}%`);
  console.log('Response time:');
  console.log(`  Min: ${report.responseTime.minMs}ms`);
  console.log(`  Average: ${report.responseTime.averageMs}ms`);
  console.log(`  P95: ${report.responseTime.p95Ms}ms`);
  console.log(`  Max: ${report.responseTime.maxMs}ms`);
  console.log(`Status codes: ${JSON.stringify(report.statusCodes)}`);
  if (Object.keys(report.errors).length > 0) {
    console.log(`Errors: ${JSON.stringify(report.errors)}`);
  }
}

function percentile(sortedValues, percentileValue) {
  if (sortedValues.length === 0) {
    return 0;
  }
  const index = Math.ceil((percentileValue / 100) * sortedValues.length) - 1;
  return sortedValues[Math.max(0, Math.min(sortedValues.length - 1, index))];
}

function round(value) {
  return Number(value.toFixed(2));
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return null;
  }
  return process.argv[index + 1] || null;
}

function validateConfig(currentConfig) {
  if (!Number.isFinite(currentConfig.virtualUsers) || currentConfig.virtualUsers < 1) {
    throw new Error('Virtual users must be a positive number.');
  }
  if (!Number.isFinite(currentConfig.durationSeconds) || currentConfig.durationSeconds < 1) {
    throw new Error('Duration must be at least 1 second.');
  }
  if (currentConfig.paths.length === 0) {
    throw new Error('At least one path is required.');
  }
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

function printHelp() {
  console.log(`
FocusAI baseline/load test

Defaults match the client baseline case:
  100 virtual users
  60 seconds
  continuous requests
  RPS + response-time summary

Usage:
  npm run load:baseline
  npm run load:baseline -- --target http://localhost:8001
  npm run load:baseline -- --target https://focusai-production-31f2.up.railway.app --paths /api/health --vus 100 --duration 60

Options:
  --target     Backend base URL
  --paths      Comma-separated GET paths, default /api/health
  --vus        Virtual users, default 100
  --duration   Duration in seconds, default 60
  --timeout    Request timeout in ms, default 10000
`);
}
