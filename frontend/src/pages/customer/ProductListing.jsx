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
} from "lucide-react";
import { getPublicProducts } from "../../api/productApi.js";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import NotificationBell from "../../components/common/NotificationBell.jsx";

/**
 * CURATED FALLBACK PRODUCTS STRICTLY MATCHING PROJECT DB SCHEMA
 * Schema: name, slug, description, category, images (1-5), variants (sku, color, size, material, price, mrp, stockQuantity), basePrice, totalStock, isFeatured
 */
export const SAMPLE_PRODUCTS = [
  {
    _id: "prod-1",
    name: "Blanco Lounge Chair",
    slug: "blanco-lounge-chair",
    description:
      "Sculptural bouclé lounge chair featuring solid American walnut legs and curved acoustic ergonomics designed for modern living sanctuaries.",
    category: { _id: "cat-1", name: "Furniture", slug: "furniture" },
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: "BLC-IVORY-STD",
        color: "Ivory Bouclé",
        size: "Standard",
        material: "Bouclé & Walnut",
        price: 38500,
        mrp: 45000,
        stockQuantity: 12,
      },
      {
        sku: "BLC-SAND-STD",
        color: "Warm Sand",
        size: "Standard",
        material: "Textured Linen & Walnut",
        price: 40000,
        mrp: 47000,
        stockQuantity: 8,
      },
    ],
    basePrice: 38500,
    totalStock: 20,
    isFeatured: true,
  },
  {
    _id: "prod-2",
    name: "Avia Mid-Century Armchair",
    slug: "avia-mid-century-armchair",
    description:
      "Handcrafted cognac leather armchair with sculptural solid ash framing and precision brass screw fasteners.",
    category: { _id: "cat-1", name: "Furniture", slug: "furniture" },
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: "AVIA-CGN-STD",
        color: "Cognac Rust",
        size: "Standard",
        material: "Top-grain Leather & Ash",
        price: 46200,
        mrp: 54000,
        stockQuantity: 6,
      },
    ],
    basePrice: 46200,
    totalStock: 6,
    isFeatured: true,
  },
  {
    _id: "prod-3",
    name: "Optima Architectural Lounge",
    slug: "optima-architectural-lounge",
    description:
      "Low-profile monolithic armchair with terracotta velvet upholstery and continuous enveloping silhouette.",
    category: { _id: "cat-1", name: "Furniture", slug: "furniture" },
    images: [
      "https://images.unsplash.com/photo-1580481077195-c9a910ecb2eb?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: "OPT-TERRA-STD",
        color: "Terracotta Velvet",
        size: "Standard",
        material: "Velvet & Steel",
        price: 52000,
        mrp: 62000,
        stockQuantity: 4,
      },
    ],
    basePrice: 52000,
    totalStock: 4,
    isFeatured: true,
  },
  {
    _id: "prod-4",
    name: "Verde Tub Accent Chair",
    slug: "verde-tub-accent-chair",
    description:
      "Curved tub-style silhouette upholstered in olive green wool blend with tapered matte black oak legs.",
    category: { _id: "cat-1", name: "Furniture", slug: "furniture" },
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: "VRD-OLV-STD",
        color: "Olive Wool",
        size: "Standard",
        material: "Virgin Wool & Oak",
        price: 34500,
        mrp: 41000,
        stockQuantity: 15,
      },
    ],
    basePrice: 34500,
    totalStock: 15,
    isFeatured: false,
  },
  {
    _id: "prod-5",
    name: "Nordic Minimalist Armchair",
    slug: "nordic-minimalist-armchair",
    description:
      "Natural Scandinavian oiled oak armchair with removable natural linen seat and back cushion.",
    category: { _id: "cat-1", name: "Furniture", slug: "furniture" },
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: "NRD-OAK-STD",
        color: "Natural Linen",
        size: "Standard",
        material: "Solid Oak & Linen",
        price: 31200,
        mrp: 38000,
        stockQuantity: 9,
      },
    ],
    basePrice: 31200,
    totalStock: 9,
    isFeatured: false,
  },
  {
    _id: "prod-6",
    name: "Mundo Curved Lounge Chair",
    slug: "mundo-curved-lounge-chair",
    description:
      "Iconic Danish-inspired curved seating with cut-out lumbar ergonomics, splayed oak legs, and slate felt upholstery.",
    category: { _id: "cat-1", name: "Furniture", slug: "furniture" },
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: "MND-SLT-STD",
        color: "Slate Grey",
        size: "Standard",
        material: "Wool Felt & Oak",
        price: 44000,
        mrp: 51000,
        stockQuantity: 7,
      },
      {
        sku: "MND-CHAR-STD",
        color: "Charcoal",
        size: "Standard",
        material: "Wool Felt & Oak",
        price: 44000,
        mrp: 51000,
        stockQuantity: 5,
      },
      {
        sku: "MND-SND-STD",
        color: "Sand Ochre",
        size: "Standard",
        material: "Wool Felt & Oak",
        price: 44000,
        mrp: 51000,
        stockQuantity: 10,
      },
    ],
    basePrice: 44000,
    totalStock: 22,
    isFeatured: true,
  },
  {
    _id: "prod-7",
    name: "Bronco Reclined Club Chair",
    slug: "bronco-reclined-club-chair",
    description:
      "Sage green cotton canvas with architectural sling armrests and solid natural beech timber frame.",
    category: { _id: "cat-1", name: "Furniture", slug: "furniture" },
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: "BRC-SGE-STD",
        color: "Sage Green",
        size: "Standard",
        material: "Cotton Canvas & Beech",
        price: 29800,
        mrp: 36000,
        stockQuantity: 11,
      },
    ],
    basePrice: 29800,
    totalStock: 11,
    isFeatured: false,
  },
  {
    _id: "prod-8",
    name: "Arina Noir Leather Lounger",
    slug: "arina-noir-leather-lounger",
    description:
      "Deep-cushioned black aniline leather armchair with scorched ash frame and reinforced saddle strapping.",
    category: { _id: "cat-1", name: "Furniture", slug: "furniture" },
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: "ARN-BLK-STD",
        color: "Noir Leather",
        size: "Standard",
        material: "Aniline Leather & Ash",
        price: 58000,
        mrp: 68000,
        stockQuantity: 3,
      },
    ],
    basePrice: 58000,
    totalStock: 3,
    isFeatured: true,
  },
  {
    _id: "prod-9",
    name: "Lennon Velvet Swivel Chair",
    slug: "lennon-velvet-swivel-chair",
    description:
      "Rich espresso corduroy velvet armchair featuring 360-degree silent bronze swivel base and plush feather-down filling.",
    category: { _id: "cat-1", name: "Furniture", slug: "furniture" },
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    ],
    variants: [
      {
        sku: "LNN-ESP-STD",
        color: "Espresso Velvet",
        size: "Standard",
        material: "Corduroy Velvet & Bronze",
        price: 49500,
        mrp: 58000,
        stockQuantity: 5,
      },
    ],
    basePrice: 49500,
    totalStock: 5,
    isFeatured: false,
  },
];

