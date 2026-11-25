import React from "react";
import { Link, useNavigate } from "react-router";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../context/CartWishlistContext.jsx";

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    installationTotal,
    shippingAmount,
    shippingThreshold,
    grandTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    toggleInstallation,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / shippingThreshold) * 100)
  );
  const remainingForFreeShipping = Math.max(0, shippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#A73D4D] text-white flex items-center justify-center font-bold shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-stone-900">Shopping Bag</h2>
                <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                  {cartCount} {cartCount === 1 ? "Item" : "Items"} · Beyond Interiors
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="px-5 py-3 bg-amber-50/70 border-b border-amber-100 text-xs">
              <div className="flex items-center justify-between text-stone-700 mb-1.5 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">
                      Congratulations! You unlocked FREE White-Glove Delivery
                    </span>
                  ) : (
                    <span>
                      Add{" "}
                      <strong className="text-amber-800">
                        ₹{remainingForFreeShipping.toLocaleString("en-IN")}
                      </strong>{" "}
                      more for FREE shipping
                    </span>
                  )}
                </span>
                <span className="font-mono text-[10px] text-stone-500">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-[#A73D4D] rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs mt-1">
                    Explore our curated catalog of architectural furniture, designer lighting, and interior finishes.
                  </p>
                </div>
                <Link
                  to="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-50/70 rounded-2xl p-3.5 border border-stone-200/80 space-y-3"
                >
                  <div className="flex gap-3">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-white border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${item.productId}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif font-bold text-sm text-stone-900 hover:text-[#A73D4D] line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-stone-500 uppercase">
                        <span className="bg-stone-200/80 px-1.5 py-0.5 rounded">{item.color}</span>
                        {item.size !== "Standard" && (
                          <span className="bg-stone-200/80 px-1.5 py-0.5 rounded">{item.size}</span>
                        )}
                        <span>SKU: {item.sku}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-serif font-bold text-sm text-stone-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>

                        {/* Stepper */}
                        <div className="flex items-center border border-stone-300 rounded-full bg-white px-2 py-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-0.5 text-stone-500 hover:text-stone-900 transition-colors"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-0.5 text-stone-500 hover:text-stone-900 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Certified Installation Toggle */}
                  <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.includeInstallation}
                        onChange={() => toggleInstallation(item.id)}
                        className="rounded border-stone-300 text-[#A73D4D] focus:ring-[#A73D4D] cursor-pointer"
                      />
                      <span className="inline-flex items-center gap-1 text-[11px] text-stone-600">
                        <Wrench className="w-3 h-3 text-amber-700" />
                        <span>White-glove certified installation</span>
                      </span>
                    </label>
                    <span className="text-[11px] font-mono text-stone-500">
                      +₹{(item.installationFee * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Order Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-stone-200 bg-stone-50/70 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    ₹{cartSubtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {installationTotal > 0 && (
                  <div className="flex justify-between text-amber-900">
                    <span className="inline-flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-amber-700" />
                      Certified Installation
                    </span>
                    <span className="font-semibold">
                      +₹{installationTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>White-Glove Shipping</span>
                  <span>
                    {shippingAmount === 0 ? (
                      <span className="text-emerald-700 font-semibold uppercase text-[10px]">
                        FREE
                      </span>
                    ) : (
                      `₹${shippingAmount.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline text-stone-900">
                  <span className="font-serif font-bold text-sm">Estimated Total</span>
                  <span className="font-serif font-bold text-lg text-stone-950">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  * Applicable GST (18%) included in calculations
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/cart");
                  }}
                  className="w-full py-3.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <span>Review Bag & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1 px-1">
                  <button
                    onClick={clearCart}
                    className="text-stone-400 hover:text-rose-600 transition-colors text-[11px]"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-stone-600 hover:text-stone-950 font-medium text-[11px]"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
