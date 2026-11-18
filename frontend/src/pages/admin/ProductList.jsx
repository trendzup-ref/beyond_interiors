import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Star,
  Boxes,
} from "lucide-react";
import { getProducts, deleteProduct } from "../../api/productApi.js";
import { getCategories } from "../../api/categoryApi.js";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [alert, setAlert] = useState(null);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setAlert(null);

      const params = {
        search: search || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        lowStock: stockFilter === "low" ? true : undefined,
      };

      const [prodRes, catRes] = await Promise.all([
        getProducts(params),
        getCategories(),
      ]);

      setProducts(prodRes.data?.products || []);
      setCategories(catRes.data?.categories || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to load product catalog.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, stockFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCatalog();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    try {
      await deleteProduct(id);
      setAlert({ type: "success", message: `Product "${name}" deleted successfully.` });
      fetchCatalog();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Failed to delete product.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs text-stone-500">
            Manage your interior design collections, variants, pricing, and availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchCatalog}
            disabled={loading}
            className="p-2 rounded-lg bg-white border border-stone-300 text-stone-600 hover:text-stone-900 shadow-2xs hover:bg-stone-50 cursor-pointer"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
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

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <option value="all">All Inventory</option>
            <option value="low">Low Stock (≤ 5)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {products.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Variants</th>
                  <th className="py-3 px-4">Starting Price</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => {
                  const isLow = p.totalStock <= 5;
                  const isOut = p.totalStock === 0;

                  return (
                    <tr key={p._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {p.images && p.images.length > 0 ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                              <Package className="w-5 h-5 text-amber-600" />
                            </div>
                          )}
                          <div className="truncate max-w-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-stone-900 truncate">
                                {p.name}
                              </span>
                              {p.isFeatured && (
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {p.variants?.[0]?.sku || "NO-SKU"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-stone-800">
                            {p.category?.name || "Uncategorized"}
                          </span>
                          {p.subcategory && (
                            <span className="text-[10px] text-stone-500">
                              {p.subcategory.name}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                          <Boxes className="w-3 h-3 text-amber-600" />
                          <span>{p.variants?.length || 0} variant(s)</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 font-serif font-semibold text-stone-900">
                        ₹{Number(p.basePrice || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isOut
                              ? "bg-red-100 text-red-700"
                              : isLow
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isLow && <AlertTriangle className="w-2.5 h-2.5" />}
                          <span>{p.totalStock} in stock</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            p.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {p.isActive ? "Active" : "Draft"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-md transition-colors inline-block"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-stone-400 space-y-3">
              <Package className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-xs font-medium text-stone-700">No interior products found</p>
              <p className="text-[11px] text-stone-400">
                Click "+ Add Product" to publish new interior furniture or décor to the catalog.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
