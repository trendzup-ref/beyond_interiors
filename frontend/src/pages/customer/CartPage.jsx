import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Truck,
  ShieldCheck,
  CheckCircle,
  Compass,
  Tag,
  CreditCard,
  Building,
  Info,
} from "lucide-react";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const CartPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    installationTotal,
    shippingAmount,
    shippingThreshold,
    taxAmount,
    grandTotal,
    updateQuantity,
    toggleInstallation,
    removeFromCart,
    clearCart,
  } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Promo Code Validation
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();

    if (code === "BEYOND10") {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
      setPromoApplied(true);
    } else if (code === "FIRSTHOME") {
      const discount = 3000;
      setDiscountAmount(discount);
      setPromoApplied(true);
    } else {
      setPromoError("Invalid code. Try 'BEYOND10' for 10% architectural discount.");
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setDiscountAmount(0);
    setPromoCode("");
  };

  const finalPayable = Math.max(0, grandTotal - discountAmount);

  // Handle Move to Wishlist
  const handleMoveToWishlist = (item) => {
    toggleWishlist({
      _id: item.productId,
      name: item.name,
      slug: item.slug,
      category: item.category,
      basePrice: item.price,
      images: [item.image],
    });
    removeFromCart(item.id);
  };

  // Place Order Simulation
  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/cart");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const orderNumber = `BI-ORD-${Date.now().toString().slice(-6)}`;
      const orderData = {
        orderNumber,
        items: [...cartItems],
        subtotal: cartSubtotal,
        discount: discountAmount,
        installationTotal,
        shippingAmount,
        grandTotal: finalPayable,
        address: user?.addresses?.[selectedAddressIndex] || {
          fullName: user?.name,
          phone: user?.phone,
          city: "Registered Address",
          state: "India",
        },
        createdAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };

      setPlacedOrderDetails(orderData);
      setOrderModalOpen(true);
      clearCart();
      setIsSubmitting(false);
    }, 1200);
  };

  const remainingForFreeShipping = Math.max(0, shippingThreshold - cartSubtotal);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
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
              to="/wishlist"
              className="p-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4" />
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
        {/* Header Breadcrumb */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-stone-500">
                CHECKOUT PROCESS · STEP 1 OF 2
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              Your Shopping Bag
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
            <span>{cartCount} CURATED PIECES</span>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-stone-400 hover:text-rose-600 underline transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Bag State */
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-xl mx-auto space-y-5 my-8 shadow-xs">
            <div className="w-20 h-20 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
                Begin curating your living spaces with our bespoke handcrafted seating, designer lighting, and architectural interior solutions.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs tracking-wider uppercase shadow-md transition-all duration-200"
              >
                Explore Product Catalog
              </Link>
              <Link
                to="/wishlist"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
              >
                View Saved Wishlist
              </Link>
            </div>
          </div>
        ) : (
          /* Two-Column Bag Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Items List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                    <span className="text-stone-800">
                      {remainingForFreeShipping === 0 ? (
                        <strong className="text-emerald-700">
                          Eligible for Complimentary White-Glove Shipping
                        </strong>
                      ) : (
                        <span>
                          Add{" "}
                          <strong className="text-amber-800">
                            ₹{remainingForFreeShipping.toLocaleString("en-IN")}
                          </strong>{" "}
                          more for free insured delivery across India
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-stone-500 text-[11px]">
                      {remainingForFreeShipping === 0
                        ? "100%"
                        : `${Math.min(100, Math.round((cartSubtotal / shippingThreshold) * 100))}%`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-[#A73D4D] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((cartSubtotal / shippingThreshold) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs divide-y divide-stone-100 overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-5 sm:p-6 space-y-4 hover:bg-stone-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Product Image */}
                      <div className="w-full sm:w-28 h-28 rounded-2xl bg-stone-100 border border-stone-200/80 overflow-hidden shrink-0 flex items-center justify-center p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold block">
                              {item.category}
                            </span>
                            <Link
                              to={`/products/${item.productId}`}
                              className="font-serif text-lg font-bold text-stone-900 hover:text-[#A73D4D] transition-colors leading-snug"
                            >
                              {item.name}
                            </Link>
                          </div>

                          <div className="text-right">
                            <span className="font-serif text-xl font-bold text-stone-900 block">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-xs text-stone-400 font-mono">
                                ₹{item.price.toLocaleString("en-IN")} each
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Variants Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-stone-600">
                          <span className="bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                            Color: <strong>{item.color}</strong>
                          </span>
                          <span className="bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                            SKU: <strong>{item.sku}</strong>
                          </span>
                          {item.material && (
                            <span className="bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200 hidden sm:inline-block">
                              {item.material}
                            </span>
                          )}
                        </div>

                        {/* Stepper & Utility Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex items-center border border-stone-300 rounded-full bg-white px-2.5 py-1 shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-4 text-xs font-semibold text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <button
                              onClick={() => handleMoveToWishlist(item)}
                              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-[#A73D4D] transition-colors font-medium"
                            >
                              <Heart className="w-3.5 h-3.5" />
                              <span>Save to Wishlist</span>
                            </button>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Certified Installation Option */}
                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between bg-amber-50/50 -mx-5 -mb-4 sm:-mx-6 sm:-mb-5 px-5 sm:px-6 py-3 rounded-b-2xl">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={item.includeInstallation}
                          onChange={() => toggleInstallation(item.id)}
                          className="w-4 h-4 rounded border-stone-300 text-[#A73D4D] focus:ring-[#A73D4D] cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-stone-900 inline-flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5 text-amber-700" />
                            Turnkey Certified Installation & Assembly
                          </span>
                          <span className="text-stone-500 block text-[11px]">
                            Certified Beyond Interiors technician will assemble and position this product.
                          </span>
                        </div>
                      </label>
                      <span className="font-mono text-xs font-semibold text-stone-800 shrink-0 ml-4">
                        +₹{(item.installationFee * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Selection Card (If Authenticated) */}
              {isAuthenticated && user?.addresses && user.addresses.length > 0 && (
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Select Delivery Address
                    </h3>
                    <Link
                      to="/account"
                      className="text-xs text-[#A73D4D] font-semibold hover:underline"
                    >
                      Manage Addresses
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.addresses.map((addr, idx) => (
                      <div
                        key={addr._id || idx}
                        onClick={() => setSelectedAddressIndex(idx)}
                        className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                          selectedAddressIndex === idx
                            ? "border-[#A73D4D] bg-[#A73D4D]/5 ring-1 ring-[#A73D4D]"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-stone-900 mb-1">
                          <span>{addr.fullName}</span>
                          {selectedAddressIndex === idx && (
                            <CheckCircle className="w-4 h-4 text-[#A73D4D]" />
                          )}
                        </div>
                        <p className="text-stone-600 line-clamp-2">
                          {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ""}{addr.city},{" "}
                          {addr.state} - {addr.pinCode}
                        </p>
                        <p className="text-stone-400 font-mono mt-1 text-[11px]">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary Card (Sticky) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs sticky top-20 space-y-6">
                <h2 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
                  Order Summary
                </h2>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Coupon (e.g. BEYOND10)"
                        disabled={promoApplied}
                        className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-stone-800 disabled:opacity-50"
                      />
                    </div>
                    {promoApplied ? (
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="px-3 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-300"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {promoApplied && (
                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Architectural discount applied successfully!
                    </p>
                  )}
                  {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
                </form>

                {/* Breakdown */}
                <div className="space-y-3 text-xs text-stone-600 border-t border-stone-100 pt-4">
                  <div className="flex justify-between">
                    <span>Products Subtotal</span>
                    <span className="font-semibold text-stone-900">
                      ₹{cartSubtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promotional Discount</span>
                      <span className="font-semibold font-mono">
                        -₹{discountAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  {installationTotal > 0 && (
                    <div className="flex justify-between text-amber-900">
                      <span className="inline-flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-amber-700" />
                        Certified Installation
                      </span>
                      <span className="font-semibold font-mono">
                        +₹{installationTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="inline-flex items-center gap-1">
                      <Truck className="w-3 h-3 text-stone-400" />
                      White-Glove Shipping
                    </span>
                    <span>
                      {shippingAmount === 0 ? (
                        <span className="text-emerald-700 font-semibold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                          FREE
                        </span>
                      ) : (
                        `₹${shippingAmount.toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-400 text-[11px]">
                    <span>Estimated GST (18%)</span>
                    <span>Included</span>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline text-stone-900">
                    <div>
                      <span className="font-serif font-bold text-base block">Total Payable</span>
                      <span className="text-[10px] text-stone-400">All Taxes & Duties Included</span>
                    </div>
                    <span className="font-serif font-bold text-2xl text-stone-950">
                      ₹{finalPayable.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {isAuthenticated ? "Confirm & Place Order" : "Sign In to Checkout"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-2 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official Beyond Interiors Certificate of Authenticity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Direct Bank Transfer (NEFT/RTGS/UPI) with Verified Invoice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= ORDER SUCCESS CONFIRMATION MODAL ================= */}
      {orderModalOpen && placedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Order Registered Successfully!
              </h2>
              <p className="text-xs text-stone-500">
                Thank you for choosing Beyond Interiors. Your order confirmation and proforma invoice have been generated.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Order Number</span>
                <span className="font-mono font-bold text-stone-900">
                  {placedOrderDetails.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Placed On</span>
                <span className="text-stone-800">{placedOrderDetails.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Amount</span>
                <span className="font-serif font-bold text-stone-950 text-sm">
                  ₹{placedOrderDetails.grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery Address</span>
                <span className="text-stone-800 font-medium text-right max-w-[200px] truncate">
                  {placedOrderDetails.address.city}, {placedOrderDetails.address.state}
                </span>
              </div>
            </div>

            {/* Offline Bank Transfer Details */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-2 font-semibold text-amber-900">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>Next Step: Offline Bank Transfer / RTGS / UPI</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Please transfer the invoice total using your order number{" "}
                <strong>{placedOrderDetails.orderNumber}</strong> as the transaction remark:
              </p>
              <div className="font-mono text-[11px] bg-white/80 p-2.5 rounded-lg border border-amber-200 space-y-1">
                <div>Bank: <strong>HDFC Bank Ltd.</strong></div>
                <div>Account Name: <strong>BEYOND INTERIORS PVT LTD</strong></div>
                <div>A/C Number: <strong>50200088991234</strong></div>
                <div>IFSC Code: <strong>HDFC0001234</strong></div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/account"
                onClick={() => setOrderModalOpen(false)}
                className="flex-1 py-3 text-center rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                View in My Account
              </Link>
              <button
                onClick={() => {
                  setOrderModalOpen(false);
                  navigate("/products");
                }}
                className="flex-1 py-3 text-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
              >
                Back to Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
