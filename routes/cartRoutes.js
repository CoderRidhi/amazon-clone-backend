import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();


// ✅ GET CART ITEMS
router.get("/", getCart);


// ✅ ADD TO CART
router.post("/", addToCart);


// ✅ UPDATE QUANTITY
router.put("/", updateCartItem);


// ✅ REMOVE SINGLE ITEM
router.delete("/:product_id", removeFromCart);


// ✅ CLEAR FULL CART
router.delete("/", clearCart);


export default router;