import React, { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "react-router";

/**
 * FAQ DATASET FOR BEYOND INTERIORS
 * Replace `DEFAULT_FAQ_IMAGE` with your admin-uploaded image in the future.
 */
export const DEFAULT_FAQ_IMAGE =
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80";

export const FAQ_ITEMS = [
  {
    id: 1,
    question: "How should I care for Beyond Interiors furniture & fabrics?",
    answer:
      "All our upholstered collections and solid wood pieces are crafted with premium protective coatings. For everyday care, dust with a microfiber cloth and keep away from direct moisture. Detailed care guides and fabric-specific maintenance kits are included with every delivery.",
  },
  {
    id: 2,
    question: "How do I book a site visit and professional installation?",
    answer:
      "You can request an on-site consultation directly through our Services portal or during checkout. Our certified interior specialist visits your property with precision laser measurement tools and physical material swatches to assess wall structures and ensure flawless architectural fitment before dispatch.",
  },
  {
    id: 3,
    question: "Do you offer bulk, commercial, or studio orders?",
    answer:
      "Yes, absolutely. We work closely with architects, interior studios, hospitality brands, and corporate workspaces. We offer customized volume tiers, bespoke architectural sizing, commercial-grade fabric certifications, and turnkey project management for large-scale fitouts.",
  },
  {
    id: 4,
    question: "What payment methods do you accept for orders?",
    answer:
      "To ensure maximum transparency on bespoke and high-value furnishings, BEYOND INTERIORS strictly operates on verified offline payments. You can pay with Cash on Delivery (COD), Direct Bank Transfer (NEFT/RTGS), or Cheque upon delivery and on-site physical inspection.",
  },
  {
    id: 5,
    question: "Are your materials and finishes eco-friendly & non-toxic?",
    answer:
      "Yes. We prioritize sustainable European hardwoods, OEKO-TEX certified Belgian linens, natural plant-based wood waxes, and low-VOC acoustic wall panel backing. Every material is selected to promote a healthy, toxin-free indoor atmosphere.",
  },
  {
    id: 6,
    question: "How long does shipping, delivery, and installation take?",
    answer:
      "Ready-to-ship lighting, rugs, and artisan home decor are dispatched within 2–4 business days. Custom handcrafted furniture, modular kitchens, and fluted wall panel suites require 10–18 business days for tailored fabrication, followed by a coordinated 1-day turnkey installation.",
  },
];

const FaqSection = ({
  faqImage = DEFAULT_FAQ_IMAGE,
  faqs = FAQ_ITEMS,
  className = "",
}) => {
  // Default to item 3 open (matching reference image where the 3rd question is expanded)
  const [openId, setOpenId] = useState(3);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={`w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 ${className}`}>
      {/* OUTER CARD CONTAINER WITH SOFT WARM AMBIENT BACKGROUND */}
      <div className="relative w-full rounded-3xl sm:rounded-[36px] bg-[#FAF7F2] border border-stone-200/70 p-6 sm:p-10 md:p-14 lg:p-16 overflow-hidden shadow-xs">
        {/* ================= SECTION HEADER (Reference Exact Match) ================= */}
        <div className="mb-10 sm:mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
            <span>Questions you might </span>
            <span className="text-[#F25A1A] uppercase font-bold tracking-wider">
              ASK
            </span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 mt-2 max-w-xl font-light">
            Everything you need to know about purchasing interior collections, scheduling site
            visits, and our certified installation process.
          </p>
        </div>

        {/* ================= TWO-COLUMN GRID: ARCH IMAGE (LEFT) + ACCORDION (RIGHT) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: ARCHITECTURAL ARCHED IMAGE + WATERMARK (Reference Exact Match) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Watermark Lettering Behind the Arch (Reference Match "SOMA" style) */}
            <div
              className="absolute -top-6 -right-4 sm:-right-8 select-none pointer-events-none font-serif text-6xl sm:text-8xl md:text-9xl font-bold text-[#E8DFD3]/60 tracking-wider leading-none z-0"
              aria-hidden="true"
            >
              BEYOND
            </div>

            {/* DISTINCTIVE ARCHED IMAGE CONTAINER (Curved top-left arch like reference) */}
            <div className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] h-[380px] sm:h-[450px] md:h-[480px] rounded-tl-[140px] sm:rounded-tl-[160px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl overflow-hidden shadow-xl border-4 border-white/80">
              <img
                src={faqImage}
                alt="Beyond Interiors Architectural Space with Linen Drapery"
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                loading="lazy"
              />

              {/* Ambient Warm Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Subtle Overlay Tag */}
              <div className="absolute bottom-4 left-4 right-4 z-20 text-center">
                <span className="inline-block text-[11px] font-mono tracking-widest uppercase text-white/95 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  ARCHITECTURAL HARMONY
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACCORDION FAQ LIST (Reference Exact Match) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-300 border ${
                    isOpen
                      ? "bg-[#F3EDE3] border-stone-300/80 shadow-xs"
                      : "bg-transparent hover:bg-stone-100/60 border-transparent"
                  }`}
                >
                  {/* QUESTION BUTTON */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left py-4 sm:py-5 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`font-serif text-base sm:text-lg font-bold leading-snug transition-colors ${
                        isOpen ? "text-stone-950" : "text-stone-800 hover:text-stone-950"
                      }`}
                    >
                      {faq.question}
                    </span>

                    {/* PLUS / MINUS TOGGLE ICON (Reference Exact Match) */}
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isOpen
                          ? "bg-stone-900 text-white"
                          : "bg-stone-200/80 text-stone-700 hover:bg-stone-300"
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {/* ACCORDION ANSWER CONTENT */}
                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-1 animate-fadeIn">
                      <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Need More Help Footer Link */}
            <div className="pt-4 px-4 flex items-center justify-between text-xs text-stone-500">
              <span className="font-light">Still have queries regarding installation or custom orders?</span>
              <Link
                to="/services"
                className="inline-flex items-center gap-1 font-semibold text-[#A73D4D] hover:underline"
              >
                <span>Contact Design Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
