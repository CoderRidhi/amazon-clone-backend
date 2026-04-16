import express from "express";
import { getUserOrders } from "../controllers/orderController.js";
import {
  placeOrder,
  getAllOrders,
  getOrderById,
  deleteOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", placeOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.delete("/:id", deleteOrder);
router.get("/user/:userId", getUserOrders);

export default router;