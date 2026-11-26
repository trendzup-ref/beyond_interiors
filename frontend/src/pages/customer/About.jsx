import React from "react";
import { Link } from "react-router";
import StorylineSection from "../../components/about/StorylineSection";
import FoundersSection from "../../components/about/FoundersSection";
import AwardsSection from "../../components/about/AwardsSection";
import OversightSection from "../../components/about/OversightSection";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col flex-1">
            {/* Top Hero / Breadcrumb Header */}
            <div className="max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
                <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6">
                    <Link to="/" className="hover:text-stone-900 transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-stone-900 font-medium">About Our Atelier</span>
                </nav>

                <header className="max-w-3xl pb-8 border-b border-stone-200">
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A73D4D] font-bold mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Beyond Interiors Atelier</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
                        Architectural Elegance, Handcrafted Excellence
                    </h1>

                    <p className="font-sans text-xs sm:text-sm md:text-base text-stone-600 mt-3 leading-relaxed font-normal">
                        We eliminate the boundary between discovering bespoke interior pieces and having them executed with architectural precision—uniting fine craftsmanship, curated tactile finishes, and white-glove installation under one seamless studio philosophy.
                    </p>
                </header>
            </div>

            {/* Editorial Storyline & Milestones */}
            <StorylineSection />

            {/* Founders & Leadership Section */}
            <FoundersSection />

            {/* Awards & Global Accolades */}
            <AwardsSection />

            {/* Oversight & Installation Assurance */}
            <OversightSection />
        </main>
    );
}
