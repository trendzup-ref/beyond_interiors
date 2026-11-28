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
