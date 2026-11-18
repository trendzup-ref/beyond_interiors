import mongoose from "mongoose";

const siteVisitSchema = new mongoose.Schema(
  {
    visitNumber: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer reference is required"],
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pinCode: { type: String, required: true, trim: true },
      landmark: { type: String, default: "", trim: true },
    },
    preferredDate: {
      type: Date,
      required: [true, "Preferred visit date is required"],
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    timeSlot: {
      type: String,
      default: "10:00 AM - 01:00 PM",
      trim: true,
    },
    assignedProfessional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "scheduled", "completed", "cancelled"],
        message: "{VALUE} is not a valid site visit status",
      },
      default: "pending",
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate unique visit code
siteVisitSchema.pre("save", function () {
  if (!this.visitNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.visitNumber = `BI-VST-${timestamp}-${randomSuffix}`;
  }
});

const SiteVisit = mongoose.model("SiteVisit", siteVisitSchema);

export default SiteVisit;