const CATEGORIES = [
  "All",
  "Furniture",
  "Lighting",
  "Wallpapers",
  "Wall Panels",
  "Flooring",
  "Curtains and Blinds",
  "Home Decor",
  "Rugs and Carpets",
  "Modular Kitchen",
  "Bathroom Products",
];

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const { isInWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart, cartCount, setIsCartOpen } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Sync category param from URL
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      // Find matching category case-insensitively
      const match = CATEGORIES.find(
        (c) => c.toLowerCase().replace(/\s+/g, "-") === cat.toLowerCase() || c.toLowerCase() === cat.toLowerCase()
      );
      if (match) setSelectedCategory(match);
    }
  }, [searchParams]);

  // Fetch real products from backend if available
  useEffect(() => {
    const fetchApiProducts = async () => {
      try {
        setLoading(true);
        const res = await getPublicProducts();
        if (res.data?.data?.products && res.data.data.products.length > 0) {
          setProducts(res.data.data.products);
        }
      } catch (err) {
        // Fallback to SAMPLE_PRODUCTS gracefully
        console.log("Using curated catalog fallback products.");
      } finally {
        setLoading(false);
      }
    };
    fetchApiProducts();
  }, []);


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
  }, [products, searchTerm, selectedCategory, sortBy, priceFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat.toLowerCase().replace(/\s+/g, "-"));
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 flex flex-col">
      {/* ================= TOP BRAND NAVIGATION BAR ================= */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-base font-bold tracking-wider text-stone-900 block leading-tight">
                BEYOND INTERIORS
              </span>
              <span className="text-[10px] tracking-widest text-amber-700 font-semibold uppercase block">
                Bespoke Catalog & Turnkey Installation
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold text-stone-600">
            <Link to="/" className="hover:text-stone-900 hidden sm:inline-block">Home</Link>
            <Link to="/products" className="text-amber-700 font-bold hidden sm:inline-block">Catalog</Link>
            <Link to="/services" className="hover:text-stone-900 hidden md:inline-block">Installations</Link>
            <Link to="/track" className="hover:text-stone-900 hidden md:inline-block">Track Order</Link>

            {/* Notifications */}
            <NotificationBell />

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 hover:text-rose-600 transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 hover:text-[#A73D4D] transition-colors cursor-pointer"
              title="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#A73D4D] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <Link to="/account" className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors">
              Account
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HEADER & SEARCH / FILTER / SORT BAR ================= */}
      <header className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4">
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
              Architectural Seating & Products
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-stone-500">
            <span>SHOWING</span>
            <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
              {filteredProducts.length} PRODUCTS
            </span>
          </div>
        </div>

        {/* SEARCH & CONTROLS ROW */}
        <div className="py-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products, materials, SKU (e.g. Bouclé, Lounge, Oak)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Price Filter & Sorting Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Filter */}
            <select
              value={priceFilter}
              onChange={(e) => {
                setPriceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2.5 rounded-full bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 focus:outline-none focus:border-stone-400"
            >
              <option value="all">All Prices</option>
              <option value="under-35k">Under ₹35,000</option>
              <option value="35k-50k">₹35,000 – ₹50,000</option>
              <option value="above-50k">Above ₹50,000</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-full bg-stone-50 border border-stone-200 text-xs font-medium text-stone-700 focus:outline-none focus:border-stone-400"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {/* CATEGORY FILTER PILLS TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isSelected
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </header>

      {/* ================= PRODUCT GRID (EXACT REFERENCE DESIGN: 3 COLUMNS) ================= */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {paginatedProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4 max-w-md mx-auto">
            <Package className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-stone-800">No matching products found</h3>
            <p className="text-xs text-stone-500">
              Try adjusting your search criteria, resetting category filters, or exploring our wider catalog.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setPriceFilter("all");
              }}
              className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {paginatedProducts.map((product) => {
              const displayPrice =
                product.basePrice || (product.variants && product.variants[0]?.price) || 0;
              const primaryImage =
                (product.images && product.images[0]) ||
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80";
              const isWishlisted = isInWishlist(product._id);
              const primaryVariant = product.variants?.[0];

              return (
                <div key={product._id} className="group flex flex-col">
                  {/* CARD IMAGE CONTAINER (Exact Match to Image 1: soft stone card, heart top-right, black '+' bottom-right) */}
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
                        className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-rose-600 text-rose-600" : ""
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

                    {/* Bottom-Right Distinctive Black Floating Action '+' Button (Exact Match) */}
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

                  {/* DETAILS BELOW CARD (Exact Match: Left aligned bold name, left aligned bold price) */}
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

        {/* ================= BOTTOM PAGINATION (Exact Match to Image 1: '01 / 02' center, 'Next →' right) ================= */}
        {totalPages > 1 && (
          <div className="mt-16 pt-8 border-t border-stone-200/80 flex items-center justify-between">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:border-stone-900 disabled:opacity-40 disabled:hover:border-stone-300 transition-colors"
            >
              &larr; Previous
            </button>

            {/* Page Count (e.g. 01 / 03) */}
            <div className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-stone-400">
              <span className="text-stone-900 font-bold">0{currentPage}</span>
              <span className="mx-2">/</span>
              <span>0{totalPages}</span>
            </div>

            {/* Next Button (Exact Match) */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:border-stone-900 disabled:opacity-40 disabled:hover:border-stone-300 transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-stone-200 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500">
        <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif font-bold text-stone-900 tracking-wider">BEYOND INTERIORS</p>
          <p>&copy; {new Date().getFullYear()} Beyond Interiors. Handcrafted Architectural Furnishings.</p>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <Link to="/shipping-policy" className="hover:text-stone-700">Shipping</Link>
            <Link to="/return-policy" className="hover:text-stone-700">Returns</Link>
            <Link to="/services" className="hover:text-stone-700">Installation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductListing;
