import React, { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "react-router";

/**
 * FAQ DATASET FOR BEYOND INTERIORS
 * Matches brand terminology and includes warranty & care specifications.
 */
export const FAQ_ITEMS = [
  {
    id: 1,
    question: "How does the warranty work?",
    answer:
      "The warranty is eligible for all types of manufacturing defects in the product. To know the warranty period and warranty terms, please refer to the warranty description on the product page on www.beyondinteriors.in\nRepair, Replacement or Cancellation of the product under the warranty period is subject to review on the basis of nature of the damage/defect.\nReplacement will be provided only in case the product is non repairable after review with our technical team.",
  },
  {
    id: 2,
    question: "How should I care for Beyond Interiors furniture & fabrics?",
    answer:
      "All our upholstered collections and solid wood pieces are crafted with premium protective coatings. For everyday care, dust with a microfiber cloth and keep away from direct moisture. Detailed care guides and fabric-specific maintenance kits are included with every delivery.",
  },
  {
    id: 3,
    question: "How do I book a site visit and professional installation?",
    answer:
      "You can request an on-site consultation directly through our Services portal or during checkout. Our certified interior specialist coordinates with precision laser measurement tools and physical material swatches to assess wall structures and ensure flawless architectural fitment before dispatch.",
  },
  {
    id: 4,
    question: "Do you offer bulk, commercial, or studio orders?",
    answer:
      "Yes, absolutely. We work closely with architects, interior studios, hospitality brands, and corporate workspaces. We offer customized volume tiers, bespoke architectural sizing, commercial-grade fabric certifications, and turnkey project management for large-scale fitouts.",
  },
  {
    id: 5,
    question: "What payment methods do you accept for orders?",
    answer:
      "To ensure maximum transparency on bespoke and high-value furnishings, BEYOND INTERIORS strictly operates on verified offline payments. You can pay with Cash on Delivery (COD), Direct Bank Transfer (NEFT/RTGS), or Cheque upon delivery and on-site physical inspection.",
  },
  {
    id: 6,
    question: "How long does shipping, delivery, and installation take?",
    answer:
      "Ready-to-ship lighting, rugs, and artisan home decor are dispatched within 2–4 business days. Custom handcrafted furniture, modular kitchens, and fluted wall panel suites require 10–18 business days for tailored fabrication, followed by a coordinated 1-day turnkey installation.",
  },
];

const FaqSection = ({ faqs = FAQ_ITEMS, className = "" }) => {
  // Default first item (warranty) open as in reference image
  const [openId, setOpenId] = useState(1);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={`w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 ${className}`}>
      <div className="w-full">
        {/* ================= SECTION HEADER ================= */}
        <div className="mb-10 sm:mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
            <span>Questions you might </span>
            <span className="text-[#C0623A] uppercase font-bold tracking-wider">
              ASK
            </span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-stone-500 mt-2 max-w-xl font-light">
            Everything you need to know about purchasing interior collections, scheduling site
            visits, warranties, and our certified installation process.
          </p>
        </div>

        {/* ================= FULL WIDTH FAQ LIST ACCORDION (Exact Reference Match) ================= */}
        <div className="w-full space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="border-b border-stone-200/90 pb-4 transition-colors"
              >
                {/* QUESTION ACCORDION ROW */}
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left py-2.5 flex items-center justify-between gap-4 transition-colors cursor-pointer group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-sans text-base sm:text-lg font-medium text-[#C0623A] group-hover:opacity-85 transition-opacity">
                    {faq.question}
                  </span>

                  {/* MINUS (OPEN) / PLUS (CLOSED) ACCORDION ICON */}
                  <span className="flex-shrink-0 text-[#C0623A] transition-transform duration-200">
                    {isOpen ? (
                      <Minus className="w-5 h-5 stroke-[2]" />
                    ) : (
                      <Plus className="w-5 h-5 stroke-[2] text-stone-400 group-hover:text-[#C0623A]" />
                    )}
                  </span>
                </button>

                {/* EXPANDED ANSWER CONTENT */}
                {isOpen && (
                  <div className="pt-2 pb-3 pr-4 sm:pr-10 animate-fadeIn">
                    <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed font-normal whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need More Help Footer Link */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 border-t border-stone-100 mt-8">
          <span className="font-light">
            Still have queries regarding warranties, installation, or custom bespoke orders?
          </span>
          <Link
            to="/support"
            className="inline-flex items-center gap-1.5 font-semibold text-[#A73D4D] hover:text-[#C0623A] transition-colors"
          >
            <span>Contact Support Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
