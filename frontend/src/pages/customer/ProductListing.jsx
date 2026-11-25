import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Heart,
  Plus,
  ArrowRight,
  X,
  Compass,
  Check,
  Package,
  Wrench,
  Sparkles,
  ShoppingBag,
  Loader2,
  Filter,
} from "lucide-react";
import { getPublicProducts } from "../../api/productApi.js";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import {
  CURATED_CATALOG_PRODUCTS,
  CATEGORIES,
  CATEGORY_SUBCATEGORY_MAP,
} from "../../data/productsData.js";

export const SAMPLE_PRODUCTS = CURATED_CATALOG_PRODUCTS;

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSubcategory = searchParams.get("subcategory");
  const urlSearch = searchParams.get("search") || "";
  const urlOffers = searchParams.get("filter") === "offers";

  // Data & Pagination State (Server-side MongoDB .skip() & .limit(30))
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Filter & Search Controls
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Sync category param from URL on initial load or URL change
  useEffect(() => {
    if (urlCategory) {
      const match = CATEGORIES.find(
        (c) =>
          c.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-").replace(/--+/g, "-") ===
            urlCategory.toLowerCase() ||
          c.toLowerCase() === urlCategory.toLowerCase()
      );
      setSelectedCategory(match || "All");
    } else {
      setSelectedCategory("All");
    }
  }, [urlCategory]);

  // Sync subcategory param from URL
  useEffect(() => {
    if (urlSubcategory) {
      setSelectedSubcategory(urlSubcategory);
    } else {
      setSelectedSubcategory("All");
    }
  }, [urlSubcategory]);

  // Sync search param from URL
  useEffect(() => {
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  // Compute visible subcategories based on selected category:
  // - Selecting one category displays ONLY its corresponding subcategories
  // - Selecting "All" displays subcategories of all 10 categories
  const visibleSubcategories = useMemo(() => {
    if (selectedCategory === "All") {
      // Flatten subcategories of all 10 categories
      return Object.values(CATEGORY_SUBCATEGORY_MAP).flat();
    }
    return CATEGORY_SUBCATEGORY_MAP[selectedCategory] || [];
  }, [selectedCategory]);

  // Core Server-Side Data Fetcher using MongoDB .skip() and .limit(30)
  const fetchProducts = useCallback(
    async (pageToFetch = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = {
          page: pageToFetch,
          limit: 30,
          search: searchTerm.trim() || undefined,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          subcategory: selectedSubcategory !== "All" ? selectedSubcategory : undefined,
          sortBy,
          priceFilter: priceFilter !== "all" ? priceFilter : undefined,
          isFeatured: urlOffers ? true : undefined,
        };

        const res = await getPublicProducts(params);
        const fetchedProducts = res?.data?.products || [];
        const pagination = res?.data?.pagination || {};

        if (append) {
          setProducts((prev) => {
            // Prevent duplicate products by _id
            const existingIds = new Set(prev.map((p) => p._id));
            const freshItems = fetchedProducts.filter((p) => !existingIds.has(p._id));
            return [...prev, ...freshItems];
          });
        } else {
          setProducts(fetchedProducts);
        }

        setCurrentPage(pageToFetch);
        setHasMore(pagination.hasMore ?? false);
        setTotalCount(pagination.total ?? fetchedProducts.length);
      } catch (err) {
        console.error("Failed to load products from server:", err);
        if (!append) {
          // Graceful fallback to curated architectural catalog if server is offline
          setProducts(CURATED_CATALOG_PRODUCTS.slice(0, 30));
          setTotalCount(CURATED_CATALOG_PRODUCTS.length);
          setHasMore(CURATED_CATALOG_PRODUCTS.length > 30);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory, selectedSubcategory, searchTerm, sortBy, priceFilter, urlOffers]
  );

  // Trigger server-side fetch on filter change (resets to page 1)
  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  // Handle Load More (fetches page + 1 from MongoDB and appends)
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchProducts(currentPage + 1, true);
  };

  // Category selection handler (resets subcategory if current subcategory is not in the new category)
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory("All");

    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set(
        "category",
        cat.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-").replace(/--+/g, "-")
      );
    }
    newParams.delete("subcategory");
    setSearchParams(newParams);
  };

  // Subcategory selection handler
  const handleSubcategorySelect = (sub) => {
    setSelectedSubcategory(sub);
    const newParams = new URLSearchParams(searchParams);
    if (sub === "All") {
      newParams.delete("subcategory");
    } else {
      newParams.set("subcategory", sub);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-white font-sans text-stone-900 flex flex-col flex-1">
      {/* ================= HEADER & SEARCH / FILTER / SORT BAR ================= */}
      <header className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4">
        {/* Title & Product Count */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-stone-500">
                CURATED ARCHITECTURAL COLLECTION
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900">
              {selectedCategory === "All"
                ? "Architectural Furnishings & Products"
                : `${selectedCategory} Collection`}
            </h1>
            {selectedSubcategory !== "All" && (
              <p className="text-xs font-mono text-amber-800 font-semibold mt-1">
                Subcategory: {selectedSubcategory}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-stone-500">
            <span>SHOWING</span>
            <span className="font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded">
              {products.length} OF {totalCount} PRODUCTS
            </span>
          </div>
        </div>

        {/* SEARCH & CONTROLS ROW */}
        <div className="py-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Quick Filter Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by piece name, material, or SKU..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Price Filter + Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Filter */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 px-3 py-2 rounded-full border border-stone-200">
              <span className="font-bold">Price:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-stone-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under-35k">Under ₹35,000</option>
                <option value="35k-50k">₹35,000 – ₹50,000</option>
                <option value="above-50k">Above ₹50,000</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 px-3 py-2 rounded-full border border-stone-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-bold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs text-stone-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured">Curated & Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= 10 STRICT CATEGORIES STRIP ================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ================= CORRESPONDING SUBCATEGORIES STRIP ================= */}
        {/* Horizontal overflow scrolling with hidden scrollbar */}
        <div className="pt-2 pb-3 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="shrink-0 flex items-center gap-1 text-[11px] font-mono uppercase text-stone-400 font-semibold pr-1">
            <Filter className="w-3 h-3" />
            <span>Subcategory:</span>
          </div>

          <button
            onClick={() => handleSubcategorySelect("All")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedSubcategory === "All"
                ? "bg-[#D4C26B] text-[#1C1211] font-bold shadow-2xs"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            All Subcategories
          </button>

          {visibleSubcategories.map((sub) => {
            const isSubSelected = selectedSubcategory.toLowerCase() === sub.toLowerCase();
            return (
              <button
                key={sub}
                onClick={() => handleSubcategorySelect(sub)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSubSelected
                    ? "bg-[#D4C26B] text-[#1C1211] font-bold shadow-2xs"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </header>

      {/* ================= PRODUCT GRID CONTAINER ================= */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {loading && products.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
            <p className="text-xs font-mono text-stone-500">Querying architectural products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              No matching products found
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We couldn't find any architectural pieces matching your current category and subcategory selection. Try selecting "All" or resetting filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedSubcategory("All");
                setSearchTerm("");
                setPriceFilter("all");
              }}
              className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-[#A73D4D] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {products.map((product) => {
              const inWishlist = isInWishlist(product._id);
              const primaryVariant = product.variants?.[0] || {};
              const displayPrice = product.basePrice || primaryVariant.price || 0;
              const displayMrp = primaryVariant.mrp || Math.round(displayPrice * 1.25);
              const productImage =
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80";

              return (
                <div
                  key={product._id}
                  className="group flex flex-col bg-white rounded-3xl p-3 sm:p-4 border border-stone-200/70 hover:border-stone-400 transition-all duration-300 hover:shadow-lg"
                >
                  {/* Top Image Showcase with Wishlist & Quick Add */}
                  <div className="relative aspect-square w-full rounded-2xl bg-[#F5F5F3] overflow-hidden flex items-center justify-center p-6 sm:p-8">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-108"
                      loading="lazy"
                    />

                    {/* Subtle Category/Subcategory Pill Tag */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-stone-700 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs border border-stone-200/60">
                        {product.subcategory?.name || product.category?.name || "ARCHITECTURAL"}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                        inWishlist
                          ? "bg-rose-50 text-rose-600 scale-105"
                          : "bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white"
                      }`}
                      title={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
                    >
                      <Heart
                        className={`w-4 h-4 ${inWishlist ? "fill-current text-rose-600" : ""}`}
                      />
                    </button>

                    {/* Circular Quick Add to Cart Button (IKEA Match) */}
                    <button
                      onClick={() => addToCart(product)}
                      className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-md hover:bg-[#A73D4D] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                      title="Add to Shopping Bag"
                      aria-label="Add to cart"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Product Details Block */}
                  <div className="pt-4 pb-2 px-1 flex flex-col flex-1 justify-between space-y-2">
                    <div>
                      <Link
                        to={`/products/${product._id}`}
                        className="group-hover:text-[#A73D4D] transition-colors"
                      >
                        <h3 className="font-sans font-bold text-base sm:text-lg text-stone-900 tracking-tight line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-stone-500 font-sans line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="flex items-baseline gap-2">
                        <span className="font-sans font-bold text-base sm:text-lg text-stone-900">
                          ₹{displayPrice.toLocaleString("en-IN")}
                        </span>
                        {displayMrp > displayPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{displayMrp.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {primaryVariant?.sku && (
                        <span className="text-[10px] font-mono text-stone-400 uppercase">
                          {primaryVariant.sku}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= SERVER-SIDE PAGINATION: LOAD MORE PRODUCTS (30 + 30) ================= */}
        {products.length > 0 && (
          <div className="mt-16 pt-8 border-t border-stone-200/80 flex flex-col items-center justify-center space-y-4">
            <p className="text-xs font-mono text-stone-500">
              Showing <strong className="text-stone-900">{products.length}</strong> of{" "}
              <strong className="text-stone-900">{totalCount}</strong> Products
            </p>

            {/* Visual Progress Bar */}
            <div className="w-64 sm:w-80 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-stone-800 to-[#A73D4D] transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((products.length / Math.max(1, totalCount)) * 100)
                  )}%`,
                }}
              />
            </div>

            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-2 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs tracking-wider uppercase shadow-md flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {loadingMore
                    ? "Fetching Next 30 Items from Database..."
                    : `Load More Products (+30)`}
                </span>
              </button>
            ) : (
              <p className="text-xs text-stone-400 font-serif italic mt-2">
                All {totalCount} matching products loaded from catalog.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductListing;
