import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/categoryController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect & authorize('admin') to all admin category and subcategory routes
router.use(protect, authorize("admin"));

// Category Routes
router.route("/categories").post(createCategory).get(getAllCategories);
router
  .route("/categories/:id")
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

// Subcategory Routes
router.route("/subcategories").post(createSubcategory).get(getAllSubcategories);
router
  .route("/subcategories/:id")
  .get(getSubcategoryById)
  .put(updateSubcategory)
  .delete(deleteSubcategory);

export default router;
