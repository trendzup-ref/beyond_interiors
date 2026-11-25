import React from "react";
import { Link } from "react-router";
import {
  Compass,
  User,
  ShoppingBag,
  LogOut,
  Shield,
  Sparkles,
  ArrowRight,
  Package,
  Wrench,
  CheckCircle,
  Heart,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import HeroBanner from "../../components/home/HeroBanner.jsx";
import CategorySection from "../../components/home/CategorySection.jsx";
import RoomSection from "../../components/home/RoomSection.jsx";
import InspirationSection from "../../components/home/InspirationSection.jsx";
import HowItWorksSection from "../../components/home/HowItWorksSection.jsx";
import InstallationVideoSection from "../../components/home/InstallationVideoSection.jsx";
import FaqSection from "../../components/common/FaqSection.jsx";
import NotificationBell from "../../components/common/NotificationBell.jsx";

const CustomerHome = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Customer Navigation Bar */}
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
                Bespoke Furniture & Architectural Installation
              </span>
            </div>
          </Link>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/products"
              className="hidden lg:inline-flex items-center text-xs font-semibold text-stone-700 hover:text-stone-900 px-2 py-1"
            >
              Catalog
            </Link>
            <Link
              to="/services"
              className="hidden lg:inline-flex items-center text-xs font-semibold text-stone-700 hover:text-stone-900 px-2 py-1"
            >
              Services
            </Link>
            <Link
              to="/track"
              className="hidden lg:inline-flex items-center text-xs font-semibold text-stone-700 hover:text-stone-900 px-2 py-1"
            >
              Track Order
            </Link>

            {/* Notifications Bell */}
            <NotificationBell />

            {/* Wishlist Icon Button */}
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

            {/* Shopping Bag Icon Button */}
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

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/account"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>{user?.name?.split(" ")[0] || "Account"}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                    {user?.role}
                  </span>
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner Section (Full-bleed Background & Absolute Text) */}
      <HeroBanner />

      {/* Shop by Category Section (Bento Grid with Full Background Images) */}
      <CategorySection />

      {/* Shop by Room Section (3D Perspective Gallery / Carousel) */}
      <RoomSection />

      {/* Looks by You / Design Inspiration Section (IKEA-Style Shoppable Gallery) */}
      <InspirationSection />

      {/* How it Works Section (3-Step Process) */}
      <HowItWorksSection />

      {/* Full-Width Installation Video Section (Typewriter Impact Headline) */}
      <InstallationVideoSection />

      {/* Frequently Asked Questions Section */}
      <FaqSection />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500">
        <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif font-bold text-stone-900 tracking-wider">
            BEYOND INTERIORS
          </p>
          <p>&copy; {new Date().getFullYear()} Beyond Interiors. Curated Interior Products & Professional Installation.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
            <Link to="/products" className="hover:text-stone-700">Catalog</Link>
            <Link to="/services" className="hover:text-stone-700">Installations</Link>
            <Link to="/track" className="hover:text-stone-700">Track Order</Link>
            <Link to="/wishlist" className="hover:text-stone-700">Wishlist</Link>
            <Link to="/cart" className="hover:text-stone-700">Shopping Bag</Link>
            <Link to="/support" className="hover:text-stone-700">Concierge Help</Link>
            <Link to="/shipping-policy" className="hover:text-stone-700">Shipping</Link>
            <Link to="/return-policy" className="hover:text-stone-700">Returns</Link>
            <Link to="/privacy-policy" className="hover:text-stone-700">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-stone-700">Terms of Service</Link>
            <Link to="/account" className="hover:text-stone-700">Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerHome;
