import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  Users,
  Wrench,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import axiosClient from "../../api/axiosClient.js";

const Dashboard = () => {
  const [data, setData] = useState({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalProducts: 0,
      lowStockCount: 0,
      totalCustomers: 0,
      pendingInstallations: 0,
      pendingSiteVisits: 0,
    },
    recentOrders: [],
    lowStockItems: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get("/admin/dashboard/stats");
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const stats = data.stats || {};

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Executive Overview
          </h1>
          <p className="text-xs text-stone-500">
            Real-time operations, inventory health, and offline order metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardStats}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardStats}
            className="font-semibold underline hover:text-red-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Revenue Collected */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Offline Revenue
            </p>
            <p className="text-2xl font-bold font-serif text-stone-900 mt-1">
              ₹{Number(stats.totalRevenue || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" />
              <span>Direct / Cash Collected</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Total Orders
            </p>
            <p className="text-2xl font-bold font-serif text-stone-900 mt-1">
              {stats.totalOrders || 0}
            </p>
            <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              <span>{stats.pendingOrders || 0} awaiting fulfillment</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Catalog & Low Stock */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Active Products
            </p>
            <p className="text-2xl font-bold font-serif text-stone-900 mt-1">
              {stats.totalProducts || 0}
            </p>
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{stats.lowStockCount || 0} low-stock items</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Customers & Services */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Customer Accounts
            </p>
            <p className="text-2xl font-bold font-serif text-stone-900 mt-1">
              {stats.totalCustomers || 0}
            </p>
            <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>Registered buyers</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Secondary Service Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 sm:p-5 rounded-xl shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Installation Requests
              </span>
            </div>
            <p className="text-xl font-bold font-serif">
              {stats.pendingInstallations || 0} Pending Bookings
            </p>
            <p className="text-[11px] text-stone-400">
              Requires technician assignment and scheduling.
            </p>
          </div>
          <Link
            to="/admin/installations"
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Assign</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 sm:p-5 rounded-xl shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Site Visit Requests
              </span>
            </div>
            <p className="text-xl font-bold font-serif">
              {stats.pendingSiteVisits || 0} Pending Site Visits
            </p>
            <p className="text-[11px] text-stone-400">
              Customers waiting for interior measurement & consultation.
            </p>
          </div>
          <Link
            to="/admin/site-visits"
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Recent Customer Orders</h2>
              <p className="text-[11px] text-stone-500">Latest orders placed via offline payment</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {data.recentOrders && data.recentOrders.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-stone-900">
                        {order.orderNumber || order._id.slice(-6)}
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium">
                        {order.customer?.name || "Customer"}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            order.offlinePayment?.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.offlinePayment?.status || "Unpaid"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-stone-700">
                          {order.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 inline-block"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-stone-400 space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs font-medium text-stone-600">No customer orders placed yet</p>
                <p className="text-[11px] text-stone-400">
                  Orders will appear here as soon as customers checkout.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Overview (1 Column) */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Inventory Alerts</h2>
              <p className="text-[11px] text-stone-500">Products with ≤ 5 units in stock</p>
            </div>
            <Link
              to="/admin/inventory"
              className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 p-4">
            {data.lowStockItems && data.lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {data.lowStockItems.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-500">
                        {item.category?.name || "Interior Product"}
                      </p>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                      {item.stockQuantity ?? 0} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-stone-400 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-medium text-stone-700">Inventory Healthy</p>
                <p className="text-[11px] text-stone-400">
                  No products are currently under the critical low-stock threshold.
                </p>
              </div>
            )}
          </div>

          <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
            <Link
              to="/admin/products"
              className="text-[11px] font-semibold text-amber-700 hover:underline"
            >
              + Add New Interior Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
