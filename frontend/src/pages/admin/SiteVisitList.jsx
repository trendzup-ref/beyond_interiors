import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  MapPin,
  X,
  Phone,
} from "lucide-react";
import {
  getSiteVisits,
  assignProfessionalToVisit,
  updateVisitStatus,
} from "../../api/siteVisitApi.js";
import { getProfessionals } from "../../api/installationApi.js";

const SiteVisitList = () => {
  const [siteVisits, setSiteVisits] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [alert, setAlert] = useState(null);

  // Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalForm, setModalForm] = useState({
    professionalId: "",
    scheduledDate: "",
    timeSlot: "10:00 AM - 01:00 PM",
    remarks: "",
  });
  const [submittingModal, setSubmittingModal] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchSiteVisits = async () => {
    try {
      setLoading(true);
      setAlert(null);

      const params = {
        search: search.trim() || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const [visitRes, proRes] = await Promise.all([
        getSiteVisits(params),
        getProfessionals(),
      ]);

      setSiteVisits(visitRes.data?.siteVisits || []);
      setProfessionals(proRes.data?.professionals || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load site visits.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteVisits();
  }, [statusFilter, startDate, endDate]);

  const handleOpenScheduleModal = (visit) => {
    setSelectedVisit(visit);
    const existingDate = visit.scheduledDate || visit.preferredDate;
    const formattedDate = existingDate
      ? new Date(existingDate).toISOString().split("T")[0]
      : "";

    setModalForm({
      professionalId: visit.assignedProfessional?._id || (professionals[0]?._id ?? ""),
      scheduledDate: formattedDate,
      timeSlot: visit.timeSlot || "10:00 AM - 01:00 PM",
      remarks: visit.remarks || "",
    });
    setModalError("");
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.scheduledDate) {
      setModalError("Please select a scheduled visit date.");
      return;
    }
    if (!modalForm.professionalId) {
      setModalError("Please select an interior specialist / professional.");
      return;
    }

    try {
      setSubmittingModal(true);
      setModalError("");

      await assignProfessionalToVisit(selectedVisit._id, {
        professionalId: modalForm.professionalId,
        scheduledDate: modalForm.scheduledDate,
        timeSlot: modalForm.timeSlot,
        remarks: modalForm.remarks,
      });

      setAlert({
        type: "success",
        message: `Site visit ${selectedVisit.visitNumber} scheduled successfully!`,
      });
      setScheduleModalOpen(false);
      fetchSiteVisits();
    } catch (err) {
      setModalError(err.message || "Failed to schedule site visit.");
    } finally {
      setSubmittingModal(false);
    }
  };

  const handleStatusChange = async (visitId, newStatus) => {
    try {
      await updateVisitStatus(visitId, newStatus);
      setAlert({
        type: "success",
        message: `Site visit status updated to ${newStatus}.`,
      });
      fetchSiteVisits();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to update visit status.",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  // Metrics
  const pendingCount = siteVisits.filter((v) => v.status === "pending").length;
  const scheduledCount = siteVisits.filter((v) => v.status === "scheduled").length;
  const completedCount = siteVisits.filter((v) => v.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Site Visit Management
          </h1>
          <p className="text-xs text-stone-500">
            Schedule customer home visits, interior measurements, and assign field specialists.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSiteVisits}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Visits</span>
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Pending Requests
            </span>
            <p className="text-2xl font-bold font-serif text-amber-700 mt-1">
              {pendingCount}
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">Needs date & specialist assignment</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Scheduled & Confirmed
            </span>
            <p className="text-2xl font-bold font-serif text-blue-700 mt-1">
              {scheduledCount}
            </p>
            <p className="text-[11px] text-blue-700 mt-0.5">Assigned to field staff</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Completed Visits
            </span>
            <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">
              {completedCount}
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Measurements & consults done</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchSiteVisits();
            }}
            className="relative flex-1 max-w-sm"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by visit #, city, or PIN code..."
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
              <option value="all">All Visit Statuses</option>
              <option value="pending">Pending (Unscheduled)</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Date Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs text-stone-600">
          <span className="font-semibold text-stone-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Preferred Date Range:</span>
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

      {/* Visits Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {siteVisits.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Visit #</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Site Location</th>
                  <th className="py-3 px-4">Dates & Time Slot</th>
                  <th className="py-3 px-4">Assigned Specialist</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {siteVisits.map((v) => {
                  const pro = v.assignedProfessional;
                  const prefDate = v.preferredDate
                    ? new Date(v.preferredDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";

                  const schedDate = v.scheduledDate
                    ? new Date(v.scheduledDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : null;

                  return (
                    <tr key={v._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        {v.visitNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-900">
                            {v.customer?.name || "Customer"}
                          </span>
                          <span className="text-[11px] text-stone-500 font-mono">
                            {v.customer?.phone || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 max-w-xs">
                        <div className="flex items-start gap-1.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <div className="truncate">
                            <span className="block truncate font-medium text-stone-800">
                              {v.address?.street}
                            </span>
                            <span className="text-stone-400 text-[10px]">
                              {v.address?.city}, {v.address?.state} — {v.address?.pinCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-700">
                        <div className="flex flex-col text-[11px]">
                          {schedDate ? (
                            <span className="font-bold text-blue-800 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-blue-600" />
                              <span>Confirmed: {schedDate}</span>
                            </span>
                          ) : (
                            <span className="text-stone-600 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              <span>Requested: {prefDate}</span>
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400">{v.timeSlot}</span>
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
                              <span className="text-[10px] text-stone-500">
                                {pro.specialization}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                            <UserX className="w-3 h-3" />
                            <span>Unassigned</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${getStatusBadge(
                            v.status
                          )}`}
                        >
                          {v.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenScheduleModal(v)}
                          className="px-2.5 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          {v.status === "scheduled" ? "Reschedule" : "Schedule & Assign"}
                        </button>

                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v._id, e.target.value)}
                          className="px-2 py-1 rounded-md border border-stone-300 text-[11px] text-stone-700 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="scheduled">Scheduled</option>
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
              <CalendarCheck className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-xs font-medium text-stone-700">No site visits found</p>
              <p className="text-[11px] text-stone-400">
                Customer home visit and consultation requests will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule & Assign Modal */}
      {scheduleModalOpen && selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/60">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold font-serif text-stone-900">
                  Schedule Site Visit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4 text-xs">
              {modalError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Customer & Location Summary */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <p className="font-bold text-stone-900">
                  {selectedVisit.customer?.name} ({selectedVisit.customer?.phone})
                </p>
                <p className="text-stone-600 text-[11px]">
                  {selectedVisit.address?.street}, {selectedVisit.address?.city} —{" "}
                  {selectedVisit.address?.pinCode}
                </p>
              </div>

              {/* Confirmed Date */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Confirmed Scheduled Date *
                </label>
                <input
                  type="date"
                  required
                  value={modalForm.scheduledDate}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, scheduledDate: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Time Slot
                </label>
                <select
                  value={modalForm.timeSlot}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, timeSlot: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                >
                  <option value="10:00 AM - 01:00 PM">Morning (10:00 AM - 01:00 PM)</option>
                  <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                  <option value="05:00 PM - 08:00 PM">Evening (05:00 PM - 08:00 PM)</option>
                </select>
              </div>

              {/* Assign Specialist */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Assign Interior Specialist / Technician *
                </label>
                <select
                  required
                  value={modalForm.professionalId}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, professionalId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                >
                  <option value="" disabled>
                    Select specialist
                  </option>
                  {professionals.map((pro) => (
                    <option key={pro._id} value={pro._id}>
                      {pro.name} — {pro.specialization} ({pro.status.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Site Instructions / Notes
                </label>
                <textarea
                  rows={2}
                  value={modalForm.remarks}
                  onChange={(e) =>
                    setModalForm({ ...modalForm, remarks: e.target.value })
                  }
                  placeholder="e.g. Bring measuring tape and wallpaper catalog samples..."
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-stone-900 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingModal}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingModal ? "Scheduling..." : "Save & Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteVisitList;
