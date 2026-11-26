import React from "react";
import { Phone, MapPin, Mail, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";

const CONTACT_BLOCKS = [
    {
        id: "call",
        title: "Call Our Studio",
        description:
            "Speak directly with an interior architect for product specifications, custom dimensions, or order status.",
        icon: Phone,
        label: "+91 11 4567 8910",
        href: "tel:+911145678910",
    },
    {
        id: "visit",
        title: "Visit Flagship Studio",
        description:
            "Touch and experience our solid wood finishes, designer lighting sconces, acoustic wall panels, and fabric swatches.",
        icon: MapPin,
        label: "Connaught Place, New Delhi, Delhi 110001",
        href: "https://maps.google.com/?q=Connaught+Place,New+Delhi,India",
        external: true,
    },
    {
        id: "email",
        title: "Email Concierge",
        description:
            "Submit architectural CAD layouts, request volume quotations, or track offline payment confirmations.",
        icon: Mail,
        label: "concierge@beyondinteriors.in",
        href: "mailto:concierge@beyondinteriors.in?subject=Beyond%20Interiors%20Inquiry",
    },
];

export default function ContactInfo() {
    return (
        <div className="space-y-6">
            {/* Contact Blocks Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs divide-y divide-stone-100">
                <div className="pb-5">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#A73D4D] block mb-2">
                        Studio Contacts
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                        Reach Us Directly
                    </h3>
                </div>

                {CONTACT_BLOCKS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.id} className="py-5 first:pt-4 last:pb-0">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shrink-0 mt-0.5">
                                    <Icon className="w-4 h-4" strokeWidth={2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-serif text-base font-semibold text-stone-900">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-stone-500 leading-relaxed mt-1 mb-2">
                                        {item.description}
                                    </p>
                                    <a
                                        href={item.href}
                                        target={item.external ? "_blank" : undefined}
                                        rel={item.external ? "noopener noreferrer" : undefined}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-[#A73D4D] transition-colors group"
                                    >
                                        <span className="truncate">{item.label}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#A73D4D] transition-colors shrink-0" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Studio Hours & Guarantees Card */}
            <div className="bg-[#FAF8F5] rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-serif text-sm font-semibold text-stone-900">
                            Studio Hours (IST)
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                            Monday – Saturday: 10:00 AM – 7:30 PM<br />
                            Sunday: By Prior Appointment Only
                        </p>
                    </div>
                </div>

                <div className="pt-3 border-t border-stone-200/70 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-serif text-sm font-semibold text-stone-900">
                            White-Glove Promise
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                            Laser-precise on-site measurements and supervised structural mounting by certified Beyond Interiors technicians.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
