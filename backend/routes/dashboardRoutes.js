import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected admin dashboard statistics endpoint
router.get("/stats", protect, authorize("admin"), getDashboardStats);

export default router;
