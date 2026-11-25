import React, { useState, useRef } from "react";
import { Link } from "react-router";
import {
  Tag,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpRight,
  Wrench,
  CheckCircle2,
  ExternalLink,
  Camera,
} from "lucide-react";

// Standard Lucide-styled Instagram SVG component
const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

/**
 * INSPIRATION & REAL HOMES DATASET
 * Inspired by IKEA "Looks by you" with shoppable product pins & installation booking.
 * Replace any `imageUrl` with real customer photos uploaded from your admin panel.
 */
export const INSPIRATION_ITEMS = [
  {
    id: "look-1",
    handle: "@nishant_living",
    roomTitle: "Sunlit Minimalist Living Corner",
    location: "Mumbai, Maharashtra",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    altText: "Client Living Room styled with Beyond Interiors bouclé chair and lighting",
    taggedCount: 4,
    taggedProducts: [
      {
        id: "p1",
        name: "Sculptural Bouclé Armchair",
        category: "Furniture",
        price: "₹34,500",
        link: "/products?category=furniture",
        x: 48, // Hotspot percentage
        y: 62,
      },
      {
        id: "p2",
        name: "Acoustic Fluted Oak Slat Panels",
        category: "Wall Panels",
        price: "₹12,800 / pack",
        link: "/products?category=wall-panels",
        x: 22,
        y: 28,
      },
      {
        id: "p3",
        name: "Travertine Low Table",
        category: "Furniture",
        price: "₹18,900",
        link: "/products?category=furniture",
        x: 32,
        y: 78,
      },
      {
        id: "p4",
        name: "Ambient Brushed Brass Sconce",
        category: "Lighting",
        price: "₹6,400",
        link: "/products?category=lighting",
        x: 75,
        y: 20,
      },
    ],
  },
  {
    id: "look-2",
    handle: "@ananya_architect",
    roomTitle: "Compact Architectural Home Studio",
    location: "Bengaluru, Karnataka",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80",
    altText: "Executive Study styled with Beyond Interiors desk and shelving",
    taggedCount: 3,
    taggedProducts: [
      {
        id: "p5",
        name: "Monolithic Natural Oak Desk",
        category: "Furniture",
        price: "₹42,000",
        link: "/products?category=furniture",
        x: 50,
        y: 65,
      },
      {
        id: "p6",
        name: "Ergonomic Linen Task Chair",
        category: "Furniture",
        price: "₹19,500",
        link: "/products?category=furniture",
        x: 65,
        y: 72,
      },
      {
        id: "p7",
        name: "Linear LED Dimmable Task Light",
        category: "Lighting",
        price: "₹7,200",
        link: "/products?category=lighting",
        x: 38,
        y: 40,
      },
    ],
  },
  {
    id: "look-3",
    handle: "@kabir_interiors",
    roomTitle: "Warm Minimalist Foyer & Entryway",
    location: "New Delhi",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    altText: "Modern Foyer styled with Beyond Interiors shoe console and mirror",
    taggedCount: 2,
    taggedProducts: [
      {
        id: "p8",
        name: "Fluted 4-Door Entryway Console",
        category: "Furniture",
        price: "₹28,500",
        link: "/products?category=furniture",
        x: 52,
        y: 64,
      },
      {
        id: "p9",
        name: "Backlit Full-Length Arch Mirror",
        category: "Lighting",
        price: "₹14,900",
        link: "/products?category=lighting",
        x: 68,
        y: 35,
      },
    ],
  },
  {
    id: "look-4",
    handle: "@rohan_designlab",
    roomTitle: "Zen Master Suite & Walk-In Corner",
    location: "Pune, Maharashtra",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80",
    altText: "Bedroom Corner styled with Beyond Interiors linen curtains and mirror",
    taggedCount: 3,
    taggedProducts: [
      {
        id: "p10",
        name: "Belgian Sheer Motorised Linen Drapery",
        category: "Curtains & Blinds",
        price: "₹16,400 / set",
        link: "/products?category=curtains-and-blinds",
        x: 75,
        y: 42,
      },
      {
        id: "p11",
        name: "Plush Berber Pure Wool Area Rug",
        category: "Rugs & Carpets",
        price: "₹24,000",
        link: "/products?category=rugs-and-carpets",
        x: 45,
        y: 84,
      },
      {
        id: "p12",
        name: "Full-Length Standing Brass Mirror",
        category: "Home Decor",
        price: "₹15,200",
        link: "/products?category=home-decor",
        x: 30,
        y: 48,
      },
    ],
  },
  {
    id: "look-5",
    handle: "@priya_lifestyle",
    roomTitle: "Nordic Dining Space with Organic Textures",
    location: "Hyderabad, Telangana",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80",
    altText: "Nordic Dining Room styled with Beyond Interiors dining table and pendant",
    taggedCount: 4,
    taggedProducts: [
      {
        id: "p13",
        name: "Solid White Oak 6-Seater Dining Table",
        category: "Furniture",
        price: "₹68,000",
        link: "/products?category=furniture",
        x: 50,
        y: 65,
      },
      {
        id: "p14",
        name: "Curved Upholstered Dining Chairs (Set of 2)",
        category: "Furniture",
        price: "₹22,000",
        link: "/products?category=furniture",
        x: 25,
        y: 68,
      },
      {
        id: "p15",
        name: "Sculptural Ceramic Vase Trio",
        category: "Home Decor",
        price: "₹5,800",
        link: "/products?category=home-decor",
        x: 48,
        y: 52,
      },
      {
        id: "p16",
        name: "Linen Drum Architectural Chandelier",
        category: "Lighting",
        price: "₹18,500",
        link: "/products?category=lighting",
        x: 50,
        y: 18,
      },
    ],
  },
  {
    id: "look-6",
    handle: "@vikram_residence",
    roomTitle: "Modern Wellness Spa En-Suite",
    location: "Jaipur, Rajasthan",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
    altText: "Luxury Spa Bathroom with Beyond Interiors fluted vanity",
    taggedCount: 3,
    taggedProducts: [
      {
        id: "p17",
        name: "Fluted Teak Wall-Hung Vanity",
        category: "Bathroom Products",
        price: "₹45,000",
        link: "/products?category=bathroom-products",
        x: 48,
        y: 68,
      },
      {
        id: "p18",
        name: "Hand-Carved River Stone Vessel Basin",
        category: "Bathroom Products",
        price: "₹18,500",
        link: "/products?category=bathroom-products",
        x: 48,
        y: 48,
      },
      {
        id: "p19",
        name: "Brushed Champagne Wall-Mount Mixer",
        category: "Bathroom Products",
        price: "₹9,200",
        link: "/products?category=bathroom-products",
        x: 48,
        y: 35,
      },
    ],
  },
];

