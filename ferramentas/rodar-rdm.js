const { spawnSync } = require('node:child_process');
const path = require('node:path');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const { runNpm } = require('./run-npm');
const steps = [
  { label: 'Testes unitários', command: npm, args: ['run', 'test:unit'] },
  { label: 'Testes de integração no PostgreSQL do Compose', command: 'docker', args: ['compose', '--profile', 'test', 'run', '--build', '--rm', 'tests', 'npm', 'run', 'test:integration'] },
  { label: 'Validação do ambiente', command: npm, args: ['run', 'validar'] }
];
let failures = 0;
for (const step of steps) {
  console.log(`\n=== ${step.label} ===`);
  const options = { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' };
  const result = step.command === npm ? runNpm(step.args, options) : spawnSync(step.command, step.args, options);
  if (result.error || result.status !== 0) { failures += 1; console.error(`${step.label}: FALHA${result.error ? ` (${result.error.message})` : ''}`); }
}
console.log('\n=== Geração da Ficha RDM ===');
const pdf = spawnSync(process.execPath, ['ferramentas/gerar-rdm.js'], { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' });
if (pdf.error || pdf.status !== 0) process.exitCode = 1;
else if (failures > 0) process.exitCode = 1;
