import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Users,
  Search,
  Eye,
  Ban,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { getCustomers, updateCustomerStatus } from "../../api/customerApi.js";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setAlert(null);

      const params = {
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      const res = await getCustomers(params);
      setCustomers(res.data?.customers || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load customer records.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleToggleStatus = async (customer) => {
    const newStatus = customer.status === "active" ? "blocked" : "active";
    const actionLabel = newStatus === "blocked" ? "block" : "activate";

    if (!window.confirm(`Are you sure you want to ${actionLabel} ${customer.name}?`)) {
      return;
    }

    try {
      setUpdatingId(customer._id);
      await updateCustomerStatus(customer._id, newStatus);
      setAlert({
        type: "success",
        message: `Customer ${customer.name} is now ${newStatus}.`,
      });

      // Update local state
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === customer._id
            ? { ...c, status: newStatus, isActive: newStatus === "active" }
            : c
        )
      );
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || `Failed to ${actionLabel} customer.`,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Customer Accounts
          </h1>
          <p className="text-xs text-stone-500">
            View customer directories, registration details, order history, and account standing.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Customers</span>
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

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <option value="all">All Customer Status</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {customers.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Orders Placed</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => {
                  const isBlocked = c.status === "blocked";
                  const isUpdating = updatingId === c._id;
                  const joinedDate = c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr key={c._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0 uppercase">
                            {c.name ? c.name.charAt(0) : "C"}
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-stone-900 block truncate">
                              {c.name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              ID: {c._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col text-[11px] text-stone-600">
                          <span className="truncate">{c.email}</span>
                          <span className="font-mono text-[10px] text-stone-500">
                            {c.phone || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{joinedDate}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                          <ShoppingBag className="w-3 h-3 text-amber-600" />
                          <span>{c.orderCount || 0} order(s)</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isBlocked
                              ? "bg-red-100 text-red-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/admin/customers/${c._id}`}
                          className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-md transition-colors inline-block"
                          title="View Profile & Orders"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(c)}
                          disabled={isUpdating}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            isBlocked
                              ? "text-emerald-700 hover:bg-emerald-50"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title={isBlocked ? "Activate Account" : "Block Account"}
                        >
                          {isBlocked ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-stone-400 space-y-3">
              <Users className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-xs font-medium text-stone-700">No customers found</p>
              <p className="text-[11px] text-stone-400">
                Registered buyers will appear here as soon as they sign up on the storefront.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
