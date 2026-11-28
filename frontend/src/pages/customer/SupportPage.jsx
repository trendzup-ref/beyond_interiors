import React from "react";
import { Link } from "react-router";
import ContactForm from "../../components/contact/ContactForm";
import ContactInfo from "../../components/contact/ContactInfo";
import LocationMap from "../../components/contact/LocationMap";
import { HelpCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col flex-1">
      {/* Outer container strictly aligned with website layout (max-w-[1520px]) */}
      <div className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Customer Support & Concierge</span>
        </nav>

        {/* Page Hero Header */}
        <header className="mb-10 sm:mb-14 max-w-3xl">


          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
            We're Here to Help Your Space Evolve
          </h1>

          <p className="font-sans text-xs sm:text-sm md:text-base text-stone-600 mt-3 leading-relaxed font-normal">
            Whether you need guidance on architectural finishes, custom dimensions, order delivery timelines, or booking a personalized site visit—our studio concierge is at your service.
          </p>
        </header>

        {/* Form + Contact Info Split (12-column grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5">
            <ContactInfo />
          </div>
        </div>

        {/* Flagship Studio Location Map */}
        <div className="mb-12 sm:mb-16">
          <LocationMap />
        </div>

      </div>
    </main>
  );
}
