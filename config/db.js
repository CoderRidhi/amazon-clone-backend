import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // ✅ load env variables

// ✅ Create pool (better than single connection)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Pool Connected");
    connection.release();
  }
});

export default db;