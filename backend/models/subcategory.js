import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      maxLength: [50, "Subcategory name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Parent category is required"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name if not provided
subcategorySchema.pre("save", function () {
  if (this.isModified("name") && (!this.slug || this.slug.trim() === "")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

// Ensure subcategory slug is unique within its parent category
subcategorySchema.index({ category: 1, slug: 1 }, { unique: true });

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

export default Subcategory;
