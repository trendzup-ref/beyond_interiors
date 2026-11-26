
import React, { useState, useEffect, useRef } from "react";
import installationVideo from "../../assets/videos/home/installation.mp4";

const HEADLINE_TEXT =
  "Precision in Every Millimeter. Turnkey Craftsmanship for Modern Sanctuaries.";

const InstallationVideoSection = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const hasAnimated = useRef(false);
  const typingIntervalRef = useRef(null);

  const [isInView, setIsInView] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Detect when section enters or leaves viewport
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;

        setIsInView(isVisible);

        // Start animations only once
        if (isVisible && !hasAnimated.current) {
          hasAnimated.current = true;

          setDisplayedText("");
          setIsTypingComplete(false);

          let currentIndex = 0;

          const totalChars = HEADLINE_TEXT.length;
          const intervalTime = 4000 / totalChars;

          typingIntervalRef.current = setInterval(() => {
            currentIndex += 1;

            setDisplayedText(
              HEADLINE_TEXT.slice(0, currentIndex)
            );

            if (currentIndex >= totalChars) {
              clearInterval(typingIntervalRef.current);
              setIsTypingComplete(true);
            }
          }, intervalTime);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();

      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Play and pause video according to viewport visibility
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (isInView) {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Video autoplay was prevented:", error);
        });
      }
    } else {
      video.pause();
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="
        relative w-full
        min-h-[580px]
        sm:min-h-[650px]
        lg:min-h-[760px]
        overflow-hidden
        bg-stone-950
        my-10 sm:my-16
      "
    >
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">

        <video
          ref={videoRef}
          src={installationVideo}
          muted
          loop
          playsInline
          preload="metadata"
          className="
            w-full h-full
            object-cover
            scale-105
          "
        />

        {/* GRADIENT OVERLAYS */}
        <div className="
          absolute inset-0
          bg-gradient-to-t
          from-black/95 via-black/55 to-black/30
          pointer-events-none
        " />

        <div className="
          absolute inset-0
          bg-gradient-to-r
          from-black/90 via-black/60 to-transparent
          pointer-events-none
        " />
      </div>

      {/* EDITORIAL CONTENT */}
      <div className="
        absolute
        bottom-8 left-6
        sm:bottom-14 sm:left-12
        lg:bottom-18 lg:left-20
        z-20
        max-w-4xl
        text-left
        space-y-5 sm:space-y-6
        pr-4
      ">

        {/* TYPEWRITER HEADLINE */}
        <div className="
          min-h-[110px]
          sm:min-h-[140px]
          md:min-h-[160px]
          flex items-start
        ">
          <h2 className="
            font-serif
            text-3xl
            sm:text-5xl
            md:text-6xl
            font-bold
            text-white
            tracking-tight
            leading-[1.12]
            drop-shadow-lg
          ">
            <span>{displayedText}</span>

            {/* BLINKING CURSOR */}
            {isInView && (
              <span
                className={`
                  inline-block
                  w-1 sm:w-1.5
                  h-7 sm:h-11 md:h-14
                  bg-amber-400
                  ml-1.5
                  align-middle
                  ${isTypingComplete
                    ? "animate-pulse"
                    : "opacity-100"
                  }
                `}
              />
            )}
          </h2>
        </div>

      </div>
    </section>
  );
};

export default InstallationVideoSection;
