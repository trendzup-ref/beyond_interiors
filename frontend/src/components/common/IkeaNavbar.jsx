import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sparkles,
  HelpCircle,
  Truck,
  Wrench,
  Info,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import NotificationBell from "./NotificationBell.jsx";
import { CATEGORY_SUBCATEGORY_MAP } from "../../data/productsData.js";

// STRICT 10 Product Categories for Beyond Interiors
export const STORE_CATEGORIES = [
  {
    id: "furniture",
    name: "Furniture",
    categoryParam: "furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "lighting",
    name: "Lighting",
    categoryParam: "lighting",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "wallpapers",
    name: "Wallpapers",
    categoryParam: "wallpapers",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "wall-panels",
    name: "Wall Panels",
    categoryParam: "wall-panels",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "flooring",
    name: "Flooring",
    categoryParam: "flooring",
    image:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "curtains-blinds",
    name: "Curtains & Blinds",
    categoryParam: "curtains-blinds",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "home-decor",
    name: "Home Décor",
    categoryParam: "home-decor",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "rugs-carpets",
    name: "Rugs & Carpets",
    categoryParam: "rugs-carpets",
    image:
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "modular-kitchen",
    name: "Modular Kitchen",
    categoryParam: "modular-kitchen",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "bathroom-products",
    name: "Bathroom Products",
    categoryParam: "bathroom-products",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=100&q=80",
  },
];

const IkeaNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const activeCategory = searchParams.get("category") || "";

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Auto focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname, location.search]);

  // Strict check: Never show customer/public navbar to Admin users
  if (isAuthenticated && user?.role === "admin") {
    return null;
  }

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
    setMobileSearchOpen(false);
  };

  // Scroll ribbon left/right
  const scrollRibbon = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs font-sans">
      {/* ================= TOP ROW: BRAND LOGO + LINKS + SEARCH + ACTIONS ================= */}
      <div className="max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        {/* Brand Logo & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 sm:p-2 rounded-lg lg:hidden text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/Beyond Interiors Luxury Logo.png"
              alt="Beyond Interiors"
              className="h-6 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>
        </div>

        {/* Public Storefront Navigation Links (Strict Requirements - Desktop only) */}
        <nav className="hidden xl:flex items-center gap-6 text-xs sm:text-[13px] font-semibold text-stone-700 shrink-0">
          <Link
            to="/products"
            className={`hover:text-stone-950 transition-colors py-1 ${
              location.pathname === "/products" && !activeCategory
                ? "text-stone-950 font-bold"
                : ""
            }`}
          >
            Products
          </Link>
          <a
            href="/about"
            className="hover:text-stone-950 transition-colors py-1"
          >
            About
          </a>
          <Link
            to="/support"
            className={`hover:text-stone-950 transition-colors py-1 ${
              location.pathname === "/support" ? "text-stone-950 font-bold" : ""
            }`}
          >
            Support
          </Link>
          <Link
            to="/services"
            className={`hover:text-stone-950 transition-colors py-1 ${
              location.pathname === "/services" ? "text-stone-950 font-bold" : ""
            }`}
          >
            Installation
          </Link>
        </nav>

        {/* Centered Elongated Pill Search Bar (Visible on md screens and up) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-sm lg:max-w-xl mx-2 relative"
        >
          <div className="relative flex items-center w-full">
            <Search className="w-4 h-4 text-stone-500 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full pl-11 pr-8 py-2.5 sm:py-3 rounded-full bg-[#F5F5F5] hover:bg-[#EAEAEA] focus:bg-white text-xs sm:text-sm text-stone-900 placeholder-stone-500 border border-transparent focus:border-stone-900 focus:outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  navigate("/products");
                }}
                className="absolute right-3 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Right Action Icons: Search Toggle (Mobile) + Notifications + Auth + Wishlist + Cart */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle Icon (Screens < md) */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`p-2 rounded-full transition-colors md:hidden cursor-pointer ${
              mobileSearchOpen
                ? "bg-stone-900 text-white"
                : "text-stone-700 hover:bg-stone-100"
            }`}
            aria-label="Search products"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown Bell */}
          <NotificationBell />

          {/* Authentication Display: Desktop / Tablet */}
          {isAuthenticated && user ? (
            <div className="relative hidden sm:block" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-stone-100 text-stone-800 transition-colors text-xs font-semibold cursor-pointer border border-transparent hover:border-stone-200"
                title="Account Options"
              >
                <div className="w-6 h-6 rounded-full bg-[#D4C26B] text-[#1C1211] font-bold text-xs flex items-center justify-center">
                  {user?.name?.charAt(0) || "C"}
                </div>
                <span className="hidden md:inline-block leading-tight text-stone-900 font-medium">
                  Hey, {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {/* Customer Account Dropdown Menu */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/account?tab=profile"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-950 font-medium transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/account?tab=orders"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-950 font-medium transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5 text-stone-500" />
                    <span>Track Orders</span>
                  </Link>
                  <Link
                    to="/account?tab=installations"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-950 font-medium transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5 text-stone-500" />
                    <span>Track Installations</span>
                  </Link>
                  <Link
                    to="/account?tab=reviews"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-950 font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-stone-500" />
                    <span>My Reviews & Ratings</span>
                  </Link>
                  <Link
                    to="/support"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-950 font-medium transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                    <span>Customer Support</span>
                  </Link>
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs transition-all duration-200"
              title="Sign in to your account"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

          {/* Wishlist Icon with Counter Badge */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-stone-100 text-stone-700 hover:text-rose-600 transition-colors"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Bag Icon with Distinctive Circular Counter Badge */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-stone-100 text-stone-800 transition-colors"
            title="Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0058A3] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ================= MOBILE EXPANDABLE SEARCH BAR (Urban Ladder Pattern) ================= */}
      {mobileSearchOpen && (
        <div className="md:hidden px-3.5 py-2.5 bg-[#FAF8F5] border-t border-stone-200 animate-in fade-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 pointer-events-none" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search furniture, lighting, decor..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white text-xs text-stone-900 placeholder-stone-400 border border-stone-200 focus:border-stone-900 focus:outline-none shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  navigate("/products");
                }}
                className="absolute right-3 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* ================= SECOND ROW: HORIZONTAL CATEGORY RIBBON (10 Exact Categories) ================= */}
      <div className="relative border-t border-stone-100 bg-white">
        <div className="max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 py-2 relative flex items-center">
          {/* Left Arrow Scroll Button (Desktop only) */}
          <button
            onClick={() => scrollRibbon("left")}
            className="hidden md:flex absolute left-2 z-10 w-7 h-7 rounded-full bg-white/95 border border-stone-200 shadow-md items-center justify-center text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition-all cursor-pointer"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Horizontal Scrollable Ribbon (All 10 Categories) */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full px-1 sm:px-2 py-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* All Products Pill */}
            <Link
              to="/products"
              className={`shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                location.pathname === "/products" && !activeCategory
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="whitespace-nowrap">All Categories</span>
            </Link>

            {/* 10 Exact Categories with Mini Preview Avatars */}
            {STORE_CATEGORIES.map((cat) => {
              const isSelected = activeCategory.toLowerCase() === cat.categoryParam.toLowerCase();
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.categoryParam}`}
                  className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all group ${
                    isSelected
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-[#F5F5F5] hover:bg-[#EAEAEA] text-stone-800"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0 border border-stone-200/60"
                  />
                  <span className="whitespace-nowrap">{cat.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Arrow Scroll Button (Desktop only) */}
          <button
            onClick={() => scrollRibbon("right")}
            className="hidden md:flex absolute right-2 z-10 w-7 h-7 rounded-full bg-white/95 border border-stone-200 shadow-md items-center justify-center text-stone-700 hover:bg-stone-50 hover:text-stone-950 transition-all cursor-pointer"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= URBAN LADDER STYLE MOBILE OFF-CANVAS DRAWER ================= */}
      {/* Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-[85%] max-w-[360px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Drawer Header: Logo + Close + User Banner */}
        <div className="bg-[#FAF8F5] border-b border-stone-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="inline-block">
              <img
                src="/Beyond Interiors Luxury Logo.png"
                alt="Beyond Interiors"
                className="h-7 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-200/70 text-stone-700 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account / Welcome Card */}
          {isAuthenticated && user ? (
            <Link
              to="/account?tab=profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs group transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#D4C26B] text-[#1C1211] font-bold text-sm flex items-center justify-center shrink-0">
                {user?.name?.charAt(0) || "C"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-900 truncate">
                  Hey, {user.name}
                </p>
                <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <div>
                <p className="text-xs font-bold text-stone-900">Welcome</p>
                <p className="text-[11px] text-stone-500">Sign in to your account</p>
              </div>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Scrollable Body: Accordion Categories & Navigation */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2 divide-y divide-stone-100">
          {/* Category Accordion Header */}
          <div className="px-4 py-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Shop by Category
            </span>
          </div>

          {/* 10 Categories Accordion (Urban Ladder Pattern) */}
          <div className="divide-y divide-stone-100/70">
            {STORE_CATEGORIES.map((cat) => {
              const subcategories = CATEGORY_SUBCATEGORY_MAP[cat.name] || [];
              const isExpanded = expandedCategory === cat.id;

              return (
                <div key={cat.id} className="text-xs">
                  <div
                    onClick={() =>
                      setExpandedCategory(isExpanded ? null : cat.id)
                    }
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-stone-50 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-7 h-7 rounded-full object-cover border border-stone-200/70 shrink-0"
                      />
                      <span className="font-semibold text-stone-800 text-[13px]">
                        {cat.name}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-180 text-stone-900" : ""
                      }`}
                    />
                  </div>

                  {/* Collapsible Subcategories Accordion Content */}
                  {isExpanded && (
                    <div className="bg-[#FAF8F5]/90 py-2.5 px-4 pl-14 space-y-2 border-t border-stone-100 animate-in fade-in slide-in-from-top-1 duration-150">
                      <Link
                        to={`/products?category=${cat.categoryParam}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1 text-xs font-bold text-[#A73D4D] hover:underline"
                      >
                        All {cat.name} &rarr;
                      </Link>
                      {subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/products?category=${cat.categoryParam}&subcategory=${encodeURIComponent(
                            sub
                          )}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1 text-xs text-stone-600 hover:text-stone-950 font-medium transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Links & Services */}
          <div className="p-3 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2 block mb-1">
              Explore & Services
            </span>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>All Products</span>
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
            >
              <Wrench className="w-4 h-4 text-stone-500" />
              <span>Installation Services</span>
            </Link>
            <Link
              to={isAuthenticated ? "/account?tab=orders" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
            >
              <Truck className="w-4 h-4 text-stone-500" />
              <span>Track Orders & Installations</span>
            </Link>
            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-stone-500" />
              <span>Customer Support</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors"
            >
              <Info className="w-4 h-4 text-stone-500" />
              <span>About Beyond Interiors</span>
            </Link>
          </div>
        </div>

        {/* Drawer Sticky Footer */}
        <div className="p-4 border-t border-stone-200 bg-[#FAF8F5] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#0058A3]" />
              <span>Bag ({cartCount})</span>
            </Link>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default IkeaNavbar;
