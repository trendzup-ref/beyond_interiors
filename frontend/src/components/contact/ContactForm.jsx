import { useState } from "react";
import { ChevronDown, Send, CheckCircle2, AlertCircle } from "lucide-react";

const INITIAL_FORM = {
    name: "",
    email: "",
    interestedIn: "",
    phone: "",
    message: "",
};

const INTEREST_OPTIONS = [
    "Furniture & Seating",
    "Lighting & Chandeliers",
    "Wallpapers & Wall Panels",
    "Modular Kitchen",
    "Flooring & Rugs",
    "Professional Installation / Site Visit",
];

export default function ContactForm() {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | submitting | success | error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Please enter your full name.";
        if (!formData.email.trim()) {
            newErrors.email = "Please enter your email address.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.interestedIn) {
            newErrors.interestedIn = "Please select a collection or service.";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Please enter your contact number.";
        } else if (!/^[+\d\s-]{8,15}$/.test(formData.phone.trim())) {
            newErrors.phone = "Please enter a valid contact number.";
        }
        if (!formData.message.trim()) {
            newErrors.message = "Please write a brief inquiry or requirement.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setStatus("submitting");
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            setStatus("success");
            setFormData(INITIAL_FORM);
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs">
            <div className="mb-8">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#A73D4D] block mb-2">
                    Direct Inquiry Form
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                    Send a Message
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mt-1.5 max-w-lg">
                    Have a question regarding custom specifications, offline payments, or scheduling an on-site consultation? Fill out the details below.
                </p>
            </div>

            {status === "success" && (
                <div
                    role="status"
                    className="mb-8 flex items-start gap-3 border border-emerald-200 bg-emerald-50/80 rounded-2xl p-4 text-sm text-emerald-900 animate-fadeIn"
                >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Message delivered successfully.</p>
                        <p className="text-xs text-emerald-700 mt-0.5">
                            Thank you for reaching out to Beyond Interiors. A certified interior specialist will contact you within 24 business hours.
                        </p>
                    </div>
                </div>
            )}

            {status === "error" && (
                <div
                    role="alert"
                    className="mb-8 flex items-center gap-3 border border-red-200 bg-red-50 rounded-2xl p-4 text-sm text-red-800"
                >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Something went wrong. Please try again or reach us directly via phone.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2"
                        >
                            Full Name *
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Aarav Sharma"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2"
                        >
                            Email Address *
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="aarav@example.com"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: Interested In & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                        <label
                            htmlFor="interestedIn"
                            className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2"
                        >
                            Interested In *
                        </label>
                        <div className="relative">
                            <select
                                id="interestedIn"
                                name="interestedIn"
                                value={formData.interestedIn}
                                onChange={handleChange}
                                className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pr-10 text-sm text-stone-900 focus:outline-none focus:border-stone-900 focus:bg-white transition-all cursor-pointer"
                            >
                                <option value="" disabled>
                                    Select category or service
                                </option>
                                {INTEREST_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="w-4 h-4 text-stone-500 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                                strokeWidth={2}
                            />
                        </div>
                        {errors.interestedIn && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{errors.interestedIn}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2"
                        >
                            Contact Phone *
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>
                        )}
                    </div>
                </div>

                {/* Row 3: Message */}
                <div>
                    <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2"
                    >
                        Project Details / Inquiry *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your space dimensions, preferred materials, architectural blueprints, or required timeline..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-all resize-none"
                    />
                    {errors.message && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{errors.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-stone-400">
                        * All client project details remain strictly confidential.
                    </p>

                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="inline-flex items-center gap-2 bg-stone-900 hover:bg-[#A73D4D] text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <Send className="w-3.5 h-3.5 stroke-[2]" />
                        <span>{status === "submitting" ? "Submitting..." : "Send Inquiry"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
