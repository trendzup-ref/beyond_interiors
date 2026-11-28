import React, { useState, useEffect, useRef } from "react";
import installationVideo from "../../assets/videos/home/installation.mp4";

const HEADLINE_TEXT =
  "Precision in Every Millimeter. Turnkey Craftsmanship for Modern Sanctuaries.";

const InstallationVideoSection = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const hasAnimated = useRef(false);
  const typingIntervalRef = useRef(null);

  // Drag / swipe scrubbing refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startTimeRef = useRef(0);

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

        // Start typewriter animation once when section comes into focus
        if (isVisible && !hasAnimated.current) {
          hasAnimated.current = true;
          setDisplayedText("");
          setIsTypingComplete(false);

          let currentIndex = 0;
          const totalChars = HEADLINE_TEXT.length;
          const intervalTime = 4000 / totalChars;

          typingIntervalRef.current = setInterval(() => {
            currentIndex += 1;
            setDisplayedText(HEADLINE_TEXT.slice(0, currentIndex));

            if (currentIndex >= totalChars) {
              clearInterval(typingIntervalRef.current);
              setIsTypingComplete(true);
            }
          }, intervalTime);
        }
      },
      { threshold: 0.3 }
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

  // Horizontal trackpad / shift+wheel scrubbing (right = forward, left = backward)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      // Only intercept horizontal scroll gestures; keep vertical page scroll intact
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
        e.preventDefault();
        const deltaSeconds = e.deltaX * 0.015;
        const nextTime = Math.min(
          Math.max(video.currentTime + deltaSeconds, 0),
          video.duration
        );
        video.currentTime = nextTime;
      }
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    return () => section.removeEventListener("wheel", handleWheel);
  }, []);

  // Pointer / touch horizontal drag scrubbing (right = forward, left = backward)
  const handlePointerDown = (e) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startTimeRef.current = video.currentTime;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || !Number.isFinite(video.duration)) return;

    const deltaX = e.clientX - startXRef.current;
    const width = section.clientWidth || 1;
    const scrubSeconds = (deltaX / width) * video.duration;

    video.currentTime = Math.min(
      Math.max(startTimeRef.current + scrubSeconds, 0),
      video.duration
    );
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  return (
    <section
      ref={sectionRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="
        relative w-full
        h-[320px]
        sm:h-[400px]
        md:h-[450px]
        lg:h-[500px]
        xl:h-[540px]
        overflow-hidden
        bg-stone-950
        my-8 sm:my-12
        select-none touch-pan-y cursor-ew-resize
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
          className="w-full h-full object-cover scale-105 pointer-events-none"
        />

        {/* GRADIENT OVERLAYS */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/90 via-black/45 to-black/25
            pointer-events-none
          "
        />
        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-black/85 via-black/50 to-transparent
            pointer-events-none
          "
        />
      </div>

      {/* EDITORIAL CONTENT */}
      <div
        className="
          absolute
          bottom-6 left-5
          sm:bottom-10 sm:left-10
          lg:bottom-14 lg:left-16
          z-20
          max-w-3xl
          text-left
          pr-5
          pointer-events-none
        "
      >
        {/* TYPEWRITER HEADLINE */}
        <div
          className="
            min-h-[84px]
            sm:min-h-[112px]
            md:min-h-[132px]
            flex items-start
          "
        >
          <h2
            className="
              font-serif
              text-2xl
              sm:text-4xl
              md:text-5xl
              font-bold
              text-white
              tracking-tight
              leading-[1.12]
              drop-shadow-lg
            "
          >
            <span>{displayedText}</span>

            {/* BLINKING CURSOR */}
            {isInView && (
              <span
                className={`
                  inline-block
                  w-1 sm:w-1.5
                  h-6 sm:h-9 md:h-11
                  bg-amber-400
                  ml-1.5
                  align-middle
                  ${isTypingComplete ? "animate-pulse" : "opacity-100"}
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