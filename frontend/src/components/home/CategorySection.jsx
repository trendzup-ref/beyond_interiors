import React, { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

/**
 * 10 CATEGORIES CONFIGURATION FOR BEYOND INTERIORS
 * Every card features a full background image with absolute editorial text overlays.
 * Replace any `imageUrl` with admin-uploaded images.
 */
export const CATEGORY_PAGES = [
  // PAGE 1 (5 Categories)
  [
    {
      id: "furniture",
      name: "Furniture",
      meta: "140+ Products · Handcrafted",
      badge: "Living & Lounge",
      headline: "Architectural Living: Handcrafted Sofas & Sculptural Lounge Seating",
      link: "/products?category=furniture",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      altText: "Handcrafted Luxury Furniture",
    },
    {
      id: "lighting",
      name: "Lighting",
      meta: "85+ Fixtures · Site Fitting",
      badge: "Architectural Lights",
      headline: "Ambient Illumination: Sculptural Pendants, Sconces & Floor Lamps",
      link: "/products?category=lighting",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
      altText: "Architectural Ambient Lighting",
    },
    {
      id: "wallpapers",
      name: "Wallpapers",
      meta: "260+ Patterns · Professional Pasting",
      badge: "Wall Artistry",
      headline: "Textured Murals & Botanicals: Transform Walls into Tactile Masterpieces",
      link: "/products?category=wallpapers",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85",
      altText: "Designer Textured Wallpapers",
    },
    {
      id: "wall-panels",
      name: "Wall Panels",
      meta: "75+ Finishes · Acoustic Damping",
      badge: "Fluted & Slat Panels",
      headline: "Acoustic Slats & Fluted Panels: Contemporary Dimensional Depth",
      link: "/products?category=wall-panels",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      altText: "Fluted Wood Wall Panels",
    },
    {
      id: "flooring",
      name: "Flooring",
      meta: "95+ Options · Certified Laying",
      badge: "Hardwood & Stone",
      headline: "Engineered Oak & Herringbone: Timeless Foundations for Refined Living",
      link: "/products?category=flooring",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80",
      altText: "Engineered Hardwood Flooring",
    },
  ],

  // PAGE 2 (Next 5 Categories)
  [
    {
      id: "curtains-and-blinds",
      name: "Curtains and Blinds",
      meta: "120+ Fabrics · Precision Fit",
      badge: "Window Couture",
      headline: "Custom Drapery: Sheer Belgian Linens & Motorised Acoustic Blinds",
      link: "/products?category=curtains-and-blinds",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      altText: "Custom Curtains and Blinds",
    },
    {
      id: "home-decor",
      name: "Home Decor",
      meta: "190+ Accents · Handcrafted",
      badge: "Artisan Accents",
      headline: "Sculptural Accents: Ceramic Vessels, Trays & Minimalist Tableware",
      link: "/products?category=home-decor",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
      altText: "Artisan Home Decor Accents",
    },
    {
      id: "modular-kitchen",
      name: "Modular Kitchen",
      meta: "Bespoke Units · Full Survey",
      badge: "Culinary Sanctuaries",
      headline: "Architectural Kitchens: Seamless Cabinetry, Quartz Tops & Island Units",
      link: "/products?category=modular-kitchen",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85",
      altText: "Bespoke Modular Kitchen",
    },
    {
      id: "rugs-and-carpets",
      name: "Rugs and Carpets",
      meta: "110+ Weaves · NZ Virgin Wool",
      badge: "Artisanal Weaves",
      headline: "Textured Floor Art: High-Pile Berber & Hand-Knotted Wool Carpets",
      link: "/products?category=rugs-and-carpets",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80",
      altText: "Handcrafted Rugs and Carpets",
    },
    {
      id: "bathroom-products",
      name: "Bathroom Products",
      meta: "130+ Fixtures · Plumber Ready",
      badge: "Spa & Wellness",
      headline: "Wellness Sanctuaries: Fluted Vanities, Stone Basins & Brass Hardware",
      link: "/products?category=bathroom-products",
      // Replace with your admin image URL
      imageUrl:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      altText: "Luxury Bathroom Products",
    },
  ],
];

const CategorySection = () => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalPages = CATEGORY_PAGES.length;
  const currentCategories = CATEGORY_PAGES[activePageIndex];

  const handlePageChange = (newIndex) => {
    if (newIndex === activePageIndex || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActivePageIndex(newIndex);
      setIsTransitioning(false);
    }, 220);
  };

  const nextCategories = () => {
    handlePageChange((activePageIndex + 1) % totalPages);
  };

  const prevCategories = () => {
    handlePageChange((activePageIndex - 1 + totalPages) % totalPages);
  };

  const card1 = currentCategories[0]; // Top Left
  const card2 = currentCategories[1]; // Bottom Left
  const centerHero = currentCategories[2]; // Tall Center
  const card4 = currentCategories[3]; // Top Right
  const card5 = currentCategories[4]; // Bottom Right

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* SECTION HEADER: Title, Subtitle, and Top-Right Prev/Next Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
            Shop by Category
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 max-w-2xl mt-1.5 leading-relaxed">
            From architectural lighting and bespoke furniture to acoustic wall panels and certified
            installation services, explore high-end collections tailored for discerning interiors.
          </p>
        </div>

        {/* Top-Right Prev / Next Controls with Page Indicator */}
        <div className="flex items-center gap-3 self-end sm:self-auto">

          <button
            onClick={prevCategories}
            className="w-10 h-10 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
            aria-label="Previous 5 categories"
            title="Previous categories"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextCategories}
            className="w-10 h-10 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
            aria-label="Next 5 categories"
            title="Next categories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5-CATEGORY ASYMMETRICAL BENTO GRID WITH FULL BACKGROUND IMAGES */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 transition-all duration-300 ease-in-out ${isTransitioning ? "opacity-30 scale-[0.99]" : "opacity-100 scale-100"
          }`}
      >
        {/* ================= COLUMN 1: LEFT STACK (Cards 1 & 2) ================= */}
        <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
          {/* Card 1: Top Left with Full Background Image */}
          <Link
            to={card1.link}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-7 h-[250px] sm:h-[270px] transition-all duration-500 hover:shadow-xl border border-stone-300/40"
          >
            {/* FULL BACKGROUND IMAGE */}
            <img
              src={card1.imageUrl}
              alt={card1.altText}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            {/* Ambient Dual Gradients for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 pointer-events-none" />

            <div className="z-10 relative flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-wide text-stone-200">
                {card1.meta}
              </span>
              <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="z-10 relative space-y-2">
              <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-stone-900 shadow-xs">
                {card1.badge}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-white line-clamp-2 drop-shadow-sm">
                {card1.headline}
              </h3>
            </div>
          </Link>

          {/* Card 2: Bottom Left with Full Background Image */}
          <Link
            to={card2.link}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-7 h-[250px] sm:h-[270px] transition-all duration-500 hover:shadow-xl border border-stone-300/40"
          >
            {/* FULL BACKGROUND IMAGE */}
            <img
              src={card2.imageUrl}
              alt={card2.altText}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 pointer-events-none" />

            <div className="z-10 relative flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-wide text-stone-200">
                {card2.meta}
              </span>
              <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="z-10 relative space-y-2">
              <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-stone-900 shadow-xs">
                {card2.badge}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-white line-clamp-2 drop-shadow-sm">
                {card2.headline}
              </h3>
            </div>
          </Link>
        </div>

        {/* ================= COLUMN 2: CENTER FEATURED TALL CARD (Card 3) ================= */}
        <div className="md:col-span-2 lg:col-span-5 h-[480px] sm:h-[540px] lg:h-full">
          <Link
            to={centerHero.link}
            className="group relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-7 sm:p-9 transition-all duration-500 hover:shadow-2xl border border-stone-300/40"
          >
            {/* FULL BACKGROUND IMAGE */}
            <img
              src={centerHero.imageUrl}
              alt={centerHero.altText}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Deep Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90 pointer-events-none" />

            {/* Top Metadata */}
            <div className="z-10 relative flex items-center justify-between">
              <span className="text-xs font-mono font-medium tracking-wide text-white/90 drop-shadow-sm">
                {centerHero.meta}
              </span>
              <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="z-10 relative space-y-3.5 max-w-lg">
              <span className="inline-block text-xs font-semibold tracking-wider px-3.5 py-1 rounded-full bg-white text-stone-900 shadow-md">
                {centerHero.badge}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-md">
                {centerHero.headline}
              </h3>
            </div>
          </Link>
        </div>

        {/* ================= COLUMN 3: RIGHT STACK (Cards 4 & 5) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Card 4: Top Right with Full Background Image */}
          <Link
            to={card4.link}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-7 h-[250px] sm:h-[270px] transition-all duration-500 hover:shadow-xl border border-stone-300/40"
          >
            {/* FULL BACKGROUND IMAGE */}
            <img
              src={card4.imageUrl}
              alt={card4.altText}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25 pointer-events-none" />

            <div className="z-10 relative flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-wide text-stone-200">
                {card4.meta}
              </span>
              <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="z-10 relative space-y-2">
              <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-stone-900 shadow-xs">
                {card4.badge}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-white line-clamp-2 drop-shadow-sm">
                {card4.headline}
              </h3>
            </div>
          </Link>

          {/* Card 5: Bottom Right with Full Background Image */}
          <Link
            to={card5.link}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-7 h-[250px] sm:h-[270px] transition-all duration-500 hover:shadow-xl border border-stone-300/40"
          >
            {/* FULL BACKGROUND IMAGE */}
            <img
              src={card5.imageUrl}
              alt={card5.altText}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            {/* Rich Terracotta / Accent Tinted Gradient for Card 5 matching reference emphasis */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#822432]/95 via-black/55 to-black/30 pointer-events-none" />

            <div className="z-10 relative flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-wide text-rose-200">
                {card5.meta}
              </span>
              <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="z-10 relative space-y-2">
              <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-white text-stone-900 shadow-xs">
                {card5.badge}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-white line-clamp-2 drop-shadow-sm">
                {card5.headline}
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
