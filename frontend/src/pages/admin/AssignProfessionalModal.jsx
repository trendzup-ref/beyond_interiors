import React, { useState, useEffect } from "react";
import { X, Wrench, UserCheck, AlertCircle } from "lucide-react";
import { getProfessionals, assignProfessional } from "../../api/installationApi.js";

const AssignProfessionalModal = ({ isOpen, onClose, onSuccess, booking }) => {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProId, setSelectedProId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const loadPros = async () => {
        try {
          setFetching(true);
          setError("");
          const res = await getProfessionals();
          const list = res.data?.professionals || [];
          setProfessionals(list);

          if (booking?.assignedProfessional?._id) {
            setSelectedProId(booking.assignedProfessional._id);
          } else if (list.length > 0) {
            const firstActive = list.find((p) => p.status === "active") || list[0];
            setSelectedProId(firstActive._id);
          }
          setNotes(booking?.notes || "");
        } catch (err) {
          setError(err.message || "Failed to load technicians list.");
        } finally {
          setFetching(false);
        }
      };
      loadPros();
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProId) {
      setError("Please select a professional.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await assignProfessional(booking._id, {
        professionalId: selectedProId,
        notes,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to assign professional.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif text-stone-900">
                Assign Professional
              </h3>
              <p className="text-[11px] text-stone-500 font-mono">
                Booking: {booking.bookingNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Job Details Card */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
            <p className="text-[10px] uppercase font-semibold text-stone-500">
              Service Details
            </p>
            <p className="font-bold text-stone-900">{booking.serviceType}</p>
            <p className="text-stone-600">
              Customer: <span className="font-medium">{booking.customer?.name}</span> (
              {booking.customer?.phone})
            </p>
            <p className="text-stone-500 text-[11px]">
              Scheduled for{" "}
              {new Date(booking.preferredDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              ({booking.timeSlot || "Standard slot"})
            </p>
          </div>

          {/* Select Professional */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Select Installation Technician *
            </label>
            {fetching ? (
              <p className="text-xs text-stone-400 italic">Loading technicians...</p>
            ) : professionals.length > 0 ? (
              <select
                required
                value={selectedProId}
                onChange={(e) => setSelectedProId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                {professionals.map((pro) => (
                  <option key={pro._id} value={pro._id}>
                    {pro.name} — {pro.specialization} ({pro.status.toUpperCase()}) •{" "}
                    {pro.activeJobs || 0} active job(s)
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-red-600 font-medium">
                No professionals found. Please add technicians in the Professionals directory first.
              </p>
            )}
          </div>

          {/* Assignment Remarks */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Assignment Notes / Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please bring laser level and drywall anchors..."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-amber-500/40 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || professionals.length === 0}
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Confirm Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignProfessionalModal;
