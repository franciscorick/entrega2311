const fs = require('node:fs');
const path = require('node:path');
const PDFDocument = require('pdfkit');
const root = path.resolve(__dirname, '..');
const rdm = path.join(root, 'rdm');
function readJson(file, command) {
  const full = path.join(rdm, file);
  if (!fs.existsSync(full)) { console.error(`Arquivo necessário ausente: rdm/${file}. Rode antes: ${command}`); process.exit(1); }
  try { return JSON.parse(fs.readFileSync(full, 'utf8')); }
  catch { console.error(`O arquivo rdm/${file} não contém JSON válido. Rode antes: ${command}`); process.exit(1); }
}
const unit = readJson('testes-unitarios.json', 'npm run test:unit');
const integration = readJson('testes-integracao.json', 'npm run test:integration');
const environment = readJson('resultados.json', 'npm run validar');
const config = JSON.parse(fs.readFileSync(path.join(rdm, 'config-rdm.json'), 'utf8'));
const pkg = require('../package.json');
const compose = fs.readFileSync(path.join(root, 'docker-compose.yml'), 'utf8');
const envExample = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
const stats = (report) => ({ total: report.numTotalTests || 0, passed: report.numPassedTests || 0, failed: report.numFailedTests || 0 });
const unitStats = stats(unit), integrationStats = stats(integration);
const allTests = unitStats.total + integrationStats.total;
const failedTests = unitStats.failed + integrationStats.failed;
const environmentChecks = ['composePs', 'logs', 'health'];
const environmentFailed = environmentChecks.some((key) => environment.checks?.[key] === false) || (environment.logCriticalErrors ?? 0) > 0;
const environmentIncomplete = environmentChecks.some((key) => environment.checks?.[key] !== true);
const partial = allTests === 0 || unitStats.passed + integrationStats.passed < allTests || environmentIncomplete;
const status = failedTests > 0 || environmentFailed ? 'FALHA' : partial ? 'SUCESSO COM RESSALVAS' : 'SUCESSO';
const variableNames = [...new Set([...envExample.matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((m) => m[1]))];
const dbUser = envExample.match(/^POSTGRES_USER=(.*)$/m)?.[1] || 'não identificado';
const appPort = envExample.match(/^HOST_PORT=(.*)$/m)?.[1] || '3000';
const containerPort = envExample.match(/^PORT=(.*)$/m)?.[1] || '3000';
const volume = compose.match(/-\s*(postgres_data):\/var\/lib\/postgresql\/data/)?.[1] || 'postgres_data';
const output = path.join(rdm, 'RDM-EstuLanches-Chico.pdf');
const doc = new PDFDocument({ size: 'A4', margin: 38, info: { Title: 'RDM EstuLanches - Francisco', Author: 'Francisco' } });
doc.pipe(fs.createWriteStream(output));
const brand = '#173f35', dark = '#20362f', muted = '#69766d', pale = '#edf1e8';
doc.rect(0, 0, 595.28, 105).fill(brand);
doc.fillColor('white').font('Helvetica-Bold').fontSize(21).text('FICHA DE MUDANÇA', 38, 31);
doc.font('Helvetica').fontSize(11).text('Entrada em operação · Cantina EstuLanches', 38, 62);
doc.fontSize(9).text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 38, 81);
doc.roundedRect(411, 32, 146, 38, 10).fill(status === 'SUCESSO' ? '#dff4e8' : status === 'FALHA' ? '#fde5e2' : '#fff1d9');
doc.fillColor(status === 'SUCESSO' ? '#176341' : status === 'FALHA' ? '#a3332d' : '#87530e').font('Helvetica-Bold').fontSize(10).text(status, 418, 46, { width: 132, align: 'center' });
let y = 125;
function heading(text) { doc.fillColor(brand).font('Helvetica-Bold').fontSize(11).text(text.toUpperCase(), 38, y); y += 19; }
function row(label, value, index) {
  doc.rect(38, y, 519, 25).fill(index % 2 ? '#ffffff' : pale);
  doc.fillColor(muted).font('Helvetica-Bold').fontSize(8.5).text(label, 47, y + 8, { width: 145 });
  doc.fillColor(dark).font('Helvetica').fontSize(8.5).text(String(value), 196, y + 8, { width: 351, ellipsis: true }); y += 25;
}
heading('Identificação');
[
  ['Sistema / versão', `EstuLanches · ${pkg.version}`], ['Responsável', `${config.responsavel.cargo} · ${config.responsavel.nome}`],
  ['Ambiente', config.ambiente], ['Aplicação / banco', `porta host ${appPort} -> container ${containerPort} · PostgreSQL 16 · usuário ${dbUser}`],
  ['Configuração', `variáveis: ${variableNames.join(', ')} · volume persistente: ${volume}`]
].forEach((entry, i) => row(entry[0], entry[1], i));
y += 13; heading('Resultados dos testes e ambiente');
[
  ['Testes unitários', `${unitStats.passed}/${unitStats.total} aprovados · ${unitStats.failed} falhas`],
  ['Testes integração', `${integrationStats.passed}/${integrationStats.total} aprovados · ${integrationStats.failed} falhas`],
  ['Ambiente / API', `Compose ${environment.checks?.composePs ? 'OK' : 'FALHA'} · /health ${environment.health?.ok ? 'OK' : 'FALHA'} · erros críticos nos logs: ${environment.logCriticalErrors ?? 'não apurado'}`]
].forEach((entry, i) => row(entry[0], entry[1], i));
y += 13; heading('Observações e plano de rollback');
doc.fillColor(dark).font('Helvetica').fontSize(8.5)
  .text('A aplicação é servida em container Node.js não-root; PostgreSQL permanece isolado em rede interna e usa volume persistente. A ficha foi preenchida com os artefatos de validação disponíveis na data de geração.', 38, y, { width: 519, lineGap: 3 });
y += 48;
doc.roundedRect(38, y, 519, 48, 8).fill('#f4f6f5');
doc.fillColor(dark).font('Helvetica-Bold').fontSize(9).text('Rollback', 49, y + 9);
doc.font('Helvetica').fontSize(8.5).text('Execute `docker compose down` e suba novamente a imagem/tag anterior aprovada com `docker compose up -d`.', 49, y + 24, { width: 495 });
doc.end();
console.log(`PDF de uma página gerado: ${path.relative(root, output)} · status ${status}`);
