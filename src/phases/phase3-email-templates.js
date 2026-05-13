const { post } = require('../ghl-client');
const { locationId } = require('../config');
const { header, step, success, error, report } = require('../logger');
const templates = require('../../data/email-templates');

async function run() {
  header(3, 'EMAIL TEMPLATES');
  const results = [];

  for (const tmpl of templates) {
    step(`Creating template: ${tmpl.name}`);
    try {
      const data = await post(`/locations/${locationId}/emails/builder`, {
        title: tmpl.name,
        name: tmpl.name,
        subject: tmpl.subject,
        body: tmpl.html,
        type: 'html',
      });
      success(`"${tmpl.name}" created`);
      results.push({ name: tmpl.name, status: 'created', id: data.template?.id || data.id });
    } catch (err) {
      error(`"${tmpl.name}": ${err.message}`);
      results.push({ name: tmpl.name, status: 'failed', error: err.message });
    }
  }

  const summary = {
    phase: 3,
    status: results.every((r) => r.status === 'created') ? 'COMPLETE' : 'PARTIAL',
    templates_created: results.filter((r) => r.status === 'created').length,
    details: results,
  };

  report(3, summary);
  return summary;
}

module.exports = { run };
