import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import Lenis from "lenis";
import {
  Compass,
  ArrowLeft,
  ChevronDown,
  RotateCcw,
  CheckCircle,
  XCircle,
  FileText,
  CreditCard,
  RefreshCw,
  Ban,
  Wrench,
  Truck,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
} from "lucide-react";

/**
 * Replace this image link with your admin banner / inspection workshop photo in future
 */
export const RETURN_BG_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85";

export const RETURN_SECTIONS = [
  {
    id: "eligibility",
    number: "01",
    label: "Eligibility",
    title: "Return Eligibility",
    icon: CheckCircle,
    summary:
      "Requests must be initiated within 7 days of delivery with unused items in original packaging and proof of purchase.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          Customers can request a return or replacement within <strong>7 days of delivery</strong>,
          provided the product meets the eligibility criteria below:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-200">
          <li>The product must be unused and in its pristine original condition.</li>
          <li>Returned with complete original packaging, brand tags, accessories, and included hardware.</li>
          <li>Must not exhibit signs of installation, assembly, modification, or post-delivery damage.</li>
          <li>Valid order ID or proof of purchase must be submitted.</li>
        </ul>
        <p className="text-xs text-stone-400">All return requests undergo preliminary inspection and approval by our quality desk.</p>
      </div>
    ),
  },
  {
    id: "eligible-products",
    number: "02",
    label: "Eligible Cases",
    title: "Products Eligible for Return",
    icon: ShieldCheck,
    summary:
      "Full replacement or refund coverage for transit damage, manufacturing defects, mismatched models, or missing parts.",
    content: (
      <div className="space-y-4 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>Returns and replacements are accepted under the following verified circumstances:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">Transit Damage</span>
            <p className="text-xs text-stone-200 mt-1">Physical impact or breakage during transportation and crating.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">Manufacturing Defect</span>
            <p className="text-xs text-stone-200 mt-1">Material flaws, structural weakness, or functional non-performance.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">Incorrect Product</span>
            <p className="text-xs text-stone-200 mt-1">Product delivered differs in model, finish, or design from your confirmed order.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">Missing Components</span>
            <p className="text-xs text-stone-200 mt-1">Essential hardware, installation brackets, or modular pieces missing.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "non-returnable",
    number: "03",
    label: "Exclusions",
    title: "Non-Returnable Products",
    icon: XCircle,
    summary:
      "Customized made-to-order furniture, cut-to-size wallpapers, modified materials, or already-installed products.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>For hygiene, customization, and architectural reasons, certain items are non-returnable:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-200">
          <li>Customized or made-to-order furniture fabricated to bespoke dimensions or custom finishes.</li>
          <li>Cut-to-size wallpapers, flooring planks, drapery fabrics, or custom acoustic panels.</li>
          <li>Products that have been installed, assembled, anchored, painted, or altered.</li>
          <li>Items damaged due to improper handling, moisture, or unauthorized assembly post-delivery.</li>
          <li>Products missing mandatory packaging required for safe transport.</li>
        </ul>
        <p className="text-xs text-stone-400">This exclusion does not affect statutory consumer remedies for defective products.</p>
      </div>
    ),
  },
  {
    id: "how-to-request",
    number: "04",
    label: "Steps",
    title: "How to Request a Return",
    icon: FileText,
    summary:
      "Simple 5-step process through your My Orders dashboard with photo/video upload and technician inspection.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>Follow our structured 5-step return workflow:</p>
        <div className="space-y-2 pt-1">
          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <strong className="text-amber-400 font-mono text-xs block">STEP 1: Log in to Your Account</strong>
            <span className="text-xs text-stone-200">Navigate to My Orders and locate the item you wish to return.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <strong className="text-amber-400 font-mono text-xs block">STEP 2: Submit Return Request</strong>
            <span className="text-xs text-stone-200">Select the item and specify your reason for requesting a return or replacement.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <strong className="text-amber-400 font-mono text-xs block">STEP 3: Upload Evidence</strong>
            <span className="text-xs text-stone-200">Attach clear photos/videos of the product defect, damage, and packaging labels.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <strong className="text-amber-400 font-mono text-xs block">STEP 4: Review & Approval</strong>
            <span className="text-xs text-stone-200">Our quality desk assesses the request within 24–48 hours.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <strong className="text-amber-400 font-mono text-xs block">STEP 5: Pickup & Verification</strong>
            <span className="text-xs text-stone-200">Our logistics team schedules collection and physical verification before refund/replacement.</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "refund",
    number: "05",
    label: "Refunds",
    title: "Refund Policy & Timelines",
    icon: CreditCard,
    summary:
      "Since Beyond Interiors supports verified offline payments, approved refunds are coordinated via Direct Bank Transfer or UPI.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          Once a return is received and verified, refunds are coordinated directly with the customer
          according to original payment records:
        </p>
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
          <p className="text-xs uppercase font-mono text-amber-400 font-semibold">Refund Coordination Methods:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-stone-200">
            <li>Direct Bank Transfer (NEFT / RTGS).</li>
            <li>Direct Verified UPI Transfer.</li>
            <li>Another mutually confirmed resolution method.</li>
          </ul>
        </div>
        <p className="text-stone-300 text-xs sm:text-sm">
          Refund processing commences within <strong>5–7 business days</strong> following completion of inspection.
          Credit reflects based on your banking institution’s clearing cycle.
        </p>
      </div>
    ),
  },
  {
    id: "replacement",
    number: "06",
    label: "Replacement",
    title: "Replacement Policy",
    icon: RefreshCw,
    summary:
      "Priority dispatch for verified defective or transit-damaged products subject to workshop inventory.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          If your product arrives damaged or defective, you are eligible for an immediate replacement
          subject to product availability and verification.
        </p>
        <p className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-stone-200">
          🔄 If an identical piece is out of stock or requires extended workshop fabrication, our design
          concierge will propose premium alternatives or process a full refund.
        </p>
      </div>
    ),
  },
  {
    id: "cancellation",
    number: "07",
    label: "Cancellations",
    title: "Cancellation Policy",
    icon: Ban,
    summary:
      "Orders can be canceled prior to dispatch. Made-to-order items are subject to workshop production stage.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          Customers may request order cancellation any time before the product has been dispatched
          from our warehouse.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-200">
          <li>Once an order is shipped, standard cancellation is no longer possible.</li>
          <li>Custom made-to-order pieces carry cancellation restrictions once wood cutting, framing, or fabric stitching has commenced.</li>
          <li>Approved cancellations will be processed back via the agreed payment method.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "installation-services",
    number: "08",
    label: "Installation",
    title: "Installation Services Policy",
    icon: Wrench,
    summary:
      "Service bookings are treated separately from product purchases. Rescheduling is available prior to service day.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>Installation bookings are managed as dedicated architectural services:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-200">
          <li>Installation appointments may be rescheduled or cancelled before the technician dispatches.</li>
          <li>Once on-site installation work has been completed and verified, service fees are non-refundable.</li>
          <li>Product-related quality inquiries are handled independently under our product return policy.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "return-shipping",
    number: "09",
    label: "Freight",
    title: "Return Shipping Charges",
    icon: Truck,
    summary:
      "Beyond Interiors covers reverse logistics for confirmed damaged, defective, or incorrect shipments.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          For approved returns involving transit damage, manufacturing faults, or mismatched deliveries,
          <strong> BEYOND INTERIORS covers 100% of reverse logistics costs</strong>.
        </p>
        <p className="text-xs text-stone-400">
          For discretionary returns where permissible, return handling and crating fees will be
          clearly communicated before return pickup is scheduled.
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    number: "10",
    label: "Contact",
    title: "Contact Concierge Desk",
    icon: Mail,
    summary:
      "Dedicated assistance for return claims, inspection scheduling, and refund coordination.",
    content: (
      <div className="space-y-4 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>For questions regarding returns, replacements, cancellations, or refunds, contact us:</p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-white">
            <Mail className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm">returns@beyondinteriors.com</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Phone className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm">+91 (0) 800-BEYOND-RET</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm">www.beyondinteriors.in</span>
          </div>
        </div>
        <p className="text-xs text-stone-400 pt-2 border-t border-white/10">
          We appreciate your understanding and are committed to making your shopping experience reliable, transparent, and refined.
        </p>
      </div>
    ),
  },
];

