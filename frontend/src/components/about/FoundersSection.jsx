import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { foundersData } from "../../data/aboutData";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FoundersSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % foundersData.length);
        }, 3500);

        return () => clearInterval(timer);
    }, [isPaused]);

    return (
        <section className="bg-[#F6F2EC] py-16 sm:py-24">
            {/* Aligned strictly to website container max-w-[1520px] */}
            <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A73D4D] font-bold mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Architects & Master Craftsmen</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
                            Our Founders
                        </h2>
                        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl">
                            Guided by leading architects, design curators, and certified installation directors with decades of combined architectural practice.
                        </p>
                    </div>

                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 bg-stone-900 hover:bg-[#A73D4D] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors shadow-xs w-fit"
                    >
                        <span>Book Consultation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* 1 CTA Card + 3 Auto-Focused Founder Cards */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Left Editorial CTA Card */}
                    <div className="bg-white rounded-2xl border border-stone-200/90 p-7 flex flex-col justify-between min-h-[360px] shadow-xs">
                        <div>
                            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#A73D4D] mb-3">
                                Work With Us
                            </span>
                            <h3 className="font-serif text-2xl font-bold text-stone-900 leading-snug mb-3">
                                Want to craft timeless spaces with us?
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                Explore our 10 curated interior categories or schedule a private site visit with our installation specialists.
                            </p>
                        </div>

                        <Link
                            to="/products"
                            className="mt-6 inline-flex items-center justify-center border border-stone-300 hover:border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-xl transition-all w-fit"
                        >
                            Explore Catalog
                        </Link>
                    </div>

                    {/* Founder Portrait Cards */}
                    {foundersData.map((founder, index) => {
                        const isFocused = activeIndex === index;

                        return (
                            <motion.article
                                key={founder.id}
                                onClick={() => setActiveIndex(index)}
                                animate={{
                                    scale: isFocused ? 1.02 : 0.98,
                                    opacity: isFocused ? 1 : 0.75,
                                }}
                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                className={`relative cursor-pointer overflow-hidden rounded-2xl min-h-[360px] bg-stone-200 border transition-all duration-300 shadow-xs ${isFocused ? "border-stone-900 ring-2 ring-stone-900/10 z-10" : "border-stone-200"
                                    }`}
                            >
                                <img
                                    src={founder.image}
                                    alt={founder.name}
                                    loading="lazy"
                                    className={`w-full h-full object-cover object-top transition-all duration-700 ${isFocused ? "grayscale-0 scale-105" : "grayscale-[30%]"
                                        }`}
                                />

                                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs px-4 py-3 rounded-xl border-l-3 border-[#A73D4D] shadow-sm">
                                    <h3 className="font-serif text-base font-bold text-stone-900 leading-tight">
                                        {founder.name}
                                    </h3>
                                    <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mt-0.5">
                                        {founder.role}
                                    </p>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
