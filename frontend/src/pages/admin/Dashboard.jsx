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
  ArrowUpRight,
  RefreshCw,
  Clock,
  CheckCircle,
  Eye,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import axiosClient from "../../api/axiosClient.js";

/**
 * Animated number counting component
 * Smoothly animates numbers from 0 to target value on load/change
 */
const AnimatedCounter = ({ value = 0, duration = 1200, prefix = "", suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(value) || 0;
    const startValue = 0;

    if (endValue === 0) {
      setDisplayValue(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic: 1 - (1 - progress)^3
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * (endValue - startValue) + startValue);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    const animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

/**
 * Revenue Graph Component
 * Interactive SVG/HTML Bar Chart with monthly breakdown & hover tooltips
 */
const RevenueGraph = ({ monthlyData = [], totalRevenue = 0 }) => {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  // Fallback 6-month structure if API response is empty
  const defaultMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const displayMonths =
    monthlyData && monthlyData.length > 0
      ? monthlyData
      : defaultMonths.map((m, idx) => ({
          month: m,
          revenue: idx === defaultMonths.length - 1 ? totalRevenue : 0,
          orders: 0,
        }));

  const maxVal = Math.max(...displayMonths.map((m) => m.revenue || 0), totalRevenue || 1, 1000);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full relative overflow-hidden">
      {/* Top Details */}
      <div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Offline Revenue Overview
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                ₹{Number(totalRevenue || 0).toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-stone-400 font-medium">/ 6-months trend</span>
            </div>
          </div>

          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Hovered Bar Tooltip Info */}
        <div className="h-6 mt-3">
          {hoveredMonth ? (
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-900 text-white animate-fadeIn">
              <span>{hoveredMonth.month}:</span>
              <span style={{ color: "var(--color-secondary)" }}>
                ₹{Number(hoveredMonth.revenue || 0).toLocaleString("en-IN")}
              </span>
              {hoveredMonth.orders > 0 && (
                <span className="text-[11px] text-stone-300">({hoveredMonth.orders} orders)</span>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-stone-500">
              Hover over bars to inspect monthly collections
            </p>
          )}
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="pt-6">
        <div className="flex items-end justify-between gap-2.5 sm:gap-4 h-48 pb-2 border-b border-stone-100">
          {displayMonths.map((item, idx) => {
            const isLatest = idx === displayMonths.length - 1;
            const rev = item.revenue || 0;
            // Proportionate height with minimum height of 10% for sleek aesthetics
            const heightPercent = rev > 0 ? Math.max(Math.round((rev / maxVal) * 100), 18) : 12;
            const isHovered = hoveredMonth?.month === item.month;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredMonth(item)}
                onMouseLeave={() => setHoveredMonth(null)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                {/* Bar */}
                <div className="w-full max-w-[42px] flex items-end justify-center h-full">
                  <div
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor:
                        isHovered || isLatest
                          ? "var(--color-primary)"
                          : "#1c1917",
                    }}
                    className={`w-full rounded-t-lg transition-all duration-300 group-hover:scale-y-105 group-hover:opacity-95 ${
                      isLatest ? "shadow-sm" : ""
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Month Labels */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 pt-3 text-[11px] font-semibold text-stone-500">
          {displayMonths.map((item, idx) => {
            const isLatest = idx === displayMonths.length - 1;
            const isHovered = hoveredMonth?.month === item.month;
            return (
              <div
                key={idx}
                className={`flex-1 text-center transition-colors ${
                  isHovered || isLatest ? "font-bold text-stone-900" : "text-stone-400"
                }`}
              >
                {item.month}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
    monthlyRevenue: [],
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time revenue analytics, order counts, product inventory, and customer statistics.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardStats}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
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

      {/* Section 1: Revenue Graph & Animated Metric Counters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue in form of a Graph (7 cols on lg) */}
        <div className="lg:col-span-7">
          <RevenueGraph
            monthlyData={data.monthlyRevenue}
            totalRevenue={stats.totalRevenue || 0}
          />
        </div>

        {/* Right: Orders, Products, and Customers Cards with Animated Counting (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4 sm:gap-5">
          {/* Card 1: Total Orders */}
          <Link
            to="/admin/orders"
            className="group p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-stone-400 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Total Orders
              </span>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                <AnimatedCounter value={stats.totalOrders || 0} />
              </p>
              <p className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>
                  <strong className="text-stone-700">{stats.pendingOrders || 0}</strong> awaiting
                  fulfillment
                </span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-stone-900"
                style={{ backgroundColor: "var(--color-tertiary)" }}
              >
                <ShoppingBag
                  className="w-5 h-5"
                  style={{ color: "var(--color-primary)" }}
                />
              </div>
              <span className="p-1 text-stone-400 group-hover:text-stone-900 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Card 2: Active Products */}
          <Link
            to="/admin/products"
            className="group p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-stone-400 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Active Catalog Products
              </span>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                <AnimatedCounter value={stats.totalProducts || 0} />
              </p>
              <p className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                <AlertTriangle
                  className="w-3 h-3"
                  style={{ color: "var(--color-accent)" }}
                />
                <span>
                  <strong className="text-stone-700">{stats.lowStockCount || 0}</strong> items under
                  low stock
                </span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-800">
                <Package className="w-5 h-5" />
              </div>
              <span className="p-1 text-stone-400 group-hover:text-stone-900 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Card 3: Customers with Customer Icon and Animated Counting */}
          <Link
            to="/admin/customers"
            className="group p-5 sm:p-6 rounded-3xl bg-stone-900 text-white shadow-sm hover:bg-stone-800 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Total Customers
              </span>
              <p className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                <AnimatedCounter value={stats.totalCustomers || 0} />
              </p>
              <p className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
                <TrendingUp
                  className="w-3 h-3"
                  style={{ color: "var(--color-secondary)" }}
                />
                <span>Registered buyer accounts</span>
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              {/* Customer Icon Prominently Highlighted */}
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Users className="w-6 h-6" />
              </div>
              <span className="p-1 text-stone-400 group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Section 2: Assign and Install Tabs (Without background, just bold headline & direct link text) */}
      <div className="py-6 border-y border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Installation Tab */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wrench
                className="w-4 h-4"
                style={{ color: "var(--color-primary)" }}
              />
              <span className="text-base sm:text-lg font-bold font-serif text-stone-900">
                Installation Requests ({stats.pendingInstallations || 0} Pending)
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Customer orders requesting on-site professional installation and product assembly.
            </p>
            <div>
              <Link
                to="/admin/installations"
                className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors underline underline-offset-4"
                style={{ color: "var(--color-primary)" }}
              >
                <span>Assign Technicians</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Site Visit Tab */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarCheck
                className="w-4 h-4"
                style={{ color: "var(--color-accent)" }}
              />
              <span className="text-base sm:text-lg font-bold font-serif text-stone-900">
                Site Visit Requests ({stats.pendingSiteVisits || 0} Pending)
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Customers waiting for interior measurement, room planning, and design consultation.
            </p>
            <div>
              <Link
                to="/admin/site-visits"
                className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors underline underline-offset-4"
                style={{ color: "var(--color-primary)" }}
              >
                <span>Schedule Visits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Last Two Parts (Recent Orders & Inventory Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Part 1: Recent Orders (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-serif text-stone-900">Recent Orders</h2>
                <p className="text-[11px] text-stone-500">
                  Latest customer checkouts and offline payments
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-bold transition-colors"
                style={{ color: "var(--color-primary)" }}
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              {data.recentOrders && data.recentOrders.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50/70 text-stone-500 font-semibold border-b border-stone-100 uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-5">Order #</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {data.recentOrders.map((order) => {
                      const isPaid = order.offlinePayment?.status === "paid";
                      return (
                        <tr key={order._id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3.5 px-5 font-mono font-semibold text-stone-900">
                            {order.orderNumber || order._id.slice(-6)}
                          </td>
                          <td className="py-3.5 px-4 text-stone-700 font-medium truncate max-w-[140px]">
                            {order.customer?.name || "Customer"}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-stone-900">
                            ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                              style={{
                                backgroundColor: isPaid
                                  ? "#ecfdf5"
                                  : "var(--color-tertiary)",
                                color: isPaid
                                  ? "#065f46"
                                  : "var(--color-primary)",
                                border: isPaid
                                  ? "1px solid #a7f3d0"
                                  : "1px solid var(--color-secondary)",
                              }}
                            >
                              {order.offlinePayment?.status || "Unpaid"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="capitalize text-stone-600 font-medium">
                              {order.orderStatus || "Pending"}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 inline-block transition-colors"
                              title="View Order Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-10 text-center text-stone-400 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-xs font-semibold text-stone-700">No customer orders yet</p>
                  <p className="text-[11px] text-stone-400">
                    New orders will populate here automatically upon customer checkout.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Showing latest {data.recentOrders?.length || 0} customer orders</span>
            <Link
              to="/admin/orders"
              className="font-semibold underline hover:text-stone-800"
            >
              Order Management
            </Link>
          </div>
        </div>

        {/* Part 2: Inventory Alerts (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-serif text-stone-900">Inventory Alerts</h2>
                <p className="text-[11px] text-stone-500">
                  Products with ≤ 5 units in stock
                </p>
              </div>
              <Link
                to="/admin/inventory"
                className="inline-flex items-center gap-1 text-xs font-bold transition-colors"
                style={{ color: "var(--color-primary)" }}
              >
                <span>Manage Stock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 space-y-3">
              {data.lowStockItems && data.lowStockItems.length > 0 ? (
                data.lowStockItems.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs hover:border-stone-300 transition-colors"
                  >
                    <div className="truncate pr-3">
                      <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-500">
                        {item.category?.name || "Interior Collection"}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-2xs"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      >
                        {item.stockQuantity ?? 0} units left
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-tertiary)" }}
                  >
                    <CheckCircle
                      className="w-6 h-6"
                      style={{ color: "var(--color-primary)" }}
                    />
                  </div>
                  <p className="text-xs font-bold text-stone-800">Inventory Healthy</p>
                  <p className="text-[11px] text-stone-400 max-w-xs">
                    All products maintain stock levels above the critical threshold of 5 units.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-stone-50/60 border-t border-stone-100 text-center">
            <Link
              to="/admin/products/new"
              className="text-xs font-bold transition-colors hover:underline"
              style={{ color: "var(--color-primary)" }}
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
