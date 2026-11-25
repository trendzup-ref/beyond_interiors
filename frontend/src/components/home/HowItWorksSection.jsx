import React from "react";
import { Link } from "react-router";
import { ArrowRight, CheckCircle2, Ruler, Palette, Wrench } from "lucide-react";

/**
 * HOW IT WORKS CONFIGURATION FOR BEYOND INTERIORS
 * Replace any `imageUrl` with your own step photos uploaded as Admin.
 */
export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Explore & Book Site Visit",
    subtitle: "DISCOVERY & MEASUREMENT",
    description:
      "Browse our curated catalog of furniture, lighting, wallpapers, and finishes. Request a professional on-site visit where our specialists take laser measurements and understand your lifestyle needs.",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
    altText: "Architect and designer reviewing floor plans and material swatches",
    icon: Ruler,
    highlight: "Free Site Measurement",
  },
  {
    step: "02",
    title: "Customize & Finalize Specs",
    subtitle: "MATERIAL & 3D PLANNING",
    description:
      "Select bespoke upholstery fabrics, wood veneers, and modular dimensions. Review technical specs and realistic architectural visualizations to ensure every detail fits your space with millimetric precision.",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    altText: "Architectural 3D render and customized modular layout planning",
    icon: Palette,
    highlight: "Custom Tailored Finishes",
  },
  {
    step: "03",
    title: "Delivery & Certified Installation",
    subtitle: "TURNKEY CRAFTSMANSHIP",
    description:
      "Sit back while our master craftsmen and certified technicians handle doorstep delivery, precision wall-mounting, and turnkey fitment. Inspect your completed sanctuary and pay via verified offline payment.",
    // Replace with your admin image URL
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
    altText: "Flawlessly completed luxury interior space ready for modern living",
    icon: Wrench,
    highlight: "Certified Precision Fitting",
  },
];

const HowItWorksSection = ({ steps = HOW_IT_WORKS_STEPS }) => {
  return (
    <section className="w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      {/* ================= SECTION HEADER (Reference Exact Match) ================= */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-2.5">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
          How it Works
        </h2>
        <p className="font-sans text-xs sm:text-sm md:text-base text-stone-500 font-light leading-relaxed">
          Here’s how Beyond Interiors brings your architectural dream space to life — from curated
          product selection to certified on-site installation.
        </p>
      </div>

      {/* ================= 3-STEP PROCESS CARDS (Reference Exact Match) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative">
        {steps.map((item, index) => {
          const IconComponent = item.icon;
          const isNotLast = index < steps.length - 1;

          return (
            <div key={item.step} className="relative flex flex-col group">
              {/* UPPER IMAGE CONTAINER (Large rounded corners, generous aspect ratio) */}
              <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 shadow-md border border-stone-200/60">
                <img
                  src={item.imageUrl}
                  alt={item.altText}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  loading="lazy"
                />

                {/* Subtle Ambient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                {/* Subtle highlight pill at top right of image */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-900 text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider uppercase shadow-xs">
                    <IconComponent className="w-3 h-3 text-amber-700" />
                    <span>{item.highlight}</span>
                  </span>
                </div>
              </div>

              {/* FLOATING OVERLAPPING WHITE CONTENT CARD (Reference Exact Match) */}
              <div className="relative -mt-10 sm:-mt-14 mx-3 sm:mx-5 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-100 flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                {/* CIRCULAR STEP NUMBER BADGE OVERLAPPING TOP EDGE */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-stone-200 text-stone-800 font-bold text-sm sm:text-base flex items-center justify-center shadow-md -mt-12 sm:-mt-14 mb-3 sm:mb-4 group-hover:border-amber-600 group-hover:text-amber-700 transition-colors">
                  {item.step}
                </div>

                {/* STEP TITLE */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* STEP DESCRIPTION */}
                <p className="font-sans text-xs sm:text-sm text-stone-500 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              {/* HORIZONTAL DASHED CONNECTOR ARROW (Visible on desktop between steps) */}
              {isNotLast && (
                <div className="hidden md:flex items-center justify-center absolute top-[68%] -right-4 lg:-right-6 z-20 pointer-events-none text-amber-500/70">
                  <div className="w-6 lg:w-8 border-t-2 border-dashed border-amber-500/50" />
                  <ArrowRight className="w-3.5 h-3.5 -ml-1 text-amber-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <div className="mt-14 sm:mt-16 bg-[#F8F5F0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
            Ready to transform your home with Beyond Interiors?
          </h4>
          <p className="font-sans text-xs sm:text-sm text-stone-500">
            Book an on-site consultation or explore our luxury collections with certified installation included.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <span>Book Site Visit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm tracking-wide border border-stone-300 shadow-xs transition-colors"
          >
            <span>Explore Products</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