const ReturnPolicy = () => {
  const [activeSectionId, setActiveSectionId] = useState("eligibility");
  const lenisRef = useRef(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const animId = requestAnimationFrame(raf);

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;
      for (let i = RETURN_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(RETURN_SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(RETURN_SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScroll);
      lenis.destroy();
    };
  }, []);

  const scrollToSection = (id) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${id}`, { offset: -20, duration: 1.2 });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-stone-950 text-white font-sans selection:bg-amber-500 selection:text-white">
      {/* ================= FIXED BACKGROUND IMAGE ================= */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={RETURN_BG_IMAGE}
          alt="Beyond Interiors Quality & Inspection Atelier"
          className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-transparent to-stone-950/80" />
      </div>

      {/* ================= TOP NAVIGATION BAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/70 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-stone-300 hover:text-white text-xs font-semibold transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center group-hover:bg-amber-600 transition-colors">
              <ArrowLeft className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-sm tracking-wider uppercase font-bold text-white">
              BEYOND INTERIORS
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-medium text-stone-400 uppercase tracking-widest hidden sm:inline">
              ASSURANCE FRAMEWORK
            </span>
            <Link
              to="/shipping-policy"
              className="text-xs font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              View Shipping Policy &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= TOP-LEFT SQUARES NAVIGATION CONTROLLER ================= */}
      <div className="fixed top-24 left-4 sm:left-8 z-40 hidden md:flex flex-col gap-1.5 p-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 shadow-2xl">
        <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 text-center py-1">
          SECTIONS
        </span>
        <div className="grid grid-cols-2 gap-1.5 max-h-[65vh] overflow-y-auto no-scrollbar">
          {RETURN_SECTIONS.map((sec) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                title={`${sec.number}: ${sec.title}`}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/40 scale-105 border border-amber-400"
                    : "bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white border border-white/10"
                }`}
              >
                {sec.number}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= PAGE HERO HEADER ================= */}
      <header className="relative z-10 pt-36 sm:pt-44 pb-16 px-4 sm:px-8 max-w-[1520px] mx-auto md:pl-36">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-mono tracking-widest uppercase">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>CUSTOMER ASSURANCE & RESOLUTION FRAMEWORK</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Return & Refund Policy
          </h1>

          <p className="text-xs sm:text-sm font-mono text-stone-400 tracking-wider">
            LAST UPDATED: <span className="text-white font-semibold">NOVEMBER 24, 2026</span>
          </p>

          <p className="font-sans text-stone-300 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl pt-2">
            At <strong>BEYOND INTERIORS</strong>, we want every product you purchase to become a cherished,
            enduring part of your living sanctuary. We meticulously inspect every piece before dispatch.
            However, if a product arrives damaged, defective, or incorrect, our concierge team is here to ensure
            a smooth and transparent resolution.
          </p>
        </div>
      </header>

      {/* ================= 10 FULL-HEIGHT POLICY SECTIONS ================= */}
      <main className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-8 md:pl-36 pb-32 space-y-16 sm:space-y-24">
        {RETURN_SECTIONS.map((section, idx) => {
          const Icon = section.icon;

          return (
            <section
              key={section.id}
              id={section.id}
              className="relative min-h-[75vh] sm:min-h-[82vh] flex flex-col justify-end py-12 sm:py-16 scroll-mt-28"
            >
              {/* SCROLL-DRIVEN MOTION TEXT CONTAINER */}
              <motion.div
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl space-y-6 bg-black/60 backdrop-blur-xl p-6 sm:p-10 md:p-12 rounded-3xl border border-white/15 shadow-2xl"
              >
                {/* Section Index & Category Pill */}
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg sm:text-xl font-bold text-amber-400">
                      {section.number}
                    </span>
                    <span className="text-stone-500">/</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-300 font-semibold">
                      {section.label}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-amber-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Section Title */}
                <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-snug">
                  {section.title}
                </h2>

                {/* Section Summary Highlight */}
                <p className="text-sm sm:text-base font-medium text-amber-300/90 leading-relaxed">
                  {section.summary}
                </p>

                {/* Deep Full Policy Content */}
                <div className="pt-2">{section.content}</div>

                {/* Bottom Action Pill matching reference */}
                <div className="pt-4 flex items-center justify-between border-t border-white/10 text-xs text-stone-400">
                  <span className="font-mono">Section {idx + 1} of 10</span>
                  <button
                    onClick={() => {
                      const next = RETURN_SECTIONS[(idx + 1) % RETURN_SECTIONS.length];
                      scrollToSection(next.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-stone-200 hover:text-stone-900 transition-colors font-semibold"
                  >
                    <span>Next Section</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </section>
          );
        })}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 bg-stone-950 border-t border-white/10 py-10 px-4 sm:px-8 text-xs text-stone-500 text-center">
        <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif font-bold text-white tracking-wider">BEYOND INTERIORS</p>
          <p>&copy; {new Date().getFullYear()} Beyond Interiors. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <Link to="/shipping-policy" className="hover:text-white">Shipping</Link>
            <Link to="/return-policy" className="text-amber-400 font-semibold">Returns & Refunds</Link>
            <Link to="/" className="hover:text-white">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReturnPolicy;
