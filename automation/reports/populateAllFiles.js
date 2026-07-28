import { buildEnterpriseReports } from './generateReports.js';

async function run() {
  await buildEnterpriseReports();
}

run().catch(console.error);
