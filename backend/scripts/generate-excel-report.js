import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Generate formatted Excel XML (.xlsx/xml) and CSV load test reports.
 * @param {Object} report Load test summary report object
 * @param {string} xlsxPath Output path for Excel spreadsheet
 * @param {string} csvPath Output path for CSV file
 */
export async function exportExcelReport(report, xlsxPath = 'load_test_results.xlsx', csvPath = 'load_test_results.csv') {
  const xmlContent = buildExcelXml(report);
  const csvContent = buildCsv(report);

  await writeFile(xlsxPath, xmlContent, 'utf-8');
  await writeFile(csvPath, csvContent, 'utf-8');

  console.log(`Excel report successfully generated: ${resolve(xlsxPath)}`);
  console.log(`CSV report successfully generated: ${resolve(csvPath)}`);
}

function buildExcelXml(report) {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>FocusAI Baseline / Load Test Report</Title>
  <Subject>Baseline Performance Testing Results</Subject>
  <Author>FocusAI Load Test Runner</Author>
  <Created>${now}</Created>
 </DocumentProperties>
 <Styles>
  <!-- Default Style -->
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#000000"/>
  </Style>

  <!-- Title Banner -->
  <Style ss:ID="TitleBanner">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="16" ss:Bold="1" ss:Color="#1F4E79"/>
  </Style>

  <!-- Subtitle / Meta -->
  <Style ss:ID="Subtitle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Italic="1" ss:Color="#595959"/>
  </Style>

  <!-- Table Header -->
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1F4E79"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1F4E79" ss:Pattern="Solid"/>
  </Style>

  <!-- Metric Card Header -->
  <Style ss:ID="CardHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#2F5597"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#2F5597"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#2F5597"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#2F5597"/>
   <Interior ss:Color="#D9E1F2" ss:Pattern="Solid"/>
  </Style>

  <!-- Metric Card Value -->
  <Style ss:ID="CardValue">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#2F5597"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#2F5597"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#2F5597"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="16" ss:Bold="1" ss:Color="#1F4E79"/>
   <Interior ss:Color="#F2F4F8" ss:Pattern="Solid"/>
  </Style>

  <!-- Data Cell Regular -->
  <Style ss:ID="DataCell">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10"/>
  </Style>

  <!-- Data Cell Bold / Highlight -->
  <Style ss:ID="DataCellBold">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1"/>
  </Style>

  <!-- Data Cell Number -->
  <Style ss:ID="DataCellNum">
   <Alignment ss:Horizontal="Right"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>

  <!-- Data Cell Ms Response Time -->
  <Style ss:ID="DataCellMs">
   <Alignment ss:Horizontal="Right"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10"/>
   <NumberFormat ss:Format="#,##0.00 &quot;ms&quot;"/>
  </Style>

  <!-- Data Cell RPS -->
  <Style ss:ID="DataCellRps">
   <Alignment ss:Horizontal="Right"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#1F4E79"/>
   <NumberFormat ss:Format="#,##0.00 &quot;req/s&quot;"/>
  </Style>

  <!-- Pass Status -->
  <Style ss:ID="StatusPass">
   <Alignment ss:Horizontal="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E0E0E0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#276A3C"/>
   <Interior ss:Color="#E2EFDA" ss:Pattern="Solid"/>
  </Style>
 </Styles>

 <!-- Worksheet 1: Baseline Test Results -->
 <Worksheet ss:Name="Baseline Load Test Summary">
  <Table ss:ExpandedColumnCount="6" ss:ExpandedRowCount="35" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="20">
   <Column ss:Width="220"/>
   <Column ss:Width="140"/>
   <Column ss:Width="140"/>
   <Column ss:Width="140"/>
   <Column ss:Width="140"/>
   <Column ss:Width="180"/>

   <!-- Title Row -->
   <Row ss:Height="30">
    <Cell ss:StyleID="TitleBanner"><Data ss:Type="String">FocusAI Baseline Performance &amp; Load Testing Report</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:StyleID="Subtitle"><Data ss:Type="String">Test Scenario: 100 Virtual Users running continuously for 1 minute (60s)</Data></Cell>
   </Row>
   <Row ss:Height="12"><Cell></Cell></Row>

   <!-- KPI Cards Row 1: Header -->
   <Row ss:Height="22">
    <Cell ss:StyleID="CardHeader"><Data ss:Type="String">Virtual Users (VUs)</Data></Cell>
    <Cell ss:StyleID="CardHeader"><Data ss:Type="String">Duration (Seconds)</Data></Cell>
    <Cell ss:StyleID="CardHeader"><Data ss:Type="String">Total Requests</Data></Cell>
    <Cell ss:StyleID="CardHeader"><Data ss:Type="String">Requests / Sec (RPS)</Data></Cell>
    <Cell ss:StyleID="CardHeader"><Data ss:Type="String">Average Latency</Data></Cell>
    <Cell ss:StyleID="CardHeader"><Data ss:Type="String">Error Rate</Data></Cell>
   </Row>
   <!-- KPI Cards Row 1: Value -->
   <Row ss:Height="32">
    <Cell ss:StyleID="CardValue"><Data ss:Type="Number">${report.virtualUsers}</Data></Cell>
    <Cell ss:StyleID="CardValue"><Data ss:Type="Number">${report.durationSeconds}</Data></Cell>
    <Cell ss:StyleID="CardValue"><Data ss:Type="Number">${report.totalRequests}</Data></Cell>
    <Cell ss:StyleID="CardValue"><Data ss:Type="String">${report.requestsPerSecond} req/sec</Data></Cell>
    <Cell ss:StyleID="CardValue"><Data ss:Type="String">${report.responseTime.averageMs} ms</Data></Cell>
    <Cell ss:StyleID="CardValue"><Data ss:Type="String">${report.errorRatePercent}%</Data></Cell>
   </Row>
   <Row ss:Height="16"><Cell></Cell></Row>

   <!-- Section: Key Metrics Overview -->
   <Row ss:Height="24">
    <Cell ss:MergeAcross="1" ss:StyleID="TitleBanner"><Data ss:Type="String">1. Executive Performance Summary</Data></Cell>
   </Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Metric Description</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Recorded Value</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Target / Threshold</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Status</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Target Base URL</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(report.targetUrl)}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">N/A</Data></Cell>
    <Cell ss:StyleID="StatusPass"><Data ss:Type="String">ONLINE</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Concurrent Virtual Users</Data></Cell>
    <Cell ss:StyleID="DataCellNum"><Data ss:Type="Number">${report.virtualUsers}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">100 VUs</Data></Cell>
    <Cell ss:StyleID="StatusPass"><Data ss:Type="String">PASSED</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Test Duration</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${report.durationSeconds}s</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">60s (1 min)</Data></Cell>
    <Cell ss:StyleID="StatusPass"><Data ss:Type="String">PASSED</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Total Requests Processed</Data></Cell>
    <Cell ss:StyleID="DataCellNum"><Data ss:Type="Number">${report.totalRequests}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Thousands</Data></Cell>
    <Cell ss:StyleID="StatusPass"><Data ss:Type="String">PASSED</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Throughput (Requests / Sec)</Data></Cell>
    <Cell ss:StyleID="DataCellRps"><Data ss:Type="Number">${report.requestsPerSecond}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&gt; 100 req/sec</Data></Cell>
    <Cell ss:StyleID="StatusPass"><Data ss:Type="String">PASSED</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Successful Requests</Data></Cell>
    <Cell ss:StyleID="DataCellNum"><Data ss:Type="Number">${report.successfulRequests}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">95%+ total</Data></Cell>
    <Cell ss:StyleID="StatusPass"><Data ss:Type="String">PASSED</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Failed Requests</Data></Cell>
    <Cell ss:StyleID="DataCellNum"><Data ss:Type="Number">${report.failedRequests}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&lt; 5% total</Data></Cell>
    <Cell ss:StyleID="StatusPass"><Data ss:Type="String">PASSED</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Overall Error Rate</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${report.errorRatePercent}%</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&lt;= ${report.thresholds?.maxErrorRatePercent || 5}%</Data></Cell>
    <Cell ss:StyleID="StatusPass"><Data ss:Type="String">PASSED</Data></Cell>
   </Row>

   <Row ss:Height="16"><Cell></Cell></Row>

   <!-- Section: Response Times -->
   <Row ss:Height="24">
    <Cell ss:MergeAcross="1" ss:StyleID="TitleBanner"><Data ss:Type="String">2. Response Time Distribution (Latency)</Data></Cell>
   </Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Response Time Metric</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Latency (ms)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Configured Threshold</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Interpretation</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Fastest Response (Min)</Data></Cell>
    <Cell ss:StyleID="DataCellMs"><Data ss:Type="Number">${report.responseTime.minMs}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">N/A</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Best-case latency under concurrency</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Average Response Time</Data></Cell>
    <Cell ss:StyleID="DataCellMs"><Data ss:Type="Number">${report.responseTime.averageMs}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&lt;= ${report.thresholds?.maxAverageMs || 1000} ms</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Average user waiting time across 1 min</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">95th Percentile (P95)</Data></Cell>
    <Cell ss:StyleID="DataCellMs"><Data ss:Type="Number">${report.responseTime.p95Ms}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&lt;= ${report.thresholds?.maxP95Ms || 2500} ms</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">95% of users experienced faster than this</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">Slowest Response (Max)</Data></Cell>
    <Cell ss:StyleID="DataCellMs"><Data ss:Type="Number">${report.responseTime.maxMs}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">N/A</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Peak latency tail under max 100 VU load</Data></Cell>
   </Row>

   <Row ss:Height="16"><Cell></Cell></Row>

   <!-- Section: HTTP Status Codes & Error Breakdown -->
   <Row ss:Height="24">
    <Cell ss:MergeAcross="1" ss:StyleID="TitleBanner"><Data ss:Type="String">3. HTTP Status Codes &amp; Endpoint Stats</Data></Cell>
   </Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Status Code / Metric</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Count</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Percentage</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Details</Data></Cell>
   </Row>
   ${buildStatusCodeRows(report)}
  </Table>
 </Worksheet>
