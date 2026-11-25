import React from "react";
import { Link, useNavigate } from "react-router";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Compass,
  Check,
  Package,
  Wrench,
  Sparkles,
} from "lucide-react";
import { useWishlist, useCart } from "../../context/CartWishlistContext.jsx";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, wishlistCount, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((item) => {
      moveToCart(item);
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-serif text-sm font-bold tracking-wider text-stone-900">
              BEYOND INTERIORS
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </Link>
            <Link
              to="/account"
              className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800 transition-colors"
            >
              Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-stone-500">
                SAVED ARCHITECTURAL PIECES
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              My Wishlist
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
            <span>{wishlistCount} SAVED ITEMS</span>
            {wishlistCount > 0 && (
              <button
                onClick={handleMoveAllToCart}
                className="px-4 py-2 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag</span>
              </button>
            )}
          </div>
        </div>

        {wishlistCount === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-5 my-8 shadow-xs">
            <div className="w-20 h-20 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-stone-900">Your Wishlist is Empty</h2>
              <p className="text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
                Explore our curated catalog of modern furniture and bespoke interior products, and tap the heart icon on any piece to save it for your next space transformation.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs tracking-wider uppercase shadow-md transition-all duration-200"
              >
                <span>Browse Curated Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {wishlistItems.map((product) => {
              const displayPrice =
                product.basePrice || (product.variants && product.variants[0]?.price) || 35000;
              const primaryImage =
                (product.images && product.images[0]) ||
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80";
              const categoryName = product.category?.name || product.category || "FURNITURE";

              return (
                <div
                  key={product._id || product.id}
                  className="group flex flex-col bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-square bg-[#F7F7F7] p-8 flex items-center justify-center overflow-hidden">
                    {/* Remove from wishlist button */}
                    <button
                      onClick={() => removeFromWishlist(product._id || product.id)}
                      className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xs text-rose-600 hover:bg-rose-50 transition-transform duration-200 hover:scale-110 active:scale-90"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/products/${product._id || product.id}`}
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-106"
                      />
                    </Link>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold">
                          {categoryName}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                          IN STOCK
                        </span>
                      </div>

                      <Link
                        to={`/products/${product._id || product.id}`}
                        className="font-serif font-bold text-lg text-stone-900 group-hover:text-[#A73D4D] transition-colors line-clamp-1 block"
                      >
                        {product.name}
                      </Link>

                      {product.description && (
                        <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="block font-serif text-xl font-bold text-stone-900">
                          ₹{displayPrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        onClick={() => moveToCart(product)}
                        className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;
