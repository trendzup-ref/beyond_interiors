import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

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
  autoPlayInterval = 3000,
}) => {
  const totalSlides = slides.length;
  const extendedSlides = totalSlides > 1 ? [...slides, slides[0]] : slides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const activeDotIndex = currentIndex % totalSlides;

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Autoplay every 3 seconds
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev < totalSlides ? prev + 1 : prev));
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides, autoPlayInterval]);

  const handleTransitionEnd = () => {
    if (currentIndex === totalSlides) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  if (!totalSlides) return null;

  return (
    <section className="w-full max-w-[1520px] mx-auto px-3 sm:px-5 lg:px-8 py-3 sm:py-4 lg:py-5">
      {/* HERO BANNER */}
      <div
        className="
          relative w-full
          h-[320px]
          min-[480px]:h-[340px]
          sm:h-[360px]
          md:h-[380px]
          lg:h-[400px]
          xl:h-[430px]
          2xl:h-[460px]
          rounded-2xl sm:rounded-3xl lg:rounded-[32px]
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
        {/* HORIZONTAL INFINITE SLIDING TRACK */}
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex w-full h-full will-change-transform ${isTransitioning
              ? "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              : "transition-none"
            }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {extendedSlides.map((slide, index) => {
            const isActive = index === currentIndex;

            return (
              <div
                key={`${slide.id || index}-${index}`}
                className="relative w-full h-full shrink-0 overflow-hidden"
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
                    px-5 py-8
                    min-[480px]:px-7
                    sm:px-10 sm:py-10
                    md:px-12
                    lg:px-16
                    xl:px-20
                  "
                >
                  <div className="w-full max-w-[680px] space-y-2.5 sm:space-y-3.5 lg:space-y-4 pb-6">
                    {/* TAGLINE */}
                    <p
                      className="
                        text-[9px]
                        min-[480px]:text-[10px]
                        sm:text-xs
                        tracking-[0.2em]
                        sm:tracking-[0.25em]
                        font-medium text-white/80
                        uppercase
                      "
                    >
                      {slide.tagline}
                    </p>

                    {/* HEADING */}
                    <h1
                      className="
                        font-serif font-bold text-white
                        tracking-tight
                        leading-[1.02]
                        drop-shadow-md
                        text-[clamp(1.85rem,5vw,4.25rem)]
                      "
                    >
                      <span className="block font-medium opacity-90">
                        {slide.titleLine1}
                      </span>
                      <span className="block">{slide.titleLine2}</span>
                    </h1>

                    {/* SUBTITLE */}
                    <p
                      className="
                        font-sans
                        text-[clamp(0.75rem,1.3vw,1rem)]
                        text-stone-200
                        font-light
                        leading-relaxed
                        max-w-[480px]
                        drop-shadow-sm
                      "
                    >
                      {slide.subtitle}
                    </p>

                    {/* CTA BUTTONS */}
                    <div
                      className="
                        pt-1.5 sm:pt-2
                        flex flex-wrap
                        items-center
                        gap-2.5 sm:gap-3.5
                      "
                    >
                      <Link
                        to={slide.buttonLink || "/products"}
                        tabIndex={isActive ? 0 : -1}
                        className="
                          inline-flex items-center justify-center gap-2
                          px-4 py-2
                          sm:px-5 sm:py-2.5
                          lg:px-7 lg:py-3
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
                        <ChevronRight
                          className="
                            w-3.5 h-3.5 sm:w-4 sm:h-4
                            text-stone-700
                            transition-transform duration-200
                            group-hover/btn:translate-x-1
                          "
                        />
                      </Link>

                      <Link
                        to="/services"
                        tabIndex={isActive ? 0 : -1}
                        className="
                          inline-flex items-center justify-center
                          px-4 py-2
                          sm:px-5 sm:py-2.5
                          lg:px-6 lg:py-3
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
              </div>
            );
          })}
        </div>

        {/* FIXED PAGINATION DOTS */}
        {totalSlides > 1 && (
          <div
            className="
              absolute z-30
              bottom-4 sm:bottom-5 lg:bottom-6
              left-5 sm:left-10 lg:left-16 xl:left-20
              flex items-center gap-2
            "
          >
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => goToSlide(dotIdx)}
                className={`
                  h-1.5 sm:h-2 rounded-full
                  transition-all duration-300 cursor-pointer
                  ${dotIdx === activeDotIndex
                    ? "w-6 sm:w-9 bg-white shadow-md"
                    : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
                  }
                `}
                aria-label={`Go to slide ${dotIdx + 1}`}
                aria-current={dotIdx === activeDotIndex ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;