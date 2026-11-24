require('dotenv').config();
const app = require('./app');
const logger = require('./logger');
const { pool } = require('./db');

const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => logger.info({ port }, 'EstuLanches iniciado'));
async function shutdown(signal) {
  logger.info({ signal }, 'Encerrando aplicação');
  server.close(async () => { await pool.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
