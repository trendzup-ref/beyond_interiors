import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import Lenis from "lenis";
import {
  Compass,
  ArrowLeft,
  ChevronDown,
  Truck,
  Clock,
  Calendar,
  DollarSign,
  PackageCheck,
  MapPin,
  AlertTriangle,
  CloudRain,
  Wrench,
  Mail,
  Phone,
  Globe,
  ArrowUpRight,
} from "lucide-react";

/**
 * Replace this image link with your admin banner / warehouse photo in future
 */
export const SHIPPING_BG_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=85";

export const SHIPPING_SECTIONS = [
  {
    id: "coverage",
    number: "01",
    label: "Coverage",
    title: "Shipping Coverage",
    icon: MapPin,
    summary:
      "We currently deliver products across serviceable locations throughout India with PIN code verification.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          We currently aim to deliver products across serviceable locations in India. Delivery
          availability may vary depending on the product category, delivery address, product
          dimensions, and logistics partner availability.
        </p>
        <p className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-stone-200">
          📍 <strong>PIN Code Check:</strong> Customers can verify delivery availability and estimated
          timelines by providing their PIN code during browsing or at checkout.
        </p>
      </div>
    ),
  },
  {
    id: "processing",
    number: "02",
    label: "Processing",
    title: "Order Processing Time",
    icon: Clock,
    summary:
      "Orders are processed within 1–3 business days. Made-to-order furnishings require tailored craftsmanship preparation.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>Once an order is successfully placed, our fulfillment team begins processing it immediately:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-200">
          <li>Standard items are generally processed within 1–3 business days.</li>
          <li>Processing time may vary depending on item availability and inventory location.</li>
          <li>Handcrafted furniture, custom upholstery, and made-to-order items require additional preparation time.</li>
          <li>Orders placed on Sundays or public holidays are processed on the next business day.</li>
        </ul>
        <p>You will receive an order confirmation email and SMS once your order has been registered.</p>
      </div>
    ),
  },
  {
    id: "delivery-time",
    number: "03",
    label: "Timelines",
    title: "Estimated Delivery Time",
    icon: Calendar,
    summary:
      "Indicative timelines ranging from 5–10 days for home décor up to 10–21 days for large bespoke furniture.",
    content: (
      <div className="space-y-4 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>Delivery timelines depend on the product category, destination, availability, and transportation requirements:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">Home Décor & Accents</span>
            <span className="text-lg font-serif font-bold text-white">5–10 Business Days</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">Lighting & Fixtures</span>
            <span className="text-lg font-serif font-bold text-white">5–12 Business Days</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">Wallpapers & Flooring</span>
            <span className="text-lg font-serif font-bold text-white">7–15 Business Days</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold block">Furniture & Large Suites</span>
            <span className="text-lg font-serif font-bold text-white">10–21 Business Days</span>
          </div>
        </div>
        <p className="text-xs text-stone-400">These are indicative timelines and may vary depending on the destination PIN code.</p>
      </div>
    ),
  },
  {
    id: "charges",
    number: "04",
    label: "Charges",
    title: "Shipping Charges",
    icon: DollarSign,
    summary:
      "Transparent fee calculation displayed at checkout based on weight, volume, and special white-glove logistics.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          Shipping charges, if applicable, are transparently displayed during checkout before your
          order is placed. Costs are computed based on:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-200">
          <li>Delivery location and distance from distribution hub.</li>
          <li>Product dimensions, volumetric weight, and crating needs.</li>
          <li>Number of products ordered in a single consignment.</li>
          <li>Special architectural handling or freight lift requirements.</li>
        </ul>
        <p className="text-amber-300 font-medium text-xs sm:text-sm bg-amber-950/40 p-3 rounded-lg border border-amber-500/30">
          ✨ Certain high-value products or promotional campaigns qualify for Free Complimentary Delivery.
        </p>
      </div>
    ),
  },
  {
    id: "tracking",
    number: "05",
    label: "Tracking",
    title: "Order Tracking",
    icon: PackageCheck,
    summary:
      "Real-time visibility from order placement to doorstep dispatch via your Customer Account dashboard.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          Customers can track their orders through the <strong>My Orders</strong> section of their
          Beyond Interiors account. Your consignment moves through clear milestones:
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {["Order Placed", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"].map(
            (status, idx) => (
              <span
                key={status}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{status}</span>
              </span>
            )
          )}
        </div>
        <p className="text-xs text-stone-400 pt-1">
          If tracking information is temporarily unavailable or stalled, our support desk is readily available to assist.
        </p>
      </div>
    ),
  },
  {
    id: "process",
    number: "06",
    label: "Delivery",
    title: "Delivery Process & Access",
    icon: Truck,
    summary:
      "White-glove doorstep delivery. Please ensure doorways, stairs, and elevators can accommodate oversized pieces.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>Our logistics specialists will deliver the order to the shipping address provided at checkout:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-stone-200">
          <li>Ensure an accurate, complete address and active telephone number are provided.</li>
          <li>An authorized adult must be available to inspect and receive the consignment.</li>
          <li>Verify that entry gates, elevators, stairwells, and doorways accommodate product dimensions.</li>
        </ul>
        <p className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-200">
          ⚠️ Any specialized hoisting, external crane arrangements, or restricted access handling will require separate prior coordination.
        </p>
      </div>
    ),
  },
  {
    id: "damaged",
    number: "07",
    label: "Damaged",
    title: "Damaged or Incorrect Products",
    icon: AlertTriangle,
    summary:
      "All consignments are packed with reinforced crating. Report transit discrepancies within 48 hours.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          We take meticulous care to ensure products are crated securely before dispatch. If you receive
          a damaged, defective, or incorrect piece, notify us within <strong>48 hours of delivery</strong>.
        </p>
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
          <p className="text-xs uppercase font-mono text-amber-400 font-semibold">Please share with our team:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-stone-200">
            <li>Your Order ID & contact info.</li>
            <li>High-resolution photographs or video showing the defect or transit damage.</li>
            <li>Photos of the outer box labels and packaging.</li>
            <li>A brief description of the issue.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "delayed",
    number: "08",
    label: "Delays",
    title: "Delayed or Failed Deliveries",
    icon: CloudRain,
    summary:
      "Proactive notifications during weather disruptions, logistics strikes, or regional transit delays.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          While we make every effort to meet estimated schedules, unexpected logistical challenges can
          occasionally occur due to:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-stone-200">
          <li>Severe weather conditions or natural occurrences.</li>
          <li>Interstate freight regulations and transportation disruptions.</li>
          <li>Regional public holidays and courier operational backlogs.</li>
        </ul>
        <p>
          If a delivery attempt fails due to recipient unavailability or incorrect address details,
          our logistics partner will attempt re-delivery.
        </p>
      </div>
    ),
  },
  {
    id: "installation",
    number: "09",
    label: "Installation",
    title: "Delivery and Installation",
    icon: Wrench,
    summary:
      "Delivery and installation are coordinated services. Book certified on-site technicians with your order.",
    content: (
      <div className="space-y-3 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>
          Delivery and on-site installation are managed as separate professional services unless
          explicitly combined in a package.
        </p>
        <p className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-stone-200">
          🔧 <strong>Certified Installation:</strong> Products like acoustic wall panels, chandeliers,
          modular kitchens, and architectural mirrors require precision fitting. You can easily book an
          on-site installation team through Beyond Interiors.
        </p>
        <p className="text-xs text-stone-400">Installation schedules and technician details are confirmed post-delivery.</p>
      </div>
    ),
  },
  {
    id: "contact",
    number: "10",
    label: "Contact",
    title: "Contact Support Desk",
    icon: Mail,
    summary:
      "Our concierge team is available to help with tracking inquiries, scheduling, and specialized delivery needs.",
    content: (
      <div className="space-y-4 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
        <p>For questions regarding shipping, delivery timelines, or order tracking, reach out directly:</p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-white">
            <Mail className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm">support@beyondinteriors.com</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Phone className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm">+91 (0) 800-BEYOND-INT</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm">www.beyondinteriors.in</span>
          </div>
        </div>
        <p className="text-xs text-stone-400 pt-2 border-t border-white/10">
          We appreciate your trust in BEYOND INTERIORS and look forward to bringing your dream spaces to life.
        </p>
      </div>
    ),
  },
];

