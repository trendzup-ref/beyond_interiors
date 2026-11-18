import mongoose from "mongoose";
import User from "../models/user.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * @desc    Get all registered customer accounts (excluding admins)
 * @route   GET /api/admin/customers
 * @access  Private (Admin)
 */
export const getAllCustomers = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;

    let filter = { role: "customer" };

    if (search && search.trim() !== "") {
      const regex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [customers, totalCount] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(filter),
    ]);

    // Check if Order model is registered to calculate customer orders count & spent
    const OrderModel = mongoose.models.Order;
    let customerOrderStats = {};

    if (OrderModel && customers.length > 0) {
      const customerIds = customers.map((c) => c._id);
      const stats = await OrderModel.aggregate([
        { $match: { customer: { $in: customerIds } } },
        {
          $group: {
            _id: "$customer",
            orderCount: { $sum: 1 },
            totalSpent: { $sum: "$totalAmount" },
          },
        },
      ]);

      stats.forEach((s) => {
        customerOrderStats[s._id.toString()] = {
          orderCount: s.orderCount,
          totalSpent: s.totalSpent,
        };
      });
    }

    const enrichedCustomers = customers.map((c) => ({
      ...c,
      orderCount: customerOrderStats[c._id.toString()]?.orderCount || 0,
      totalSpent: customerOrderStats[c._id.toString()]?.totalSpent || 0,
    }));

    return sendSuccess(res, 200, "Customers retrieved successfully", {
      customers: enrichedCustomers,
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
 * @desc    Get detailed customer profile, saved addresses, and order history
 * @route   GET /api/admin/customers/:id
 * @access  Private (Admin)
 */
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    }).select("-password");

    if (!customer) {
      return sendError(res, 404, "Customer account not found.");
    }

    let orders = [];
    let totalSpent = 0;

    const OrderModel = mongoose.models.Order;
    if (OrderModel) {
      orders = await OrderModel.find({ customer: customer._id })
        .sort({ createdAt: -1 })
        .lean();

      totalSpent = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    }

    return sendSuccess(res, 200, "Customer details retrieved", {
      customer,
      addresses: customer.addresses || [],
      orders,
      totalOrders: orders.length,
      totalSpent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update customer account status (Active / Blocked)
 * @route   PATCH /api/admin/customers/:id/status
 * @access  Private (Admin)
 */
export const updateCustomerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !["active", "blocked"].includes(status)) {
      return sendError(res, 400, "Valid status ('active' or 'blocked') is required.");
    }

    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    });

    if (!customer) {
      return sendError(res, 404, "Customer account not found.");
    }

    customer.status = status;
    customer.isActive = status === "active";

    await customer.save();

    return sendSuccess(res, 200, `Customer status updated to ${status}`, {
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        isActive: customer.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
};
