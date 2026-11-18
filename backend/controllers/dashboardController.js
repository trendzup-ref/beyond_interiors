import mongoose from "mongoose";
import User from "../models/user.js";
import { sendSuccess } from "../utils/apiResponse.js";

/**
 * @desc    Get dashboard statistics & overview data
 * @route   GET /api/admin/dashboard/stats
 * @access  Private (Admin)
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Customer statistics from User model
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // 2. Safe querying for models that may be registered now or in upcoming modules
    const OrderModel = mongoose.models.Order;
    const ProductModel = mongoose.models.Product;
    const InstallationModel = mongoose.models.InstallationBooking;
    const SiteVisitModel = mongoose.models.SiteVisit;

    let totalOrders = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let recentOrders = [];

    if (OrderModel) {
      totalOrders = await OrderModel.countDocuments();
      pendingOrders = await OrderModel.countDocuments({
        orderStatus: { $in: ["pending", "processing"] },
      });

      // Sum of offline payments received
      const revenueAgg = await OrderModel.aggregate([
        {
          $match: {
            "offlinePayment.status": { $in: ["paid", "partially_paid"] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$offlinePayment.amountReceived" },
          },
        },
      ]);
      totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

      recentOrders = await OrderModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("customer", "name email phone")
        .lean();
    }

    let totalProducts = 0;
    let lowStockCount = 0;
    let lowStockItems = [];

    if (ProductModel) {
      totalProducts = await ProductModel.countDocuments({ isActive: true });

      // Products with stock <= 5
      lowStockItems = await ProductModel.find({
        $or: [
          { "variants.stockQuantity": { $lte: 5 } },
          { stockQuantity: { $lte: 5 } },
        ],
      })
        .select("name images variants stockQuantity category")
        .limit(6)
        .lean();

      lowStockCount = lowStockItems.length;
    }

    let pendingInstallations = 0;
    if (InstallationModel) {
      pendingInstallations = await InstallationModel.countDocuments({
        status: { $in: ["requested", "assigned"] },
      });
    }

    let pendingSiteVisits = 0;
    if (SiteVisitModel) {
      pendingSiteVisits = await SiteVisitModel.countDocuments({
        status: { $in: ["pending", "scheduled"] },
      });
    }

    return sendSuccess(res, 200, "Dashboard statistics retrieved successfully", {
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalProducts,
        lowStockCount,
        totalCustomers,
        totalAdmins,
        pendingInstallations,
        pendingSiteVisits,
      },
      recentOrders,
      lowStockItems,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
};
