
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Search,
  SlidersHorizontal,
  Heart,
  Filter,
  Loader2,
  ShoppingBag,
  X,
} from "lucide-react";

import { getPublicProducts } from "../../api/productApi.js";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";

import {
  CURATED_CATALOG_PRODUCTS,
  CATEGORIES,
  CATEGORY_SUBCATEGORY_MAP,
} from "../../data/productsData.js";

export const SAMPLE_PRODUCTS = CURATED_CATALOG_PRODUCTS;

// ======================================================
// HELPER: COLOUR NAME TO COLOUR VALUE
// ======================================================

const getColorValue = (color = "") => {
  const colors = {
    cream: "#E8DFD2",
    beige: "#D6C2A5",
    ivory: "#F4F0E6",
    white: "#F8F8F5",
    black: "#252525",
    walnut: "#795438",
    brown: "#8B5E3C",
    grey: "#929292",
    gray: "#929292",
    green: "#68745A",
    olive: "#77734B",
    blue: "#526D83",
    oak: "#B88C5B",
    gold: "#C5A45D",
    charcoal: "#414141",
  };

  return colors[color.toLowerCase()] || "#D8D2C8";
};

// ======================================================
// PREMIUM EDITORIAL PRODUCT CARD
// ======================================================

const ProductCard = ({
  product,
  isInWishlist,
  toggleWishlist,
  addToCart,
}) => {
  const primaryVariant = product.variants?.[0] || {};

  // Use basePrice, otherwise calculate the lowest variant price.
  const displayPrice =
    Number(product.basePrice) ||
    Math.min(
      ...(product.variants || [])
        .map((variant) => Number(variant.price))
        .filter((price) => price > 0),
      0
    );

  const categoryName =
    product.subcategory?.name ||
    product.category?.name ||
    "INTERIORS";

  const material =
    primaryVariant.material ||
    product.material ||
    "Premium craftsmanship";

  // Get unique available variant colours.
  const colors = [
    ...new Map(
      (product.variants || [])
        .filter((variant) => variant.color)
        .map((variant) => [
          variant.color.toLowerCase(),
          variant.color,
        ])
    ).values(),
  ].slice(0, 5);

  const inWishlist = isInWishlist(product._id);

  const isAvailable = Number(product.totalStock ?? 0) > 0;

  const productImage =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80";

  return (
    <article className="group flex flex-col min-w-0">

      {/* ================= PRODUCT IMAGE ================= */}

      <div className="relative aspect-[4/5] overflow-hidden bg-[#F3F0EA]">

        <Link
          to={`/products/${product._id}`}
          className="block w-full h-full"
        >
          <img
            src={productImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {/* FEATURED LABEL */}

        {product.isFeatured && (
          <span className="absolute top-4 left-4 bg-[#F8F5EF] text-[#39352F] px-3 py-1.5 text-[9px] tracking-[0.16em] uppercase font-semibold">
            Featured
          </span>
        )}

        {/* NEW ARRIVAL LABEL */}

        {!product.isFeatured && product.isNewArrival && (
          <span className="absolute top-4 left-4 bg-[#F8F5EF] text-[#39352F] px-3 py-1.5 text-[9px] tracking-[0.16em] uppercase font-semibold">
            New Arrival
          </span>
        )}

        {/* WISHLIST BUTTON */}

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={
            inWishlist
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          title={
            inWishlist
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="absolute top-3.5 right-3.5 w-10 h-10 bg-[#F8F5EF]/95 flex items-center justify-center text-stone-800 hover:bg-white transition-colors cursor-pointer"
        >
          <Heart
            size={17}
            strokeWidth={1.5}
            className={
              inWishlist
                ? "fill-[#A73D4D] text-[#A73D4D]"
                : ""
            }
          />
        </button>

        {/* QUICK VIEW */}

        <Link
          to={`/products/${product._id}`}
          className="absolute bottom-4 left-4 right-4 py-3 bg-white/95 text-stone-900 text-[10px] tracking-[0.18em] uppercase font-semibold text-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-stone-900 hover:text-white"
        >
          Quick View
        </Link>

      </div>

      {/* ================= PRODUCT DETAILS ================= */}

      <div className="pt-4 flex flex-col flex-1">

        {/* CATEGORY */}

        <p className="text-[10px] tracking-[0.18em] uppercase text-stone-500 font-medium">
          {categoryName}
        </p>

        {/* PRODUCT NAME */}

        <Link to={`/products/${product._id}`}>
          <h3 className="mt-1.5 text-[16px] sm:text-[17px] font-medium text-[#25231F] tracking-tight line-clamp-1 group-hover:text-[#A73D4D] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* MATERIAL / FINISH */}

        <p className="mt-1 text-xs text-stone-500 line-clamp-1">
          {material}
        </p>

        {/* COLOUR SWATCHES */}

        <div className="flex items-center gap-2 mt-3 min-h-5">

          {colors.map((color) => (
            <span
              key={color}
              title={color}
              className="w-[15px] h-[15px] rounded-full border border-stone-300/70"
              style={{
                backgroundColor: getColorValue(color),
              }}
            />
          ))}

          {colors.length > 0 && (
            <span className="text-[10px] text-stone-400 ml-1">
              {colors.length} finishes
            </span>
          )}

        </div>

        {/* PRICE AND STOCK */}

        <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-end justify-between gap-2">

          <div>

            <p className="text-[9px] uppercase tracking-[0.15em] text-stone-400 mb-1">
              Starting from
            </p>

            <div className="flex items-baseline gap-1.5">

              <span className="text-[17px] font-semibold text-[#25231F]">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>

              {product.priceUnit && (
                <span className="text-[10px] text-stone-500">
                  / {product.priceUnit}
                </span>
              )}

            </div>

          </div>

          <span
            className={`text-[10px] whitespace-nowrap ${isAvailable
              ? "text-[#66734F]"
              : "text-red-600"
              }`}
          >
            {isAvailable ? "In Stock" : "Out of Stock"}
          </span>

        </div>

        {/* ADD TO CART */}

        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={!isAvailable}
          className="mt-4 w-full min-h-11 flex items-center justify-center gap-2 border border-stone-900 bg-stone-900 text-white text-[10px] tracking-[0.16em] uppercase font-semibold hover:bg-[#A73D4D] hover:border-[#A73D4D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ShoppingBag size={15} strokeWidth={1.6} />

          {isAvailable
            ? "Add to Cart"
            : "Currently Unavailable"}
        </button>

      </div>

    </article>
  );
};

// ======================================================
// PRODUCT LISTING PAGE
// ======================================================

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get("category");
  const urlSubcategory = searchParams.get("subcategory");
  const urlSearch = searchParams.get("search") || "";
  const urlOffers = searchParams.get("filter") === "offers";

  // ================= DATA & PAGINATION STATE =================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // ================= FILTER & SEARCH STATE =================

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");

  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");

  // ================= CART & WISHLIST =================

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // ======================================================
  // SYNC CATEGORY FROM URL
  // ======================================================

  useEffect(() => {
    if (urlCategory) {
      const match = CATEGORIES.find((category) => {
        const slug = category
          .toLowerCase()
          .replace(/&/g, "")
          .replace(/\s+/g, "-")
          .replace(/--+/g, "-");

        return (
          slug === urlCategory.toLowerCase() ||
          category.toLowerCase() === urlCategory.toLowerCase()
        );
      });

      setSelectedCategory(match || "All");
    } else {
      setSelectedCategory("All");
    }
  }, [urlCategory]);

  // ======================================================
  // SYNC SUBCATEGORY FROM URL
  // ======================================================

  useEffect(() => {
    setSelectedSubcategory(urlSubcategory || "All");
  }, [urlSubcategory]);

  // ======================================================
  // SYNC SEARCH FROM URL
  // ======================================================

  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  // ======================================================
  // VISIBLE SUBCATEGORIES
  // ======================================================

  const visibleSubcategories = useMemo(() => {
    if (selectedCategory === "All") {
      return Object.values(CATEGORY_SUBCATEGORY_MAP).flat();
    }

    return CATEGORY_SUBCATEGORY_MAP[selectedCategory] || [];
  }, [selectedCategory]);

  // ======================================================
  // SERVER-SIDE PRODUCT FETCHER
  // ======================================================

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

          category:
            selectedCategory !== "All"
              ? selectedCategory
              : undefined,

          subcategory:
            selectedSubcategory !== "All"
              ? selectedSubcategory
              : undefined,

          sortBy,

          priceFilter:
            priceFilter !== "all"
              ? priceFilter
              : undefined,

          isFeatured: urlOffers ? true : undefined,
        };

        const res = await getPublicProducts(params);

        const fetchedProducts =
          res?.data?.products || [];

        const pagination =
          res?.data?.pagination || {};

        if (append) {
          setProducts((previousProducts) => {
            const existingIds = new Set(
              previousProducts.map((product) => product._id)
            );

            const freshItems = fetchedProducts.filter(
              (product) => !existingIds.has(product._id)
            );

            return [
              ...previousProducts,
              ...freshItems,
            ];
          });
        } else {
          setProducts(fetchedProducts);
        }

        setCurrentPage(pageToFetch);

        setHasMore(pagination.hasMore ?? false);

        setTotalCount(
          pagination.total ?? fetchedProducts.length
        );

      } catch (error) {
        console.error(
          "Failed to load products from server:",
          error
        );

        if (!append) {
          const fallbackProducts =
            CURATED_CATALOG_PRODUCTS.slice(0, 30);

          setProducts(fallbackProducts);

          setTotalCount(
            CURATED_CATALOG_PRODUCTS.length
          );

          setHasMore(
            CURATED_CATALOG_PRODUCTS.length > 30
          );
        }

      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      selectedCategory,
      selectedSubcategory,
      searchTerm,
      sortBy,
      priceFilter,
      urlOffers,
    ]
  );

  // ======================================================
  // FETCH PRODUCTS WHEN FILTERS CHANGE
  // ======================================================

  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  // ======================================================
  // LOAD MORE
  // ======================================================

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;

    fetchProducts(currentPage + 1, true);
  };

  // ======================================================
  // CATEGORY SELECTION
  // ======================================================

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("All");

    const newParams = new URLSearchParams(searchParams);

    if (category === "All") {
      newParams.delete("category");
    } else {
      newParams.set(
        "category",
        category
          .toLowerCase()
          .replace(/&/g, "")
          .replace(/\s+/g, "-")
          .replace(/--+/g, "-")
      );
    }

    newParams.delete("subcategory");

    setSearchParams(newParams);
  };

  // ======================================================
  // SUBCATEGORY SELECTION
  // ======================================================

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);

    const newParams = new URLSearchParams(searchParams);

    if (subcategory === "All") {
      newParams.delete("subcategory");
    } else {
      newParams.set("subcategory", subcategory);
    }

    setSearchParams(newParams);
  };

  // ======================================================
  // RESET FILTERS
  // ======================================================

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setSearchTerm("");
    setPriceFilter("all");
    setSortBy("featured");

    const newParams = new URLSearchParams(searchParams);

    newParams.delete("category");
    newParams.delete("subcategory");
    newParams.delete("search");
    newParams.delete("filter");

    setSearchParams(newParams);
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="bg-white font-sans text-stone-900 flex flex-col flex-1">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4">

        {/* TITLE & PRODUCT COUNT */}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">

          <div>


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

        {/* SEARCH & FILTER CONTROLS */}

        <div className="py-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

          {/* SEARCH */}

          <div className="relative flex-1 max-w-lg">

            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search by piece name, material, or SKU..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

          </div>

          {/* PRICE & SORT */}

          <div className="flex flex-wrap items-center gap-3">

            {/* PRICE FILTER */}

            <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 px-3 py-2 rounded-full border border-stone-200">

              <span className="font-bold">
                Price:
              </span>

              <select
                value={priceFilter}
                onChange={(event) =>
                  setPriceFilter(event.target.value)
                }
                className="bg-transparent border-none text-xs text-stone-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under-35k">Under ₹35,000</option>
                <option value="35k-50k">₹35,000 – ₹50,000</option>
                <option value="above-50k">Above ₹50,000</option>
              </select>

            </div>

            {/* SORT */}

            <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 px-3 py-2 rounded-full border border-stone-200">

              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />

              <span className="font-bold">
                Sort:
              </span>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="bg-transparent border-none text-xs text-stone-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured">
                  Curated & Featured
                </option>

                <option value="price-asc">
                  Price: Low to High
                </option>

                <option value="price-desc">
                  Price: High to Low
                </option>

                <option value="name-asc">
                  Name: A to Z
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* ==================================================
            CATEGORY FILTER
        ================================================== */}

        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          <button
            type="button"
            onClick={() => handleCategorySelect("All")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${selectedCategory === "All"
              ? "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
          >
            All Products
          </button>

          {CATEGORIES.map((category) => {
            const isSelected =
              selectedCategory.toLowerCase() ===
              category.toLowerCase();

            return (
              <button
                type="button"
                key={category}
                onClick={() =>
                  handleCategorySelect(category)
                }
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
              >
                {category}
              </button>
            );
          })}

        </div>

        {/* ==================================================
            SUBCATEGORY FILTER
        ================================================== */}

        <div className="pt-2 pb-3 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          <div className="shrink-0 flex items-center gap-1 text-[11px] font-mono uppercase text-stone-400 font-semibold pr-1">

            <Filter className="w-3 h-3" />

            <span>Subcategory:</span>

          </div>

          <button
            type="button"
            onClick={() =>
              handleSubcategorySelect("All")
            }
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${selectedSubcategory === "All"
              ? "bg-[#D4C26B] text-[#1C1211] font-bold"
              : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
          >
            All Subcategories
          </button>

          {visibleSubcategories.map((subcategory) => {
            const isSelected =
              selectedSubcategory.toLowerCase() ===
              subcategory.toLowerCase();

            return (
              <button
                type="button"
                key={subcategory}
                onClick={() =>
                  handleSubcategorySelect(subcategory)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${isSelected
                  ? "bg-[#D4C26B] text-[#1C1211] font-bold"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
                  }`}
              >
                {subcategory}
              </button>
            );
          })}

        </div>

      </header>

      {/* ==================================================
          PRODUCT GRID
      ================================================== */}

      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">

        {/* LOADING */}

        {loading && products.length === 0 ? (

          <div className="py-24 flex flex-col items-center justify-center gap-3">

            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />

            <p className="text-xs font-mono text-stone-500">
              Loading architectural products...
            </p>

          </div>

        ) : products.length === 0 ? (

          /* EMPTY STATE */

          <div className="py-24 text-center space-y-4 max-w-md mx-auto">

            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">

              <Search className="w-8 h-8" />

            </div>

            <h3 className="font-serif text-xl font-bold text-stone-900">
              No matching products found
            </h3>

            <p className="text-xs text-stone-500 leading-relaxed">
              We couldn't find any products matching your
              current filters. Try selecting another category
              or resetting your filters.
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-[#A73D4D] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>

          </div>

        ) : (

          /* PRODUCT CARDS */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-5 sm:gap-x-7 lg:gap-x-8 gap-y-12">

            {products.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
                isInWishlist={isInWishlist}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
              />

            ))}

          </div>

        )}

        {/* ==================================================
            SERVER-SIDE PAGINATION
        ================================================== */}

        {products.length > 0 && (

          <div className="mt-16 pt-8 border-t border-stone-200/80 flex flex-col items-center justify-center space-y-4">

            <p className="text-xs font-mono text-stone-500">

              Showing{" "}

              <strong className="text-stone-900">
                {products.length}
              </strong>

              {" "}of{" "}

              <strong className="text-stone-900">
                {totalCount}
              </strong>

              {" "}Products

            </p>

            {/* PROGRESS BAR */}

            <div className="w-64 sm:w-80 h-1.5 bg-stone-200 overflow-hidden">

              <div
                className="h-full bg-gradient-to-r from-stone-800 to-[#A73D4D] transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      (products.length /
                        Math.max(1, totalCount)) *
                      100
                    )
                  )}%`,
                }}
              />

            </div>

            {/* LOAD MORE */}

            {hasMore ? (

              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-2 px-8 py-3.5 bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {loadingMore && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}

                <span>
                  {loadingMore
                    ? "Loading more products"
                    : "Show More"}
                </span>

              </button>

            ) : (

              <p className="text-xs text-stone-400 font-serif italic mt-2">
                All {totalCount} matching products loaded.
              </p>

            )}

          </div>

        )}

      </main>

    </div>
  );
};

export default ProductListing;
