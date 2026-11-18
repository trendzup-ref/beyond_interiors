import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Admin Authentication Routes
 * Matches both /api/auth/admin/* and /api/admin/*
 */
router.post("/login", loginAdmin);
router.post("/admin/login", loginAdmin);

// Protected Admin Routes
router.post("/logout", protect, authorize("admin"), logoutAdmin);
router.post("/admin/logout", protect, authorize("admin"), logoutAdmin);

router.get("/me", protect, authorize("admin"), getAdminProfile);
router.get("/admin/me", protect, authorize("admin"), getAdminProfile);

export default router;
