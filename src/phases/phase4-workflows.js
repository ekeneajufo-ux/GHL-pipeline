const { header, step, warn, report, manual } = require('../logger');
const workflows = require('../../data/workflows');

/*
 * GHL's Workflow API does not expose full trigger/action creation via REST.
 * This phase prints a detailed manual checklist for each workflow with the
 * exact settings to configure in the GHL UI (Automation → Workflows).
 */
async function run() {
  header(4, 'WORKFLOWS');

  warn('GHL does not expose full workflow creation via REST API.');
  warn('This phase prints exact manual setup instructions for each workflow.\n');

  const results = [];

  for (let i = 0; i < workflows.length; i++) {
    const wf = workflows[i];
    step(`Workflow ${i + 1}: ${wf.name}`);

    const instructions = [
      `Go to: Automation → Workflows → Create Workflow`,
      `Name: "${wf.name}"`,
      `Trigger: ${wf.trigger}`,
      `Add the following actions in order:`,
      ...wf.actions.map((a, idx) => `  Action ${idx + 1}: ${a}`),
      `Click Save & Activate`,
    ];

    manual(instructions);
    results.push({ name: wf.name, status: 'manual_required', action_count: wf.actions.length });
    console.log();
  }

  const summary = {
    phase: 4,
    status: 'MANUAL_REQUIRED',
    workflows_to_create: workflows.length,
    note: 'Follow the printed checklist above in GHL → Automation → Workflows',
    details: results,
  };

  report(4, summary);
  return summary;
}

module.exports = { run };
