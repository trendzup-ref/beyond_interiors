import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Compass,
  ArrowLeft,
  FileText,
  Database,
  Eye,
  Share2,
  Lock,
  UserCheck,
  Cookie,
  Mail,
  Shield,
  Search,
  CheckCircle2,
  Calendar,
} from "lucide-react";

/**
 * Replace this hero banner image link with your admin banner in the future
 */
export const PRIVACY_HERO_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85";

export const PRIVACY_SECTIONS = [
  { id: "intro", label: "Introduction", icon: FileText },
  { id: "collection", label: "Data Collection", icon: Database },
  { id: "usage", label: "How We Use Data", icon: Eye },
  { id: "sharing", label: "Data Sharing", icon: Share2 },
  { id: "security", label: "Data Security", icon: Lock },
  { id: "rights", label: "Your Rights", icon: UserCheck },
  { id: "cookies", label: "Cookies & Tracking", icon: Cookie },
  { id: "contact", label: "Contact Us", icon: Mail },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("intro");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = PRIVACY_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(PRIVACY_SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(PRIVACY_SECTIONS[i].id);
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
        {/* Background Image with Dark & Warm Amber Atmospheric Vignette */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={PRIVACY_HERO_IMAGE}
            alt="Beyond Interiors Architectural Space"
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
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
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

        {/* Center Hero Title & Subtitle (Reference Match) */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-mono tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>TRANSPARENCY & PRIVACY ASSURANCE</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Privacy Policy
          </h1>

          <p className="font-sans text-stone-200 text-xs sm:text-base font-light max-w-xl mx-auto">
            How We Collect, Use, and Protect Your Personal Information
          </p>

          <p className="text-[11px] font-mono text-stone-400 tracking-wider pt-2">
            EFFECTIVE DATE: <span className="text-white font-semibold">NOVEMBER 24, 2026</span>
          </p>
        </div>
      </header>

      {/* ================= 2-COLUMN MAIN BODY (Reference Exact Match) ================= */}
      <main className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* LEFT COLUMN: TABLE OF CONTENTS (Sticky Navigation Sidebar) */}
          <aside className="lg:col-span-3 sticky top-6 self-start space-y-3 bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="border-b border-stone-200/80 pb-3">
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-stone-500 block">
                Table of contents
              </span>
            </div>

            <nav className="space-y-1">
              {PRIVACY_SECTIONS.map((sec) => {
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
                to="/terms"
                className="text-xs font-semibold text-[#A73D4D] hover:underline flex items-center justify-between"
              >
                <span>Read Terms of Service</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </aside>

          {/* RIGHT COLUMN: EDITORIAL PRIVACY CONTENT */}
          <div className="lg:col-span-9 space-y-12 sm:space-y-16 max-w-4xl">
            {/* SECTION 1: WELCOME & INTRODUCTION */}
            <section id="intro" className="space-y-4 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Welcome to our privacy policy!
              </h2>
              <div className="space-y-3.5 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  At <strong>BEYOND INTERIORS</strong>, we consider your home sanctuary and your personal
                  privacy with the highest degree of respect. This Privacy Policy details how we collect,
                  safeguard, utilize, and manage your personal data when you explore our ecommerce
                  platform, schedule on-site site visits, purchase architectural products, or book
                  certified installation services.
                </p>
                <p>
                  By accessing our platform or utilizing our services, you acknowledge the practices
                  described in this policy. Our commitment to safeguarding your data is rooted in our
                  dedication to transparency, security, and client trust.
                </p>
              </div>
            </section>

            {/* SECTION 2: DATA COLLECTION */}
            <section id="collection" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Data Collection:
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    1. Information You Provide Directly:
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-stone-600">
                    <li>
                      <strong>Contact & Account Information:</strong> When you register an account,
                      we collect your full name, email address, password, and 10-digit mobile phone number.
                    </li>
                    <li>
                      <strong>Delivery & Site Visit Addresses:</strong> House/flat numbers, street, landmark,
                      city, state, and PIN code required for laser site measurements, freight delivery, and installation.
                    </li>
                    <li>
                      <strong>Custom Architectural Preferences:</strong> Room dimensions, fabric finishes,
                      preferred wood stains, and bespoke notes communicated to our design concierge.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    2. Automatically Collected Information:
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-stone-600">
                    <li>
                      <strong>Device & Log Data:</strong> IP address, browser type, operating system, and
                      timestamps of interactions to maintain security and prevent fraudulent access.
                    </li>
                    <li>
                      <strong>Analytics & Session Data:</strong> Page browsing activity, catalog searches, and
                      interaction with product 3D configurations to improve platform ergonomics.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    3. Offline Payment & Transaction Records:
                  </h3>
                  <p>
                    Since Beyond Interiors operates on verified offline payments (Cash on Delivery, Direct Bank
                    Transfer, and Cheque upon delivery), we record transaction confirmation references and
                    billing receipts without storing sensitive credit/debit card numbers on our servers.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 3: HOW WE USE DATA */}
            <section id="usage" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                How We Use Your Information:
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>We process your data strictly for legitimate operational and customer fulfillment purposes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/70 space-y-1">
                    <span className="font-serif font-bold text-sm text-stone-900 block">Order Fulfillment</span>
                    <p className="text-xs text-stone-500">Fabricating bespoke furniture, cutting wallpapers/panels, and doorstep delivery.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/70 space-y-1">
                    <span className="font-serif font-bold text-sm text-stone-900 block">Installation Coordination</span>
                    <p className="text-xs text-stone-500">Dispatching certified technicians for laser surveys, assembly, and turnkey fitment.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/70 space-y-1">
                    <span className="font-serif font-bold text-sm text-stone-900 block">Order Tracking & Updates</span>
                    <p className="text-xs text-stone-500">Sending SMS, email, and live status milestone notifications via your account.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/70 space-y-1">
                    <span className="font-serif font-bold text-sm text-stone-900 block">Concierge Support</span>
                    <p className="text-xs text-stone-500">Handling inquiries, custom finish recommendations, and return/warranty requests.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: DATA SHARING */}
            <section id="sharing" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Data Sharing & Third Parties:
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  <strong>We do NOT sell, rent, or trade your personal information.</strong> We only share
                  essential details with trusted partners under strict confidentiality agreements:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-stone-600">
                  <li>
                    <strong>Certified Installation Technicians:</strong> Handover of property address and contact
                    phone number to execute on-site measurements and scheduled installations.
                  </li>
                  <li>
                    <strong>Freight & Logistics Partners:</strong> Delivery details necessary to transport large,
                    heavy furniture and delicate fixtures to your doorstep safely.
                  </li>
                  <li>
                    <strong>Legal & Regulatory Authorities:</strong> Only when strictly mandated by applicable laws,
                    subpoenas, or judicial enforcement.
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 5: DATA SECURITY */}
            <section id="security" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Data Security & Retention:
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  We implement robust technical and organizational safeguards including bcrypt cryptographic
                  password hashing (cost factor 12), SSL/TLS end-to-end data encryption, HTTP-only secure cookie
                  handling, and role-based access restrictions ensuring only authorized personnel access client records.
                </p>
                <p>
                  We retain personal data only for as long as necessary to maintain active customer accounts,
                  comply with statutory audit obligations, and guarantee ongoing product warranties.
                </p>
              </div>
            </section>

            {/* SECTION 6: YOUR RIGHTS */}
            <section id="rights" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Your Rights & Controls:
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>As a valued client of Beyond Interiors, you maintain full control over your personal data:</p>
                <ul className="list-disc pl-5 space-y-2 text-stone-600">
                  <li><strong>Review & Update:</strong> Modify your profile name, phone number, and delivery addresses from your Account dashboard.</li>
                  <li><strong>Password Change:</strong> Securely update your account credentials at any time.</li>
                  <li><strong>Account Deletion:</strong> Request full erasure of your account and archived personal data.</li>
                  <li><strong>Communication Preferences:</strong> Opt out of promotional newsletters while retaining vital transactional updates.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 7: COOKIES */}
            <section id="cookies" className="space-y-4 border-t border-stone-200 pt-8 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Cookies & Tracking Technologies:
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  Our website utilizes essential functional cookies and secure session tokens to authenticate
                  users, preserve shopping bag items, and remember your preferred display settings.
                </p>
                <p>
                  You can configure your browser to decline non-essential cookies; however, authentication and
                  catalog checkout functionality may be impacted.
                </p>
              </div>
            </section>

            {/* SECTION 8: CONTACT INFORMATION */}
            <section id="contact" className="space-y-4 border-t border-stone-200 pt-8 pb-12 scroll-mt-28">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Contact Information:
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                <p>
                  If you have questions, grievances, or requests regarding this Privacy Policy or your personal
                  records, please contact our Privacy Grievance Officer:
                </p>
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-2 text-stone-800">
                  <p className="font-serif font-bold text-base text-stone-900">BEYOND INTERIORS — Privacy Desk</p>
                  <p>Email: <span className="font-mono text-amber-800 font-semibold">privacy@beyondinteriors.com</span></p>
                  <p>Phone: <span className="font-mono">+91 (0) 800-BEYOND-PVT</span></p>
                  <p>Operating Hours: Monday – Saturday, 9:30 AM to 6:30 PM IST</p>
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
            <Link to="/privacy-policy" className="text-amber-700 font-bold">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-stone-700">Terms of Service</Link>
            <Link to="/shipping-policy" className="hover:text-stone-700">Shipping</Link>
            <Link to="/return-policy" className="hover:text-stone-700">Returns</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
