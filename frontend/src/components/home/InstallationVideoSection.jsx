import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Wrench, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import installationVideo from "../../assets/videos/home/installation.mp4";

const HEADLINE_TEXT =
  "Precision in Every Millimeter. Turnkey Craftsmanship for Modern Sanctuaries.";

const InstallationVideoSection = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typewriter animation calculated to take exactly 4 seconds (4000ms)
  useEffect(() => {
    let currentIndex = 0;
    const totalChars = HEADLINE_TEXT.length;
    // Total typing duration: 4000ms
    const intervalTime = Math.floor(4000 / totalChars);

    setDisplayedText("");
    setIsTypingComplete(false);

    const typingInterval = setInterval(() => {
      currentIndex += 1;
      setDisplayedText(HEADLINE_TEXT.slice(0, currentIndex));

      if (currentIndex >= totalChars) {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, intervalTime);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[650px] lg:min-h-[760px] overflow-hidden bg-stone-950 my-10 sm:my-16">
      {/* FULL-WIDTH BACKGROUND VIDEO */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          src={installationVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105"
        />

        {/* Sophisticated Multi-Layer Ambient Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />
      </div>


      {/* ABSOLUTE CONTENT POSITIONED AT BOTTOM-LEFT */}
      <div className="absolute bottom-8 left-6 sm:bottom-14 sm:left-12 lg:bottom-18 lg:left-20 z-20 max-w-4xl text-left space-y-5 sm:space-y-6 pr-4">
        {/* 4-SECOND TYPING ANIMATION IMPACTFUL HEADLINE */}
        <div className="min-h-[110px] sm:min-h-[140px] md:min-h-[160px] flex items-start">
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.12] drop-shadow-lg">
            <span>{displayedText}</span>
            {/* Blinking Typewriter Cursor */}
            <span
              className={`inline-block w-1 sm:w-1.5 h-7 sm:h-11 md:h-14 bg-amber-400 ml-1.5 align-middle transition-opacity duration-150 ${isTypingComplete ? "animate-pulse" : "opacity-100"
                }`}
            />
          </h2>
        </div>
      </div>
    </section>
  );
};

export default InstallationVideoSection;
