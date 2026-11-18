import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    variantId: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      default: "",
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Item quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    landmark: { type: String, default: "", trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pinCode: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const offlinePaymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: {
        values: ["cash_on_delivery", "direct_transfer", "cheque"],
        message: "{VALUE} is not a supported offline payment method",
      },
      default: "cash_on_delivery",
    },
    status: {
      type: String,
      enum: {
        values: ["unpaid", "partially_paid", "paid"],
        message: "{VALUE} is not a valid offline payment status",
      },
      default: "unpaid",
    },
    amountReceived: {
      type: Number,
      default: 0,
      min: 0,
    },
    receivedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
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
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (val) {
          return val && val.length > 0;
        },
        message: "An order must contain at least one item.",
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required"],
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    offlinePayment: {
      type: offlinePaymentSchema,
      default: () => ({}),
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    cancellationReason: {
      type: String,
      default: "",
      trim: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate unique order number if not set
orderSchema.pre("save", function () {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `BI-ORD-${timestamp}-${randomSuffix}`;
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
