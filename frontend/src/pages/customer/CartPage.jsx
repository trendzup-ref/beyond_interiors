import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Trash2,
  Plus,
  Minus,
  Heart,
  ArrowRight,
  Wrench,
  Truck,
  CheckCircle,
  Tag,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Info,
  Banknote,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { pincodeService } from "../../services/pincodeService.js";
import { orderService } from "../../services/orderService.js";
import { installationService } from "../../services/installationService.js";
import { notificationService } from "../../services/notificationService.js";

// 5 Interior Cards — Fruit Ninja style bottom-toss arc trajectories
const TOSS_CARDS = [
  {
    id: 1,
    label: "Modular Kitchens",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
    startX: -140,
    midX: -45,
    finalX: -16,
    peakY: -95,
    finalY: -12,
    startRotate: -42,
    midRotate: -16,
    finalRotate: -7,
    delay: 0.1,
  },
  {
    id: 2,
    label: "Designer Lighting",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80",
    startX: 150,
    midX: 50,
    finalX: 16,
    peakY: -105,
    finalY: -6,
    startRotate: 45,
    midRotate: 18,
    finalRotate: 6,
    delay: 0.42,
  },
  {
    id: 3,
    label: "Wall Panels & Décor",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80",
    startX: -110,
    midX: -25,
    finalX: -10,
    peakY: -110,
    finalY: 6,
    startRotate: -36,
    midRotate: -10,
    finalRotate: -4,
    delay: 0.74,
  },
  {
    id: 4,
    label: "Rugs & Flooring",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80",
    startX: 120,
    midX: 30,
    finalX: 10,
    peakY: -100,
    finalY: 12,
    startRotate: 38,
    midRotate: 12,
    finalRotate: 4.5,
    delay: 1.06,
  },
  {
    id: 5,
    label: "Curated Living",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80",
    startX: -20,
    midX: 0,
    finalX: 0,
    peakY: -120,
    finalY: 4,
    startRotate: -24,
    midRotate: -6,
    finalRotate: -2,
    delay: 1.38,
  },
];

