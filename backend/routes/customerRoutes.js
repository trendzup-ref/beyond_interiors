import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
} from "../controllers/customerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect & authorize('admin') to all customer administration routes
router.use(protect, authorize("admin"));

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.patch("/:id/status", updateCustomerStatus);
router.put("/:id/status", updateCustomerStatus);

export default router;
