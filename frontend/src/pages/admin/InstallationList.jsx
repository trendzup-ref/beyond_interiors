import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Wrench,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Phone,
  Layers,
  Users,
} from "lucide-react";
import {
  getInstallations,
  updateInstallationStatus,
} from "../../api/installationApi.js";
import AssignProfessionalModal from "./AssignProfessionalModal.jsx";

const InstallationList = () => {
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [alert, setAlert] = useState(null);

  // Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      setAlert(null);

      const params = {
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      const res = await getInstallations(params);
      setInstallations(res.data?.installations || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load installation bookings.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, [statusFilter]);

  const handleOpenAssign = (booking) => {
    setSelectedBooking(booking);
    setAssignModalOpen(true);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateInstallationStatus(bookingId, newStatus);
      setAlert({
        type: "success",
        message: `Booking status updated to ${newStatus}.`,
      });
      fetchInstallations();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to update status.",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in_progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  // Metrics
  const requestedCount = installations.filter((i) => i.status === "requested").length;
  const assignedCount = installations.filter(
    (i) => i.status === "assigned" || i.status === "in_progress"
  ).length;
  const completedCount = installations.filter((i) => i.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Installation & Assembly Services
          </h1>
          <p className="text-xs text-stone-500">
            Dispatch technicians, assign specialists, and oversee on-site installation progress.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/professionals"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 shadow-2xs transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-stone-500" />
            <span>Manage Technicians</span>
          </Link>

          <button
            type="button"
            onClick={fetchInstallations}
            disabled={loading}
            className="p-2 rounded-lg bg-white border border-stone-300 text-stone-600 hover:text-stone-900 shadow-2xs hover:bg-stone-50 cursor-pointer"
            title="Refresh Bookings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Awaiting Assignment
            </span>
            <p className="text-2xl font-bold font-serif text-amber-700 mt-1">
              {requestedCount}
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">Needs technician dispatch</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Active / In Progress
            </span>
            <p className="text-2xl font-bold font-serif text-blue-700 mt-1">
              {assignedCount}
            </p>
            <p className="text-[11px] text-blue-700 mt-0.5">Technicians assigned</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Completed Installations
            </span>
            <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">
              {completedCount}
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Successfully delivered</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchInstallations();
          }}
          className="relative flex-1 max-w-sm"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking # or service type..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <option value="all">All Booking Statuses</option>
            <option value="requested">Requested (Unassigned)</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {installations.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Booking #</th>
                  <th className="py-3 px-4">Service & Customer</th>
                  <th className="py-3 px-4">Schedule Date & Slot</th>
                  <th className="py-3 px-4">Assigned Technician</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {installations.map((inst) => {
                  const pro = inst.assignedProfessional;
                  const dateStr = inst.preferredDate
                    ? new Date(inst.preferredDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr key={inst._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {inst.bookingNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-900">
                            {inst.serviceType}
                          </span>
                          <span className="text-[11px] text-stone-600">
                            Customer: {inst.customer?.name} ({inst.customer?.phone})
                          </span>
                          {inst.order && (
                            <span className="text-[10px] text-stone-400 font-mono">
                              Order: {inst.order.orderNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-700">
                        <div className="flex flex-col text-[11px]">
                          <span className="font-semibold text-stone-900 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            <span>{dateStr}</span>
                          </span>
                          <span className="text-stone-500">{inst.timeSlot}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {pro ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                              {pro.name.charAt(0)}
                            </div>
                            <div className="flex flex-col text-[11px]">
                              <span className="font-semibold text-stone-900">{pro.name}</span>
                              <span className="text-stone-500 font-mono text-[10px]">
                                {pro.phone}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">
                            <UserX className="w-3 h-3" />
                            <span>Not Assigned</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${getStatusBadge(
                            inst.status
                          )}`}
                        >
                          {inst.status.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        {/* Quick Assign Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenAssign(inst)}
                          className="px-2.5 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          {pro ? "Reassign" : "Assign Pro"}
                        </button>

                        {/* Quick Status Dropdown */}
                        <select
                          value={inst.status}
                          onChange={(e) => handleStatusChange(inst._id, e.target.value)}
                          className="px-2 py-1 rounded-md border border-stone-300 text-[11px] text-stone-700 bg-white"
                        >
                          <option value="requested">Requested</option>
                          <option value="assigned">Assigned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-stone-400 space-y-3">
              <Wrench className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-xs font-medium text-stone-700">No installation bookings found</p>
              <p className="text-[11px] text-stone-400">
                Customer installation service requests will appear here for technician dispatch.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Professional Modal */}
      <AssignProfessionalModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onSuccess={() => {
          fetchInstallations();
          setAlert({
            type: "success",
            message: "Professional assigned successfully to the installation booking!",
          });
        }}
        booking={selectedBooking}
      />
    </div>
  );
};

export default InstallationList;
