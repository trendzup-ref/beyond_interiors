import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  Compass,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Heart,
  Share2,
  Wrench,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { getPublicProduct } from "../../api/productApi.js";
import { SAMPLE_PRODUCTS } from "./ProductListing.jsx";
import { useCart, useWishlist } from "../../context/CartWishlistContext.jsx";
import ProductReviews from "../../components/reviews/ProductReviews.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isInWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { addToCart, cartCount, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Fetch product from backend or fallback to SAMPLE_PRODUCTS
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getPublicProduct(id);
        if (res.data?.data?.product) {
          setProduct(res.data.data.product);
          return;
        }
      } catch (err) {
        // Fallback
      }

      // Check fallback sample products
      const match = SAMPLE_PRODUCTS.find((p) => p._id === id || p.slug === id);
      if (match) {
        setProduct(match);
      } else {
        // Default to first sample product (e.g. Mundo Lounge Chair / Blanco)
        setProduct(SAMPLE_PRODUCTS[5] || SAMPLE_PRODUCTS[0]);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="animate-pulse font-serif text-lg text-stone-500">
          Loading architectural product specifications...
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80",
      ];

  const totalImages = images.length;
  const currentImage = images[selectedImageIndex] || images[0];

  const variants = product.variants && product.variants.length > 0 ? product.variants : [];
  const activeVariant = variants[selectedVariantIndex] || variants[0] || {};
  const activePrice = activeVariant.price || product.basePrice || 44000;
  const isWishlisted = isInWishlist(product._id);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleAddToCart = () => {
    addToCart(product, activeVariant, 1, false);
    navigate("/cart");
  };

  return (
    <div className="bg-white font-sans text-stone-900 flex flex-col flex-1">
      {/* ================= MAIN SPLIT CONTAINER (Exact Match to Image 2) ================= */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch min-h-[640px] lg:min-h-[750px]">
          {/* ================= LEFT COLUMN: SERENE AMBIENT SHOWCASE (Exact Match to Image 2) ================= */}
          <div className="lg:col-span-7 bg-[#DDE5EB] rounded-3xl sm:rounded-[36px] overflow-hidden relative flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-xs border border-stone-300/40 min-h-[460px] sm:min-h-[560px] lg:min-h-full">
            {/* Top Subtle Breadcrumb / SKU */}
            <div className="z-10 flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-stone-600/90">
                {product.category?.name || "FURNITURE"} · {activeVariant.sku || "BI-ARCH-01"}
              </span>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-700 flex items-center justify-center shadow-xs transition-transform duration-200 hover:scale-110 cursor-pointer"
                aria-label="Save to wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
              </button>
            </div>

            {/* Centered Large Product Image (High-Res Cutout Showcase) */}
            <div className="relative w-full flex-1 flex items-center justify-center p-4 sm:p-8">
              <img
                src={currentImage}
                alt={product.name}
                className="max-h-[340px] sm:max-h-[440px] md:max-h-[500px] w-auto object-contain drop-shadow-2xl transition-all duration-700 ease-out"
              />
            </div>

            {/* Bottom Controls Row: Thumbnails on Left + Image Progress Line & Prev/Next Arrows on Right */}
            <div className="z-10 flex items-end justify-between pt-4">
              {/* Image Thumbnails (Supports up to 5 images per schema) */}
              <div className="flex items-center gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-white/70 border-2 transition-all ${idx === selectedImageIndex
                      ? "border-stone-900 shadow-md scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Exact Reference Match: Image Number Line + Prev/Next Circle Buttons */}
              <div className="flex items-center gap-4">
                {/* Progress line e.g. 01 ───── 03 */}
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-stone-600 tracking-wider">
                  <span>0{selectedImageIndex + 1}</span>
                  <div className="w-12 sm:w-16 h-0.5 bg-stone-400/60 rounded-full" />
                  <span>0{totalImages}</span>
                </div>

                {/* Circular Navigation Buttons (< and >) */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevImage}
                    aria-label="Previous product image"
                    className="w-9 h-9 rounded-full bg-stone-900/90 hover:bg-stone-900 text-white flex items-center justify-center shadow-xs transition-transform duration-200 hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Next product image"
                    className="w-9 h-9 rounded-full bg-stone-900/90 hover:bg-stone-900 text-white flex items-center justify-center shadow-xs transition-transform duration-200 hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: EDITORIAL SPECIFICATIONS (Exact Match to Image 2) ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2 sm:py-4 space-y-6 sm:space-y-8">
            {/* Top Details */}
            <div className="space-y-5">
              {/* Designer / Atelier Tag (Exact Match: e.g. SUSANNE GRØNLUND) */}
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-stone-500">
                  BEYOND INTERIORS ATELIER
                </span>
              </div>

              {/* Product Headline Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
                {product.name}
              </h1>

              {/* Editorial Description Narrative */}
              <p className="font-sans text-xs sm:text-sm text-stone-500 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Price & BUY NOW CTA Button Row (Exact Match) */}
              <div className="pt-2 flex items-center justify-between gap-4 border-b border-stone-200 pb-6">
                <div>
                  <span className="block text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    ₹{activePrice.toLocaleString("en-IN")}
                  </span>
                  {activeVariant.mrp && activeVariant.mrp > activePrice && (
                    <span className="text-xs text-stone-400 line-through">
                      MRP: ₹{activeVariant.mrp.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  className="px-8 sm:px-10 py-3.5 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Buy Now
                </button>
              </div>

              {/* COLOURS / VARIANTS ROW (Exact Match from Schema: Circular chips with checkmark) */}
              {variants.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-stone-500">
                      COLOURS
                    </span>
                    <span className="text-xs font-semibold text-stone-800">
                      {activeVariant.color || "Standard"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {variants.map((variant, idx) => {
                      const isSelected = idx === selectedVariantIndex;

                      // Color swatch styling mapping
                      let bgClass = "bg-[#D8C7B5]";
                      const colLower = (variant.color || "").toLowerCase();
                      if (colLower.includes("black") || colLower.includes("noir") || colLower.includes("charcoal")) {
                        bgClass = "bg-[#282828]";
                      } else if (colLower.includes("slate") || colLower.includes("grey")) {
                        bgClass = "bg-[#5A6872]";
                      } else if (colLower.includes("olive") || colLower.includes("sage")) {
                        bgClass = "bg-[#6A7862]";
                      } else if (colLower.includes("terra") || colLower.includes("rust")) {
                        bgClass = "bg-[#A74E2E]";
                      } else if (colLower.includes("ivory") || colLower.includes("linen")) {
                        bgClass = "bg-[#F3EFEA] border border-stone-300";
                      }

                      return (
                        <button
                          key={variant.sku || idx}
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center transition-all duration-200 relative ${isSelected ? "ring-2 ring-stone-900 ring-offset-2 scale-110" : "hover:scale-105"
                            }`}
                          title={variant.color}
                        >
                          {isSelected && (
                            <Check className={`w-3.5 h-3.5 ${colLower.includes("ivory") || colLower.includes("linen") ? "text-stone-900" : "text-white"}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DIMENSIONS AND WEIGHT SECTION (Exact Match to Image 2) */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-stone-500 block">
                  DIMENSIONS AND SPECIFICATIONS
                </span>

                <div className="space-y-1.5 text-xs text-stone-600 font-light">
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-400">Height:</span>
                    <span className="font-medium text-stone-800">82 / 40.5 cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-400">Width:</span>
                    <span className="font-medium text-stone-800">75 cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-400">Depth:</span>
                    <span className="font-medium text-stone-800">54 cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-400">Seating Height:</span>
                    <span className="font-medium text-stone-800">40.5 cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-400">Armrest Height:</span>
                    <span className="font-medium text-stone-800">55.5 cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-400">Maximum Weight Load:</span>
                    <span className="font-medium text-stone-800">125 kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-400">Primary Material:</span>
                    <span className="font-medium text-stone-800">{activeVariant.material || "Solid Wood & Upholstery"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Service Guarantees & Installation Option */}
            <div className="pt-4 space-y-3">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200/80 flex items-start gap-3">
                <Wrench className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-serif font-bold text-xs text-stone-900">
                    Certified On-Site Installation Available
                  </h4>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                    Laser measurement and turnkey wall-anchoring by certified Beyond Interiors technicians.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono px-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  <span>White-Glove Delivery</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                  <span>7-Day Return Coverage</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= VERIFIED CLIENT REVIEWS SECTION ================= */}
        <ProductReviews productName={product.name} />
      </main>
    </div>
  );
};

export default ProductDetail;
