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
    images: [""],
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
              images: p.images && p.images.length > 0 ? p.images : [""],
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

  // Image URL management
  const handleImageUrlChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const handleAddImageUrl = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const handleRemoveImageUrl = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated.length ? updated : [""] });
  };

  // File upload trigger
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("images", files[i]);
    }

    try {
      setUploadingImage(true);
      const res = await uploadProductImages(data);
      const uploadedUrls = res.data?.images || [];
      const cleaned = formData.images.filter((url) => url.trim() !== "");
      setFormData({
        ...formData,
        images: [...cleaned, ...uploadedUrls],
      });
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
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

    const cleanImages = formData.images.filter((img) => img.trim() !== "");

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
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
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
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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

        {/* Section 2: Product Images */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-amber-600" />
              <span>Product Images</span>
            </h2>
            <label className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer transition-colors">
              <span>{uploadingImage ? "Uploading..." : "+ Upload Local Image"}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2.5">
            {formData.images.map((imgUrl, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt="Preview"
                    className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 text-stone-400 flex items-center justify-center text-[10px] shrink-0">
                    URL
                  </div>
                )}
                <input
                  type="text"
                  value={imgUrl}
                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                  placeholder="https://images.unsplash.com/photo-... or /uploads/..."
                  className="flex-1 px-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImageUrl(idx)}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddImageUrl}
              className="text-xs font-semibold text-amber-700 hover:underline pt-1 inline-block"
            >
              + Add Image URL Field
            </button>
          </div>
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
