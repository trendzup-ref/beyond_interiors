import React, { useState, useEffect } from "react";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Layers,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import {
  getCategories,
  deleteCategory,
  getSubcategories,
  deleteSubcategory,
} from "../../api/categoryApi.js";
import CategoryModal from "./CategoryModal.jsx";

const CategoryList = () => {
  const [activeTab, setActiveTab] = useState("categories"); // "categories" | "subcategories"
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedParentCat, setSelectedParentCat] = useState("all");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("category");
  const [selectedItem, setSelectedItem] = useState(null);

  // Alert State
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

  const fetchData = async () => {
    try {
      setLoading(true);
      setAlert(null);

      // Fetch Categories
      const catRes = await getCategories({
        search: activeTab === "categories" ? search : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setCategories(catRes.data?.categories || []);

      // Fetch Subcategories
      const subRes = await getSubcategories({
        category: selectedParentCat !== "all" ? selectedParentCat : undefined,
        search: activeTab === "subcategories" ? search : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setSubcategories(subRes.data?.subcategories || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load category records.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, statusFilter, selectedParentCat]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Open Create Modal
  const handleOpenCreate = (type) => {
    setModalType(type);
    setSelectedItem(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item, type) => {
    setModalType(type);
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Handle Delete Category
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      return;
    }
    try {
      await deleteCategory(id);
      setAlert({ type: "success", message: `Category "${name}" deleted successfully.` });
      fetchData();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Cannot delete category.",
      });
    }
  };

  // Handle Delete Subcategory
  const handleDeleteSubcategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete subcategory "${name}"?`)) {
      return;
    }
    try {
      await deleteSubcategory(id);
      setAlert({ type: "success", message: `Subcategory "${name}" deleted successfully.` });
      fetchData();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Cannot delete subcategory.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Category & Subcategory Management
          </h1>
          <p className="text-xs text-stone-500">
            Structure your interior products catalog with categories and subcategories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg bg-white border border-stone-300 text-stone-600 hover:text-stone-900 shadow-2xs hover:bg-stone-50 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {activeTab === "categories" ? (
            <button
              type="button"
              onClick={() => handleOpenCreate("category")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenCreate("subcategory")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subcategory</span>
            </button>
          )}
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
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
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

      {/* Tabs and Filters Bar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab("categories");
              setSearch("");
            }}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
              activeTab === "categories"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("subcategories");
              setSearch("");
            }}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
              activeTab === "subcategories"
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Subcategories ({subcategories.length})</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </form>

          {/* Right Selectors */}
          <div className="flex items-center gap-2.5">
            {activeTab === "subcategories" && (
              <select
                value={selectedParentCat}
                onChange={(e) => setSelectedParentCat(e.target.value)}
                className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                <option value="all">All Parent Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        {activeTab === "categories" ? (
          /* Categories Table */
          <div className="overflow-x-auto">
            {categories.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Subcategories</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-9 h-9 rounded-lg object-cover border border-stone-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-xs">
                              {cat.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-semibold text-stone-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                        {cat.slug}
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                        {cat.description || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                          <Layers className="w-3 h-3 text-amber-600" />
                          <span>{cat.subcategoryCount || 0} subcategories</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            cat.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat, "category")}
                          className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat._id, cat.name)}
                          className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Category"
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
                <FolderOpen className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-xs font-medium text-stone-700">No categories found</p>
                <p className="text-[11px] text-stone-400">
                  Click "+ Add Category" to start organizing your interior catalog.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Subcategories Table */
          <div className="overflow-x-auto">
            {subcategories.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Subcategory</th>
                    <th className="py-3 px-4">Parent Category</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {subcategories.map((sub) => (
                    <tr key={sub._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {sub.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          {sub.category?.name || "Unassigned"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                        {sub.slug}
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                        {sub.description || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            sub.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {sub.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sub, "subcategory")}
                          className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                          title="Edit Subcategory"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubcategory(sub._id, sub.name)}
                          className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Subcategory"
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
                <Layers className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-xs font-medium text-stone-700">No subcategories found</p>
                <p className="text-[11px] text-stone-400">
                  Click "+ Add Subcategory" to add sub-items under your categories.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          fetchData();
          setAlert({
            type: "success",
            message: `${modalType === "category" ? "Category" : "Subcategory"} saved successfully!`,
          });
        }}
        item={selectedItem}
        type={modalType}
        categories={categories}
      />
    </div>
  );
};

export default CategoryList;
