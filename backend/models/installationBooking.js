import mongoose from "mongoose";

const installationBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
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
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    serviceType: {
      type: String,
      required: [true, "Installation service type is required"],
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: [true, "Preferred installation date is required"],
    },
    timeSlot: {
      type: String,
      default: "10:00 AM - 02:00 PM",
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
        values: [
          "requested",
          "assigned",
          "in_progress",
          "completed",
          "cancelled",
        ],
        message: "{VALUE} is not a valid installation booking status",
      },
      default: "requested",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pinCode: { type: String, default: "" },
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate booking code
installationBookingSchema.pre("save", function () {
  if (!this.bookingNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingNumber = `BI-INS-${timestamp}-${randomSuffix}`;
  }
});

const InstallationBooking = mongoose.model(
  "InstallationBooking",
  installationBookingSchema
);

export default InstallationBooking;
