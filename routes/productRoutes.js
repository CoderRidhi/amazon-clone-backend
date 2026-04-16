import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();


// ✅ GET ALL PRODUCTS (with search + category filter)
router.get("/", getAllProducts);


// ✅ GET SINGLE PRODUCT BY ID
router.get("/:id", getProductById);


// ✅ CREATE NEW PRODUCT
router.post("/", createProduct);


// ✅ UPDATE PRODUCT
router.put("/:id", updateProduct);


// ✅ DELETE PRODUCT
router.delete("/:id", deleteProduct);


export default router;