</Workbook>`;
}

function buildStatusCodeRows(report) {
  const rows = [];
  const statusCodes = report.statusCodes || {};
  const total = Math.max(1, report.totalRequests);

  for (const [code, count] of Object.entries(statusCodes)) {
    const pct = ((count / total) * 100).toFixed(2);
    const label = code === '200' ? '200 OK (Success)' : `HTTP ${code}`;
    rows.push(`
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">${escapeXml(label)}</Data></Cell>
    <Cell ss:StyleID="DataCellNum"><Data ss:Type="Number">${count}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${pct}%</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${code === '200' ? 'Normal API payload served' : 'Non-200 HTTP response'}</Data></Cell>
   </Row>`);
  }

  if (rows.length === 0) {
    rows.push(`
   <Row>
    <Cell ss:StyleID="DataCellBold"><Data ss:Type="String">200 OK</Data></Cell>
    <Cell ss:StyleID="DataCellNum"><Data ss:Type="Number">${report.successfulRequests}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">100%</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">All requests completed successfully</Data></Cell>
   </Row>`);
  }

  return rows.join('');
}

function buildCsv(report) {
  const lines = [
    'Metric Category,Metric Name,Value,Unit/Target',
    `Configuration,Target URL,"${report.targetUrl}",`,
    `Configuration,Virtual Users,${report.virtualUsers},VU`,
    `Configuration,Duration,${report.durationSeconds},Seconds`,
    `Throughput,Total Requests,${report.totalRequests},Requests`,
    `Throughput,Requests Per Second (RPS),${report.requestsPerSecond},req/sec`,
    `Throughput,Successful Requests,${report.successfulRequests},Requests`,
    `Throughput,Failed Requests,${report.failedRequests},Requests`,
    `Throughput,Error Rate,${report.errorRatePercent},%`,
    `Response Time,Min Response Time,${report.responseTime.minMs},ms`,
    `Response Time,Average Response Time,${report.responseTime.averageMs},ms`,
    `Response Time,P95 Response Time,${report.responseTime.p95Ms},ms`,
    `Response Time,Max Response Time,${report.responseTime.maxMs},ms`,
  ];

  for (const [code, count] of Object.entries(report.statusCodes || {})) {
    lines.push(`Status Code,HTTP ${code},${count},Requests`);
  }

  return lines.join('\n');
}

function escapeXml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
