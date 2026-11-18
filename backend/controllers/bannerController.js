import Banner from "../models/banner.js";
import Product from "../models/product.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * @desc    Get all banners
 * @route   GET /api/admin/banners
 * @access  Private (Admin)
 */
export const getAllBanners = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === "true" || isActive === true;
    }

    const banners = await Banner.find(filter).sort({ displayOrder: 1, createdAt: -1 });

    return sendSuccess(res, 200, "Banners retrieved successfully.", {
      banners,
      count: banners.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single banner by ID
 * @route   GET /api/admin/banners/:id
 * @access  Private (Admin)
 */
export const getBannerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return sendError(res, 404, "Banner not found.");
    }

    return sendSuccess(res, 200, "Banner retrieved successfully.", { banner });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new banner
 * @route   POST /api/admin/banners
 * @access  Private (Admin)
 */
export const createBanner = async (req, res, next) => {
  try {
    let { title, subtitle, imageUrl, linkUrl, displayOrder, isActive } = req.body;

    if (!title || !title.trim()) {
      return sendError(res, 400, "Banner title is required.");
    }

    // Check if an image was uploaded via multer
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl || !imageUrl.trim()) {
      return sendError(res, 400, "Banner image is required (upload a file or provide an imageUrl).");
    }

    // Auto-compute display order if not specified
    if (displayOrder === undefined || displayOrder === null || displayOrder === "") {
      const highestBanner = await Banner.findOne().sort({ displayOrder: -1 });
      displayOrder = highestBanner ? highestBanner.displayOrder + 1 : 0;
    } else {
      displayOrder = Number(displayOrder);
    }

    const banner = await Banner.create({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      imageUrl: imageUrl.trim(),
      linkUrl: linkUrl ? linkUrl.trim() : "/products",
      displayOrder: isNaN(displayOrder) ? 0 : displayOrder,
      isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
    });

    return sendSuccess(res, 201, "Banner created successfully.", { banner });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing banner
 * @route   PUT /api/admin/banners/:id
 * @access  Private (Admin)
 */
export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { title, subtitle, imageUrl, linkUrl, displayOrder, isActive } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) {
      return sendError(res, 404, "Banner not found.");
    }

    if (title !== undefined) banner.title = title.trim();
    if (subtitle !== undefined) banner.subtitle = subtitle.trim();
    if (linkUrl !== undefined) banner.linkUrl = linkUrl.trim();
    if (displayOrder !== undefined) banner.displayOrder = Number(displayOrder);
    if (isActive !== undefined) {
      banner.isActive = isActive === "true" || isActive === true;
    }

    // If new image uploaded
    if (req.file) {
      banner.imageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl && imageUrl.trim()) {
      banner.imageUrl = imageUrl.trim();
    }

    await banner.save();

    return sendSuccess(res, 200, "Banner updated successfully.", { banner });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a banner
 * @route   DELETE /api/admin/banners/:id
 * @access  Private (Admin)
 */
export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return sendError(res, 404, "Banner not found.");
    }

    return sendSuccess(res, 200, "Banner deleted successfully.", { bannerId: id });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle banner active status
 * @route   PATCH /api/admin/banners/:id/toggle-status
 * @access  Private (Admin)
 */
export const toggleBannerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return sendError(res, 404, "Banner not found.");
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    return sendSuccess(
      res,
      200,
      `Banner marked as ${banner.isActive ? "active" : "inactive"}.`,
      { banner }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reorder banners in batch
 * @route   PUT /api/admin/banners/reorder
 * @access  Private (Admin)
 */
export const reorderBanners = async (req, res, next) => {
  try {
    const { orderings } = req.body; // Array of { id, displayOrder }

    if (!Array.isArray(orderings) || orderings.length === 0) {
      return sendError(res, 400, "Valid orderings array with id and displayOrder is required.");
    }

    const updates = orderings.map((item) =>
      Banner.findByIdAndUpdate(item.id, { displayOrder: Number(item.displayOrder) })
    );

    await Promise.all(updates);

    const updatedBanners = await Banner.find().sort({ displayOrder: 1, createdAt: -1 });

    return sendSuccess(res, 200, "Banner order updated successfully.", {
      banners: updatedBanners,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all featured products
 * @route   GET /api/admin/banners/featured-products
 * @access  Private (Admin)
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .sort({ updatedAt: -1 });

    return sendSuccess(res, 200, "Featured products retrieved successfully.", {
      products,
      count: products.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle featured status of a product
 * @route   PATCH /api/admin/banners/featured-products/:id
 * @access  Private (Admin)
 */
export const toggleFeaturedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return sendError(res, 404, "Product not found.");
    }

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === "true" || isFeatured === true;
    } else {
      product.isFeatured = !product.isFeatured;
    }

    await product.save();

    return sendSuccess(
      res,
      200,
      `Product "${product.name}" ${product.isFeatured ? "featured on" : "removed from"} homepage.`,
      { product }
    );
  } catch (error) {
    next(error);
  }
};
