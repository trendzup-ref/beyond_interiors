import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// ==========================================
// CATEGORY CONTROLLERS
// ==========================================

/**
 * @desc    Create a new category
 * @route   POST /api/admin/categories
 * @access  Private (Admin)
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    if (!name || name.trim() === "") {
      return sendError(res, 400, "Category name is required.");
    }

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingCategory) {
      return sendError(res, 400, "A category with this name already exists.");
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim() || "",
      image: image?.trim() || "",
      isActive: isActive !== undefined ? isActive : true,
    });

    await category.save();

    return sendSuccess(res, 201, "Category created successfully", { category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all categories (with subcategories count)
 * @route   GET /api/admin/categories
 * @access  Private (Admin) / Public for customers
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 }).lean();

    // Attach subcategory counts to each category
    const categoryIds = categories.map((cat) => cat._id);
    const subcounts = await Subcategory.aggregate([
      { $match: { category: { $in: categoryIds } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    subcounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const enrichedCategories = categories.map((cat) => ({
      ...cat,
      subcategoryCount: countMap[cat._id.toString()] || 0,
    }));

    return sendSuccess(res, 200, "Categories retrieved successfully", {
      categories: enrichedCategories,
      total: enrichedCategories.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category by ID with its subcategories
 * @route   GET /api/admin/categories/:id
 * @access  Private (Admin)
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, 404, "Category not found.");
    }

    const subcategories = await Subcategory.find({ category: category._id }).sort({
      name: 1,
    });

    return sendSuccess(res, 200, "Category details retrieved", {
      category,
      subcategories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/admin/categories/:id
 * @access  Private (Admin)
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return sendError(res, 404, "Category not found.");
    }

    if (name && name.trim() !== category.name) {
      const duplicate = await Category.findOne({
        _id: { $ne: category._id },
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      });
      if (duplicate) {
        return sendError(res, 400, "Another category with this name already exists.");
      }
      category.name = name.trim();
      category.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image.trim();
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return sendSuccess(res, 200, "Category updated successfully", { category });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category and verify no dependencies
 * @route   DELETE /api/admin/categories/:id
 * @access  Private (Admin)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, 404, "Category not found.");
    }

    // Check if subcategories exist
    const subcategoryCount = await Subcategory.countDocuments({ category: category._id });
    if (subcategoryCount > 0) {
      return sendError(
        res,
        400,
        `Cannot delete category. It contains ${subcategoryCount} subcategory/subcategories. Please remove or reassign them first.`
      );
    }

    await Category.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 200, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};

// ==========================================
// SUBCATEGORY CONTROLLERS
// ==========================================

/**
 * @desc    Create a new subcategory
 * @route   POST /api/admin/subcategories
 * @access  Private (Admin)
 */
export const createSubcategory = async (req, res, next) => {
  try {
    const { name, category, description, image, isActive } = req.body;

    if (!name || name.trim() === "") {
      return sendError(res, 400, "Subcategory name is required.");
    }

    if (!category) {
      return sendError(res, 400, "Parent category is required.");
    }

    // Verify parent category exists
    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return sendError(res, 404, "Selected parent category does not exist.");
    }

    const existingSubcategory = await Subcategory.findOne({
      category,
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingSubcategory) {
      return sendError(
        res,
        400,
        "A subcategory with this name already exists under the chosen category."
      );
    }

    const subcategory = new Subcategory({
      name: name.trim(),
      category,
      description: description?.trim() || "",
      image: image?.trim() || "",
      isActive: isActive !== undefined ? isActive : true,
    });

    await subcategory.save();
    await subcategory.populate("category", "name slug");

    return sendSuccess(res, 201, "Subcategory created successfully", { subcategory });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all subcategories (optional filter by parent category)
 * @route   GET /api/admin/subcategories
 * @access  Private (Admin) / Public
 */
export const getAllSubcategories = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    const subcategories = await Subcategory.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Subcategories retrieved successfully", {
      subcategories,
      total: subcategories.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get subcategory by ID
 * @route   GET /api/admin/subcategories/:id
 * @access  Private (Admin)
 */
export const getSubcategoryById = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate(
      "category",
      "name slug"
    );

    if (!subcategory) {
      return sendError(res, 404, "Subcategory not found.");
    }

    return sendSuccess(res, 200, "Subcategory details retrieved", { subcategory });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update subcategory
 * @route   PUT /api/admin/subcategories/:id
 * @access  Private (Admin)
 */
export const updateSubcategory = async (req, res, next) => {
  try {
    const { name, category, description, image, isActive } = req.body;
    const subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return sendError(res, 404, "Subcategory not found.");
    }

    if (category && category !== subcategory.category.toString()) {
      const parentExists = await Category.findById(category);
      if (!parentExists) {
        return sendError(res, 404, "Selected parent category does not exist.");
      }
      subcategory.category = category;
    }

    if (name && name.trim() !== subcategory.name) {
      const duplicate = await Subcategory.findOne({
        _id: { $ne: subcategory._id },
        category: subcategory.category,
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      });

      if (duplicate) {
        return sendError(
          res,
          400,
          "Another subcategory with this name already exists under this category."
        );
      }

      subcategory.name = name.trim();
      subcategory.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    if (description !== undefined) subcategory.description = description.trim();
    if (image !== undefined) subcategory.image = image.trim();
    if (isActive !== undefined) subcategory.isActive = isActive;

    await subcategory.save();
    await subcategory.populate("category", "name slug");

    return sendSuccess(res, 200, "Subcategory updated successfully", { subcategory });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete subcategory
 * @route   DELETE /api/admin/subcategories/:id
 * @access  Private (Admin)
 */
export const deleteSubcategory = async (req, res, next) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) {
      return sendError(res, 404, "Subcategory not found.");
    }

    await Subcategory.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 200, "Subcategory deleted successfully");
  } catch (error) {
    next(error);
  }
};

export default {
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
};
