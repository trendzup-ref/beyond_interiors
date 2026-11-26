
import React, { useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useInView } from "motion/react";

// Reusable motion component
const MotionLink = motion(Link);

/**
 * 10 CATEGORIES CONFIGURATION
 * Original categories, images, text and ordering preserved.
 */
export const CATEGORY_PAGES = [
  [
    {
      id: "furniture",
      name: "Furniture",
      meta: "140+ Products · Handcrafted",
      badge: "Living & Lounge",
      headline: "Architectural Living: Handcrafted Sofas & Sculptural Lounge Seating",
      link: "/products?category=furniture",
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      altText: "Handcrafted Luxury Furniture",
    },
    {
      id: "lighting",
      name: "Lighting",
      meta: "85+ Fixtures · Site Fitting",
      badge: "Architectural Lights",
      headline: "Ambient Illumination: Sculptural Pendants, Sconces & Floor Lamps",
      link: "/products?category=lighting",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
      altText: "Architectural Ambient Lighting",
    },
    {
      id: "wallpapers",
      name: "Wallpapers",
      meta: "260+ Patterns · Professional Pasting",
      badge: "Wall Artistry",
      headline: "Textured Murals & Botanicals: Transform Walls into Tactile Masterpieces",
      link: "/products?category=wallpapers",
      imageUrl: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=85",
      altText: "Designer Textured Wallpapers",
    },
    {
      id: "wall-panels",
      name: "Wall Panels",
      meta: "75+ Finishes · Acoustic Damping",
      badge: "Fluted & Slat Panels",
      headline: "Acoustic Slats & Fluted Panels: Contemporary Dimensional Depth",
      link: "/products?category=wall-panels",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56c0?auto=format&fit=crop&w=1200&q=80",
      altText: "Fluted Wood Wall Panels",
    },
    {
      id: "flooring",
      name: "Flooring",
      meta: "95+ Options · Certified Laying",
      badge: "Hardwood & Stone",
      headline: "Engineered Oak & Herringbone: Timeless Foundations for Refined Living",
      link: "/products?category=flooring",
      imageUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80",
      altText: "Engineered Hardwood Flooring",
    },
  ],
  [
    {
      id: "curtains-and-blinds",
      name: "Curtains and Blinds",
      meta: "120+ Fabrics · Precision Fit",
      badge: "Window Couture",
      headline: "Custom Drapery: Sheer Belgian Linens & Motorised Acoustic Blinds",
      link: "/products?category=curtains-and-blinds",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      altText: "Custom Curtains and Blinds",
    },
    {
      id: "home-decor",
      name: "Home Decor",
      meta: "190+ Accents · Handcrafted",
      badge: "Artisan Accents",
      headline: "Sculptural Accents: Ceramic Vessels, Trays & Minimalist Tableware",
      link: "/products?category=home-decor",
      imageUrl: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
      altText: "Artisan Home Decor Accents",
    },
    {
      id: "modular-kitchen",
      name: "Modular Kitchen",
      meta: "Bespoke Units · Full Survey",
      badge: "Culinary Sanctuaries",
      headline: "Architectural Kitchens: Seamless Cabinetry, Quartz Tops & Island Units",
      link: "/products?category=modular-kitchen",
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85",
      altText: "Bespoke Modular Kitchen",
    },
    {
      id: "rugs-and-carpets",
      name: "Rugs and Carpets",
      meta: "110+ Weaves · NZ Virgin Wool",
      badge: "Artisanal Weaves",
      headline: "Textured Floor Art: High-Pile Berber & Hand-Knotted Wool Carpets",
      link: "/products?category=rugs-and-carpets",
      imageUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80",
      altText: "Handcrafted Rugs and Carpets",
    },
    {
      id: "bathroom-products",
      name: "Bathroom Products",
      meta: "130+ Fixtures · Plumber Ready",
      badge: "Spa & Wellness",
      headline: "Wellness Sanctuaries: Fluted Vanities, Stone Basins & Brass Hardware",
      link: "/products?category=bathroom-products",
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      altText: "Luxury Bathroom Products",
    },
  ],
];

