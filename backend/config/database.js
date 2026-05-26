import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  insecureAuth: process.env.DB_INSECURE_AUTH === 'true',
  database: process.env.DB_NAME,
});

export default connection;
