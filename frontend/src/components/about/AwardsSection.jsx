import { motion } from "motion/react";
import { Award } from "lucide-react";
import { awardsData } from "../../data/aboutData";

const awardsContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
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
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function AwardsSection() {
    const awardsCount = awardsData?.length || 5;

    return (
        <section className="bg-[#FAF8F5] py-16 sm:py-24 text-stone-900">
            {/* Aligned strictly to website container max-w-[1520px] */}
            <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Reference Split Layout */}
                <motion.div
                    variants={awardsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch"
                >
                    {/* ================= LEFT COLUMN: EDITORIAL INTRO & IMAGE ================= */}
                    <motion.div
                        variants={awardItemVariants}
                        className="lg:col-span-5 flex flex-col justify-between gap-10"
                    >
                        <div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
                                    AT
                                </span>
                                <h2 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-normal tracking-tight text-stone-900 uppercase">
                                    Beyond Interiors,
                                </h2>
                            </div>

                            <p className="mt-6 text-xs sm:text-sm leading-relaxed text-stone-600 max-w-sm">
                                We believe luxury interiors are more than just
                                aesthetics — they are about curating timeless
                                furnishings, lighting, and bespoke installations
                                that elevate how a space lives with you.
                            </p>
                        </div>

                        {/* Architectural Feature Image */}
                        <div className="w-full aspect-[4/3] overflow-hidden bg-stone-200">
                            <img
                                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                                alt="Beyond Interiors curated living space"
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                            />
                        </div>
                    </motion.div>

                    {/* ================= RIGHT COLUMN: 2x2 HAIRLINE METRICS & QUOTE GRID ================= */}
                    <div className="lg:col-span-7 border-t border-stone-300/80 grid grid-cols-1 sm:grid-cols-2">
                        {/* CELL 1: Top-Left */}
                        <motion.div
                            variants={awardItemVariants}
                            className="flex flex-col justify-end p-6 sm:p-8 min-h-[220px] sm:min-h-[260px] border-b sm:border-r border-stone-300/80"
                        >
                            <div className="flex items-end justify-between gap-4">
                                <p className="text-xs sm:text-[13px] leading-snug text-stone-600 max-w-[180px]">
                                    design & architectural awards honored for
                                    residential fitouts.
                                </p>
                                <span className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-stone-900 leading-none">
                                    {awardsCount}
                                </span>
                            </div>
                        </motion.div>

                        {/* CELL 2: Top-Right */}
                        <motion.div
                            variants={awardItemVariants}
                            className="flex flex-col justify-end p-6 sm:p-8 min-h-[220px] sm:min-h-[260px] border-b border-stone-300/80"
                        >
                            <div className="flex items-end justify-between gap-4">
                                <p className="text-xs sm:text-[13px] leading-snug text-stone-600 max-w-[180px]">
                                    master artisans, designers & installation
                                    specialists.
                                </p>
                                <span className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-stone-900 leading-none">
                                    25+
                                </span>
                            </div>
                        </motion.div>

                        {/* CELL 3: Bottom-Left */}
                        <motion.div
                            variants={awardItemVariants}
                            className="flex flex-col justify-end p-6 sm:p-8 min-h-[240px] sm:min-h-[290px] border-b sm:border-b-0 sm:border-r border-stone-300/80"
                        >
                            <div className="flex items-end justify-between gap-4">
                                <p className="text-xs sm:text-[13px] leading-snug text-stone-600 max-w-[185px]">
                                    completed turnkey projects and satisfied
                                    homeowners across India.
                                </p>
                                <span className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-stone-900 leading-none">
                                    120+
                                </span>
                            </div>
                        </motion.div>

                        {/* CELL 4: Bottom-Right (Dark Walnut Statement Card) */}
                        <motion.div
                            variants={awardItemVariants}
                            className="flex flex-col justify-between p-6 sm:p-8 min-h-[240px] sm:min-h-[290px] bg-[#3E2B25] text-amber-50"
                        >
                            <p className="text-sm sm:text-[15px] leading-relaxed font-normal text-amber-50/90 max-w-[230px]">
                                Design isn't just what you see — it's
                                how a space lives with you, from inspiration to
                                installation.
                            </p>

                            <div className="pt-8">
                                <p className="text-xs font-medium tracking-wide text-amber-50">
                                    Beyond Interiors Studio
                                </p>
                                <p className="text-[11px] text-amber-100/60 mt-0.5">
                                    From Inspiration to Installation
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* ================= HONORS & AWARDS STRIP (USES YOUR awardsData) ================= */}
                {awardsData?.length > 0 && (
                    <motion.div
                        variants={awardsContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="mt-14 pt-8 border-t border-stone-300/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                    >
                        {awardsData.map((award) => (
                            <motion.div
                                key={award.id}
                                variants={awardItemVariants}
                                className="group flex flex-col justify-between border-l border-stone-300/80 pl-4 transition-colors hover:border-[#A73D4D]"
                            >
                                <div className="flex items-center justify-between text-stone-500">
                                    <Award
                                        className="w-4 h-4 text-[#A73D4D]"
                                        strokeWidth={1.6}
                                    />
                                    <span className="text-[11px] font-mono tracking-widest">
                                        {award.year}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <p className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
                                        {award.organization}
                                    </p>
                                    <h3 className="mt-1 font-serif text-sm font-semibold text-stone-900 leading-snug group-hover:text-[#A73D4D] transition-colors">
                                        {award.title}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}