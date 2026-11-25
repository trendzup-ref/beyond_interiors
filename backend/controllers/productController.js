import Product from "../models/product.js";
import Category from "../models/category.js";
import Subcategory from "../models/subcategory.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * @desc    Create a new product
 * @route   POST /api/admin/products
 * @access  Private (Admin)
 */
export const createProduct = async (req, res, next) => {
  try {
    let {
      name,
      description,
      category,
      subcategory,
      images,
      variants,
      isFeatured,
      isActive,
    } = req.body;

    // Parse JSON strings if form-data was used
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        return sendError(res, 400, "Invalid variants JSON format.");
      }
    }

    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch (e) {
        images = [images];
      }
    }

    // Attach uploaded files if multer processed any
    if (req.files && req.files.length > 0) {
      const uploadedPaths = req.files.map((file) => `/uploads/${file.filename}`);
      images = images ? [...images, ...uploadedPaths] : uploadedPaths;
    }

    // Basic Validations
    if (!name || !name.trim()) {
      return sendError(res, 400, "Product name is required.");
    }
    if (!description || !description.trim()) {
      return sendError(res, 400, "Product description is required.");
    }
    if (!category) {
      return sendError(res, 400, "Category is required.");
    }

    // Image validations: At least 1 image mandatory, maximum 5 images
    if (!images || !Array.isArray(images) || images.length === 0) {
      return sendError(res, 400, "At least one product image is mandatory.");
    }
    if (images.length > 5) {
      return sendError(res, 400, "You can upload a maximum of 5 images per product.");
    }

    // Verify Category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return sendError(res, 404, "Selected category not found.");
    }

    // Verify Subcategory if provided
    if (subcategory) {
      const subcategoryExists = await Subcategory.findById(subcategory);
      if (!subcategoryExists) {
        return sendError(res, 404, "Selected subcategory not found.");
      }
    } else {
      subcategory = null;
    }

    // Validate Variants
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return sendError(res, 400, "At least one product variant (with SKU, price, stock) is required.");
    }

    // Validate unique SKUs within the product and check required fields
    const seenSkus = new Set();
    for (const v of variants) {
      if (!v.sku || !v.sku.trim()) {
        return sendError(res, 400, "Each variant must have an SKU.");
      }
      const upperSku = v.sku.trim().toUpperCase();
      if (seenSkus.has(upperSku)) {
        return sendError(res, 400, `Duplicate SKU "${upperSku}" found in variants.`);
      }
      seenSkus.add(upperSku);

      if (v.price === undefined || Number(v.price) < 0) {
        return sendError(res, 400, `Invalid price for variant SKU: ${upperSku}`);
      }
      if (v.mrp === undefined || Number(v.mrp) < 0) {
        return sendError(res, 400, `Invalid MRP for variant SKU: ${upperSku}`);
      }
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      category,
      subcategory,
      images: images || [],
      variants,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isActive: isActive !== undefined ? isActive : true,
    });

    await product.save();
    await product.populate(["category", "subcategory"]);

    return sendSuccess(res, 201, "Product created successfully", { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products (with filters, pagination, and search)
 * @route   GET /api/admin/products
 * @access  Private (Admin) / Storefront
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      subcategory,
      status,
      lowStock,
      isFeatured,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { "variants.sku": { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    // Low stock filter (products where totalStock or any variant stock <= 5)
    if (lowStock === "true" || lowStock === true) {
      filter.$or = [
        { totalStock: { $lte: 5 } },
        { "variants.stockQuantity": { $lte: 5 } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Products retrieved successfully", {
      products,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(totalCount / Number(limit)) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/admin/products/:id
 * @access  Private (Admin)
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    if (!product) {
      return sendError(res, 404, "Product not found.");
    }

    return sendSuccess(res, 200, "Product details retrieved", { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/admin/products/:id
 * @access  Private (Admin)
 */
export const updateProduct = async (req, res, next) => {
  try {
    let {
      name,
      description,
      category,
      subcategory,
      images,
      variants,
      isFeatured,
      isActive,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Product not found.");
    }

    if (name) product.name = name.trim();
    if (description) product.description = description.trim();

    if (category) {
      const catExists = await Category.findById(category);
      if (!catExists) return sendError(res, 404, "Category not found.");
      product.category = category;
    }

    if (subcategory !== undefined) {
      if (subcategory) {
        const subExists = await Subcategory.findById(subcategory);
        if (!subExists) return sendError(res, 404, "Subcategory not found.");
        product.subcategory = subcategory;
      } else {
        product.subcategory = null;
      }
    }

    // Attach uploaded files if any
    if (req.files && req.files.length > 0) {
      const uploadedPaths = req.files.map((file) => `/uploads/${file.filename}`);
      images = images ? [...images, ...uploadedPaths] : uploadedPaths;
    }

    if (images !== undefined) {
      if (!Array.isArray(images) || images.length === 0) {
        return sendError(res, 400, "At least one product image is mandatory.");
      }
      if (images.length > 5) {
        return sendError(res, 400, "You can upload a maximum of 5 images per product.");
      }
      product.images = images;
    }

    if (variants !== undefined) {
      if (!Array.isArray(variants) || variants.length === 0) {
        return sendError(res, 400, "At least one variant is required.");
      }
      product.variants = variants;
    }

    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();
    await product.populate(["category", "subcategory"]);

    return sendSuccess(res, 200, "Product updated successfully", { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/admin/products/:id
 * @access  Private (Admin)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Product not found.");
    }

    await Product.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 200, "Product deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick Stock adjustment for Inventory Management
 * @route   PATCH or PUT /api/admin/products/:id/stock
 * @access  Private (Admin)
 */
export const updateStock = async (req, res, next) => {
  try {
    const { variantId, stockQuantity, adjustments } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Product not found.");
    }

    // 1. Multiple variant adjustments in one call: [{ variantId, stockQuantity }]
    if (adjustments && Array.isArray(adjustments)) {
      adjustments.forEach((adj) => {
        const variant = product.variants.id(adj.variantId);
        if (variant && adj.stockQuantity !== undefined) {
          variant.stockQuantity = Math.max(0, Number(adj.stockQuantity));
        }
      });
    }
    // 2. Single variant adjustment: { variantId, stockQuantity }
    else if (variantId && stockQuantity !== undefined) {
      const variant = product.variants.id(variantId);
      if (!variant) {
        return sendError(res, 404, "Variant not found on this product.");
      }
      variant.stockQuantity = Math.max(0, Number(stockQuantity));
    }
    // 3. Fallback: single product with 1 default variant
    else if (stockQuantity !== undefined && product.variants.length === 1) {
      product.variants[0].stockQuantity = Math.max(0, Number(stockQuantity));
    } else {
      return sendError(
        res,
        400,
        "Please provide variantId and new stockQuantity (or an adjustments array)."
      );
    }

    await product.save();

    return sendSuccess(res, 200, "Stock updated successfully", {
      productId: product._id,
      totalStock: product.totalStock,
      variants: product.variants,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload product images endpoint
 * @route   POST /api/admin/products/upload-images
 * @access  Private (Admin)
 */
export const uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return sendError(res, 400, "No image files uploaded.");
    }

    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);

    return sendSuccess(res, 200, "Images uploaded successfully", {
      images: fileUrls,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  uploadProductImages,
};
