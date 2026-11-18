import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
      maxLength: [150, "Banner title cannot exceed 150 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxLength: [255, "Banner subtitle cannot exceed 255 characters"],
      default: "",
    },
    imageUrl: {
      type: String,
      required: [true, "Banner image is required"],
      trim: true,
    },
    linkUrl: {
      type: String,
      trim: true,
      default: "/products",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for sorted display retrieval
bannerSchema.index({ displayOrder: 1, createdAt: -1 });

const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);

export default Banner;
