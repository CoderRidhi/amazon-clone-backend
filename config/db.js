import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing");
}

const db = mysql.createPool(process.env.DATABASE_URL);

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  }
});

export default db;