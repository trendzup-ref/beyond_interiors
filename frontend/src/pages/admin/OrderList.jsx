import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ShoppingBag,
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  Calendar,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getOrders } from "../../api/orderApi.js";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alert, setAlert] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setAlert(null);

      const params = {
        search: search.trim() || undefined,
        orderStatus: orderStatus !== "all" ? orderStatus : undefined,
        paymentStatus: paymentStatus !== "all" ? paymentStatus : undefined,
        paymentMethod: paymentMethod !== "all" ? paymentMethod : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const res = await getOrders(params);
      setOrders(res.data?.orders || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load customer orders.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orderStatus, paymentStatus, paymentMethod, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "processing":
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "partially_paid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Customer Orders
          </h1>
          <p className="text-xs text-stone-500">
            Monitor offline purchases, verify cash/direct payments, and track order fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Alert Notice */}
      {alert && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{alert.message}</span>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="font-bold text-stone-500 hover:text-stone-800 px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order # or Customer..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </form>

          {/* Quick Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Order Status */}
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="all">All Order Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Offline Payment Status */}
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="all">All Payment Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid</option>
            </select>

            {/* Payment Method */}
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="all">All Offline Methods</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="direct_transfer">Direct Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
        </div>

        {/* Date Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs text-stone-600">
          <span className="font-semibold text-stone-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Date Range:</span>
          </span>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1 rounded border border-stone-300 text-xs text-stone-700 bg-white"
          />
          <span className="text-stone-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2.5 py-1 rounded border border-stone-300 text-xs text-stone-700 bg-white"
          />

          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="text-[11px] text-red-600 hover:underline font-medium"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order Number</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Offline Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => {
                  const pay = ord.offlinePayment || {};
                  const createdDate = ord.createdAt
                    ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  const methodLabel =
                    pay.method === "cash_on_delivery"
                      ? "COD"
                      : pay.method === "direct_transfer"
                      ? "Direct Transfer"
                      : "Cheque";

                  return (
                    <tr key={ord._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {ord.orderNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-900">
                            {ord.customer?.name || ord.shippingAddress?.fullName || "Guest"}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {ord.customer?.email || ord.shippingAddress?.phone}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-stone-600">{createdDate}</td>

                      <td className="py-3 px-4 font-serif font-bold text-stone-900">
                        ₹{Number(ord.totalAmount || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block w-fit px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${getPaymentStatusBadge(
                              pay.status
                            )}`}
                          >
                            {pay.status || "Unpaid"}
                          </span>
                          <span className="text-[10px] text-stone-500 font-medium">
                            {methodLabel}
                            {pay.amountReceived > 0 &&
                              ` (₹${pay.amountReceived.toLocaleString("en-IN")})`}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${getOrderStatusBadge(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus?.replace(/_/g, " ") || "Pending"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/admin/orders/${ord._id}`}
                          className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-md transition-colors inline-block"
                          title="View Order Details & Verify Payment"
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
            <div className="p-12 text-center text-stone-400 space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-xs font-medium text-stone-700">No customer orders found</p>
              <p className="text-[11px] text-stone-400">
                Orders placed through the customer portal will be indexed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