// Deterministic dust particles settling after all 5 cards land
const DUST_PARTICLES = [
  { id: 1, x: "18%", y: "22%", size: 4, delay: 2.35, duration: 2.2 },
  { id: 2, x: "32%", y: "16%", size: 3, delay: 2.5, duration: 2.4 },
  { id: 3, x: "48%", y: "28%", size: 5, delay: 2.3, duration: 2.6 },
  { id: 4, x: "66%", y: "20%", size: 3, delay: 2.6, duration: 2.1 },
  { id: 5, x: "78%", y: "34%", size: 4, delay: 2.45, duration: 2.5 },
  { id: 6, x: "24%", y: "44%", size: 3, delay: 2.65, duration: 2.3 },
  { id: 7, x: "42%", y: "50%", size: 6, delay: 2.4, duration: 2.7 },
  { id: 8, x: "58%", y: "46%", size: 3, delay: 2.75, duration: 2.0 },
  { id: 9, x: "74%", y: "58%", size: 5, delay: 2.55, duration: 2.4 },
  { id: 10, x: "28%", y: "68%", size: 4, delay: 2.7, duration: 2.2 },
  { id: 11, x: "52%", y: "72%", size: 3, delay: 2.45, duration: 2.5 },
  { id: 12, x: "68%", y: "78%", size: 4, delay: 2.8, duration: 2.1 },
  { id: 13, x: "38%", y: "82%", size: 5, delay: 2.6, duration: 2.6 },
  { id: 14, x: "82%", y: "70%", size: 3, delay: 2.85, duration: 2.2 },
  { id: 15, x: "15%", y: "58%", size: 4, delay: 2.5, duration: 2.4 },
  { id: 16, x: "60%", y: "32%", size: 3, delay: 2.7, duration: 2.3 },
];

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
    grandTotal,
    updateQuantity,
    toggleInstallation,
    removeFromCart,
    clearCart,
  } = useCart();
  const { toggleWishlist } = useWishlist();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState("");

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pincode Availability Checker State
  const [pincodeInput, setPincodeInput] = useState("122002");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  // Check pincode availability
  const checkPincode = async (codeToCheck = pincodeInput) => {
    setPincodeError("");
    setPincodeChecking(true);
    const res = await pincodeService.checkAvailability(codeToCheck);
    setPincodeChecking(false);
    setPincodeResult(res);
    if (!res.available) {
      setPincodeError(res.message);
    }
  };

  // Pre-fill pincode from active delivery address or default
  useEffect(() => {
    const activeAddress = user?.addresses?.[selectedAddressIndex];
    if (activeAddress?.pinCode) {
      setPincodeInput(activeAddress.pinCode);
      checkPincode(activeAddress.pinCode);
    } else {
      checkPincode("122002");
    }
  }, [selectedAddressIndex, user]);

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
      setPromoError(
        "Invalid code. Try 'BEYOND10' for 10% architectural discount."
      );
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

  // Real Order Placement & Data Synchronization with Service Layer
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/cart");
      return;
    }

    if (pincodeResult && !pincodeResult.available) {
      setPincodeError("Delivery is unavailable for this PIN code. Please enter a serviceable delivery PIN code to proceed.");
      return;
    }

    setIsSubmitting(true);
    try {
      const activeAddress = user?.addresses?.[selectedAddressIndex] || {
        fullName: user?.name || "Client",
        phone: user?.phone || "9876543210",
        street: "Registered Atelier Residence",
        landmark: "",
        city: pincodeResult?.city || "Gurugram",
        state: pincodeResult?.state || "Haryana",
        pinCode: pincodeInput || "122002",
      };

      const orderPayload = {
        customer: {
          _id: user?._id || "usr-current",
          name: user?.name || "Client",
          email: user?.email || "customer@beyondinteriors.in",
          phone: user?.phone || "9876543210",
        },
        items: cartItems.map((item) => ({
          product: item.productId,
          variantId: item.sku || "",
          sku: item.sku || "BI-SKU-01",
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          includeInstallation: Boolean(item.includeInstallation),
          installationFee: item.installationFee || 0,
        })),
        shippingAddress: activeAddress,
        offlinePayment: {
          method: "cash_on_delivery",
          status: "Payment Pending",
          notes: "Offline payment will be collected according to team instructions upon delivery.",
        },
        subtotal: cartSubtotal,
        shippingFee: shippingAmount,
        installationTotal,
        discount: discountAmount,
        totalAmount: finalPayable,
        expectedDeliveryDate: pincodeResult?.estimatedDays
          ? `Within ${pincodeResult.estimatedDays}`
          : "Within 4-7 business days",
      };

      // 1. Create and persist Order
      const createdOrder = await orderService.createOrder(orderPayload);

      // 2. Automatically create linked Installation records for selected products (without duplicates)
      const installationPromises = cartItems
        .filter((item) => item.includeInstallation)
        .map((item) =>
          installationService.createInstallation({
            order: createdOrder.orderNumber,
            customer: orderPayload.customer,
            serviceType: `Certified Assembly & Installation for ${item.name}`,
            product: {
              _id: item.productId,
              name: item.name,
              image: item.image,
            },
            address: activeAddress,
            notes: "Selected during product purchase",
          })
        );
      const createdInstallations = await Promise.all(installationPromises);

      // 3. Generate Notifications in synchronized system
      await notificationService.createNotification({
        title: `Order Placed: ${createdOrder.orderNumber}`,
        message: `Your interior order of ₹${finalPayable.toLocaleString("en-IN")} has been registered under offline payment mode.`,
        type: "order",
        link: `/account?tab=orders&id=${createdOrder.orderNumber}`,
      });

      if (createdInstallations.length > 0) {
        await notificationService.createNotification({
          title: `Installation Requested: ${createdInstallations.length} Service(s)`,
          message: `Linked to Order ${createdOrder.orderNumber}. An installation professional will be assigned to coordinate on-site mounting.`,
          type: "installation",
          link: `/account?tab=installations&id=${createdInstallations[0].bookingNumber}`,
        });
      }

      // 4. Update details and open modal
      setPlacedOrderDetails({
        ...createdOrder,
        installationsCount: createdInstallations.length,
        paymentInstructions: "Our concierge team will contact you to coordinate offline payment and material dispatch.",
      });

      setOrderModalOpen(true);
      clearCart();
    } catch (err) {
      console.error("Order placement failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingForFreeShipping = Math.max(0, shippingThreshold - cartSubtotal);

  return (
    <div className="bg-stone-50 font-sans text-stone-900 flex flex-col flex-1">
      {/* Main Container */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {/* Header Breadcrumb */}
        {cartItems.length > 0 && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
                Your Shopping Bag
              </h1>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
              <span>{cartCount} Products in Cart</span>
              <button
                onClick={clearCart}
                className="text-primary underline hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          /* Animated Empty Bag State: Fruit-Ninja Bottom Toss Cards + Settling Dust */
          <section className="py-8 sm:py-14 overflow-hidden">
            <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
              {/* LEFT: Tossed Photo Cards Stack + Dust */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="relative w-[290px] sm:w-[350px] h-[360px] sm:h-[420px] flex items-center justify-center">
                  {TOSS_CARDS.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{
                        x: card.startX,
                        y: 440,
                        rotate: card.startRotate,
                        scale: 0.72,
                        opacity: 0,
                      }}
                      animate={{
                        x: [card.startX, card.midX, card.finalX],
                        y: [440, card.peakY, card.finalY],
                        rotate: [
                          card.startRotate,
                          card.midRotate,
                          card.finalRotate,
                        ],
                        scale: [0.72, 1.05, 1],
                        opacity: [0, 1, 1],
                      }}
                      transition={{
                        duration: 0.9,
                        delay: card.delay,
                        times: [0, 0.58, 1],
                        ease: ["easeOut", "easeInOut"],
                      }}
                      style={{ zIndex: index + 1 }}
                      className="absolute w-[230px] sm:w-[275px] h-[290px] sm:h-[345px] bg-[#FAF8F5] p-3 pb-8 shadow-xl border border-[#E5DDD3]"
                    >
                      <div className="w-full h-full overflow-hidden bg-[#EDE6DC]">
                        <img
                          src={card.image}
                          alt={card.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#7D7165] text-center font-medium">
                        {card.label}
                      </p>
                    </motion.div>
                  ))}

                  {/* Dust Phase 1: Settled Matte Dusty Layer over the stack */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.8, delay: 2.35, ease: "easeOut" }}
                    className="pointer-events-none absolute inset-4 rounded-sm"
                    style={{
                      zIndex: 8,
                      background:
                        "radial-gradient(circle at 45% 40%, rgba(235, 227, 215, 0.34) 0%, rgba(210, 198, 182, 0.48) 65%, rgba(190, 178, 162, 0.25) 100%)",
                      backdropFilter: "saturate(0.75) contrast(0.95)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Dust Phase 2: Fine Dust Motes Drifting Down */}
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{ zIndex: 9 }}
                    aria-hidden="true"
                  >
                    {DUST_PARTICLES.map((p) => (
                      <motion.span
                        key={p.id}
                        initial={{ y: -90, x: -12, opacity: 0, scale: 0.4 }}
                        animate={{
                          y: 0,
                          x: 0,
                          opacity: [0, 0.85, 0.65],
                          scale: 1,
                        }}
                        transition={{
                          duration: p.duration,
                          delay: p.delay,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          left: p.x,
                          top: p.y,
                          width: p.size,
                          height: p.size,
                        }}
                        className="absolute rounded-full bg-[#E8DFD3] shadow-[0_0_6px_rgba(245,238,228,0.9)]"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Editorial Copy & CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="lg:col-span-6 text-center lg:text-left max-w-md mx-auto lg:mx-0"
              >
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1714] leading-tight mb-4">
                  Your bag is gathering dust.
                </h2>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-8">
                  Begin curating your living spaces with our bespoke handcrafted
                  seating, designer lighting, wall panels, and architectural
                  interior solutions—backed by white-glove installation.
                </p>

                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3">
                  <Link
                    to="/products"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2C241E] hover:bg-[#3E3228] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.16em] px-8 py-4 transition-colors"
                  >
                    <span>Explore Product Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/wishlist"
                    className="w-full sm:w-auto inline-flex items-center justify-center border border-[#2C241E] text-[#2C241E] hover:bg-[#2C241E] hover:text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.16em] px-7 py-4 transition-colors"
                  >
                    View Saved Wishlist
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
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
                        : `${Math.min(
                          100,
                          Math.round((cartSubtotal / shippingThreshold) * 100)
                        )}%`}
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
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 space-y-4 hover:bg-stone-50/50 transition-colors"
                  >
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
                              ₹
                              {(item.price * item.quantity).toLocaleString(
                                "en-IN"
                              )}
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
                            Certified Beyond Interiors technician will assemble
                            and position this product.
                          </span>
                        </div>
                      </label>
                      <span className="font-mono text-xs font-semibold text-stone-800 shrink-0 ml-4">
                        +₹
                        {(item.installationFee * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Selection Card (If Authenticated) */}
              {isAuthenticated &&
                user?.addresses &&
                user.addresses.length > 0 && (
                  <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        Select Delivery Address
                      </h3>
                      <Link
                        to="/account?tab=profile"
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
                          className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${selectedAddressIndex === idx
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
                            {addr.street},{" "}
                            {addr.landmark ? `${addr.landmark}, ` : ""}
                            {addr.city}, {addr.state} - {addr.pinCode}
                          </p>
                          <p className="text-stone-400 font-mono mt-1 text-[11px]">
                            Phone: {addr.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* ================= 1. PINCODE AVAILABILITY CHECKER ================= */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block mb-0.5">
                      Serviceability & SLA
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Delivery & Installation PIN Code
                    </h3>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">India Only</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit delivery PIN code"
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => checkPincode(pincodeInput)}
                    disabled={pincodeChecking || !pincodeInput}
                    className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shrink-0 shadow-xs"
                  >
                    {pincodeChecking ? "Verifying..." : "Check Availability"}
                  </button>
                </div>

                {/* Status Message */}
                {pincodeResult && (
                  <div
                    className={`p-4 rounded-2xl border text-xs transition-all ${pincodeResult.available
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                        : "bg-red-50/80 border-red-200 text-red-900"
                      }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {pincodeResult.available ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">{pincodeResult.message}</p>
                        {pincodeResult.available && (
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-emerald-800">
                            <span>
                              City / Hub: <strong>{pincodeResult.city}, {pincodeResult.state}</strong>
                            </span>
                            <span>
                              Estimated Transit: <strong>{pincodeResult.estimatedDays}</strong>
                            </span>
                            {pincodeResult.whiteGlove && (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                                <ShieldCheck className="w-3.5 h-3.5" /> White-Glove Installation Covered
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ================= 2. OFFLINE PAYMENT INSTRUCTIONS ================= */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A73D4D] block mb-0.5">
                      Payment Policy
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Offline Payment
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70">
                    Payment Pending Upon Delivery
                  </span>
                </div>

                {/* Mandatory Offline Payments Notice */}
                <div className="p-4 rounded-2xl bg-[#FBF9F6] border border-amber-200/80 flex items-start gap-3">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 text-xs text-stone-700 leading-relaxed font-normal">
                    <p>
                      <strong className="text-stone-900 font-semibold">BEYOND INTERIORS currently accepts offline payments only.</strong> Your order will be confirmed according to the payment instructions provided by our team.
                    </p>
                    <p className="text-stone-600">
                      Payment must be completed directly through the available offline payment method upon verification and delivery of your interior products and materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card (Sticky) */}
            <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
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
                  {promoError && (
                    <p className="text-[11px] text-rose-600">{promoError}</p>
                  )}
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
                      <span className="font-serif font-bold text-base block">
                        Total Payable
                      </span>
                      <span className="text-[10px] text-stone-400">
                        All Taxes & Duties Included
                      </span>
                    </div>
                    <span className="font-serif font-bold text-2xl text-stone-950">
                      ₹{finalPayable.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Pincode Availability Warning */}
                {pincodeResult && !pincodeResult.available && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Please enter a serviceable PIN code to proceed.</span>
                  </div>
                )}

                {/* Offline Payment Confirmation Reminder */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-stone-900">
                    <span>Payment Mode:</span>
                    <span className="text-[#A73D4D]">Offline Only</span>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    Payment will be collected offline according to team instructions upon delivery.
                  </p>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || (pincodeResult && !pincodeResult.available)}
                  className="w-full py-4 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {isAuthenticated
                          ? "Confirm & Place Order"
                          : "Sign In to Checkout"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
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
                Order Placed Successfully!
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                Thank you for choosing Beyond Interiors. Your order has been registered in our atelier system.
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
                <span className="text-stone-500">Total Amount</span>
                <span className="font-serif font-bold text-stone-950 text-sm">
                  ₹{placedOrderDetails.totalAmount?.toLocaleString("en-IN") || placedOrderDetails.grandTotal?.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Status</span>
                <span className="text-amber-800 font-semibold font-mono bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80 text-[10px]">
                  Payment Pending (Offline)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Mode</span>
                <span className="text-stone-800 font-medium text-right max-w-[220px] truncate">
                  Offline Payment (Direct Verification)
                </span>
              </div>
              {placedOrderDetails.installationsCount > 0 && (
                <div className="flex justify-between text-amber-900 pt-1 border-t border-stone-200/60 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-amber-700" /> Linked Installations
                  </span>
                  <span>{placedOrderDetails.installationsCount} Active Service(s)</span>
                </div>
              )}
            </div>

            {/* Offline Payment Instructions Callout */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-stone-700 space-y-1">
              <span className="font-bold text-stone-900 block text-[11px] uppercase tracking-wider">
                Offline Payment Instructions:
              </span>
              <p className="text-[11px] text-stone-600 whitespace-pre-line leading-relaxed">
                {placedOrderDetails.paymentInstructions ||
                  "Our team will contact you for payment verification and material dispatch coordination."}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to={`/account?tab=orders&id=${placedOrderDetails.orderNumber}`}
                onClick={() => setOrderModalOpen(false)}
                className="flex-1 py-3 text-center rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Track Order
              </Link>
              {placedOrderDetails.installationsCount > 0 && (
                <Link
                  to={`/account?tab=installations&order=${placedOrderDetails.orderNumber}`}
                  onClick={() => setOrderModalOpen(false)}
                  className="flex-1 py-3 text-center rounded-full bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Track Installation
                </Link>
              )}
              <button
                onClick={() => {
                  setOrderModalOpen(false);
                  navigate("/products");
                }}
                className="py-3 px-5 text-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;