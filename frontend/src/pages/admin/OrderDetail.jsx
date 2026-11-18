import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  MapPin,
  Clock,
  XCircle,
  DollarSign,
  PackageCheck,
  Send,
} from "lucide-react";
import {
  getOrder,
  updateOrderStatus,
  updatePaymentRecord,
  cancelOrder,
} from "../../api/orderApi.js";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Status Update State
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Offline Payment Box State
  const [paymentForm, setPaymentForm] = useState({
    method: "cash_on_delivery",
    status: "unpaid",
    amountReceived: 0,
    notes: "",
  });
  const [savingPayment, setSavingPayment] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setAlert(null);
      const res = await getOrder(id);
      const ord = res.data?.order;
      setOrder(ord);
      if (ord) {
        setSelectedStatus(ord.orderStatus);
        setPaymentForm({
          method: ord.offlinePayment?.method || "cash_on_delivery",
          status: ord.offlinePayment?.status || "unpaid",
          amountReceived: ord.offlinePayment?.amountReceived ?? 0,
          notes: ord.offlinePayment?.notes || "",
        });
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load order details.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  // Handle Order Status change
  const handleStatusUpdate = async () => {
    if (selectedStatus === order?.orderStatus) return;

    if (selectedStatus === "cancelled") {
      const reason = window.prompt("Please enter a reason for cancelling this order:");
      if (!reason) return;
      try {
        setUpdatingStatus(true);
        const res = await cancelOrder(id, reason);
        setOrder(res.data?.order);
        setAlert({ type: "success", message: "Order cancelled successfully." });
      } catch (err) {
        setAlert({ type: "error", message: err.message || "Failed to cancel order." });
      } finally {
        setUpdatingStatus(false);
      }
      return;
    }

    try {
      setUpdatingStatus(true);
      const res = await updateOrderStatus(id, { orderStatus: selectedStatus });
      setOrder(res.data?.order);
      setAlert({
        type: "success",
        message: `Order status updated to ${selectedStatus.replace(/_/g, " ")}.`,
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to update order status.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle Offline Payment Record submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingPayment(true);
      setAlert(null);

      const res = await updatePaymentRecord(id, {
        method: paymentForm.method,
        status: paymentForm.status,
        amountReceived: Number(paymentForm.amountReceived),
        notes: paymentForm.notes,
      });

      setOrder(res.data?.order);
      setAlert({
        type: "success",
        message: "Offline payment record updated and verified successfully!",
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to save offline payment record.",
      });
    } finally {
      setSavingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Loading order information...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-stone-500 space-y-3">
        <p className="text-sm">Order not found.</p>
        <Link to="/admin/orders" className="text-xs text-amber-700 underline font-semibold">
          Return to Orders List
        </Link>
      </div>
    );
  }

  const pay = order.offlinePayment || {};
  const orderSteps = ["pending", "confirmed", "processing", "out_for_delivery", "delivered"];
  const currentStepIndex = orderSteps.indexOf(order.orderStatus);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-stone-900">
                Order {order.orderNumber}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                  pay.status === "paid"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
                }`}
              >
                {pay.status || "Unpaid"}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && (
          <button
            type="button"
            onClick={() => {
              setSelectedStatus("cancelled");
              setTimeout(handleStatusUpdate, 0);
            }}
            className="px-3.5 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium cursor-pointer"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Alert Notice */}
      {alert && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs ${
            alert.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
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

      {/* Fulfillment Status Stepper & Control */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Fulfillment & Delivery Progress</span>
            </h2>
            <p className="text-[11px] text-stone-500">
              Update dispatch and logistics milestones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={updatingStatus}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white capitalize focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={updatingStatus || selectedStatus === order.orderStatus}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
            >
              {updatingStatus ? "Saving..." : "Update"}
            </button>
          </div>
        </div>

        {order.orderStatus === "cancelled" ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-bold">Order Cancelled</p>
              <p className="text-[11px] text-red-700">
                Reason: {order.cancellationReason || "No reason specified."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
            {orderSteps.map((step, idx) => {
              const isDone = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step}
                  className={`p-3 rounded-xl border text-xs font-semibold capitalize flex flex-col items-center gap-1.5 transition-all ${
                    isCurrent
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : isDone
                      ? "bg-amber-50 text-amber-900 border-amber-200"
                      : "bg-stone-50 text-stone-400 border-stone-200"
                  }`}
                >
                  <span className="text-[10px] opacity-80">Step {idx + 1}</span>
                  <span>{step.replace(/_/g, " ")}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* OFFLINE PAYMENT VERIFICATION BOX */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-stone-50 rounded-xl border-2 border-amber-300 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-700" />
              <h2 className="text-sm font-bold text-stone-900">
                Offline Payment Verification & Recording
              </h2>
            </div>
            <p className="text-[11px] text-stone-500">
              Strictly offline payment platform. Record cash collected or direct transfer receipts.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-stone-500 uppercase font-semibold">
              Total Order Due
            </span>
            <p className="text-lg font-bold font-serif text-stone-900">
              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Payment Method */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                Offline Method
              </label>
              <select
                value={paymentForm.method}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, method: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-amber-500/40"
              >
                <option value="cash_on_delivery">Cash on Delivery (COD)</option>
                <option value="direct_transfer">Direct Bank Transfer (NEFT/RTGS/UPI)</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                Payment Verification Status
              </label>
              <select
                value={paymentForm.status}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, status: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 font-semibold focus:ring-2 focus:ring-amber-500/40"
              >
                <option value="unpaid">Unpaid (Awaiting Payment)</option>
                <option value="partially_paid">Partially Paid (Advance Received)</option>
                <option value="paid">Paid (Fully Collected)</option>
              </select>
            </div>

            {/* Amount Received */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                Amount Received (₹)
              </label>
              <input
                type="number"
                min="0"
                value={paymentForm.amountReceived}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amountReceived: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 font-bold font-serif"
              />
            </div>
          </div>

          {/* Payment Notes / Transaction Reference */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
              Payment Remarks & Transaction Reference
            </label>
            <textarea
              rows={2}
              value={paymentForm.notes}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, notes: e.target.value })
              }
              placeholder="e.g. Received ₹65,000 via Cash on delivery by driver / Bank Ref: UTR9988223..."
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs placeholder-stone-400 focus:ring-2 focus:ring-amber-500/40"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-amber-200/50">
            <div className="text-[11px] text-stone-500">
              {pay.receivedAt ? (
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Last verified on{" "}
                    {new Date(pay.receivedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
              ) : (
                <span>No payment collection recorded yet.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={savingPayment}
              className="px-5 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingPayment ? "Saving Record..." : "Save Payment Verification"}
            </button>
          </div>
        </form>
      </div>

      {/* Purchased Items Table & Customer Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100">
            <h2 className="text-sm font-bold text-stone-900">
              Purchased Interior Products ({order.items?.length || 0})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items?.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                            <ShoppingBag className="w-5 h-5 text-amber-600" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-stone-900 block">
                            {item.name}
                          </span>
                          {item.sku && (
                            <span className="text-[10px] text-stone-400 font-mono">
                              SKU: {item.sku}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-serif text-stone-800">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      x {item.quantity}
                    </td>

                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900 text-right">
                      ₹{Number(item.subtotal).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals Footer */}
          <div className="p-4 bg-stone-50/60 border-t border-stone-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-stone-900 font-serif">
                ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping / Delivery Fee:</span>
              <span className="font-semibold text-stone-900 font-serif">
                {order.shippingFee > 0
                  ? `₹${Number(order.shippingFee).toLocaleString("en-IN")}`
                  : "FREE"}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Grand Total Due:</span>
              <span className="font-serif text-amber-700 text-base">
                ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details (1 Column) */}
        <div className="space-y-4">
          {/* Customer Profile Box */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              <span>Customer Details</span>
            </h3>

            <div className="text-xs space-y-1.5">
              <p className="font-bold text-stone-900">
                {order.customer?.name || order.shippingAddress?.fullName}
              </p>
              <p className="text-stone-600">{order.customer?.email}</p>
              <p className="font-mono text-stone-600">
                {order.customer?.phone || order.shippingAddress?.phone}
              </p>
              {order.customer?._id && (
                <Link
                  to={`/admin/customers/${order.customer._id}`}
                  className="text-[11px] text-amber-700 hover:underline font-semibold pt-1 inline-block"
                >
                  View Full Customer Profile →
                </Link>
              )}
            </div>
          </div>

          {/* Shipping Address Box */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-5 space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-100 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Delivery Address</span>
            </h3>

            <div className="text-xs space-y-1 text-stone-600 leading-relaxed">
              <p className="font-semibold text-stone-900">
                {order.shippingAddress?.fullName}
              </p>
              <p>{order.shippingAddress?.street}</p>
              {order.shippingAddress?.landmark && (
                <p>Near {order.shippingAddress.landmark}</p>
              )}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} —{" "}
                <span className="font-mono font-bold text-stone-900">
                  {order.shippingAddress?.pinCode}
                </span>
              </p>
              <p className="font-mono pt-1 text-[11px] text-stone-500">
                Contact: {order.shippingAddress?.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
