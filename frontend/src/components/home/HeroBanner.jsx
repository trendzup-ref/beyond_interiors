
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    titleLine1: "The",
    titleLine2: "Lounge Edit",
    subtitle:
      "Sculptural comfort and architectural craftsmanship tailored for modern living.",
    buttonText: "Shop the Look",
    buttonLink: "/products?category=furniture",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1920&q=85",
    altText: "The Lounge Edit - Curated interior living space",
    tagline: "CURATED LIVING ROOM COLLECTION",
  },
  {
    id: 2,
    titleLine1: "Bespoke",
    titleLine2: "Living Sanctuaries",
    subtitle:
      "Harmonious silhouettes and tactile materials designed for enduring elegance.",
    buttonText: "Explore Collection",
    buttonLink: "/products",
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85",
    altText: "Bespoke Living Sanctuaries - Architectural interior",
    tagline: "BESPOKE INTERIOR ARCHITECTURE",
  },
  {
    id: 3,
    titleLine1: "Artisan",
    titleLine2: "Dining Series",
    subtitle:
      "Handcrafted tables, organic ceramics, and lighting crafted for timeless gatherings.",
    buttonText: "Discover Dining",
    buttonLink: "/products?category=furniture",
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1920&q=85",
    altText: "Artisan Dining Series - Modern dining room interior",
    tagline: "HANDCRAFTED DINING & ENTERTAINING",
  },
];

const HeroBanner = ({
  slides = DEFAULT_HERO_SLIDES,
  autoPlayInterval = 6000,
}) => {
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

  // Autoplay slider
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, totalSlides, autoPlayInterval]);

  if (!totalSlides) return null;

  return (
    <section className="w-full max-w-[1520px] mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-5 lg:py-6">

      {/* HERO BANNER */}
      <div
        className="
          relative w-full
          h-[440px]
          min-[480px]:h-[460px]
          sm:h-[480px]
          md:h-[440px]
          lg:h-[500px]
          xl:h-[540px]
          2xl:h-[580px]
          rounded-2xl sm:rounded-3xl lg:rounded-[36px]
          overflow-hidden shadow-lg
          border border-stone-200/50 group
          isolate
        "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsPaused(false);
          }
        }}
      >
        {/* SLIDES */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id || index}
              className={`
                absolute inset-0 w-full h-full
                transition-all duration-1000 ease-in-out
                ${isActive
                  ? "opacity-100 z-10 scale-100"
                  : "opacity-0 z-0 pointer-events-none scale-105"
                }
              `}
              aria-hidden={!isActive}
            >
              {/* BACKGROUND IMAGE */}
              <img
                src={slide.imageUrl}
                alt={slide.altText}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
              />

              {/* GRADIENT OVERLAYS */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/5 pointer-events-none" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />

              {/* EDITORIAL CONTENT */}
              <div
                className="
                  absolute inset-0 z-20
                  flex flex-col justify-center
                  px-5 py-12
                  min-[480px]:px-7
                  sm:px-10 sm:py-14
                  md:px-12
                  lg:px-16
                  xl:px-20
                "
              >
                <div className="w-full max-w-[720px] space-y-4 sm:space-y-5 lg:space-y-6">

                  {/* TAGLINE */}
                  <p className="
                    text-[9px]
                    min-[480px]:text-[10px]
                    sm:text-xs
                    tracking-[0.2em]
                    sm:tracking-[0.25em]
                    font-medium text-white/80
                    uppercase
                  ">
                    {slide.tagline}
                  </p>

                  {/* HEADING */}
                  <h1
                    className="
                      font-serif font-bold text-white
                      tracking-tight
                      leading-[0.98]
                      drop-shadow-md
                      text-[clamp(2.5rem,7vw,5.5rem)]
                    "
                  >
                    <span className="block font-medium opacity-90">
                      {slide.titleLine1}
                    </span>

                    <span className="block">
                      {slide.titleLine2}
                    </span>
                  </h1>

                  {/* SUBTITLE */}
                  <p className="
                    font-sans
                    text-[clamp(0.75rem,1.5vw,1.125rem)]
                    text-stone-200
                    font-light
                    leading-relaxed
                    max-w-[500px]
                    drop-shadow-sm
                  ">
                    {slide.subtitle}
                  </p>

                  {/* CTA BUTTONS */}
                  <div className="
                    pt-2 sm:pt-3
                    flex flex-wrap
                    items-center
                    gap-2.5 sm:gap-4
                  ">
                    <Link
                      to={slide.buttonLink || "/products"}
                      className="
                        inline-flex items-center justify-center gap-2
                        px-4 py-2.5
                        sm:px-6 sm:py-3
                        lg:px-8 lg:py-3.5
                        rounded-full
                        bg-white text-stone-900
                        hover:bg-amber-50
                        text-[10px] sm:text-xs lg:text-sm
                        font-semibold tracking-wide
                        shadow-xl
                        transition-all duration-300
                        hover:scale-105 active:scale-95
                        group/btn
                        whitespace-nowrap
                      "
                    >
                      <span>{slide.buttonText}</span>

                      <ChevronRight className="
                        w-3.5 h-3.5 sm:w-4 sm:h-4
                        text-stone-700
                        transition-transform duration-200
                        group-hover/btn:translate-x-1
                      " />
                    </Link>

                    <Link
                      to="/services"
                      className="
                        inline-flex items-center justify-center
                        px-4 py-2.5
                        sm:px-5 sm:py-3
                        lg:px-6 lg:py-3.5
                        rounded-full
                        bg-black/30 backdrop-blur-md
                        hover:bg-black/50
                        text-white
                        text-[10px] sm:text-xs lg:text-sm
                        font-semibold tracking-wide
                        border border-white/20
                        transition-all duration-200
                        whitespace-nowrap
                      "
                    >
                      Book Installation
                    </Link>
                  </div>
                </div>
              </div>

              {/* PAGINATION DOTS */}
              <div className="
                absolute z-30
                bottom-5 sm:bottom-7 lg:bottom-9
                left-5 sm:left-10 lg:left-16 xl:left-20
                flex items-center gap-2.5
              ">
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => goToSlide(dotIdx)}
                    className={`
                      h-2 sm:h-2.5 rounded-full
                      transition-all duration-300
                      ${dotIdx === currentIndex
                        ? "w-7 sm:w-10 bg-white shadow-md"
                        : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/70"
                      }
                    `}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    aria-current={dotIdx === currentIndex ? "true" : undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* NAVIGATION ARROWS */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="
                absolute left-2 sm:left-5
                top-1/2 -translate-y-1/2
                z-40
                w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12
                rounded-full
                bg-white/25 hover:bg-white/90
                text-white hover:text-stone-900
                backdrop-blur-md
                flex items-center justify-center
                shadow-lg transition-all duration-200
                opacity-100 md:opacity-0 md:group-hover:opacity-100
              "
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="
                absolute right-2 sm:right-5
                top-1/2 -translate-y-1/2
                z-40
                w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12
                rounded-full
                bg-white/25 hover:bg-white/90
                text-white hover:text-stone-900
                backdrop-blur-md
                flex items-center justify-center
                shadow-lg transition-all duration-200
                opacity-100 md:opacity-0 md:group-hover:opacity-100
              "
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
