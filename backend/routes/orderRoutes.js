import express from "express";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentRecord,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Guard all order management routes for admin role
router.use(protect, authorize("admin"));

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment", updatePaymentRecord);
router.post("/:id/cancel", cancelOrder);

export default router;
