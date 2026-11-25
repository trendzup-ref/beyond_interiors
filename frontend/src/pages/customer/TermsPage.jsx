import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Compass,
  ArrowLeft,
  FileCheck,
  UserCheck,
  ShoppingBag,
  CreditCard,
  Ruler,
  Wrench,
  Truck,
  ShieldAlert,
  Scale,
  Mail,
  Search,
} from "lucide-react";

/**
 * Replace this hero banner image link with your admin banner in the future
 */
export const TERMS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85";

export const TERMS_SECTIONS = [
  { id: "intro", label: "Agreement to Terms", icon: FileCheck },
  { id: "eligibility", label: "Client Accounts", icon: UserCheck },
  { id: "orders", label: "Orders & Bespoke Specs", icon: ShoppingBag },
  { id: "payments", label: "Offline Payment Terms", icon: CreditCard },
  { id: "site-visits", label: "Site Surveys & Visits", icon: Ruler },
  { id: "installation", label: "Certified Installation", icon: Wrench },
  { id: "delivery", label: "Delivery & Returns", icon: Truck },
  { id: "intellectual", label: "Intellectual Property", icon: ShieldAlert },
  { id: "liability", label: "Warranties & Liability", icon: Scale },
  { id: "contact", label: "Governing Law & Contact", icon: Mail },
];

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState("intro");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = TERMS_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(TERMS_SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(TERMS_SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* ================= HERO HEADER BANNER (Reference Exact Match) ================= */}
      <header className="relative w-full rounded-b-[32px] sm:rounded-b-[44px] overflow-hidden bg-stone-950 text-white shadow-xl">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={TERMS_HERO_IMAGE}
            alt="Beyond Interiors Architectural Craftsmanship"
            className="w-full h-full object-cover opacity-40 filter brightness-90 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Top Navbar Inside Hero */}
        <div className="relative z-20 max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-serif text-base font-bold tracking-wider text-white">
              BEYOND INTERIORS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-200">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/products" className="hover:text-white transition-colors">Catalog</Link>
            <Link to="/services" className="hover:text-white transition-colors">Installation</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Explore Products</span>
            </Link>
          </div>
        </div>

        {/* Center Hero Title & Subtitle */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-mono tracking-widest uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>TERMS OF SERVICE & CLIENT CHARTER</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Terms of Service
          </h1>

          <p className="font-sans text-stone-200 text-xs sm:text-base font-light max-w-xl mx-auto">
            Terms Governing Product Purchases, Site Visits, and Certified Turnkey Installation
          </p>

          <p className="text-[11px] font-mono text-stone-400 tracking-wider pt-2">
            LAST UPDATED: <span className="text-white font-semibold">NOVEMBER 24, 2026</span>
          </p>
        </div>
      </header>

      {/* ================= 2-COLUMN MAIN BODY (Reference Exact Match) ================= */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* LEFT COLUMN: TABLE OF CONTENTS (Sticky Sidebar) */}
          <aside className="lg:col-span-3 sticky top-6 self-start space-y-3 bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="border-b border-stone-200/80 pb-3">
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-stone-500 block">
                Table of contents
              </span>
            </div>

            <nav className="space-y-1">
              {TERMS_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;

                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                      isActive
                        ? "bg-stone-900 text-white shadow-xs"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-stone-400"}`} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-stone-200/80">
              <Link
                to="/privacy-policy"
                className="text-xs font-semibold text-[#A73D4D] hover:underline flex items-center justify-between"
              >
                <span>Read Privacy Policy</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </aside>

          {/* RIGHT COLUMN: EDITORIAL TERMS CONTENT */}
          <div className="lg:col-span-9 space-y-12 sm:space-y-16 max-w-4xl">
            {/* 1. AGREEMENT */}
            <section id="intro" className="space-y-4 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                1. Agreement to Terms
              </h2>
              <div className="space-y-3.5 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  Welcome to <strong>BEYOND INTERIORS</strong>. These Terms of Service constitute a legally
                  binding agreement between you ("Customer", "Client") and BEYOND INTERIORS regarding your
                  use of our website, product purchases, pre-purchase site visit bookings, and on-site certified
                  installation services.
                </p>
                <p>
                  By registering an account, ordering products, or scheduling site visits, you agree to comply
                  with these terms in their entirety.
                </p>
              </div>
            </section>

            {/* 2. CLIENT ACCOUNTS */}
            <section id="eligibility" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                2. Client Accounts & Security
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  To place orders, track shipments, or request certified installation, customers must create an
                  account. You agree to provide accurate, truthful, and updated contact and delivery address details.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                  <li>You are solely responsible for maintaining the confidentiality of your account credentials.</li>
                  <li>Notify us immediately of any unauthorized account activity.</li>
                  <li>We reserve the right to suspend or terminate accounts that breach our service terms or engage in fraudulent activities.</li>
                </ul>
              </div>
            </section>

            {/* 3. ORDERS & BESPOKE SPECS */}
            <section id="orders" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                3. Product Orders & Custom Made-to-Order Specs
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  We strive to present our architectural finishes, upholstery colors, and wood grains with the
                  highest fidelity. However, as our solid woods and stones are natural materials, subtle organic
                  grain variations and dye-lot tolerances are characteristic of authentic craftsmanship.
                </p>
                <p>
                  For customized furniture, cut-to-size wall panels, and bespoke wallpapers, production commences
                  only after order verification. Custom dimensional pieces cannot be canceled once workshop
                  cutting or upholstery framing is underway.
                </p>
              </div>
            </section>

            {/* 4. OFFLINE PAYMENT TERMS */}
            <section id="payments" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                4. Strictly Offline Payment Terms
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  To provide absolute peace of mind on high-value bespoke interior furnishings, BEYOND INTERIORS
                  strictly operates on verified offline payment methods:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-stone-200">
                    <strong className="text-stone-900 block text-xs font-serif font-bold">Cash on Delivery (COD)</strong>
                    <span className="text-[11px] text-stone-500">Payable directly upon physical delivery and inspection.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-stone-200">
                    <strong className="text-stone-900 block text-xs font-serif font-bold">Bank Transfer (NEFT/RTGS)</strong>
                    <span className="text-[11px] text-stone-500">Direct account transfer upon dispatch confirmation.</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-stone-200">
                    <strong className="text-stone-900 block text-xs font-serif font-bold">Cheque Payment</strong>
                    <span className="text-[11px] text-stone-500">Payable upon delivery subject to standard bank clearance.</span>
                  </div>
                </div>
                <p className="text-xs text-stone-500 pt-1">Official physical and digital tax invoices are provided upon payment verification.</p>
              </div>
            </section>

            {/* 5. SITE SURVEYS */}
            <section id="site-visits" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                5. Pre-Purchase Site Surveys & Measurement Visits
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  Customers may schedule an on-site visit for precision laser measurements and architectural
                  consultation before finalizing their order:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                  <li>An authorized representative must be present at the site during the scheduled appointment window.</li>
                  <li>Our specialists assess structural wall soundness, electrical access points, and elevator/stairway clearances.</li>
                  <li>Site survey measurements remain the basis for custom fabrication tolerances.</li>
                </ul>
              </div>
            </section>

            {/* 6. CERTIFIED INSTALLATION */}
            <section id="installation" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                6. Certified On-Site Installation Services
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  Certified installation is carried out by trained Beyond Interiors technicians. The client agrees to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                  <li>Ensure the installation site has active electrical power, clean floor clearance, and adequate illumination.</li>
                  <li>Inspect the completed work alongside our lead technician and sign off on the turnkey completion receipt.</li>
                  <li>Notify the team immediately if any adjustment or touch-up is needed during the visit.</li>
                </ul>
              </div>
            </section>

            {/* 7. DELIVERY & RETURNS */}
            <section id="delivery" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                7. Delivery, Returns & Replacements
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  Delivery timelines and return eligibility are governed by our dedicated{" "}
                  <Link to="/shipping-policy" className="text-amber-700 font-semibold hover:underline">
                    Shipping Policy
                  </Link>{" "}
                  and{" "}
                  <Link to="/return-policy" className="text-amber-700 font-semibold hover:underline">
                    Return & Refund Policy
                  </Link>
                  . Customers have 7 days from delivery to request a return or replacement for transit-damaged or
                  manufacturing-defective items.
                </p>
              </div>
            </section>

            {/* 8. INTELLECTUAL PROPERTY */}
            <section id="intellectual" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                8. Intellectual Property Rights
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  All content, trademarks, logos, architectural 3D room compositions, photography, and bespoke
                  product blueprints published on this website are the proprietary intellectual property of
                  BEYOND INTERIORS and are protected under copyright and trademark laws.
                </p>
              </div>
            </section>

            {/* 9. WARRANTIES & LIABILITY */}
            <section id="liability" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                9. Warranties & Limitation of Liability
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  BEYOND INTERIORS warrants that all products delivered will be free from structural defects for the
                  warranty period specified per product category. Our warranty does not cover normal wear and tear,
                  accidental spills, unauthorized modifications, or third-party structural relocations.
                </p>
              </div>
            </section>

            {/* 10. GOVERNING LAW & CONTACT */}
            <section id="contact" className="space-y-4 border-t border-stone-200 pt-8 pb-12 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                10. Governing Law & Dispute Resolution
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  These Terms are governed by and construed in accordance with the laws of India. Any disputes
                  arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in India.
                </p>
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-2 text-stone-800">
                  <p className="font-serif font-bold text-base text-stone-900">BEYOND INTERIORS — Legal Concierge</p>
                  <p>Email: <span className="font-mono text-amber-800 font-semibold">legal@beyondinteriors.com</span></p>
                  <p>Phone: <span className="font-mono">+91 (0) 800-BEYOND-LEG</span></p>
                  <p>Website: <span className="font-mono">www.beyondinteriors.in</span></p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-stone-200 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500">
        <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif font-bold text-stone-900 tracking-wider">BEYOND INTERIORS</p>
          <p>&copy; {new Date().getFullYear()} Beyond Interiors. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <Link to="/terms" className="text-amber-700 font-bold">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-stone-700">Privacy Policy</Link>
            <Link to="/shipping-policy" className="hover:text-stone-700">Shipping</Link>
            <Link to="/return-policy" className="hover:text-stone-700">Returns</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;
