import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { timelineMilestones } from "../../data/aboutData";
import { Sparkles } from "lucide-react";

export default function StorylineSection() {
    const timelineRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 70%", "end 75%"],
    });

    const smoothLineScale = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 26,
        restDelta: 0.001,
    });

    return (
        <section className="bg-[#FAF8F5] py-16 sm:py-24">
            {/* Aligned strictly to website container max-w-[1520px] */}
            <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Heading */}
                <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">

                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
                        Our Storyline
                    </h2>

                    <p className="text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed mt-3 font-normal">
                        Since our inception, Beyond Interiors has united timeless
                        architectural products with white-glove installation—transforming
                        how discerning spaces are curated, delivered, and finished.
                    </p>
                </div>

                {/* Timeline Inner Container */}
                <div ref={timelineRef} className="relative py-6 max-w-5xl mx-auto">
                    {/* Base Track Line */}
                    <div
                        className="absolute top-0 bottom-0 left-4 md:left-1/2 md:-translate-x-1/2 w-[1.5px] bg-stone-200"
                        aria-hidden="true"
                    />

                    {/* Scroll-Drawn Active Line */}
                    <motion.div
                        style={{ scaleY: smoothLineScale }}
                        className="origin-top absolute top-0 bottom-0 left-4 md:left-1/2 md:-translate-x-1/2 w-[2.5px] bg-[#A73D4D]"
                        aria-hidden="true"
                    />

                    {/* Top Terminal Dot */}
                    <span
                        className="absolute top-0 left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#A73D4D]"
                        aria-hidden="true"
                    />

                    {/* Milestones */}
                    <div className="space-y-16 md:space-y-24 pt-10 pb-10">
                        {timelineMilestones.map((item, index) => {
                            const isImageLeft = index % 2 === 0;

                            return (
                                <div key={item.id} className="relative">
                                    {/* Center Dot + Year */}
                                    <div className="relative flex items-center md:justify-center mb-6 pl-10 md:pl-0">
                                        <motion.span
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true, amount: 0.6 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FAF8F5] border-[3px] border-[#A73D4D] z-10 shadow-xs"
                                        />

                                        <motion.span
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.6 }}
                                            transition={{ duration: 0.45, delay: 0.12 }}
                                            className="md:mt-10 bg-white border border-stone-200/80 px-4 py-1 rounded-full font-serif text-base sm:text-lg font-bold text-stone-900 tracking-wide z-10 shadow-xs"
                                        >
                                            {item.year}
                                        </motion.span>
                                    </div>

                                    {/* Alternating Image & Description */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center pl-10 md:pl-0">
                                        <motion.div
                                            initial={{ opacity: 0, x: isImageLeft ? -28 : 28 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, amount: 0.35 }}
                                            transition={{
                                                duration: 0.65,
                                                delay: 0.18,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className={
                                                isImageLeft ? "md:order-1 md:pr-4" : "md:order-2 md:pl-4"
                                            }
                                        >
                                            <div className="overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/80 shadow-xs aspect-[16/10]">
                                                <img
                                                    src={item.image}
                                                    alt={item.imageAlt}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-700"
                                                />
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: isImageLeft ? 28 : -28 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true, amount: 0.35 }}
                                            transition={{
                                                duration: 0.65,
                                                delay: 0.28,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className={
                                                isImageLeft
                                                    ? "md:order-2 md:pl-4 text-left"
                                                    : "md:order-1 md:pr-4 md:text-right text-left"
                                            }
                                        >
                                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Terminal Dot */}
                    <span
                        className="absolute bottom-0 left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#A73D4D]"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </section>
    );
}
