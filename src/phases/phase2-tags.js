const { post } = require('../ghl-client');
const { locationId } = require('../config');
const { header, step, success, error, report } = require('../logger');
const tagData = require('../../data/tags');

async function run() {
  header(2, 'TAGS');
  const results = {};
  let totalCreated = 0;

  for (const [category, tags] of Object.entries(tagData)) {
    results[category] = [];
    for (const tagName of tags) {
      step(`Creating tag: ${tagName} [${category}]`);
      try {
        const data = await post(`/locations/${locationId}/tags`, { name: tagName });
        success(`${tagName} created`);
        results[category].push({ name: tagName, status: 'created', id: data.tag?.id || data.id });
        totalCreated++;
      } catch (err) {
        error(`${tagName}: ${err.message}`);
        results[category].push({ name: tagName, status: 'failed', error: err.message });
      }
    }
  }

  const byCategory = {};
  for (const [cat, items] of Object.entries(results)) {
    byCategory[cat] = items.filter((t) => t.status === 'created').length;
  }

  const summary = {
    phase: 2,
    status: totalCreated === 15 ? 'COMPLETE' : 'PARTIAL',
    tags_created: totalCreated,
    by_category: byCategory,
    details: results,
  };

  report(2, summary);
  return summary;
}

module.exports = { run };
