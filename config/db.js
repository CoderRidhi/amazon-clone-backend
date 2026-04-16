import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// ✅ Use full connection string (Aiven gives this)
const db = mysql.createPool(process.env.DATABASE_URL);

// ✅ Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  }
});

export default db;