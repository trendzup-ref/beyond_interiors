import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "Variant SKU is required"],
      trim: true,
      uppercase: true,
    },
    color: {
      type: String,
      trim: true,
      default: "",
    },
    size: {
      type: String,
      trim: true,
      default: "",
    },
    material: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Price cannot be negative"],
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"],
      min: [0, "MRP cannot be negative"],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxLength: [120, "Product name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    variants: {
      type: [variantSchema],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: "A product must have at least one variant with pricing and SKU.",
      },
    },
    basePrice: {
      type: Number,
      default: 0,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug and calculate basePrice / totalStock before saving
productSchema.pre("save", function () {
  if (this.isModified("name") && (!this.slug || this.slug.trim() === "")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (this.variants && this.variants.length > 0) {
    // Total stock is sum of all variant stocks
    this.totalStock = this.variants.reduce(
      (sum, variant) => sum + (Number(variant.stockQuantity) || 0),
      0
    );

    // Base price is lowest selling price among variants
    const prices = this.variants.map((v) => Number(v.price) || 0);
    this.basePrice = Math.min(...prices);
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
