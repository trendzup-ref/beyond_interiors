import { motion } from "motion/react";
import { Award, Trophy } from "lucide-react";
import { awardsData } from "../../data/aboutData";

const awardsContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const awardItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const themeClasses = {
    dark: "bg-stone-900 text-white border-stone-800",
    stone: "bg-stone-100 text-stone-900 border-stone-200",
    walnut: "bg-[#3E2B25] text-amber-50 border-[#3E2B25]",
    ivory: "bg-white text-stone-900 border-stone-200",
    cream: "bg-[#F7F2D7] text-stone-900 border-[#E5DEBC]",
};

export default function AwardsSection() {
    return (
        <section className="bg-[#FAF8F5] py-16 sm:py-24">
            {/* Aligned strictly to website container max-w-[1520px] */}
            <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 sm:mb-12">
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A73D4D] font-bold mb-2">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Honors & Global Recognition</span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
                        Our Awards
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl">
                        Celebrated by leading architectural publications and design councils for redefining high-end residential fitouts.
                    </p>
                </div>

                {/* Staggered Reveal Grid */}
                <motion.div
                    variants={awardsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5"
                >
                    {awardsData.map((award) => (
                        <motion.div
                            key={award.id}
                            variants={awardItemVariants}
                            className={`border rounded-2xl p-6 min-h-[160px] flex flex-col justify-between shadow-xs transition-transform duration-300 hover:-translate-y-1 ${themeClasses[award.theme]
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <Award className="w-5 h-5 opacity-85" strokeWidth={1.75} />
                                <span className="text-[11px] font-mono uppercase tracking-widest font-semibold opacity-75">
                                    {award.year}
                                </span>
                            </div>

                            <div className="mt-6">
                                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-75 mb-1">
                                    {award.organization}
                                </p>
                                <h3 className="font-serif text-base font-bold leading-snug">
                                    {award.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="flex items-center gap-4 mt-10 text-stone-500">
                    <span className="w-12 h-[1px] bg-stone-300" aria-hidden="true" />
                    <p className="text-xs uppercase tracking-wider font-medium">
                        Recognized for architectural curation & installation excellence nationwide
                    </p>
                </div>
            </div>
        </section>
    );
}
