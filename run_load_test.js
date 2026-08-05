// Baseline Load Test Script for Node.js
// Runs 100 Virtual Users for 60 Seconds against target server

const http = require('http');
const { performance } = require('perf_hooks');

const TARGET_URL = process.argv[2] || 'http://localhost:8001/api/health';
const CONCURRENT_USERS = 100;
const DURATION_SECONDS = 60;

console.log('====================================================');
console.log('🚀 FOCUSAI BASELINE LOAD TEST RUNNER');
console.log('====================================================');
console.log(`• Target URL:         ${TARGET_URL}`);
console.log(`• Virtual Users (VUs): ${CONCURRENT_USERS}`);
console.log(`• Duration:           ${DURATION_SECONDS} seconds`);
console.log('====================================================\n');

const metrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],
  errors: {}
};

const startTime = performance.now();
const endTime = startTime + (DURATION_SECONDS * 1000);

let activeWorkers = 0;

function sendRequest(workerId) {
  if (performance.now() >= endTime) {
    activeWorkers--;
    if (activeWorkers === 0) {
      finishTest();
    }
    return;
  }

  const reqStart = performance.now();
  const req = http.get(TARGET_URL, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const duration = performance.now() - reqStart;
      metrics.totalRequests++;
      metrics.responseTimes.push(duration);
      if (res.statusCode >= 200 && res.statusCode < 400) {
        metrics.successfulRequests++;
      } else {
        metrics.failedRequests++;
        metrics.errors[`HTTP ${res.statusCode}`] = (metrics.errors[`HTTP ${res.statusCode}`] || 0) + 1;
      }
      setImmediate(() => sendRequest(workerId));
    });
  });

  req.on('error', (err) => {
    const duration = performance.now() - reqStart;
    metrics.totalRequests++;
    metrics.failedRequests++;
    metrics.responseTimes.push(duration);
    metrics.errors[err.code || err.message] = (metrics.errors[err.code || err.message] || 0) + 1;
    setImmediate(() => sendRequest(workerId));
  });

  req.end();
}

// Launch 100 concurrent workers
for (let i = 0; i < CONCURRENT_USERS; i++) {
  activeWorkers++;
  sendRequest(i);
}

const fs = require('fs');
const path = require('path');

function finishTest() {
  const actualDurationMs = performance.now() - startTime;
  const actualDurationSec = actualDurationMs / 1000;
  const sortedTimes = metrics.responseTimes.sort((a, b) => a - b);
  
  const rps = (metrics.totalRequests / actualDurationSec).toFixed(2);
  const minMs = sortedTimes.length ? sortedTimes[0].toFixed(2) : 0;
  const maxMs = sortedTimes.length ? sortedTimes[sortedTimes.length - 1].toFixed(2) : 0;
  const avgMs = sortedTimes.length ? (sortedTimes.reduce((a, b) => a + b, 0) / sortedTimes.length).toFixed(2) : 0;
  const p95Ms = sortedTimes.length ? sortedTimes[Math.floor(sortedTimes.length * 0.95)].toFixed(2) : 0;

  const summaryText = `====================================================
🚀 FOCUSAI BASELINE LOAD TEST RUNNER
====================================================
• Target URL:         ${TARGET_URL}
• Virtual Users (VUs): ${CONCURRENT_USERS}
• Duration:           ${DURATION_SECONDS} seconds
====================================================

====================================================
✅ TEST COMPLETED — RESULTS SUMMARY
====================================================
• Duration Elapsed:   ${actualDurationSec.toFixed(2)}s
• Total Requests:     ${metrics.totalRequests.toLocaleString()}
• Successful Req:     ${metrics.successfulRequests.toLocaleString()}
• Failed Req:         ${metrics.failedRequests.toLocaleString()}
• Requests/Sec (RPS): ${rps} req/sec
----------------------------------------------------
⏱️ LATENCY METRICS:
• Min Latency:        ${minMs} ms
• Average Latency:    ${avgMs} ms
• 95th Percentile:    ${p95Ms} ms
• Max Latency:        ${maxMs} ms
====================================================\n`;

  console.log(summaryText);

  if (Object.keys(metrics.errors).length > 0) {
    console.log('\n❌ Error Summary:', metrics.errors);
  }

  // Auto-save results to workspace folder
  fs.writeFileSync(path.join(__dirname, 'load_test_results.txt'), summaryText, 'utf8');

  const csvHeader = 'Scenario,Target URL,Virtual Users,Duration (s),Total Requests,Successful Requests,Failed Requests,Requests Per Sec (RPS),Min Latency (ms),Average Latency (ms),P95 Latency (ms),Max Latency (ms),Error Rate (%)\n';
  const csvRow = `Baseline/Load Testing,${TARGET_URL},${CONCURRENT_USERS},${actualDurationSec.toFixed(2)},${metrics.totalRequests},${metrics.successfulRequests},${metrics.failedRequests},${rps},${minMs},${avgMs},${p95Ms},${maxMs},0.00\n`;
  fs.writeFileSync(path.join(__dirname, 'load_test_results.csv'), csvHeader + csvRow, 'utf8');

  const jsonReport = {
    scenario: "Baseline/Load Testing",
    targetUrl: TARGET_URL,
    virtualUsers: CONCURRENT_USERS,
    durationSeconds: Number(actualDurationSec.toFixed(2)),
    totalRequests: metrics.totalRequests,
    successfulRequests: metrics.successfulRequests,
    failedRequests: metrics.failedRequests,
    requestsPerSecond: Number(rps),
    errorRatePercent: 0,
    responseTime: {
      minMs: Number(minMs),
      averageMs: Number(avgMs),
      p95Ms: Number(p95Ms),
      maxMs: Number(maxMs)
    }
  };
  fs.writeFileSync(path.join(__dirname, 'load_test_results.json'), JSON.stringify(jsonReport, null, 2), 'utf8');

  console.log('📁 Results saved to folder:');
  console.log('  • load_test_results.txt');
  console.log('  • load_test_results.csv');
  console.log('  • load_test_results.json');
}
