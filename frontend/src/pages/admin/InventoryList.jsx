import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Boxes,
  AlertTriangle,
  Search,
  Check,
  RefreshCw,
  Package,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { getProducts, updateStock } from "../../api/productApi.js";
import { getCategories } from "../../api/categoryApi.js";

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Tracks inline editing stock inputs: { [`${productId}_${variantId}`]: stockNumber }
  const [stockInputs, setStockInputs] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const params = {
        search: search || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        lowStock: onlyLowStock ? true : undefined,
        limit: 100,
      };

      const [prodRes, catRes] = await Promise.all([
        getProducts(params),
        getCategories(),
      ]);

      const prods = prodRes.data?.products || [];
      setProducts(prods);
      setCategories(catRes.data?.categories || []);

      // Initialize inline stock inputs
      const initialInputs = {};
      prods.forEach((p) => {
        p.variants?.forEach((v) => {
          initialInputs[`${p._id}_${v._id}`] = v.stockQuantity;
        });
      });
      setStockInputs(initialInputs);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load inventory stock.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedCategory, onlyLowStock]);

  const handleStockInputChange = (productId, variantId, value) => {
    setStockInputs((prev) => ({
      ...prev,
      [`${productId}_${variantId}`]: value,
    }));
  };

  const handleQuickUpdate = async (productId, variantId) => {
    const key = `${productId}_${variantId}`;
    const newQty = stockInputs[key];

    if (newQty === undefined || newQty === "" || Number(newQty) < 0) {
      alert("Please enter a valid stock quantity (0 or greater).");
      return;
    }

    try {
      setUpdatingId(key);
      await updateStock(productId, {
        variantId,
        stockQuantity: Number(newQty),
      });

      setSuccessId(key);
      setTimeout(() => setSuccessId(null), 2500);

      // Update product in local state
      setProducts((prev) =>
        prev.map((p) => {
          if (p._id !== productId) return p;
          const updatedVariants = p.variants.map((v) =>
            v._id === variantId ? { ...v, stockQuantity: Number(newQty) } : v
          );
          const totalStock = updatedVariants.reduce((sum, v) => sum + v.stockQuantity, 0);
          return { ...p, variants: updatedVariants, totalStock };
        })
      );
    } catch (err) {
      alert(err.message || "Failed to update stock quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Flatten products into variant rows for inventory inspection
  const flattenedInventory = [];
  let totalWarehouseUnits = 0;
  let lowStockVariantCount = 0;
  let outOfStockVariantCount = 0;

  products.forEach((p) => {
    p.variants?.forEach((v) => {
      totalWarehouseUnits += Number(v.stockQuantity) || 0;
      if (v.stockQuantity === 0) outOfStockVariantCount++;
      else if (v.stockQuantity <= 5) lowStockVariantCount++;

      flattenedInventory.push({
        product: p,
        variant: v,
      });
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            Inventory & SKU Management
          </h1>
          <p className="text-xs text-stone-500">
            Monitor real-time warehouse stock, track SKUs, and perform quick inline stock updates.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchInventory}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 shadow-2xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Total Units Available
            </span>
            <p className="text-2xl font-bold font-serif text-stone-900 mt-1">
              {totalWarehouseUnits.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">Across all catalog SKUs</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Low Stock Warnings (≤ 5)
            </span>
            <p className="text-2xl font-bold font-serif text-amber-700 mt-1">
              {lowStockVariantCount}
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">Replenishment recommended</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              Depleted / Out of Stock
            </span>
            <p className="text-2xl font-bold font-serif text-red-700 mt-1">
              {outOfStockVariantCount}
            </p>
            <p className="text-[11px] text-red-700 mt-0.5">Zero inventory on hand</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchInventory()}
            placeholder="Search by product title or SKU..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-stone-700 px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100">
            <input
              type="checkbox"
              checked={onlyLowStock}
              onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="w-3.5 h-3.5 text-amber-600 rounded border-stone-300"
            />
            <span>Show Low Stock Only (≤ 5)</span>
          </label>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          {flattenedInventory.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Variant Attributes</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {flattenedInventory.map(({ product: p, variant: v }) => {
                  const key = `${p._id}_${v._id}`;
                  const isUpdating = updatingId === key;
                  const isSuccess = successId === key;
                  const qty = Number(v.stockQuantity);
                  const isOut = qty === 0;
                  const isLow = qty <= 5 && qty > 0;

                  return (
                    <tr key={key} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {p.images && p.images[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div className="truncate max-w-xs">
                            <span className="font-semibold text-stone-900 block truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {p.category?.name || "General"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-800 text-[11px]">
                        {v.sku}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {v.color && (
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px]">
                              {v.color}
                            </span>
                          )}
                          {v.size && (
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px]">
                              {v.size}
                            </span>
                          )}
                          {v.material && (
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px]">
                              {v.material}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-serif font-semibold text-stone-900">
                        ₹{Number(v.price).toLocaleString("en-IN")}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isOut
                              ? "bg-red-100 text-red-800"
                              : isLow
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isLow && <AlertTriangle className="w-2.5 h-2.5" />}
                          <span>
                            {isOut ? "Out of Stock" : isLow ? `${qty} Left (Low)` : `${qty} Available`}
                          </span>
                        </span>
                      </td>

                      {/* Inline Stock Input and Save button */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <input
                            type="number"
                            min="0"
                            value={stockInputs[key] ?? v.stockQuantity}
                            onChange={(e) =>
                              handleStockInputChange(p._id, v._id, e.target.value)
                            }
                            className="w-16 px-2 py-1 rounded border border-stone-300 text-xs text-center text-stone-900 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuickUpdate(p._id, v._id)}
                            disabled={isUpdating}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                              isSuccess
                                ? "bg-emerald-600 text-white"
                                : "bg-stone-900 hover:bg-stone-800 text-white"
                            }`}
                          >
                            {isUpdating ? (
                              "..."
                            ) : isSuccess ? (
                              <Check className="w-3.5 h-3.5 inline" />
                            ) : (
                              "Save"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-stone-400 space-y-3">
              <Boxes className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-xs font-medium text-stone-700">No inventory items matched</p>
              <p className="text-[11px] text-stone-400">
                Adjust search query or category filters to view SKUs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
