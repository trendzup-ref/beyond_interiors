import express from "express";
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  reorderBanners,
  getFeaturedProducts,
  toggleFeaturedProduct,
} from "../controllers/bannerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All homepage management routes are protected for admin
router.use(protect, authorize("admin"));

// Featured products endpoints
router.get("/featured-products", getFeaturedProducts);
router.patch("/featured-products/:id", toggleFeaturedProduct);

// Reordering banners endpoint
router.put("/reorder", reorderBanners);

// Core Banner CRUD endpoints
router.route("/").get(getAllBanners).post(upload.single("image"), createBanner);

router
  .route("/:id")
  .get(getBannerById)
  .put(upload.single("image"), updateBanner)
  .delete(deleteBanner);

router.patch("/:id/toggle-status", toggleBannerStatus);

export default router;
