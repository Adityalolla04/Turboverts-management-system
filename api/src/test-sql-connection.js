const sql = require('mssql');

// Prefer environment variables so we can test Azure SQL connections.
const config = {
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASS || 'Srivatsav@04',
  server: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  database: process.env.DB_NAME || 'Turboverts_database',
  options: {
    encrypt: process.env.DB_ENCRYPT ? process.env.DB_ENCRYPT === 'true' : true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: { max: 2, min: 0, idleTimeoutMillis: 30000 },
};

(async () => {
  console.log('\nTesting DB connection with config (sensitive fields hidden):');
  console.log({ server: config.server, port: config.port, database: config.database });
  try {
    const pool = await sql.connect(config);
    const res = await pool.request().query('SELECT 1 AS val');
    console.log('Success:', res.recordset);
    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
