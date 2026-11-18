import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  uploadProductImages,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Apply protect & authorize('admin') to all product routes
router.use(protect, authorize("admin"));

// Image upload helper
router.post("/upload-images", upload.array("images", 5), uploadProductImages);

// Product CRUD
router
  .route("/")
  .get(getAllProducts)
  .post(upload.array("images", 5), createProduct);

// Quick Stock Adjustment
router.route("/:id/stock").patch(updateStock).put(updateStock);

router
  .route("/:id")
  .get(getProductById)
  .put(upload.array("images", 5), updateProduct)
  .delete(deleteProduct);

export default router;
