import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { getPublicProducts } from "../../api/productApi.js";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import { CURATED_CATALOG_PRODUCTS, CATEGORIES } from "../../data/productsData.js";

export const SAMPLE_PRODUCTS = CURATED_CATALOG_PRODUCTS;

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search") || "";
  const urlOffers = searchParams.get("filter") === "offers";

  const [products, setProducts] = useState(CURATED_CATALOG_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(30);

  const { isInWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart, cartCount } = useCart();

  // Sync category param from URL
  useEffect(() => {
    if (urlCategory) {
      const match = CATEGORIES.find(
        (c) =>
          c.toLowerCase().replace(/\s+/g, "-") === urlCategory.toLowerCase() ||
          c.toLowerCase() === urlCategory.toLowerCase()
      );
      setSelectedCategory(match || "All");
    } else {
      setSelectedCategory("All");
    }
    setVisibleCount(30);
  }, [urlCategory]);

  // Sync search param from URL
  useEffect(() => {
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
      setVisibleCount(30);
    }
  }, [urlSearch]);

  // Fetch from backend
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        setLoading(true);
        const res = await getPublicProducts({
          page: 1,
          limit: 30,
          search: searchTerm || undefined,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
        });

        if (res.data?.data?.products && res.data.data.products.length > 0) {
          setProducts(res.data.data.products);
        } else {
          setProducts(CURATED_CATALOG_PRODUCTS);
        }
      } catch (err) {
        setProducts(CURATED_CATALOG_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchApiProducts();
  }, [selectedCategory, searchTerm]);

  // Filter & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search Term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchSku = p.variants?.some((v) => v.sku?.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchSku) return false;
        }

        // Offers Filter
        if (urlOffers && !p.isFeatured) {
          return false;
        }

        // Category Filter
        if (selectedCategory !== "All") {
          const pCatName = p.category?.name || p.category || "";
          if (pCatName.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Price Filter
        const price = p.basePrice || (p.variants && p.variants[0]?.price) || 0;
        if (priceFilter === "under-35k" && price >= 35000) return false;
        if (priceFilter === "35k-50k" && (price < 35000 || price > 50000)) return false;
        if (priceFilter === "above-50k" && price <= 50000) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.basePrice || a.variants?.[0]?.price || 0;
        const priceB = b.basePrice || b.variants?.[0]?.price || 0;

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "featured") return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        return 0;
      });
  }, [products, searchTerm, selectedCategory, sortBy, priceFilter, urlOffers]);

  // 30 Products displayed initially, loads next 30 with existing 30
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Load More Products Handler
  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const res = await getPublicProducts({
        page: nextPage,
        limit: 30,
        search: searchTerm || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
      });

      if (res.data?.data?.products && res.data.data.products.length > 0) {
        setProducts((prev) => [...prev, ...res.data.data.products]);
        setCurrentPage(nextPage);
      }
    } catch {
      // Fallback
    } finally {
      // Always increment visibleCount by 30 to reveal next slice
      setVisibleCount((prev) => prev + 30);
      setLoadingMore(false);
    }
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(30);
    setCurrentPage(1);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat.toLowerCase().replace(/\s+/g, "-"));
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white font-sans text-stone-900 flex flex-col flex-1">
      {/* ================= HEADER & SEARCH / FILTER / SORT BAR ================= */}
      <header className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4">
        {/* Title & Count */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-stone-500">
                CURATED LIVING COLLECTION
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900">
              {selectedCategory === "All"
                ? "Architectural Furnishings & Products"
                : `${selectedCategory} Collection`}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-stone-500">
            <span>SHOWING</span>
            <span className="font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded">
              {visibleProducts.length} OF {filteredProducts.length} PRODUCTS
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
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

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-stone-100">
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
      </header>

      {/* ================= PRODUCT GRID CONTAINER ================= */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              No matching products found
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We couldn't find any architectural pieces matching your current filters. Try resetting your search terms.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setPriceFilter("all");
              }}
              className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {visibleProducts.map((product) => {
              const displayPrice =
                product.basePrice || (product.variants && product.variants[0]?.price) || 0;
              const primaryImage =
                (product.images && product.images[0]) ||
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80";
              const isWishlisted = isInWishlist(product._id);
              const primaryVariant = product.variants?.[0];

              return (
                <div key={product._id} className="group flex flex-col">
                  {/* CARD IMAGE CONTAINER */}
                  <div className="relative aspect-square rounded-2xl sm:rounded-[26px] bg-[#F7F7F7] border border-stone-200/60 overflow-hidden flex items-center justify-center p-6 sm:p-10 transition-all duration-300 group-hover:bg-[#F2EFE9] group-hover:shadow-md">
                    {/* Top-Right Minimalist Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      aria-label="Save to wishlist"
                      className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xs text-stone-600 hover:text-rose-600 transition-transform duration-200 hover:scale-110 active:scale-90 cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted ? "fill-rose-600 text-rose-600" : ""
                        }`}
                      />
                    </button>

                    {/* Centered Product Image */}
                    <Link
                      to={`/products/${product._id}`}
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-106"
                        loading="lazy"
                      />
                    </Link>

                    {/* Bottom-Right Floating Action '+' Button (Directly Adds to Shopping Bag) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product, primaryVariant, 1);
                      }}
                      aria-label={`Add ${product.name} to bag`}
                      className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 active:scale-95 group/btn cursor-pointer"
                    >
                      <Plus className="w-5 h-5 transition-transform duration-200 group-hover/btn:rotate-90" />
                    </button>
                  </div>

                  {/* DETAILS BELOW CARD */}
                  <div className="pt-3.5 space-y-1">
                    <Link
                      to={`/products/${product._id}`}
                      className="block font-serif text-base sm:text-lg font-bold text-stone-900 hover:text-[#A73D4D] transition-colors leading-tight line-clamp-1"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-sm sm:text-base text-stone-900">
                        ₹{displayPrice.toLocaleString("en-IN")}
                      </span>

                      {primaryVariant?.material && (
                        <span className="text-[11px] font-sans text-stone-400 font-light truncate max-w-[140px]">
                          {primaryVariant.material}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= LOAD MORE PRODUCTS BUTTON (+30 WITH EXISTING 30) ================= */}
        {filteredProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-stone-200/80 flex flex-col items-center justify-center space-y-4">
            <p className="text-xs font-mono text-stone-500">
              Showing <strong className="text-stone-900">{visibleProducts.length}</strong> of{" "}
              <strong className="text-stone-900">{filteredProducts.length}</strong> Products
            </p>

            {/* Visual Progress Bar */}
            <div className="w-64 sm:w-80 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-stone-800 to-[#A73D4D] transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((visibleProducts.length / filteredProducts.length) * 100)
                  )}%`,
                }}
              />
            </div>

            {visibleProducts.length < filteredProducts.length ? (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-2 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs tracking-wider uppercase shadow-md flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {loadingMore
                    ? "Loading Next 30 Pieces..."
                    : `Load More Products (+30)`}
                </span>
              </button>
            ) : (
              <p className="text-xs text-stone-400 font-serif italic mt-2">
                You've reached the end of the curated collection ({filteredProducts.length} of {filteredProducts.length} products).
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductListing;
