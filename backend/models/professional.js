import mongoose from "mongoose";

const professionalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Professional name is required"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    specialization: {
      type: String,
      required: [true, "Specialization area is required"],
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 2,
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "busy"],
        message: "{VALUE} is not a valid professional status",
      },
      default: "active",
    },
  },
  { timestamps: true }
);

const Professional = mongoose.model("Professional", professionalSchema);

export default Professional;
