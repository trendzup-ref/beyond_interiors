import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import {
  createCategory,
  updateCategory,
  createSubcategory,
  updateSubcategory,
} from "../../api/categoryApi.js";

const CategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  item = null,
  type = "category", // "category" or "subcategory"
  categories = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!item;

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        category: item.category?._id || item.category || "",
        description: item.description || "",
        image: item.image || "",
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        category: categories.length > 0 ? categories[0]._id : "",
        description: "",
        image: "",
        isActive: true,
      });
    }
    setError("");
  }, [item, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (type === "subcategory" && !formData.category) {
      setError("Please select a parent category.");
      return;
    }

    try {
      setLoading(true);

      if (type === "category") {
        if (isEditing) {
          await updateCategory(item._id, {
            name: formData.name,
            description: formData.description,
            image: formData.image,
            isActive: formData.isActive,
          });
        } else {
          await createCategory({
            name: formData.name,
            description: formData.description,
            image: formData.image,
            isActive: formData.isActive,
          });
        }
      } else {
        // Subcategory
        if (isEditing) {
          await updateSubcategory(item._id, {
            name: formData.name,
            category: formData.category,
            description: formData.description,
            image: formData.image,
            isActive: formData.isActive,
          });
        } else {
          await createSubcategory({
            name: formData.name,
            category: formData.category,
            description: formData.description,
            image: formData.image,
            isActive: formData.isActive,
          });
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/60">
          <div>
            <h3 className="text-base font-bold font-serif text-stone-900">
              {isEditing ? "Edit" : "Add New"}{" "}
              {type === "category" ? "Category" : "Subcategory"}
            </h3>
            <p className="text-[11px] text-stone-500">
              {type === "category"
                ? "Manage top-level product classifications"
                : "Attach subcategory under a parent category"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
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

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              {type === "category" ? "Category Name" : "Subcategory Name"} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={
                type === "category"
                  ? "e.g., Furniture, Luxury Lighting, Wallpapers"
                  : "e.g., Sofas, Chandeliers, Vinyl Flooring"
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
            />
          </div>

          {/* Parent Category Selector (Only for Subcategories) */}
          {type === "subcategory" && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Parent Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short summary of this interior design collection..."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 resize-none"
            />
          </div>

          {/* Status Active Toggle */}
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="isActiveToggle"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
            />
            <label
              htmlFor="isActiveToggle"
              className="text-xs font-medium text-stone-700 cursor-pointer select-none"
            >
              Active and visible in store
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