// Animation configuration
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Reusable category card
const CategoryCard = ({ category, size = "small", accent = false }) => {
  const isLarge = size === "large";

  return (
    <MotionLink
      to={category.link}
      variants={cardVariants}
      className={`group relative w-full rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between border border-stone-300/40 transition-shadow duration-500 hover:shadow-xl ${isLarge
          ? "h-full p-7 sm:p-9"
          : "h-[250px] sm:h-[270px] p-6 sm:p-7"
        }`}
    >
      <img
        src={category.imageUrl}
        alt={category.altText}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      <div
        className={`absolute inset-0 pointer-events-none ${isLarge
            ? "bg-gradient-to-b from-black/60 via-black/20 to-black/90"
            : accent
              ? "bg-gradient-to-t from-[#822432]/95 via-black/55 to-black/30"
              : "bg-gradient-to-t from-black/90 via-black/45 to-black/25"
          }`}
      />

      {/* Top metadata */}
      <div className="z-10 relative flex items-center justify-between">
        <span
          className={`${isLarge
              ? "text-xs font-mono text-white/90"
              : accent
                ? "text-[11px] text-rose-200"
                : "text-[11px] text-stone-200"
            } font-medium tracking-wide`}
        >
          {category.meta}
        </span>

        <span
          className={`rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isLarge ? "w-9 h-9" : "w-7 h-7"
            } ${isLarge ? "" : "opacity-0 group-hover:opacity-100"
            }`}
        >
          <ArrowUpRight className={isLarge ? "w-4 h-4" : "w-3.5 h-3.5"} />
        </span>
      </div>

      {/* Bottom editorial content */}
      <div className={`z-10 relative ${isLarge ? "space-y-3.5 max-w-lg" : "space-y-2"}`}>
        <span
          className={`inline-block font-semibold tracking-wider rounded-full bg-white text-stone-900 shadow-sm ${isLarge
              ? "text-xs px-3.5 py-1"
              : "text-[10px] sm:text-[11px] px-2.5 py-0.5"
            }`}
        >
          {category.badge}
        </span>

        <h3
          className={`font-serif font-bold text-white leading-snug drop-shadow-md ${isLarge
              ? "text-2xl sm:text-3xl md:text-4xl"
              : "text-base sm:text-lg line-clamp-2"
            }`}
        >
          {category.headline}
        </h3>
      </div>
    </MotionLink>
  );
};

const CategorySection = () => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sectionRef = useRef(null);

  // Initial viewport animation happens only once.
  const hasEntered = useInView(sectionRef, {
    once: true,
    amount: 0.15,
  });

  const totalPages = CATEGORY_PAGES.length;
  const currentCategories = CATEGORY_PAGES[activePageIndex];

  const handlePageChange = (newIndex) => {
    if (
      newIndex === activePageIndex ||
      isTransitioning
    ) {
      return;
    }

    setIsTransitioning(true);
    setActivePageIndex(newIndex);
  };

  const nextCategories = () => {
    handlePageChange((activePageIndex + 1) % totalPages);
  };

  const prevCategories = () => {
    handlePageChange(
      (activePageIndex - 1 + totalPages) % totalPages
    );
  };

  const [card1, card2, centerHero, card4, card5] = currentCategories;

  return (
    <section
      ref={sectionRef}
      className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
    >
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
            Shop by Category
          </h2>

          <p className="font-sans text-xs sm:text-sm text-stone-500 max-w-2xl mt-1.5 leading-relaxed">
            From architectural lighting and bespoke furniture to acoustic wall panels and certified installation services, explore high-end collections tailored for discerning interiors.
          </p>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={prevCategories}
            disabled={isTransitioning}
            className="w-10 h-10 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous 5 categories"
            title="Previous categories"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextCategories}
            disabled={isTransitioning}
            className="w-10 h-10 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next 5 categories"
            title="Next categories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animated category grid */}
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          // The new grid will now animate in.
        }}
      >
        <motion.div
          key={activePageIndex}
          variants={containerVariants}
          initial="hidden"
          animate={hasEntered ? "visible" : "hidden"}
          exit="exit"
          onAnimationComplete={(definition) => {
            if (definition === "visible") {
              setIsTransitioning(false);
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6"
        >
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
            <CategoryCard category={card1} />
            <CategoryCard category={card2} />
          </div>

          {/* CENTER FEATURED CARD */}
          <div className="md:col-span-2 lg:col-span-5 h-[480px] sm:h-[540px] lg:h-full">
            <CategoryCard category={centerHero} size="large" />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
            <CategoryCard category={card4} />
            <CategoryCard category={card5} accent />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default CategorySection;
