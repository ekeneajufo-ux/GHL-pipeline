const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { postForm } = require('../ghl-client');
const { locationId, pdfDir } = require('../config');
const { header, step, success, warn, error, report, manual } = require('../logger');

const PDF_FILES = [
  'PracticeRx_DPC_Practice_Launch_Teaser_Guide.pdf',
  'PracticeRx_DPC_Pediatric_Vaccine_Cost_Guide.pdf',
  'PracticeRx_Family_Medicine_DPC_Launch_Guide.pdf',
  'PracticeRx_AI_Workflow_Optimization_Guide.pdf',
];

async function uploadPDF(filename) {
  const filepath = path.resolve(pdfDir, filename);
  if (!fs.existsSync(filepath)) {
    warn(`PDF not found, skipping: ${filepath}`);
    return { name: filename, status: 'skipped', reason: 'file not found' };
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filepath));
  form.append('name', filename);

  try {
    const data = await postForm(`/locations/${locationId}/files`, form);
    const url = data.file?.url || data.url || 'check GHL file manager';
    success(`Uploaded: ${filename} → ${url}`);
    return { name: filename, status: 'uploaded', url };
  } catch (err) {
    error(`Failed to upload ${filename}: ${err.message}`);
    return { name: filename, status: 'failed', error: err.message };
  }
}

async function run() {
  header(6, 'INTEGRATIONS');

  // Google Calendar — must be done via UI (OAuth)
  manual([
    'Navigate to: GHL → Settings → Integrations → Calendar',
    'Click "Connect" next to Google Calendar',
    'Sign in with your Google account',
    'Select the calendar you want to use for appointment tracking',
    'Click Save — verify status shows "Connected"',
  ]);

  console.log();

  // PDF uploads
  step(`Uploading PDFs from: ${path.resolve(pdfDir)}`);
  console.log();

  const uploadResults = [];
  for (const pdf of PDF_FILES) {
    uploadResults.push(await uploadPDF(pdf));
  }

  const uploaded = uploadResults.filter((r) => r.status === 'uploaded');

  const summary = {
    phase: 6,
    status: uploaded.length === PDF_FILES.length ? 'COMPLETE' : 'PARTIAL',
    integrations: {
      google_calendar: { status: 'manual_required', instructions: 'See printed steps above' },
      pdfs_uploaded: uploaded.length,
      files: uploadResults,
    },
  };

  report(6, summary);
  return summary;
}

module.exports = { run };
