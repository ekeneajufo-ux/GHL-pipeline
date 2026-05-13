const chalk = require('chalk');

function step(msg) {
  process.stdout.write(chalk.cyan('  → ') + msg + '\n');
}

function success(msg) {
  console.log(chalk.green('  ✓ ') + msg);
}

function warn(msg) {
  console.log(chalk.yellow('  ⚠ ') + msg);
}

function error(msg) {
  console.log(chalk.red('  ✗ ') + msg);
}

function header(phase, title) {
  console.log('\n' + chalk.bold.blue(`═══ PHASE ${phase}: ${title} ═══`));
}

function report(phase, data) {
  console.log('\n' + chalk.bold('Output:'));
  console.log(JSON.stringify(data, null, 2));
}

function manual(instructions) {
  console.log('\n' + chalk.bold.yellow('  ── MANUAL STEPS REQUIRED ──'));
  instructions.forEach((line, i) => {
    console.log(chalk.yellow(`  ${i + 1}. ${line}`));
  });
}

module.exports = { step, success, warn, error, header, report, manual };
