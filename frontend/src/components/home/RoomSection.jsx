import React, { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

/**
 * SHOP BY ROOM CONFIGURATION FOR BEYOND INTERIORS
 * Evocative room concepts with coordinated furnishings, lighting, wall panels, and installation.
 * Replace any `imageUrl` with admin room curation banners.
 */
export const ROOM_COLLECTIONS = [
  {
    id: "living-room",
    title: "The Living Sanctuary",
    tagline: "ARCHITECTURAL PROPORTIONS",
    description:
      "Sculptural bouclé sofas, acoustic fluted oak wall slats, travertine cocktail tables, and ambient architectural lighting.",
    includes: ["Custom Upholstery", "Acoustic Wall Panels", "Ambient Sconces", "On-site Fitting"],
    link: "/products?category=furniture",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    altText: "Curated Luxury Living Room Sanctuary",
  },
  {
    id: "master-bedroom",
    title: "The Master Suite",
    tagline: "TACTILE TRANQUILITY",
    description:
      "Low-profile upholstered platform beds, floor-to-ceiling Belgian sheer curtains, tactile wool rugs, and warm diffused sconces.",
    includes: ["Bespoke Bed Frames", "Motorised Linen Curtains", "New Zealand Wool Rugs", "Site Survey"],
    link: "/products?category=furniture",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    altText: "Bespoke Master Bedroom Suite",
  },
  {
    id: "dining-room",
    title: "The Dining Gallery",
    tagline: "TIMELESS ENTERTAINING",
    description:
      "Handcrafted solid walnut dining tables, organic ceramic vessels, minimalist dining chairs, and statement pendant centerpieces.",
    includes: ["Solid Wood Dining Tables", "Sculptural Chairs", "Statement Lighting", "Leveling & Setup"],
    link: "/products?category=furniture",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    altText: "Artisan Dining Room Gallery",
  },
  {
    id: "modular-kitchen",
    title: "The Culinary Atelier",
    tagline: "ERGONOMIC ELEGANCE",
    description:
      "Seamless soft-close cabinetry, sintered stone countertops, integrated task illumination, and splashback wall treatments.",
    includes: ["Bespoke Cabinet Units", "Quartz/Sintered Tops", "Integrated Lighting", "Turnkey Fitting"],
    link: "/products?category=modular-kitchen",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    altText: "Architectural Modular Kitchen Atelier",
  },
  {
    id: "home-office",
    title: "The Executive Study",
    tagline: "FOCUSED SERENITY",
    description:
      "Monolithic wooden executive desks, ergonomic statement seating, acoustic dampening wall slats, and bespoke shelving.",
    includes: ["Monolithic Desks", "Acoustic Wall Panels", "Modular Wall Storage", "Cable Management"],
    link: "/products?category=furniture",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    altText: "Executive Study and Home Office",
  },
  {
    id: "spa-bathroom",
    title: "The Wellness Spa",
    tagline: "MINIMALIST REJUVENATION",
    description:
      "Fluted timber vanities, monolithic carved stone basins, brushed champagne brassware, and waterproof decorative wall panels.",
    includes: ["Fluted Vanities", "Carved Stone Basins", "Brushed Brass Fixtures", "Certified Plumbing"],
    link: "/products?category=bathroom-products",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    altText: "Wellness Spa Bathroom",
  },
];

const RoomSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalRooms = ROOM_COLLECTIONS.length;
  const activeRoom = ROOM_COLLECTIONS[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalRooms) % totalRooms);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalRooms);
  };

  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 my-10 overflow-hidden">
      {/* ================= TOP EDITORIAL HEADER (Reference Exact Match) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 sm:mb-16">
        {/* Top-Left: Large Bold Uppercase Editorial Headline */}
        <div className="lg:col-span-7">
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-stone-900 leading-[1.08]">
            CURATE YOUR <br />
            SANCTUARY ROOM <br />
            BY ROOM
          </h2>
        </div>

        {/* Top-Right: Editorial Narrative Text & Navigation Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
          <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg">
            At <strong>BEYOND INTERIORS</strong>, we don’t merely sell individual pieces — we curate
            complete, architecturally unified room concepts. Select any space to explore coordinated
            furniture, ambient lighting, designer wall coverings, and luxury flooring with
            professional on-site measurement, site visits, and end-to-end installation.
          </p>

          <div className="flex items-center justify-between">
            {/* Navigation Arrows */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrev}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
                aria-label="Previous room"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-800 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-105 active:scale-95"
                aria-label="Next room"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3D PERSPECTIVE GALLERY / CAROUSEL (Reference Match) ================= */}
      <div className="relative w-full py-4 overflow-hidden">
        {/* Perspective Container */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 min-h-[440px] sm:min-h-[520px] md:min-h-[580px] perspective-[1200px]">
          {ROOM_COLLECTIONS.map((room, index) => {
            // Distance from active card (-2, -1, 0, 1, 2)
            const distance = (index - activeIndex + totalRooms) % totalRooms;
            let offset = distance;
            if (offset > totalRooms / 2) offset -= totalRooms;

            // Only display cards within visible window (-2 to +2)
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            const isCenter = offset === 0;
            const isLeft = offset < 0;
            const isRight = offset > 0;

            // 3D Perspective Transformation parameters mirroring reference image
            let transformStyles = "";
            let zIndex = 10;
            let opacity = 1;
            let widthClass = "w-[240px] sm:w-[320px] md:w-[380px] lg:w-[440px]";
            let heightClass = "h-[420px] sm:h-[490px] md:h-[550px]";

            if (isCenter) {
              transformStyles = "scale-100 rotate-y-0 translate-z-0";
              zIndex = 30;
              opacity = 1;
            } else if (isLeft) {
              const deg = offset === -1 ? 14 : 22;
              transformStyles = `scale-90 rotate-y-[${deg}deg] -translate-x-3 sm:-translate-x-6`;
              zIndex = offset === -1 ? 20 : 10;
              opacity = offset === -1 ? 0.75 : 0.45;
              widthClass = "w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px]";
              heightClass = "h-[360px] sm:h-[430px] md:h-[480px]";
            } else if (isRight) {
              const deg = offset === 1 ? -14 : -22;
              transformStyles = `scale-90 -rotate-y-[${deg}deg] translate-x-3 sm:translate-x-6`;
              zIndex = offset === 1 ? 20 : 10;
              opacity = offset === 1 ? 0.75 : 0.45;
              widthClass = "w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px]";
              heightClass = "h-[360px] sm:h-[430px] md:h-[480px]";
            }

            return (
              <div
                key={room.id}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-shrink-0 cursor-pointer rounded-[32px] sm:rounded-[40px] overflow-hidden transition-all duration-700 ease-out shadow-xl border border-stone-200/60 ${widthClass} ${heightClass} ${transformStyles}`}
                style={{
                  zIndex,
                  opacity,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* ROOM PHOTOGRAPHY */}
                <img
                  src={room.imageUrl}
                  alt={room.altText}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />

                {/* Ambient Soft Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                {/* Card Content Overlay */}
                <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-between z-10 text-white">
                  {/* Top Badge */}
                  <div>
                    <span className="inline-block text-[10px] sm:text-xs font-mono font-medium tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/20">
                      {room.tagline}
                    </span>
                  </div>

                  {/* Bottom Room Info */}
                  <div className="space-y-2.5">
                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-tight drop-shadow-sm">
                      {room.title}
                    </h3>

                    {isCenter && (
                      <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 font-light leading-relaxed drop-shadow-xs hidden sm:block">
                        {room.description}
                      </p>
                    )}

                    {isCenter && (
                      <div className="pt-2 flex items-center gap-2">
                        <Link
                          to={room.link}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-stone-900 hover:bg-stone-100 text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <span>Explore Room</span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-700" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoomSection;
