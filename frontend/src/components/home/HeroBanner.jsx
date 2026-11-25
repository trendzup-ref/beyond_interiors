import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronRight, ChevronLeft } from "lucide-react";

/**
 * HERO BANNER SLIDES CONFIGURATION
 * Full background images with absolute editorial text overlays.
 * Replace any `imageUrl` with banners you post from the admin panel.
 */
export const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    titleLine1: "The",
    titleLine2: "Lounge Edit",
    subtitle: "Sculptural comfort and architectural craftsmanship tailored for modern living.",
    buttonText: "Shop the Look",
    buttonLink: "/products?category=furniture",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1920&q=85",
    altText: "The Lounge Edit - Curated interior living space",
    tagline: "CURATED LIVING ROOM COLLECTION",
  },
  {
    id: 2,
    titleLine1: "Bespoke",
    titleLine2: "Living Sanctuaries",
    subtitle: "Harmonious silhouettes and tactile materials designed for enduring elegance.",
    buttonText: "Explore Collection",
    buttonLink: "/products",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85",
    altText: "Bespoke Living Sanctuaries - Architectural interior",
    tagline: "BESPOKE INTERIOR ARCHITECTURE",
  },
  {
    id: 3,
    titleLine1: "Artisan",
    titleLine2: "Dining Series",
    subtitle: "Handcrafted tables, organic ceramics, and lighting crafted for timeless gatherings.",
    buttonText: "Discover Dining",
    buttonLink: "/products?category=furniture",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1920&q=85",
    altText: "Artisan Dining Series - Modern dining room interior",
    tagline: "HANDCRAFTED DINING & ENTERTAINING",
  },
];

const HeroBanner = ({ slides = DEFAULT_HERO_SLIDES, autoPlayInterval = 6000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Continuous loop with pause on hover
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, totalSlides, autoPlayInterval]);

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Outer Banner Card with Large Rounded Corners & Expansive Width */}
      <div
        className="relative w-full h-[500px] sm:h-[580px] md:h-[640px] lg:h-[700px] rounded-3xl sm:rounded-[36px] overflow-hidden shadow-lg border border-stone-200/50 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slide Transitions */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${isActive
                  ? "opacity-100 z-10 scale-100"
                  : "opacity-0 z-0 pointer-events-none scale-105"
                }`}
              aria-hidden={!isActive}
            >
              {/* FULL BACKGROUND IMAGE (No separate card, fills entire hero container) */}
              <img
                src={slide.imageUrl}
                alt={slide.altText}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out"
                loading={index === 0 ? "eager" : "lazy"}
              />

              {/* Sophisticated Dual Gradient Overlay for Impeccable Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* ABSOLUTE EDITORIAL TEXT OVERLAY */}
              <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-10 md:p-16 lg:p-20">
                {/* Top Tagline */}
                <div>
                  <span className="inline-block text-[10px] sm:text-xs font-mono font-semibold tracking-widest uppercase text-amber-300/90 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    {slide.tagline}
                  </span>
                </div>

                {/* Center / Lower-Left Editorial Typography & CTA */}
                <div className="max-w-xl md:max-w-2xl space-y-4 sm:space-y-6">
                  <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-md">
                    <span className="block font-medium opacity-90">
                      {slide.titleLine1}
                    </span>
                    <span className="block">{slide.titleLine2}</span>
                  </h1>

                  <p className="font-sans text-stone-200 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-lg drop-shadow-sm">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2 sm:pt-4 flex items-center gap-4">
                    <Link
                      to={slide.buttonLink || "/products"}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-stone-900 hover:bg-amber-50 text-xs sm:text-sm font-semibold tracking-wide shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
                    >
                      <span>{slide.buttonText}</span>
                      <ChevronRight className="w-4 h-4 text-stone-700 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Link>

                    <Link
                      to="/services"
                      className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/20 transition-all duration-200"
                    >
                      <span>Book Installation</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom Left Pagination Dots */}
                <div className="flex items-center gap-2.5 pt-4">
                  {slides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => goToSlide(dotIdx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${dotIdx === currentIndex
                          ? "w-8 sm:w-10 bg-white shadow-md"
                          : "w-2.5 bg-white/40 hover:bg-white/70 backdrop-blur-xs"
                        }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous / Next Arrow Controls (Visible on hover) */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/90 text-white hover:text-stone-900 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/90 text-white hover:text-stone-900 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
