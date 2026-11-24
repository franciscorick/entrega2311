const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
require('dotenv').config({ path: path.join(root, '.env') });
const outputDir = path.join(root, 'rdm');
fs.mkdirSync(outputDir, { recursive: true });
const run = (args) => execFileSync('docker', ['compose', ...args], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const criticalPattern = /\b(fatal|panic|uncaught exception|unhandled rejection|ECONNREFUSED|permission denied|error: relation .* does not exist)\b/i;
const result = { generatedAt: new Date().toISOString(), packageVersion: require('../package.json').version, composePs: '', logCriticalErrors: 0, criticalLogLines: [], health: { ok: false, status: null, body: null }, checks: {} };
let failed = false;
try {
  // Aguarda a inicialização normal após `docker compose up -d`.
  for (let attempt = 0; attempt < 30; attempt += 1) {
    result.composePs = run(['ps']);
    if (/healthy/i.test(result.composePs) && !/health: starting/i.test(result.composePs)) break;
    if (attempt < 29) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000);
  }
  result.checks.composePs = /healthy/i.test(result.composePs) && !/health: starting/i.test(result.composePs);
} catch (error) { result.checks.composePs = false; result.composeError = error.stderr || error.message; failed = true; }
try {
  const logs = run(['logs', '--no-color', '--tail=500']);
  result.criticalLogLines = logs.split(/\r?\n/).filter((line) => criticalPattern.test(line));
  result.logCriticalErrors = result.criticalLogLines.length;
  result.checks.logs = result.logCriticalErrors === 0;
} catch (error) { result.checks.logs = false; result.logError = error.stderr || error.message; failed = true; }
function save() {
  failed = failed || !result.checks.composePs || !result.checks.logs || !result.checks.health;
  fs.writeFileSync(path.join(outputDir, 'resultados.json'), `${JSON.stringify(result, null, 2)}\n`);
}
// Espera a chamada assíncrona de health e só então retorna o resumo.
(async () => {
  try {
    const response = await fetch(`http://127.0.0.1:${process.env.HOST_PORT || 3000}/health`, { signal: AbortSignal.timeout(5000) });
    result.health.status = response.status;
    try { result.health.body = await response.json(); } catch { result.health.body = await response.text(); }
    result.health.ok = response.ok && result.health.body.database === 'connected';
    result.checks.health = result.health.ok;
  } catch (error) { result.health.error = error.message; result.checks.health = false; }
  save();
  console.log(`Compose: ${result.checks.composePs ? 'OK' : 'FALHA'}`);
  console.log(`Logs críticos: ${result.logCriticalErrors} (${result.checks.logs ? 'OK' : 'FALHA'})`);
  console.log(`API /health: ${result.health.ok ? 'OK' : 'FALHA'}`);
  console.log(`Resultado salvo em rdm/resultados.json`);
  if (failed) process.exitCode = 1;
})();
