"use client";

import React from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

export default function AboutHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Clamp to -0.5..0.5 so the parallax offset can never exceed
      // the intended range, even with fast mouse movement near edges.
      const rawX = (e.clientX - rect.left) / rect.width - 0.5;
      const rawY = (e.clientY - rect.top) / rect.height - 0.5;
      const x = Math.min(0.5, Math.max(-0.5, rawX));
      const y = Math.min(0.5, Math.max(-0.5, rawY));
      setMousePosition({ x, y });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  // Small, safe parallax range — image is scaled 1.05 (5% bigger) so it has
  // enough bleed to cover this movement without ever showing an edge gap,
  // and the parent's overflow-hidden clips any of it that would spill out.
  const parallaxX = mousePosition.x * 14;
  const parallaxY = mousePosition.y * 14;

  return (
    <div
      ref={sectionRef}
      className={`${poppins.className} relative w-full max-w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden cursor-pointer`}
    >
      {/* Background Image with Smooth Zoom + Parallax */}
      <div
        className={`absolute inset-0 overflow-hidden transition-all duration-[1500ms] ease-out ${
          isVisible
            ? "scale-100 opacity-100"
            : "scale-110 opacity-0"
        }`}
        style={{
          transform: isVisible 
            ? `scale(1.05) translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)` 
            : "scale(1.1)",
          transitionDelay: "0ms",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?fm=jpg&q=80&w=1920&auto=format&fit=crop"
          alt="School building"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient Overlay - Smooth Fade */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#0B2340]/50 via-[#0B2340]/70 to-[#0B2340]/80 transition-all duration-[1200ms] ease-out ${
          isVisible
            ? "opacity-100"
            : "opacity-0"
        }`}
        style={{ transitionDelay: "200ms" }}
      />

      {/* Subtle Pattern Overlay - Hidden on mobile */}
      <div
        className={`hidden sm:block absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] transition-all duration-[1000ms] ease-out ${
          isVisible
            ? "opacity-100"
            : "opacity-0"
        }`}
        style={{ transitionDelay: "300ms" }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6">
        <div className="relative z-10 max-w-4xl w-full overflow-hidden">
          {/* Badge - Slides in from RIGHT */}
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-16"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <p className="inline-block text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#E8871E] mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 border border-[#E8871E]/30 rounded-full bg-[#E8871E]/10 backdrop-blur-sm">
              ✦ About Us ✦
            </p>
          </div>

          {/* Heading - Slides in from LEFT */}
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-16"
            }`}
            style={{ transitionDelay: "550ms" }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-2xl">
              Greenfield School
            </h1>
          </div>

          {/* Decorative Line - Scales from Center */}
          <div
            className={`flex justify-center transition-all duration-[800ms] ease-out ${
              isVisible
                ? "opacity-100 scale-x-100"
                : "opacity-0 scale-x-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="h-[2px] sm:h-[3px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#E8871E] to-transparent rounded-full my-3 sm:my-4" />
          </div>

          {/* Description - Slides UP from BOTTOM */}
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[80px]"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              Empowering young minds with quality education, character building, 
              and holistic development since 2010. We believe in nurturing 
              curiosity, fostering creativity, and building a strong foundation 
              for lifelong learning and success.
            </p>
          </div>

          {/* CTA Button - Fades in with scale */}
          <div
            className={`transition-all duration-[800ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-[40px] scale-90"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#E8871E] text-white font-semibold hover:bg-[#d47a1a] transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E8871E]/30 text-sm sm:text-base"
            >
              Explore More
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration - Mobile Responsive */}
      <div
        className={`absolute bottom-0 left-0 w-full transition-all duration-[1200ms] ease-out ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[20px]"
        }`}
        style={{ transitionDelay: "1100ms" }}
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