const ShippingPolicy = () => {
  const [activeSectionId, setActiveSectionId] = useState("coverage");
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

    // Scroll listener to update active section square indicator
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.45;
      for (let i = SHIPPING_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SHIPPING_SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(SHIPPING_SECTIONS[i].id);
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
      {/* ================= FIXED BACKGROUND IMAGE (Warehouse / Packaging Curation) ================= */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={SHIPPING_BG_IMAGE}
          alt="Beyond Interiors Shipping Logistics & Packaging"
          className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
        />
        {/* Cinematic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-transparent to-stone-950/80" />
      </div>

      {/* ================= TOP-LEFT SQUARES NAVIGATION CONTROLLER ================= */}
      <div className="fixed top-48 left-4 sm:left-8 z-40 hidden md:flex flex-col gap-1.5">

        <div className="grid grid-cols-2 gap-1.5 max-h-[75vh] overflow-y-auto overflow-x-hidden no-scrollbar">
          {SHIPPING_SECTIONS.map((sec) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                title={`${sec.number}: ${sec.title}`}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${isActive
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/40 scale-105 border border-amber-400"
                  : "bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white border border-white/10"
                  }`}
              >
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= PAGE HERO HEADER ================= */}
      <header className="relative z-10 pt-36 sm:pt-44 pb-16 px-4 sm:px-8 max-w-[1520px] mx-auto md:pl-36">
        <div className="max-w-4xl space-y-4">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Shipping Policy
          </h1>

          <p className="text-xs sm:text-sm font-mono text-stone-400 tracking-wider">
            LAST UPDATED: <span className="text-white font-semibold">NOVEMBER 24, 2026</span>
          </p>

          <p className="font-sans text-stone-300 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl pt-2">
            At <strong>BEYOND INTERIORS</strong>, we believe that creating a beautiful sanctuary begins with a
            seamless shopping and delivery experience. From selecting handcrafted furniture to choosing
            the finest architectural details, our white-glove logistics ensure your pieces arrive
            safely, securely, and on time.
          </p>
        </div>
      </header>

      {/* ================= 10 FULL-HEIGHT POLICY SECTIONS ================= */}
      <main className="relative z-10 max-w-[1520px] mx-auto px-4 sm:px-8 md:pl-36 pb-32 space-y-16 sm:space-y-24">
        {SHIPPING_SECTIONS.map((section, idx) => {
          const Icon = section.icon;

          return (
            <section
              key={section.id}
              id={section.id}
              className="relative min-h-[75vh] sm:min-h-[82vh] flex flex-col justify-end py-12 sm:py-16 scroll-mt-28"
            >
              {/* SCROLL-DRIVEN MOTION TEXT CONTAINER (Starts at bottom, slides gracefully upwards) */}
              <motion.div
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-full w-full space-y-6 p-6 sm:p-10 md:p-12"
              >

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

              </motion.div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default ShippingPolicy;
