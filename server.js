import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ✅ ROUTES
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import authRoutes from "./routes/authRoutes.js";


// ✅ LOAD ENV VARIABLES
dotenv.config();

const app = express();


// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());


// ✅ SERVE STATIC IMAGES
// http://localhost:5000/images/laptop.jpg
app.use("/images", express.static("public/images"));

app.use("/auth", authRoutes);
// ✅ ROUTES
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);


// ✅ DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Amazon Clone Backend Running...");
});


// ✅ ERROR HANDLER (optional but good practice)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong" });
});


// ✅ PORT
const PORT = process.env.PORT || 5000;


// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});