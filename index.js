const chalk = require('chalk');

const phases = {
  1: require('./src/phases/phase1-custom-fields'),
  2: require('./src/phases/phase2-tags'),
  3: require('./src/phases/phase3-email-templates'),
  4: require('./src/phases/phase4-workflows'),
  5: require('./src/phases/phase5-pipeline'),
  6: require('./src/phases/phase6-integrations'),
};

function printBanner() {
  console.log(chalk.bold.blue('\n════════════════════════════════════════════════════════════'));
  console.log(chalk.bold.blue('   GHL Implementation Suite — PracticeRx Consulting'));
  console.log(chalk.bold.blue('════════════════════════════════════════════════════════════\n'));
}

function printCompletion(results) {
  console.log('\n' + chalk.bold.green('════════════════════════════════════════════════════════════'));
  console.log(chalk.bold.green('   🎉 GHL IMPLEMENTATION COMPLETE!'));
  console.log(chalk.bold.green('════════════════════════════════════════════════════════════\n'));

  const icons = { COMPLETE: '✅', PARTIAL: '⚠️ ', FAILED: '❌', MANUAL_REQUIRED: '📋' };
  const labels = [
    [1, '9 Custom Fields'],
    [2, '15 Tags'],
    [3, '7 Email Templates'],
    [4, '5 Workflows'],
    [5, '1 Pipeline (6 stages)'],
    [6, 'Integrations + PDF Uploads'],
  ];

  for (const [phase, label] of labels) {
    const status = results[phase]?.status || 'SKIPPED';
    const icon = icons[status] || '⏭️ ';
    console.log(`  ${icon} Phase ${phase}: ${label} — ${status}`);
  }

  console.log('\n' + chalk.bold('NEXT STEPS:'));
  console.log('  1. Complete any MANUAL_REQUIRED steps printed above');
  console.log('  2. Verify each phase in the GHL dashboard');
  console.log('  3. Run a test contact through each workflow');
  console.log('  4. Place PDF files in ./pdfs/ and re-run Phase 6 if needed');
  console.log('\n' + chalk.bold.green('════════════════════════════════════════════════════════════\n'));
}

async function main() {
  printBanner();

  const args = process.argv.slice(2);
  const phaseFlag = args.indexOf('--phase');
  const targetPhase = phaseFlag !== -1 ? parseInt(args[phaseFlag + 1]) : null;

  if (targetPhase && !phases[targetPhase]) {
    console.error(`Unknown phase: ${targetPhase}. Valid phases are 1–6.`);
    process.exit(1);
  }

  const results = {};

  if (targetPhase) {
    results[targetPhase] = await phases[targetPhase].run();
  } else {
    for (const phase of Object.keys(phases)) {
      results[phase] = await phases[phase].run();
      console.log();
    }
    printCompletion(results);
  }
}

main().catch((err) => {
  console.error(chalk.red('\nFatal error:'), err.message);
  process.exit(1);
});
