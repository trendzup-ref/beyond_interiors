import express from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";
import { getAllCategories } from "../controllers/categoryController.js";
import {
  getPublicInstallationServices,
  trackOrderByNumber,
  trackInstallationByNumber,
  bookPublicInstallation,
  submitCustomerSupportTicket,
} from "../controllers/publicTrackingController.js";

const router = express.Router();

// Public storefront endpoints (no admin auth required)
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/categories", getAllCategories);

// Installation Services & Booking
router.get("/installations/services", getPublicInstallationServices);
router.post("/installations/book", bookPublicInstallation);

// Live Order & Installation Tracking
router.get("/tracking/order/:orderNumber", trackOrderByNumber);
router.get("/tracking/installation/:bookingNumber", trackInstallationByNumber);

// Customer Concierge & Support Tickets
router.post("/support/ticket", submitCustomerSupportTicket);

export default router;
