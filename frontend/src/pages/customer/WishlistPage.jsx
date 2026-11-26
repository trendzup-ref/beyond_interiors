import React from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag, ArrowRight, Trash2, ArrowLeft, Check, Sparkles } from "lucide-react";
import { useWishlist, useCart } from "../../context/CartWishlistContext.jsx";

const WishlistPage = () => {
  const { wishlistItems, wishlistCount, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  // Move all available items to bag
  const handleMoveAllToBag = () => {
    wishlistItems.forEach((product) => {
      moveToCart(product);
    });
  };

  return (
    <div className="bg-[#FAF8F5] text-stone-900 flex flex-col flex-1 min-h-screen">
      {/* Outer Container strictly aligned with website layout (max-w-[1520px]) */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Saved Wishlist</span>
        </nav>

        {wishlistCount === 0 ? (
          /* ================= EMPTY WISHLIST STATE ================= */
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-white rounded-3xl border border-stone-200/80 shadow-xs max-w-3xl mx-auto my-8">
            <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center mb-6 text-amber-700">
              <Heart className="w-10 h-10 stroke-[1.5] text-amber-700/80" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Your Personal Curation</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
              Your wishlist is currently empty
            </h1>

            <p className="text-sm text-stone-600 max-w-md leading-relaxed mb-8">
              Explore our architectural furniture, ambient lighting, fluted wall panels, and bespoke finishes. Tap the heart icon on any piece to save it for your dream interior.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold uppercase tracking-[0.16em] px-8 py-4 rounded-full transition-colors shadow-sm"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-semibold uppercase tracking-[0.16em] px-7 py-4 rounded-full transition-colors"
              >
                <span>Book Site Visit</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ================= POPULATED WISHLIST VIEW ================= */
          <>
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-stone-200">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A73D4D] font-bold mb-2">
                  <span>Saved Architecture & Décor</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900">
                  My Wishlist
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 font-normal">
                  You have <strong className="text-stone-900 font-semibold">{wishlistCount}</strong> {wishlistCount === 1 ? "handcrafted piece" : "handcrafted pieces"} saved in your collection.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>

                <button
                  type="button"
                  onClick={handleMoveAllToBag}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move All to Bag</span>
                </button>
              </div>
            </header>

            {/* Product Grid (Responsive 4-column layout aligned with standard grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
              {wishlistItems.map((product) => {
                const productId = product._id || product.id;

                const activeVariant =
                  product.variants && product.variants.length > 0
                    ? product.variants.reduce((min, v) =>
                      Number(v.price) < Number(min.price) ? v : min
                    )
                    : null;

                const sellingPrice = Number(
                  activeVariant?.price ?? product.basePrice ?? 35000
                );
                const mrpPrice = Number(
                  activeVariant?.mrp ?? product.mrp ?? Math.round(sellingPrice * 1.18)
                );
                const hasDiscount = mrpPrice > sellingPrice && sellingPrice > 0;
                const discountPercent = hasDiscount
                  ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100)
                  : 0;

                const isOutOfStock =
                  typeof product.totalStock === "number" && product.totalStock === 0;

                const primaryImage =
                  product.images?.[0] ||
                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80";

                const categoryLabel =
                  product.category?.name ||
                  (typeof product.category === "string" ? product.category : "Interiors");

                return (
                  <article
                    key={productId}
                    className="group flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-stone-400 hover:shadow-md transition-all duration-300"
                  >
                    {/* Top Image Container */}
                    <div className="relative aspect-[4/3.8] bg-[#F8F5EF] p-5 flex items-center justify-center overflow-hidden">
                      {/* Status Badges */}
                      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
                        {isOutOfStock ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-red-100 text-red-700 border border-red-200">
                            Out of Stock
                          </span>
                        ) : discountPercent > 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-[#D4C26B] text-[#1C1211] font-bold">
                            Save {discountPercent}%
                          </span>
                        ) : product.isFeatured ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-stone-900 text-white">
                            Curated
                          </span>
                        ) : null}
                      </div>

                      {/* Remove from Wishlist Button */}
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(productId)}
                        title="Remove from wishlist"
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#A73D4D] border border-stone-200 shadow-xs hover:bg-[#A73D4D] hover:text-white transition-all cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      {/* Product Clickable Image */}
                      <Link
                        to={`/products/${productId}`}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={primaryImage}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-106"
                        />
                      </Link>
                    </div>

                    {/* Bottom Details Panel */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <p className="text-[10px] tracking-[0.16em] uppercase text-stone-500 font-semibold mb-1">
                          {categoryLabel}
                        </p>
                        <Link
                          to={`/products/${productId}`}
                          className="font-serif text-[16px] sm:text-[17px] font-medium text-stone-900 group-hover:text-[#A73D4D] transition-colors line-clamp-1 block"
                        >
                          {product.name}
                        </Link>
                      </div>

                      {/* Price & Stock Indicator */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-[17px] font-semibold text-stone-900">
                            ₹{sellingPrice.toLocaleString("en-IN")}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-stone-400 line-through">
                              ₹{mrpPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-medium ${isOutOfStock ? "text-red-600" : "text-[#66734F]"
                            }`}
                        >
                          {isOutOfStock ? "Unavailable" : "In Stock"}
                        </span>
                      </div>

                      {/* Action Button: Move to Bag */}
                      <div className="mt-4 pt-1">
                        <button
                          type="button"
                          onClick={() => moveToCart(product)}
                          disabled={isOutOfStock}
                          className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isOutOfStock ? "Out of Stock" : "Move to Bag"}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;
