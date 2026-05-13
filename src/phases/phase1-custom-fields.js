const { post } = require('../ghl-client');
const { locationId } = require('../config');
const { header, step, success, error, report } = require('../logger');
const fields = require('../../data/custom-fields');

async function run() {
  header(1, 'CUSTOM FIELDS');
  const results = [];

  for (const field of fields) {
    step(`Creating field: ${field.name} (${field.dataType})`);
    try {
      const data = await post(`/locations/${locationId}/customFields`, {
        name: field.name,
        dataType: field.dataType,
        placeholder: field.placeholder,
      });
      success(`${field.name} created (id: ${data.customField?.id || data.id})`);
      results.push({ name: field.name, type: field.dataType, status: 'created' });
    } catch (err) {
      error(`${field.name}: ${err.message}`);
      results.push({ name: field.name, type: field.dataType, status: 'failed', error: err.message });
    }
  }

  const summary = {
    phase: 1,
    status: results.every((r) => r.status === 'created') ? 'COMPLETE' : 'PARTIAL',
    fields_created: results.filter((r) => r.status === 'created').length,
    details: results,
  };

  report(1, summary);
  return summary;
}

module.exports = { run };
