// app/events/EventsHero.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function EventsHero() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`${poppins.className} relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden`}
    >
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
          isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
        }`}
        style={{ transitionDelay: "0ms" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=900&fit=crop&q=80"
          alt="Events and News"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#0B0F19]/60 via-[#0B0F19]/70 to-[#0B0F19]/80 transition-all duration-[1000ms] ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "200ms" }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[30px]"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <p className="inline-block text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#E8CA5E] mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 border border-[#E8CA5E]/30 rounded-full bg-[#E8CA5E]/10 backdrop-blur-sm">
            ✦ Stay Updated ✦
          </p>
        </div>

        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[300px]"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-2xl">
            News & <span className="text-[#E8CA5E]">Events</span>
          </h1>
        </div>

        <div
          className={`flex justify-center transition-all duration-[800ms] ease-out ${
            isVisible
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="h-[2px] sm:h-[3px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#E8CA5E] to-transparent rounded-full my-3 sm:my-4" />
        </div>

        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[80px]"
          }`}
          style={{ transitionDelay: "750ms" }}
        >
          <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-base max-w-2xl mx-auto leading-relaxed px-2">
            Stay connected with the latest happenings, upcoming events, and 
            important announcements from Al Noor College.
          </p>
        </div>
      </div>

      {/* Bottom Wave */}
      <div
        className={`absolute bottom-0 left-0 w-full transition-all duration-[1200ms] ease-out ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[20px]"
        }`}
        style={{ transitionDelay: "1000ms" }}
      >
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-8 sm:h-10 md:h-12 lg:h-16"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,60 L0,60 Z"
            fill="#FAF9F6"
          />
        </svg>
      </div>
    </div>
  );
}