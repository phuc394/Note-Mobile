import './env.js';
import mysql from 'mysql2';

const sslEnabled = process.env.DB_SSL === 'true';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT ?? 3306),
  password: process.env.DB_PASSWORD,
  insecureAuth: process.env.DB_INSECURE_AUTH === 'true',
  database: process.env.DB_NAME,
  ssl: sslEnabled ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined,
});

export default connection;
