const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root', // username ของ MySQL Workbench
  password: '1234', // password ของ MySQL Workbench
  database: 'auth_demo',
  port: 3307,           // <<< เพิ่มบรรทัดนี้
  port: process.env.DB_PORT || 3306
});
module.exports = pool;
