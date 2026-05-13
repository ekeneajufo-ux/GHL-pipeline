const { post } = require('../ghl-client');
const { locationId } = require('../config');
const { header, step, success, error, report } = require('../logger');
const pipelineData = require('../../data/pipeline');

async function run() {
  header(5, 'PIPELINE');
  step(`Creating pipeline: "${pipelineData.name}"`);

  try {
    const data = await post(`/opportunities/pipelines`, {
      name: pipelineData.name,
      locationId,
      stages: pipelineData.stages.map((name, index) => ({ name, position: index })),
    });

    const pipelineId = data.pipeline?.id || data.id;
    success(`Pipeline "${pipelineData.name}" created (id: ${pipelineId})`);

    const summary = {
      phase: 5,
      status: 'COMPLETE',
      pipeline: {
        name: pipelineData.name,
        id: pipelineId,
        stages: pipelineData.stages,
        auto_movement: false,
      },
    };

    report(5, summary);
    return summary;
  } catch (err) {
    error(`Pipeline creation failed: ${err.message}`);
    const summary = { phase: 5, status: 'FAILED', error: err.message };
    report(5, summary);
    return summary;
  }
}

module.exports = { run };
