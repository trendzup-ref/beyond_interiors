import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Sparkles,
  Search,
  Star,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  ExternalLink,
  ArrowLeft,
  X,
  Package,
} from "lucide-react";
import { getFeaturedProducts, toggleFeaturedProduct } from "../../api/bannerApi.js";
import { getProducts } from "../../api/productApi.js";
import { getCategories } from "../../api/categoryApi.js";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'featured' | 'not_featured'

  // Alert State
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featuredRes, catalogRes, catRes] = await Promise.all([
        getFeaturedProducts(),
        getProducts({ limit: 100 }), // retrieve comprehensive list for admin selector
        getCategories(),
      ]);

      const featuredList = featuredRes.data?.products || [];
      const catalogList = catalogRes.data?.products || [];
      const catList = catRes.data?.categories || [];

      setFeaturedProducts(featuredList);
      setCatalogProducts(catalogList);
      setCategories(catList);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load product catalog for homepage showcase.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (productId, currentStatus) => {
    try {
      setTogglingId(productId);
      const newStatus = !currentStatus;

      await toggleFeaturedProduct(productId, newStatus);

      // Optimistically update catalog state
      setCatalogProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, isFeatured: newStatus } : p))
      );

      // Update featured products list
      if (newStatus) {
        const item = catalogProducts.find((p) => p._id === productId);
        if (item) {
          setFeaturedProducts((prev) => [{ ...item, isFeatured: true }, ...prev]);
        }
      } else {
        setFeaturedProducts((prev) => prev.filter((p) => p._id !== productId));
      }

      setAlert({
        type: "success",
        message: `Product ${newStatus ? "added to" : "removed from"} homepage featured showcase.`,
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || err.message || "Failed to update featured status.",
      });
    } finally {
      setTogglingId(null);
    }
  };

  // Filter Catalog Products
  const filteredCatalog = catalogProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.variants &&
        product.variants.some((v) => v.sku?.toLowerCase().includes(search.toLowerCase())));

    const categoryId =
      typeof product.category === "object" ? product.category?._id : product.category;
    const matchesCategory =
      selectedCategory === "all" || categoryId === selectedCategory;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "featured" && product.isFeatured) ||
      (statusFilter === "not_featured" && !product.isFeatured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Alert */}
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
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin/banners"
              className="text-stone-400 hover:text-stone-600 text-xs flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Banners</span>
            </Link>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Featured Products Showcase</span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Curate top-selling items, spotlight designs, and premium furniture featured on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/banners"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all border border-stone-300"
          >
            <ImageIcon className="w-4 h-4 text-stone-600" />
            <span>Manage Hero Banners</span>
          </Link>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-stone-200">
        <Link
          to="/admin/banners"
          className="pb-3 px-4 text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-2 transition-colors"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Hero Banners</span>
        </Link>
        <button className="pb-3 px-4 text-xs font-bold border-b-2 border-amber-600 text-amber-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span>Featured Products Showcase ({featuredProducts.length})</span>
        </button>
      </div>

      {/* Currently Featured Highlight Reel */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
            <h2 className="text-sm font-bold font-serif text-stone-900">
              Live on Homepage ({featuredProducts.length} Items)
            </h2>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">
            Displayed prominently in the customer storefront
          </span>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-6 bg-white/60 rounded-xl border border-dashed border-amber-300">
            <Package className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-stone-700">No Featured Products Selected</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Browse the catalog below and click "Feature" to highlight products on the homepage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl border border-amber-200 p-2.5 shadow-xs flex flex-col justify-between group hover:shadow-md transition-all relative"
              >
                <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden mb-2 relative">
                  <img
                    src={product.images?.[0] || "/placeholder-product.png"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                  <button
                    disabled={togglingId === product._id}
                    onClick={() => handleToggle(product._id, true)}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/90 hover:bg-rose-50 text-amber-500 hover:text-rose-600 rounded-full shadow-xs transition-colors"
                    title="Remove from featured"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-stone-900 line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-amber-700 font-bold">
                    ₹{product.basePrice?.toLocaleString("en-IN") || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Catalog Search & Quick Selector Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Product Catalog Selector
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Toggle the star icon to feature or unfeature any product instantly.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalog or SKU..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 w-48"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-700"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-700"
            >
              <option value="all">All Items</option>
              <option value="featured">Featured Only</option>
              <option value="not_featured">Not Featured</option>
            </select>
          </div>
        </div>

        {/* Catalog Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mb-3" />
            <p className="text-xs text-stone-500 font-medium">Loading catalog items...</p>
          </div>
        ) : filteredCatalog.length === 0 ? (
          <div className="text-center py-12 border-t border-stone-100">
            <p className="text-xs text-stone-500 font-medium">
              No products found matching the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price / SKU</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-center">Homepage Featured</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCatalog.map((product) => {
                  const categoryName =
                    typeof product.category === "object"
                      ? product.category?.name
                      : categories.find((c) => c._id === product.category)?.name || "—";

                  const primarySku = product.variants?.[0]?.sku || "N/A";

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-stone-50/60 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || "/placeholder-product.png"}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80";
                            }}
                          />
                          <div>
                            <p className="font-semibold text-stone-900 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-stone-400 font-mono">
                              {product.variants?.length || 1} Variant(s)
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-stone-600 font-medium">
                        {categoryName}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold text-stone-900">
                          ₹{product.basePrice?.toLocaleString("en-IN") || 0}
                        </p>
                        <p className="text-[10px] text-stone-400 font-mono">SKU: {primarySku}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            product.totalStock > 5
                              ? "bg-emerald-50 text-emerald-700"
                              : product.totalStock > 0
                              ? "bg-amber-50 text-amber-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {product.totalStock} in stock
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          disabled={togglingId === product._id}
                          onClick={() => handleToggle(product._id, product.isFeatured)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            product.isFeatured
                              ? "bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 shadow-xs"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent"
                          }`}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              product.isFeatured ? "fill-amber-500 text-amber-500" : "text-stone-400"
                            }`}
                          />
                          <span>{product.isFeatured ? "Featured" : "Feature"}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800 font-semibold"
                        >
                          <span>Edit</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
