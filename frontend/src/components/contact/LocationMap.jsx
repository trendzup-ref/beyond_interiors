import React from "react";
import { MapPin, Navigation } from "lucide-react";

export default function LocationMap() {
    return (
        <div className="w-full bg-white rounded-3xl border border-stone-200 p-3 sm:p-4 shadow-xs overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 py-3 mb-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="font-serif text-sm font-semibold text-stone-900">
                            Flagship Experience Studio
                        </h4>
                        <p className="text-xs text-stone-500">
                            Connaught Place, Inner Circle, New Delhi 110001
                        </p>
                    </div>
                </div>

                <a
                    href="https://maps.google.com/?q=Connaught+Place,New+Delhi,India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-[#A73D4D] transition-colors"
                >
                    <Navigation className="w-3.5 h-3.5 text-amber-700" />
                    <span>Get Driving Directions</span>
                </a>
            </div>

            <div className="w-full overflow-hidden rounded-2xl border border-stone-100">
                <iframe
                    title="Beyond Interiors Flagship Studio - New Delhi"
                    src="https://www.google.com/maps?q=Connaught+Place,+New+Delhi,+Delhi+110001&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-[320px] sm:h-[380px] md:h-[420px] grayscale-[30%] contrast-[1.02] hover:grayscale-0 transition-all duration-500 border-0"
                />
            </div>
        </div>
    );
}
