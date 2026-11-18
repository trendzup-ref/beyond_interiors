import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Upload,
  X,
  Sliders,
} from "lucide-react";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  reorderBanners,
  getFeaturedProducts,
} from "../../api/bannerApi.js";

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit'
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "/products",
    displayOrder: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchBannersData = async () => {
    try {
      setLoading(true);
      const [bannerRes, featuredRes] = await Promise.all([
        getBanners(),
        getFeaturedProducts().catch(() => ({ data: { count: 0 } })),
      ]);

      const bannerList = bannerRes.data?.banners || [];
      // Ensure sorted by displayOrder ascending
      bannerList.sort((a, b) => a.displayOrder - b.displayOrder);
      setBanners(bannerList);
      setFeaturedCount(featuredRes.data?.count || 0);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load homepage banners.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannersData();
  }, []);

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      linkUrl: "/products",
      displayOrder: banners.length > 0 ? Math.max(...banners.map((b) => b.displayOrder || 0)) + 1 : 0,
      isActive: true,
    });
    setImageFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setModalMode("edit");
    setSelectedBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl || "",
      linkUrl: banner.linkUrl || "/products",
      displayOrder: banner.displayOrder ?? 0,
      isActive: banner.isActive ?? true,
    });
    setImageFile(null);
    setPreviewUrl(banner.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setAlert({ type: "error", message: "Please provide a banner title." });
      return;
    }
    if (!imageFile && !formData.imageUrl.trim()) {
      setAlert({ type: "error", message: "Please upload an image file or provide an Image URL." });
      return;
    }

    try {
      setSubmitting(true);
      setAlert(null);

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("subtitle", formData.subtitle);
      payload.append("linkUrl", formData.linkUrl);
      payload.append("displayOrder", formData.displayOrder);
      payload.append("isActive", formData.isActive);

      if (imageFile) {
        payload.append("image", imageFile);
      } else if (formData.imageUrl) {
        payload.append("imageUrl", formData.imageUrl);
      }

      if (modalMode === "create") {
        await createBanner(payload);
        setAlert({ type: "success", message: "Homepage banner published successfully." });
      } else {
        await updateBanner(selectedBanner._id, payload);
        setAlert({ type: "success", message: "Homepage banner updated successfully." });
      }

      setIsModalOpen(false);
      fetchBannersData();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || err.message || "Failed to save banner.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (banner) => {
    try {
      await toggleBannerStatus(banner._id);
      setBanners((prev) =>
        prev.map((b) => (b._id === banner._id ? { ...b, isActive: !b.isActive } : b))
      );
      setAlert({
        type: "success",
        message: `Banner status set to ${!banner.isActive ? "Active" : "Inactive"}.`,
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to toggle banner status.",
      });
    }
  };

  const handleDelete = async (banner) => {
    if (!window.confirm(`Are you sure you want to delete banner "${banner.title}"?`)) {
      return;
    }

    try {
      await deleteBanner(banner._id);
      setBanners((prev) => prev.filter((b) => b._id !== banner._id));
      setAlert({
        type: "success",
        message: `Banner "${banner.title}" was deleted.`,
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to delete banner.",
      });
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const [movedBanner] = newBanners.splice(index, 1);
    newBanners.splice(targetIndex, 0, movedBanner);

    // Re-assign displayOrder sequentially
    const orderings = newBanners.map((b, idx) => ({
      id: b._id,
      displayOrder: idx,
    }));

    setBanners(newBanners.map((b, idx) => ({ ...b, displayOrder: idx })));

    try {
      await reorderBanners(orderings);
    } catch (err) {
      fetchBannersData(); // revert on error
      setAlert({
        type: "error",
        message: "Failed to persist new banner order.",
      });
    }
  };

  const activeCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      {alert && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl text-sm font-medium transition-all ${
            alert.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {alert.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{alert.message}</span>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="text-stone-400 hover:text-stone-600 font-bold ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Homepage Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Curate hero slides, promotional banners, and showcase featured catalog products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/featured"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all border border-stone-300"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Featured Products ({featuredCount})</span>
          </Link>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hero Banner</span>
          </button>
        </div>
      </div>

      {/* Quick Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Total Banners</p>
            <p className="text-xl font-bold font-serif text-stone-900">{banners.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Active on Homepage</p>
            <p className="text-xl font-bold font-serif text-emerald-700">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Featured Showcase</p>
            <p className="text-xl font-bold font-serif text-indigo-700">
              {featuredCount} Items
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-stone-200">
        <button className="pb-3 px-4 text-xs font-bold border-b-2 border-amber-600 text-amber-700 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>Hero Banners ({banners.length})</span>
        </button>
        <Link
          to="/admin/featured"
          className="pb-3 px-4 text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Featured Products Selector</span>
        </Link>
      </div>

      {/* Banners Grid / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-stone-200">
          <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mb-3" />
          <p className="text-xs text-stone-500 font-medium">Loading banner gallery...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-stone-900">No Hero Banners Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Create high-resolution promotional hero banners to engage visitors on the customer homepage.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Banner</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`bg-white rounded-xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col ${
                banner.isActive ? "border-stone-200" : "border-stone-200 opacity-75 bg-stone-50/50"
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-16/9 bg-stone-900 overflow-hidden group">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {/* Status & Order Overlay Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-amber-400" />
                    Order: {banner.displayOrder}
                  </span>
                  {banner.isActive ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-600 text-white">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Quick Reorder Controls */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-lg">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveOrder(index, "up")}
                    title="Move Order Left/Up"
                    className="p-1 text-white hover:text-amber-400 disabled:opacity-30 disabled:hover:text-white transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === banners.length - 1}
                    onClick={() => handleMoveOrder(index, "down")}
                    title="Move Order Right/Down"
                    className="p-1 text-white hover:text-amber-400 disabled:opacity-30 disabled:hover:text-white transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Banner Details Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base line-clamp-1">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{banner.subtitle}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1 truncate max-w-[180px]">
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate text-stone-600">{banner.linkUrl}</span>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(banner)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                      banner.isActive
                        ? "text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200"
                        : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    }`}
                  >
                    {banner.isActive ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Activate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-mono">
                  {new Date(banner.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-white rounded transition-colors"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner)}
                    className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-white rounded transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-stone-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  {modalMode === "create" ? "Add Hero Banner" : "Edit Hero Banner"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
              {/* Image Preview & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Banner Image <span className="text-rose-500">*</span>
                </label>

                {previewUrl ? (
                  <div className="relative aspect-16/9 bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
                    <img
                      src={previewUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl("");
                        setImageFile(null);
                        setFormData((prev) => ({ ...prev, imageUrl: "" }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-xl p-6 text-center transition-colors bg-stone-50">
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-stone-700">
                      Upload hero graphic or photo
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      PNG, JPG, WEBP up to 5MB (Recommended: 1920x800 or 16:9 ratio)
                    </p>
                    <label className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer shadow-xs">
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Direct Image URL input as secondary option */}
                <div className="pt-1">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, imageUrl: e.target.value }));
                      if (!imageFile) setPreviewUrl(e.target.value);
                    }}
                    placeholder="Or paste an image URL directly (e.g. https://...)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Title / Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Bespoke Luxury Interiors for Contemporary Homes"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Subtitle Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Explore our handcrafted furniture & turn-key architectural installation"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Target Link & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Target Link URL
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))
                    }
                    placeholder="/products or /categories/living-room"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Display Order (Index)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, displayOrder: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveBanner"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <label
                  htmlFor="isActiveBanner"
                  className="text-xs font-medium text-stone-700 cursor-pointer"
                >
                  Publish and display banner on customer homepage
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === "create" ? "Publish Banner" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerList;
