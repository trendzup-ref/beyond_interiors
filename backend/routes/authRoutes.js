import express from "express";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  registerCustomer,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Public Authentication Routes
 * Common unified login and customer registration
 */
router.post("/login", loginUser);
router.post("/admin/login", loginUser); // Backward compatibility for admin login
router.post("/register", registerCustomer);

/**
 * Protected Authentication Routes (Common for Admin and Customer)
 */
router.post("/logout", protect, logoutUser);
router.post("/admin/logout", protect, logoutUser); // Backward compatibility

router.get("/me", protect, getCurrentUser);
router.get("/admin/me", protect, getCurrentUser); // Backward compatibility

// Customer Profile Management Routes (Protected for Customer Role Only)
router.put("/profile", protect, authorize("customer"), updateProfile);
router.put("/password", protect, authorize("customer"), changePassword);

export default router;
