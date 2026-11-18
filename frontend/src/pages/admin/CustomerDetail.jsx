import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  Ban,
  CheckCircle2,
  AlertCircle,
  Eye,
  IndianRupee,
} from "lucide-react";
import { getCustomer, updateCustomerStatus } from "../../api/customerApi.js";

const CustomerDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      setAlert(null);
      const res = await getCustomer(id);
      setData(res.data);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load customer profile details.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!data?.customer) return;
    const currentStatus = data.customer.status;
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    const actionLabel = newStatus === "blocked" ? "block" : "activate";

    if (!window.confirm(`Are you sure you want to ${actionLabel} ${data.customer.name}?`)) {
      return;
    }

    try {
      setUpdating(true);
      await updateCustomerStatus(id, newStatus);
      setAlert({
        type: "success",
        message: `Customer account is now ${newStatus}.`,
      });
      setData((prev) => ({
        ...prev,
        customer: {
          ...prev.customer,
          status: newStatus,
          isActive: newStatus === "active",
        },
      }));
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || `Failed to ${actionLabel} customer account.`,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Loading customer profile...</p>
      </div>
    );
  }

  const customer = data?.customer;
  const addresses = data?.addresses || [];
  const orders = data?.orders || [];
  const isBlocked = customer?.status === "blocked";

  const joinedDate = customer?.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/customers"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-900">
              Customer Profile
            </h1>
            <p className="text-xs text-stone-500">
              Account information, saved delivery addresses, and purchasing activity.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={updating}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${
            isBlocked
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {isBlocked ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Activate Customer</span>
            </>
          ) : (
            <>
              <Ban className="w-4 h-4" />
              <span>Block Customer</span>
            </>
          )}
        </button>
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

      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-xl uppercase shadow-sm">
              {customer?.name ? customer.name.charAt(0) : "C"}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold font-serif text-stone-900">
                  {customer?.name}
                </h2>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isBlocked
                      ? "bg-red-100 text-red-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isBlocked ? "Account Blocked" : "Active Customer"}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                Customer ID: {customer?._id}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-xs text-stone-500 space-y-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Registered on {joinedDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-700 font-medium">{customer?.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-700 font-mono">{customer?.phone || "—"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Total Orders
            </span>
            <p className="text-2xl font-bold font-serif text-stone-900 mt-1">
              {data?.totalOrders || orders.length}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">Purchases initiated</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Lifetime Value
            </span>
            <p className="text-2xl font-bold font-serif text-amber-700 mt-1">
              ₹{Number(data?.totalSpent || 0).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">Total offline payments</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Saved Delivery Addresses
            </span>
            <p className="text-2xl font-bold font-serif text-stone-900 mt-1">
              {addresses.length}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">Shipping destinations</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span>Saved Delivery Addresses</span>
        </h3>

        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr, idx) => (
              <div
                key={addr._id || idx}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">
                    {addr.fullName || customer?.name}
                  </span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                      Default Address
                    </span>
                  )}
                </div>
                <p className="text-stone-600 leading-relaxed">
                  {addr.street}
                  {addr.landmark ? `, Near ${addr.landmark}` : ""}
                </p>
                <p className="text-stone-600 font-medium">
                  {addr.city}, {addr.state} —{" "}
                  <span className="font-mono font-semibold text-stone-900">
                    {addr.pinCode}
                  </span>
                </p>
                {addr.phone && (
                  <p className="text-stone-500 text-[11px] font-mono">Phone: {addr.phone}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-stone-400 space-y-1">
            <p className="text-xs font-medium text-stone-600">No saved addresses on file</p>
            <p className="text-[11px] text-stone-400">
              Customer hasn't added delivery addresses yet.
            </p>
          </div>
        )}
      </div>

      {/* Order History Section */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Order History</h3>
            <p className="text-[11px] text-stone-500">
              Interior product orders and offline payment records
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {ord.orderNumber || ord._id.slice(-6)}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 font-serif font-semibold text-stone-900">
                      ₹{Number(ord.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          ord.offlinePayment?.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.offlinePayment?.status || "Unpaid"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-stone-700">
                        {ord.orderStatus || "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/orders/${ord._id}`}
                        className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 inline-block"
                        title="View Order"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-stone-400 space-y-1">
              <ShoppingBag className="w-8 h-8 mx-auto text-stone-300 mb-2" />
              <p className="text-xs font-medium text-stone-600">No purchases recorded yet</p>
              <p className="text-[11px] text-stone-400">
                When this customer places an order, it will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
