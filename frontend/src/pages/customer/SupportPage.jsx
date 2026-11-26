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
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A73D4D] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Concierge Desk</span>
          </div>

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

        {/* Quick FAQ Reference Banner */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Have questions about warranties, returns, or installations?
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Browse our comprehensive answers covering warranties, offline payment modes, and nationwide delivery timelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/#faq"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 shadow-xs"
            >
              <span>Explore FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
