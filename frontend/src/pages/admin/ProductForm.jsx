import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  Package,
  Layers,
  UploadCloud,
  CheckCircle,
} from "lucide-react";
import {
  createProduct,
  getProduct,
  updateProduct,
  uploadProductImages,
} from "../../api/productApi.js";
import { getCategories, getSubcategories } from "../../api/categoryApi.js";

const defaultVariant = {
  sku: "",
  color: "",
  size: "",
  material: "",
  price: "",
  mrp: "",
  stockQuantity: "",
};

const ProductForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    images: [],
    variants: [{ ...defaultVariant, sku: "PROD-VAR-1" }],
    isFeatured: false,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load initial data & categories
  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await getCategories({ status: "active" });
        const cats = catRes.data?.categories || [];
        setCategories(cats);

        if (isEditing) {
          const prodRes = await getProduct(id);
          const p = prodRes.data?.product;
          if (p) {
            setFormData({
              name: p.name || "",
              description: p.description || "",
              category: p.category?._id || p.category || "",
              subcategory: p.subcategory?._id || p.subcategory || "",
              images: p.images || [],
              variants: p.variants || [{ ...defaultVariant, sku: "PROD-VAR-1" }],
              isFeatured: p.isFeatured || false,
              isActive: p.isActive !== undefined ? p.isActive : true,
            });

            // Load subcategories for this category
            if (p.category?._id || p.category) {
              const subRes = await getSubcategories({
                category: p.category?._id || p.category,
              });
              setSubcategories(subRes.data?.subcategories || []);
            }
          }
        }
      } catch (err) {
        setError(err.message || "Failed to initialize product form.");
      } finally {
        setFetching(false);
      }
    };

    init();
  }, [id, isEditing]);

  // Handle Category selection change
  const handleCategoryChange = async (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId, subcategory: "" }));
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    try {
      const res = await getSubcategories({ category: categoryId });
      setSubcategories(res.data?.subcategories || []);
    } catch (err) {
      console.error("Error loading subcategories:", err);
    }
  };

  // Image Management (Direct upload & remove)
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  // File upload trigger
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files || files.length === 0) return;

    const currentCount = formData.images.length;
    const remainingSlots = 5 - currentCount;

    if (remainingSlots <= 0) {
      setError("Maximum limit of 5 images reached. Please remove an existing image before adding another.");
      e.target.value = "";
      return;
    }

    if (files.length > remainingSlots) {
      setError(
        `You can only select up to ${remainingSlots} more image${
          remainingSlots > 1 ? "s" : ""
        } (Maximum 5 images allowed per product).`
      );
      e.target.value = "";
      return;
    }

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("images", files[i]);
    }

    try {
      setUploadingImage(true);
      setError("");
      const res = await uploadProductImages(data);
      const uploadedUrls = res.data?.images || [];
      setFormData((prev) => {
        const combined = [...prev.images, ...uploadedUrls];
        return {
          ...prev,
          images: combined.slice(0, 5),
        };
      });
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  // Variant Management
  const handleVariantChange = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index][field] = value;
    setFormData({ ...formData, variants: updated });
  };

  const handleAddVariant = () => {
    const newSku = `PROD-VAR-${formData.variants.length + 1}`;
    setFormData({
      ...formData,
      variants: [...formData.variants, { ...defaultVariant, sku: newSku }],
    });
  };

  const handleRemoveVariant = (index) => {
    if (formData.variants.length === 1) {
      alert("A product must contain at least one variant.");
      return;
    }
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.category) {
      setError("Please select a product category.");
      return;
    }

    if (!formData.variants || formData.variants.length === 0) {
      setError("At least one product variant is required.");
      return;
    }

    // Clean variants and check required numbers
    const cleanVariants = [];
    for (const v of formData.variants) {
      if (!v.sku.trim()) {
        setError("Each variant must have an SKU.");
        return;
      }
      if (v.price === "" || Number(v.price) < 0) {
        setError(`Please enter a valid price for SKU: ${v.sku}`);
        return;
      }
      if (v.mrp === "" || Number(v.mrp) < 0) {
        setError(`Please enter a valid MRP for SKU: ${v.sku}`);
        return;
      }
      cleanVariants.push({
        ...v,
        price: Number(v.price),
        mrp: Number(v.mrp),
        stockQuantity: Number(v.stockQuantity) || 0,
      });
    }

    const cleanImages = formData.images.filter((img) => Boolean(img && img.trim()));

    if (cleanImages.length === 0) {
      setError("At least one product image is mandatory. Please upload at least 1 image.");
      return;
    }

    if (cleanImages.length > 5) {
      setError("You can upload a maximum of 5 images per product.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      subcategory: formData.subcategory || null,
      images: cleanImages,
      variants: cleanVariants,
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
    };

    try {
      setLoading(true);
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center space-y-3">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }}
        />
        <p className="text-xs text-stone-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  // Live Stats calculations
  const totalStockCalc = formData.variants.reduce(
    (sum, v) => sum + (Number(v.stockQuantity) || 0),
    0
  );
  const prices = formData.variants
    .map((v) => Number(v.price))
    .filter((p) => !isNaN(p) && p > 0);
  const startingPriceCalc = prices.length ? Math.min(...prices) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-900">
              {isEditing ? "Edit Interior Product" : "Add New Interior Product"}
            </h1>
            <p className="text-xs text-stone-500">
              Configure product details, variants, media, and inventory stock.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? "Saving..." : isEditing ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Calculated Stats Pill */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs text-xs">
        <div>
          <span className="text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
            Variants
          </span>
          <p className="text-base font-bold text-stone-900 font-serif">
            {formData.variants.length} SKU(s)
          </p>
        </div>
        <div>
          <span className="text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
            Starting Price
          </span>
          <p className="text-base font-bold text-amber-700 font-serif">
            ₹{startingPriceCalc.toLocaleString("en-IN")}
          </p>
        </div>
        <div>
          <span className="text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
            Total Inventory
          </span>
          <p
            className={`text-base font-bold font-serif ${
              totalStockCalc <= 5 ? "text-red-600" : "text-emerald-700"
            }`}
          >
            {totalStockCalc} Units
          </p>
        </div>
        <div>
          <span className="text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
            Store Status
          </span>
          <p className="text-base font-bold text-stone-900 font-serif">
            {formData.isActive ? "Active (Live)" : "Draft (Hidden)"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-600" />
            <span>Basic Information</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Royal Chesterfield 3-Seater Velvet Sofa"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Parent Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Subcategory (Optional)
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                disabled={subcategories.length === 0}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:bg-stone-100"
              >
                <option value="">None / Unassigned</option>
                {subcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe materials, build quality, comfort, warranty, and installation details..."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-stone-700">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
              />
              <span>Mark as Featured Product (Highlight on Homepage)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-stone-700">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
              />
              <span>Product Active & Visible</span>
            </label>
          </div>
        </div>

        {/* Section 2: Product Images (1 Mandatory, Max 5) */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-stone-900">Product Images</h2>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor:
                      formData.images.length === 0
                        ? "var(--color-tertiary)"
                        : formData.images.length === 5
                        ? "#ecfdf5"
                        : "var(--color-tertiary)",
                    color:
                      formData.images.length === 0
                        ? "var(--color-primary)"
                        : formData.images.length === 5
                        ? "#065f46"
                        : "var(--color-primary)",
                    border: "1px solid var(--color-secondary)",
                  }}
                >
                  {formData.images.length}/5 uploaded {formData.images.length === 0 ? "• Required" : ""}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Upload up to 5 photos from your device. <strong className="text-stone-700">At least 1 photo is mandatory</strong>. The first photo is your primary catalog cover.
              </p>
            </div>

            {formData.images.length < 5 ? (
              <label
                className="px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{uploadingImage ? "Uploading..." : "Upload Photos"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImage || formData.images.length >= 5}
                  className="hidden"
                />
              </label>
            ) : (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                Maximum 5/5 Photos Uploaded
              </span>
            )}
          </div>

          {/* Upload Dropzone */}
          {formData.images.length < 5 ? (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 hover:border-primary rounded-xl bg-stone-50/50 hover:bg-tertiary/20 cursor-pointer transition-colors group">
              <UploadCloud
                className="w-8 h-8 text-stone-400 group-hover:text-primary transition-colors mb-2"
              />
              <span className="text-xs font-semibold text-stone-700 group-hover:text-primary">
                {uploadingImage
                  ? "Uploading images to server..."
                  : `Click to select or drag & drop (${5 - formData.images.length} slot${
                      5 - formData.images.length > 1 ? "s" : ""
                    } remaining)`}
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5">
                PNG, JPG, WEBP up to 5MB each (Max 5 images per product)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage || formData.images.length >= 5}
                className="hidden"
              />
            </label>
          ) : (
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-center text-xs text-stone-600 font-medium">
              Image upload limit reached (5 of 5). To change photos, delete an image from the gallery below.
            </div>
          )}

          {/* Uploaded Images Gallery Grid */}
          {formData.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
              {formData.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-100 aspect-square shadow-2xs flex items-center justify-center"
                >
                  <img
                    src={imgUrl}
                    alt={`Product photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/300x300?text=Preview+Error";
                    }}
                  />

                  {/* Primary Cover Badge */}
                  {idx === 0 && (
                    <span
                      className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-xs uppercase tracking-wider"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      Cover
                    </span>
                  )}

                  {/* Image Sequence Indicator */}
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-stone-900/70 text-white backdrop-blur-xs">
                    {idx + 1}/5
                  </span>

                  {/* Delete Overlay */}
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-2 rounded-full bg-white/95 text-red-600 hover:bg-white hover:text-red-700 shadow-md transition-transform hover:scale-110 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-4 rounded-xl text-center border"
              style={{
                backgroundColor: "var(--color-tertiary)",
                borderColor: "var(--color-secondary)",
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                ⚠ At least 1 image is mandatory to create/save this product.
              </p>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Upload 1 to 5 clear photos to showcase your interior design collection.
              </p>
            </div>
          )}
        </div>

        {/* Section 3: Product Variants & Inventory */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Product Variants & SKU Management</span>
              </h2>
              <p className="text-[11px] text-stone-500">
                Define color, dimensions, material, selling price, and initial stock.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.variants.map((v, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Variant #{idx + 1}
                  </span>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Variant</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* SKU */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={v.sku}
                      onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                      placeholder="e.g. SF-VEL-BRN"
                      className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs text-stone-900 bg-white uppercase font-mono"
                    />
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                      placeholder="e.g. Royal Beige"
                      className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs text-stone-900 bg-white"
                    />
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Size / Dim.
                    </label>
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                      placeholder="e.g. 3-Seater"
                      className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs text-stone-900 bg-white"
                    />
                  </div>

                  {/* Material */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      value={v.material}
                      onChange={(e) => handleVariantChange(idx, "material", e.target.value)}
                      placeholder="e.g. Velvet"
                      className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs text-stone-900 bg-white"
                    />
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={v.price}
                      onChange={(e) => handleVariantChange(idx, "price", e.target.value)}
                      placeholder="45000"
                      className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs text-stone-900 bg-white font-semibold"
                    />
                  </div>

                  {/* MRP */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      MRP (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={v.mrp}
                      onChange={(e) => handleVariantChange(idx, "mrp", e.target.value)}
                      placeholder="59000"
                      className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs text-stone-900 bg-white"
                    />
                  </div>

                  {/* Stock */}
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Inventory Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={v.stockQuantity}
                      onChange={(e) => handleVariantChange(idx, "stockQuantity", e.target.value)}
                      placeholder="Units in warehouse"
                      className="w-full px-3 py-1.5 rounded-md border border-stone-300 text-xs text-stone-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Save Product Changes" : "Publish to Catalog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
