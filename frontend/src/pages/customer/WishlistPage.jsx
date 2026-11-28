import React from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "../../context/CartWishlistContext.jsx";

const WishlistPage = () => {
  const { wishlistItems, wishlistCount, removeFromWishlist, moveToCart } =
    useWishlist();

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
          /* ================= EMPTY WISHLIST STATE (Reference Image 1) ================= */
          <div className="min-h-[62vh] flex flex-col items-center justify-center text-center px-4 py-12">
            {/* Minimalist Notepad & Heart Illustration */}
            <div className="relative mb-7">
              <svg
                width="150"
                height="150"
                viewBox="0 0 150 150"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Soft Warm Backdrop Circle */}
                <circle cx="75" cy="75" r="56" fill="#F2EAE3" />

                {/* Subtle Sparkles */}
                <path
                  d="M28 52L30 47L32 52L37 54L32 56L30 61L28 56L23 54L28 52Z"
                  fill="#D6C7B8"
                />
                <circle cx="119" cy="96" r="3" fill="#D6C7B8" />
                <circle cx="34" cy="103" r="2.2" fill="#E3D6C9" />

                {/* Tilted Wishlist Card */}
                <g transform="rotate(8 75 75)">
                  <rect
                    x="44"
                    y="32"
                    width="62"
                    height="82"
                    rx="8"
                    fill="#FFFFFF"
                    stroke="#1C1917"
                    strokeWidth="2.2"
                  />
                  {/* Minimal Face */}
                  <circle cx="64" cy="60" r="2.2" fill="#1C1917" />
                  <circle cx="84" cy="60" r="2.2" fill="#1C1917" />
                  <path
                    d="M69 70C71.5 67.5 76.5 67.5 79 70"
                    stroke="#1C1917"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Subtle List Lines */}
                  <line
                    x1="57"
                    y1="84"
                    x2="91"
                    y2="84"
                    stroke="#E7E0D8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="57"
                    y1="93"
                    x2="83"
                    y2="93"
                    stroke="#E7E0D8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="57"
                    y1="102"
                    x2="75"
                    y2="102"
                    stroke="#E7E0D8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </g>

                {/* Heart Badge Top-Right (Brand Accent #A73D4D) */}
                <path
                  d="M109 34C105.5 34 103 36.6 102 38.4C101 36.6 98.5 34 95 34C90.3 34 87 37.8 87 42.3C87 49.4 96.8 55.2 102 59C107.2 55.2 117 49.4 117 42.3C117 37.8 113.7 34 109 34Z"
                  fill="#A73D4D"
                  stroke="#1C1917"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-2">
              Your wishlist is empty!
            </h1>

            <p className="text-sm text-stone-500 max-w-xs leading-relaxed mb-7">
              Explore more and shortlist some items for your space.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold uppercase tracking-[0.16em] px-10 py-3.5 rounded-sm transition-colors shadow-xs"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* ================= POPULATED WISHLIST VIEW (Reference Image 2) ================= */
          <>
            {/* Minimal Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
                  Favorites
                </h1>
                <p className="text-sm text-stone-500 mt-1.5">
                  {wishlistCount} {wishlistCount === 1 ? "Product" : "Products"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleMoveAllToBag}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs w-fit"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag</span>
              </button>
            </header>

            {/* Responsive 4-Column Product Grid */}
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
                  activeVariant?.mrp ?? product.mrp ?? 0
                );
                const hasDiscount =
                  mrpPrice > sellingPrice && sellingPrice > 0;
                const discountPercent = hasDiscount
                  ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100)
                  : 0;

                const isOutOfStock =
                  typeof product.totalStock === "number" &&
                  product.totalStock === 0;

                let badgeText = null;
                if (isOutOfStock) {
                  badgeText = "Out of Stock";
                } else if (discountPercent > 0) {
                  badgeText = `-${discountPercent}%`;
                } else if (product.isFeatured) {
                  badgeText = "New";
                }

                const primaryImage =
                  product.images?.[0] ||
                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80";

                const categoryLabel =
                  product.category?.name ||
                  (typeof product.category === "string"
                    ? product.category
                    : "Interiors");

                return (
                  <article
                    key={productId}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-md transition-all duration-300"
                  >
                    {/* Top Clean Image Container */}
                    <div className="relative aspect-[4/3.6] bg-white overflow-hidden">
                      {/* Top-Right Pill Badge */}
                      {badgeText && (
                        <span
                          className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide border ${isOutOfStock
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-white/95 text-stone-800 border-stone-200"
                            }`}
                        >
                          {badgeText}
                        </span>
                      )}

                      <Link
                        to={`/products/${productId}`}
                        className="block w-full h-full"
                      >
                        <img
                          src={primaryImage}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </Link>
                    </div>

                    {/* Bottom Warm Beige Footer Panel (matching Reference Image 2) */}
                    <div className="bg-[#EFE7DE] px-5 py-4 flex flex-col justify-between flex-1">
                      <div className="mb-3">
                        <p className="text-xs text-stone-500 truncate mb-0.5">
                          {categoryLabel}
                        </p>
                        <Link
                          to={`/products/${productId}`}
                          className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#A73D4D] transition-colors line-clamp-1 block"
                        >
                          {product.name}
                        </Link>
                      </div>

                      {/* Price + Heart & Bag Action Icons */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm sm:text-[15px] font-semibold text-stone-900">
                            ₹{sellingPrice.toLocaleString("en-IN")}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-stone-500 line-through">
                              ₹{mrpPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(productId)}
                            title="Remove from wishlist"
                            aria-label={`Remove ${product.name} from wishlist`}
                            className="text-[#A73D4D] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                          >
                            <Heart
                              className="w-[18px] h-[18px] fill-current"
                              strokeWidth={1.75}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => moveToCart(product)}
                            disabled={isOutOfStock}
                            title={
                              isOutOfStock ? "Out of stock" : "Move to bag"
                            }
                            aria-label={`Move ${product.name} to bag`}
                            className="text-stone-900 hover:text-[#A73D4D] hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            <ShoppingBag
                              className="w-[18px] h-[18px]"
                              strokeWidth={1.75}
                            />
                          </button>
                        </div>
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