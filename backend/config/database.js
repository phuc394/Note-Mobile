import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '123456',
    insecureAuth: true,
    database: 'note_mobile_db'
});

export default connection;