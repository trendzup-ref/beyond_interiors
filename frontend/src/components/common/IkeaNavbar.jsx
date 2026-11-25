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
  Tag,
  Compass,
  Wrench,
  Clock,
  Sparkles,
  HelpCircle,
  Truck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export const STORE_CATEGORIES = [
  {
    id: "furniture",
    name: "Sofas & Armchairs",
    categoryParam: "furniture",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "storage",
    name: "Storage & Organisation",
    categoryParam: "storage",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "lighting",
    name: "Designer Lighting",
    categoryParam: "lighting",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "wall-finishes",
    name: "Wallpapers & Paneling",
    categoryParam: "wall-finishes",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "curtains",
    name: "Curtains & Drapes",
    categoryParam: "window-dressings",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "flooring",
    name: "Wooden & Vinyl Flooring",
    categoryParam: "flooring",
    image:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "decor",
    name: "Home Décor & Accents",
    categoryParam: "decor",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "installation",
    name: "Turnkey Installation",
    link: "/services",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=100&q=80",
  },
];

const IkeaNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  const activeCategory = searchParams.get("category") || "";

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  // Scroll ribbon left/right
  const scrollRibbon = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs font-sans">
      {/* ================= TOP ROW: BRAND LOGO + LINKS + SEARCH + ACTIONS ================= */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo from /public */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg lg:hidden text-stone-700 hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/Beyond Interiors Luxury Logo.png"
              alt="Beyond Interiors"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
              onError={(e) => {
                // Graceful text badge fallback if image asset is unavailable
                e.target.style.display = "none";
              }}
            />
          </Link>
        </div>

        {/* Public Storefront Navigation Links (IKEA Style) */}
        <nav className="hidden xl:flex items-center gap-6 text-xs sm:text-[13px] font-semibold text-stone-700 shrink-0">
          <Link
            to="/products"
            className={`hover:text-stone-950 transition-colors py-1 ${location.pathname === "/products" && !activeCategory ? "text-stone-950 font-bold" : ""
              }`}
          >
            Products
          </Link>
          <Link
            to="/products?room=all"
            className="hover:text-stone-950 transition-colors py-1"
          >
            Rooms
          </Link>
          <Link
            to="/products?filter=offers"
            className="hover:text-stone-950 transition-colors py-1 flex items-center gap-1 text-amber-700 font-bold"
          >
            <span>Offers</span>
          </Link>
          <Link
            to="/services"
            className={`hover:text-stone-950 transition-colors py-1 ${location.pathname === "/services" ? "text-stone-950 font-bold" : ""
              }`}
          >
            Installation & Services
          </Link>
          <Link
            to="/support"
            className={`hover:text-stone-950 transition-colors py-1 ${location.pathname === "/support" ? "text-stone-950 font-bold" : ""
              }`}
          >
            Design / Support
          </Link>
        </nav>

        {/* Centered Elongated Pill Search Bar (Exact Match to IKEA) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xs sm:max-w-md lg:max-w-xl mx-1 sm:mx-2 relative"
        >
          <div className="relative flex items-center">
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
                className="absolute right-3 p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Right Action Icons (Exact Match to IKEA: User/Hej! + Wishlist + Cart) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Notifications Dropdown Bell */}
          <NotificationBell />

          {/* User Account / Hej! Log In (Exact IKEA Format) */}
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors text-xs font-semibold"
            title={isAuthenticated ? "My Account" : "Log In"}
          >
            <User className="w-5 h-5 text-stone-800" />
            <span className="hidden md:inline-block leading-tight text-stone-800">
              {isAuthenticated ? `Hej, ${user?.name?.split(" ")[0]}!` : "Hej! Log in"}
            </span>
          </Link>

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

          {/* Shopping Bag Icon with Distinctive Circular Counter Badge (Links Directly to /cart) */}
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

      {/* ================= SECOND ROW: HORIZONTAL CATEGORY RIBBON (Exact Match to IKEA) ================= */}
      <div className="relative border-t border-stone-100 bg-white">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-2 relative flex items-center">
          {/* Left Arrow Scroll Button */}
          <button
            onClick={() => scrollRibbon("left")}
            className="hidden md:flex absolute left-2 z-10 w-7 h-7 rounded-full bg-white/95 border border-stone-200 shadow-xs items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Category Ribbon Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none scroll-smooth w-full py-0.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* First Pill: Offers */}
            <Link
              to="/products?filter=offers"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold whitespace-nowrap transition-colors shrink-0 shadow-2xs"
            >
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-amber-700">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <span>Offers</span>
            </Link>

            {/* Curated Beyond Interiors Category Pills */}
            {STORE_CATEGORIES.map((cat) => {
              const isSelected =
                activeCategory &&
                cat.categoryParam &&
                activeCategory.toLowerCase() === cat.categoryParam.toLowerCase();

              const targetUrl = cat.link || `/products?category=${cat.categoryParam}`;

              return (
                <Link
                  key={cat.id}
                  to={targetUrl}
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${isSelected
                      ? "bg-stone-900 text-white shadow-xs"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-800"
                    }`}
                >
                  <div className="w-5 h-5 rounded-md overflow-hidden bg-white shrink-0 flex items-center justify-center border border-stone-200/60">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Arrow Scroll Button */}
          <button
            onClick={() => scrollRibbon("right")}
            className="hidden md:flex absolute right-2 z-10 w-7 h-7 rounded-full bg-white/95 border border-stone-200 shadow-xs items-center justify-center text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= MOBILE EXPANDED MENU ================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 p-5 space-y-4 shadow-xl animate-in fade-in">
          <div className="space-y-1 font-semibold text-sm text-stone-800">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-stone-100"
            >
              All Products & Furniture
            </Link>
            <Link
              to="/products?filter=offers"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-stone-100 text-amber-700"
            >
              Special Offers & Featured
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-stone-100"
            >
              Turnkey Installation Services
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-stone-100"
            >
              Live Order & Installation Tracking
            </Link>
            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-stone-100"
            >
              Concierge Help & Support
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-stone-100"
            >
              Saved Wishlist ({wishlistCount})
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 border-b border-stone-100"
            >
              Shopping Bag ({cartCount})
            </Link>
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#A73D4D]"
            >
              {isAuthenticated ? "My Profile & Account" : "Sign In to Account"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default IkeaNavbar;
