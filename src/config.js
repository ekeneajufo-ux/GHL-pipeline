require('dotenv').config();

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const PDF_DIR = process.env.PDF_DIR || './pdfs';

if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error('ERROR: GHL_API_KEY and GHL_LOCATION_ID must be set in .env');
  process.exit(1);
}

module.exports = {
  apiKey: GHL_API_KEY,
  locationId: GHL_LOCATION_ID,
  pdfDir: PDF_DIR,
  baseURL: 'https://services.leadconnectorhq.com',
  headers: {
    Authorization: `Bearer ${GHL_API_KEY}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  },
};