const InspirationSection = () => {
  const [selectedLook, setSelectedLook] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const scrollContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Update progress bar on scroll (like IKEA's progress bar)
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    const progress = (scrollLeft / maxScroll) * 100;
    setScrollProgress(progress);
  };

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const openLookModal = (look) => {
    setSelectedLook(look);
    setActiveHotspot(look.taggedProducts[0] || null);
  };

  const closeLookModal = () => {
    setSelectedLook(null);
    setActiveHotspot(null);
  };

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* ================= SECTION HEADER (Reference Exact Match) ================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
            Looks by you
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 max-w-2xl mt-1.5 leading-relaxed">
            Get inspired by real customer homes styled and installed by <strong>BEYOND INTERIORS</strong>.
            Discover shoppable products, request professional installation, or share your own space with{" "}
            <span className="font-semibold text-stone-800">#BeyondInteriors</span> to get featured.
          </p>
        </div>

        {/* Previous / Next Scroll Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => scroll("left")}
            aria-label="Previous inspiration ideas"
            className="w-10 h-10 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Next inspiration ideas"
            className="w-10 h-10 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= HORIZONTAL CARD GALLERY (Reference Exact Match) ================= */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {INSPIRATION_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => openLookModal(item)}
            className="group relative flex-shrink-0 w-[260px] sm:w-[320px] md:w-[350px] aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-stone-100 shadow-xs hover:shadow-xl transition-all duration-500 snap-start border border-stone-200/60"
          >
            {/* INSPIRATION IMAGE */}
            <img
              src={item.imageUrl}
              alt={item.altText}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              loading="lazy"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Top-Left Instagram Badge (Reference Match) */}
            <div className="absolute top-3.5 left-3.5 z-10">
              <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-stone-900 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
                <InstagramIcon className="w-4 h-4" />
              </span>
            </div>

            {/* Bottom-Left Shoppable Tag Badge (Reference Match: 🏷️ count) */}
            <div className="absolute bottom-3.5 left-3.5 z-10">
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-stone-900 font-semibold text-xs tracking-wider shadow-md backdrop-blur-xs transition-all duration-300 group-hover:bg-amber-600 group-hover:text-white"
                title={`${item.taggedCount} shoppable products in this space`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{item.taggedCount}</span>
              </button>
            </div>

            {/* Bottom Title on Hover */}
            <div className="absolute bottom-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                <span>Explore</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= IKEA-STYLE HORIZONTAL PROGRESS BAR (Reference Match) ================= */}
      <div className="w-full mt-4 h-1 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-stone-900 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(16, scrollProgress)}%` }}
        />
      </div>

      {/* ================= SHOP THE LOOK INTERACTIVE MODAL (IKEA Behavior) ================= */}
      {selectedLook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={closeLookModal}
        >
          <div
            className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={closeLookModal}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center shadow-md backdrop-blur-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Image with Interactive Shoppable Hotspots */}
            <div className="relative w-full md:w-[58%] bg-stone-900 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px]">
              <img
                src={selectedLook.imageUrl}
                alt={selectedLook.altText}
                className="w-full h-full object-cover"
              />

              {/* Hotspot Dots on the Image */}
              {selectedLook.taggedProducts.map((prod) => {
                const isSelected = activeHotspot?.id === prod.id;
                return (
                  <button
                    key={prod.id}
                    onClick={() => setActiveHotspot(prod)}
                    className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isSelected ? "scale-125 ring-4 ring-amber-400" : "scale-100 hover:scale-110"
                    }`}
                    style={{ left: `${prod.x}%`, top: `${prod.y}%` }}
                    aria-label={`View ${prod.name}`}
                  >
                    <span className="relative flex h-7 w-7 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-white text-stone-900 items-center justify-center shadow-lg font-bold text-xs">
                        <Tag className="w-3 h-3 text-amber-700" />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Shoppable Products List & Installation Options */}
            <div className="w-full md:w-[42%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                {/* Creator Header */}
                <div className="border-b border-stone-200 pb-4">
                  <div className="flex items-center gap-2 text-stone-500 text-xs font-mono">
                    <InstagramIcon className="w-3.5 h-3.5 text-rose-600" />
                    <span>{selectedLook.handle}</span>
                    <span className="text-stone-300">·</span>
                    <span>{selectedLook.location}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                    {selectedLook.roomTitle}
                  </h3>
                </div>

                {/* Tagged Products in this room */}
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-400 mb-3">
                    Products in this room ({selectedLook.taggedProducts.length})
                  </h4>

                  <div className="space-y-2.5">
                    {selectedLook.taggedProducts.map((prod) => {
                      const isSelected = activeHotspot?.id === prod.id;
                      return (
                        <div
                          key={prod.id}
                          onClick={() => setActiveHotspot(prod)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-amber-50/60 border-amber-500/80 shadow-xs"
                              : "bg-stone-50 hover:bg-stone-100 border-stone-200"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-mono font-semibold text-amber-800">
                              {prod.category}
                            </span>
                            <p className="font-serif font-bold text-sm text-stone-900">
                              {prod.name}
                            </p>
                            <p className="text-xs font-semibold text-stone-700">{prod.price}</p>
                          </div>

                          <Link
                            to={prod.link}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-amber-600 text-white text-xs font-semibold transition-colors"
                          >
                            <span>Shop</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Turnkey Installation Notice */}
              <div className="pt-6 border-t border-stone-200 mt-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs">
                  <Wrench className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Professional installation & on-site measurement available for all items.
                  </span>
                </div>

                <Link
                  to="/services"
                  className="w-full py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs tracking-wider uppercase text-center flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span>Book Site Visit & Installation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InspirationSection;
