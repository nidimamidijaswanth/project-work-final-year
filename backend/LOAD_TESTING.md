# FocusAI Baseline / Load Testing

This folder includes a lightweight Node.js load-test runner for the client baseline test case.

## Client Baseline Scenario

- 100 virtual users
- Continuous traffic for 1 minute
- Thousands of requests may be sent during that minute
- Measures API throughput and response time

## Run Local Test

Start the backend:

```bash
npm run dev
```

Run the load test in another terminal:

```bash
npm run load:baseline -- --target http://localhost:8001
```

## Run Deployed Railway Test

```bash
npm run load:baseline -- --target https://focusai-production-31f2.up.railway.app --paths /api/health --vus 100 --duration 60
```

## Metrics Reported

Requests per second:

```text
Requests/sec: 120
```

This means the API handled about 120 requests every second.

Response time:

```text
Min: 50ms
Average: 250ms
P95: 900ms
Max: 1500ms
```

This means:

- Fastest response was 50ms
- Average response was 250ms
- 95% of requests completed within 900ms
- Slowest response was 1500ms

## Useful Options

```bash
npm run load:baseline -- --target http://localhost:8001 --paths /api/health --vus 100 --duration 60
```

Available flags:

- `--target`: backend base URL
- `--paths`: comma-separated GET endpoints
- `--vus`: virtual users
- `--duration`: duration in seconds
- `--timeout`: request timeout in milliseconds

## Thresholds

The script exits with failure if thresholds are exceeded.

Defaults:

- Average response time must be <= 1000ms
- P95 response time must be <= 2500ms
- Error rate must be <= 5%

Override thresholds:

```bash
LOAD_MAX_AVG_MS=1200 LOAD_MAX_P95_MS=3000 LOAD_MAX_ERROR_RATE=10 npm run load:baseline
```

## Excel & CSV Reports

Running the baseline load test automatically exports styled Excel (`load_test_results.xlsx`) and CSV (`load_test_results.csv`) reports:

```bash
npm run load:baseline -- --target http://localhost:8001 --vus 100 --duration 60 --excel load_test_results.xlsx --csv load_test_results.csv
```

Custom report paths via environment variables:

```bash
LOAD_EXCEL_PATH=my_report.xlsx LOAD_CSV_PATH=my_report.csv LOAD_REPORT_PATH=load-report.json npm run load:baseline
```

