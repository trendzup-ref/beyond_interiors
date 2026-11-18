import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Wrench,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Phone,
  Briefcase,
  Users,
  X,
} from "lucide-react";
import {
  getProfessionals,
  createProfessional,
  updateProfessional,
  deleteProfessional,
} from "../../api/installationApi.js";

const ProfessionalList = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [alert, setAlert] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPro, setEditingPro] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    specialization: "Furniture Assembly",
    experienceYears: 2,
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      setAlert(null);
      const res = await getProfessionals({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: search || undefined,
      });
      setProfessionals(res.data?.professionals || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load professionals.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [statusFilter]);

  const handleOpenAdd = () => {
    setEditingPro(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      specialization: "Furniture Assembly",
      experienceYears: 2,
      status: "active",
    });
    setModalError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (pro) => {
    setEditingPro(pro);
    setFormData({
      name: pro.name || "",
      phone: pro.phone || "",
      email: pro.email || "",
      specialization: pro.specialization || "Furniture Assembly",
      experienceYears: pro.experienceYears || 2,
      status: pro.status || "active",
    });
    setModalError("");
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!formData.name.trim() || !formData.phone.trim()) {
      setModalError("Name and Phone number are required.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingPro) {
        await updateProfessional(editingPro._id, formData);
        setAlert({
          type: "success",
          message: `Professional "${formData.name}" updated successfully.`,
        });
      } else {
        await createProfessional(formData);
        setAlert({
          type: "success",
          message: `Professional "${formData.name}" added to roster.`,
        });
      }
      setModalOpen(false);
      fetchProfessionals();
    } catch (err) {
      setModalError(err.message || "Failed to save professional.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove technician "${name}"?`)) {
      return;
    }
    try {
      await deleteProfessional(id);
      setAlert({
        type: "success",
        message: `Professional "${name}" removed successfully.`,
      });
      fetchProfessionals();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Cannot delete professional.",
      });
    }
  };

  // Metrics
  const activeCount = professionals.filter((p) => p.status === "active").length;
  const busyCount = professionals.filter((p) => p.status === "busy").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Installation Professionals
          </h1>
          <p className="text-xs text-stone-500">
            Manage your internal assembly technicians, installers, and service specialists.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/installations"
            className="px-3 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 shadow-2xs"
          >
            View Bookings
          </Link>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Professional</span>
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Total Roster
            </span>
            <p className="text-2xl font-bold font-serif text-stone-900 mt-1">
              {professionals.length}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">Technicians on file</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Available & Active
            </span>
            <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">
              {activeCount}
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Ready for dispatch</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Currently on Site
            </span>
            <p className="text-2xl font-bold font-serif text-amber-700 mt-1">
              {busyCount}
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">Assigned to active jobs</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchProfessionals();
          }}
          className="relative flex-1 max-w-sm"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or specialty..."
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
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="busy">Busy on Site</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Professionals Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {professionals.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Technician Name</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Active Jobs</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {professionals.map((pro) => (
                  <tr key={pro._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      {pro.name}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {pro.specialization}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-stone-600">
                      <div className="flex flex-col text-[11px]">
                        <span className="font-mono text-stone-900">{pro.phone}</span>
                        {pro.email && <span className="text-stone-400">{pro.email}</span>}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-700">
                      {pro.experienceYears} year(s)
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-800">
                        {pro.activeJobs || 0} job(s)
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          pro.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : pro.status === "busy"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {pro.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(pro)}
                        className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pro._id, pro.name)}
                        className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Remove Technician"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-stone-400 space-y-3">
              <Wrench className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-xs font-medium text-stone-700">No technicians found</p>
              <p className="text-[11px] text-stone-400">
                Click "+ Add Professional" to enroll assembly & installation staff.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Professional Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/60">
              <h3 className="text-sm font-bold font-serif text-stone-900">
                {editingPro ? "Edit Professional" : "Add Installation Professional"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-3.5 text-xs">
              {modalError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experienceYears}
                    onChange={(e) =>
                      setFormData({ ...formData, experienceYears: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@beyondinteriors.com"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Specialization *
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData({ ...formData, specialization: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                  >
                    <option value="Furniture Assembly">Furniture Assembly</option>
                    <option value="Lighting & Electricals">Lighting & Electricals</option>
                    <option value="Wallpapers & Paneling">Wallpapers & Paneling</option>
                    <option value="Flooring Installation">Flooring Installation</option>
                    <option value="Curtains & Drapery">Curtains & Drapery</option>
                    <option value="General Interior Installation">General Interior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 bg-white"
                  >
                    <option value="active">Active (Available)</option>
                    <option value="busy">Busy (On Site)</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Professional"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalList;
