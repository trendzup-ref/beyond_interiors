import Order from "../models/order.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * @desc    Get all orders with rich filtering & pagination
 * @route   GET /api/admin/orders
 * @access  Private (Admin)
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const {
      search,
      orderStatus,
      paymentStatus,
      paymentMethod,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let filter = {};

    // Search by Order Number or Shipping Phone/Name
    if (search && search.trim() !== "") {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { orderNumber: regex },
        { "shippingAddress.fullName": regex },
        { "shippingAddress.phone": regex },
      ];
    }

    if (orderStatus && orderStatus !== "all") {
      filter.orderStatus = orderStatus;
    }

    if (paymentStatus && paymentStatus !== "all") {
      filter["offlinePayment.status"] = paymentStatus;
    }

    if (paymentMethod && paymentMethod !== "all") {
      filter["offlinePayment.method"] = paymentMethod;
    }

    // Date range filtering
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate("customer", "name email phone")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Orders retrieved successfully", {
      orders,
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
 * @desc    Get detailed order by ID
 * @route   GET /api/admin/orders/:id
 * @access  Private (Admin)
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customer",
      "name email phone status createdAt"
    );

    if (!order) {
      return sendError(res, 404, "Order not found.");
    }

    return sendSuccess(res, 200, "Order details retrieved", { order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order fulfillment / delivery status
 * @route   PATCH /api/admin/orders/:id/status
 * @access  Private (Admin)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, cancellationReason } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return sendError(res, 400, "Valid order status is required.");
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return sendError(res, 404, "Order not found.");
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "cancelled") {
      order.cancelledAt = new Date();
      if (cancellationReason) {
        order.cancellationReason = cancellationReason.trim();
      }
    } else {
      order.cancelledAt = null;
      order.cancellationReason = "";
    }

    await order.save();
    await order.populate("customer", "name email phone");

    return sendSuccess(res, 200, `Order status updated to ${orderStatus}`, {
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update offline payment record (Offline Payment verification box)
 * @route   PATCH /api/admin/orders/:id/payment
 * @access  Private (Admin)
 */
export const updatePaymentRecord = async (req, res, next) => {
  try {
    const { method, status, amountReceived, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return sendError(res, 404, "Order not found.");
    }

    if (method) {
      const allowedMethods = ["cash_on_delivery", "direct_transfer", "cheque"];
      if (!allowedMethods.includes(method)) {
        return sendError(res, 400, "Invalid offline payment method.");
      }
      order.offlinePayment.method = method;
    }

    if (amountReceived !== undefined) {
      const numAmount = Math.max(0, Number(amountReceived));
      order.offlinePayment.amountReceived = numAmount;

      // Auto-adjust status if amount received covers total
      if (numAmount >= order.totalAmount) {
        order.offlinePayment.status = "paid";
      } else if (numAmount > 0 && (!status || status === "unpaid")) {
        order.offlinePayment.status = "partially_paid";
      }
    }

    if (status) {
      const allowedStatus = ["unpaid", "partially_paid", "paid"];
      if (!allowedStatus.includes(status)) {
        return sendError(res, 400, "Invalid payment status.");
      }
      order.offlinePayment.status = status;
    }

    if (notes !== undefined) {
      order.offlinePayment.notes = notes.trim();
    }

    // Set receivedAt timestamp if not previously stamped
    if (order.offlinePayment.status === "paid" || order.offlinePayment.amountReceived > 0) {
      if (!order.offlinePayment.receivedAt) {
        order.offlinePayment.receivedAt = new Date();
      }
    } else {
      order.offlinePayment.receivedAt = null;
    }

    await order.save();
    await order.populate("customer", "name email phone");

    return sendSuccess(res, 200, "Offline payment record updated successfully", {
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an order
 * @route   POST /api/admin/orders/:id/cancel
 * @access  Private (Admin)
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return sendError(res, 404, "Order not found.");
    }

    if (order.orderStatus === "delivered") {
      return sendError(res, 400, "Delivered orders cannot be cancelled.");
    }

    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    order.cancellationReason = reason?.trim() || "Cancelled by Administrator";

    await order.save();
    await order.populate("customer", "name email phone");

    return sendSuccess(res, 200, "Order cancelled successfully", { order });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentRecord,
  cancelOrder,
};
