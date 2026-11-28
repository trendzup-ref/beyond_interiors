import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { oversightSlides } from "../../data/aboutData";

export default function OversightSection() {
    const [slideIndex, setSlideIndex] = useState(0);
    const currentSlide = oversightSlides[slideIndex];

    const handlePrev = () => {
        setSlideIndex((prev) =>
            prev === 0 ? oversightSlides.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setSlideIndex((prev) => (prev + 1) % oversightSlides.length);
    };

    return (
        <section className="bg-[#FAF8F5] pb-20 sm:pb-28">
            {/* Aligned strictly to website container max-w-[1520px] */}
            <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                        {/* Left Overlapping Editorial Image */}
                        <div className="lg:col-span-5 relative p-4 sm:p-6 lg:p-8">
                            <div className="relative overflow-hidden rounded-2xl bg-stone-100 aspect-[4/4.2] border border-stone-200/80 shadow-xs">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentSlide.id}
                                        src={currentSlide.image}
                                        alt={currentSlide.imageAlt}
                                        initial={{ opacity: 0, scale: 1.04 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Slider Controls */}
                                <div className="absolute bottom-3 left-3 flex rounded-xl overflow-hidden border border-stone-200/90 shadow-md">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        aria-label="Previous highlight"
                                        className="w-11 h-11 bg-white/95 backdrop-blur-xs text-stone-900 hover:bg-stone-900 hover:text-white transition-colors flex items-center justify-center border-r border-stone-200 cursor-pointer"
                                    >
                                        <ArrowLeft className="w-4 h-4 stroke-[2]" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        aria-label="Next highlight"
                                        className="w-11 h-11 bg-white/95 backdrop-blur-xs text-stone-900 hover:bg-stone-900 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        <ArrowRight className="w-4 h-4 stroke-[2]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className="lg:col-span-7 p-6 sm:p-10 lg:pr-14">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.4 }}
                                >

                                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 leading-tight mb-4">
                                        {currentSlide.title}
                                    </h2>

                                    <p className="text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed mb-8 max-w-xl font-normal">
                                        {currentSlide.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                        <Link
                                            to={currentSlide.primaryLink.to}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-[#A73D4D] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs"
                                        >
                                            <span>{currentSlide.primaryLink.label}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>

                                        <Link
                                            to={currentSlide.secondaryLink.to}
                                            className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-stone-600 hover:text-stone-900 border-b border-stone-300 pb-1 hover:border-stone-900 transition-colors"
                                        >
                                            {currentSlide.secondaryLink.label}
                                        </Link>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
