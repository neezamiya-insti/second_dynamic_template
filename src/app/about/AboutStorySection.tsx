"use client";

import React from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

export default function AboutStorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

  // Parallax effect on image
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };

    const image = imageRef.current;
    if (image) {
      image.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (image) {
        image.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const parallaxX = mousePosition.x * 30;
  const parallaxY = mousePosition.y * 30;

  return (
    <div
      ref={sectionRef}
      className={`${poppins.className} grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20 overflow-hidden`}
    >
      {/* Left Content */}
      <div className="space-y-4">
        {/* Badge - Slides in from LEFT */}
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[300px]"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8871E] mb-3">
            Our Story
          </p>
        </div>

        {/* Heading - Slides in from LEFT */}
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[400px]"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B2340] mb-6">
            A Legacy of Excellence
          </h2>
        </div>

        {/* Decorative Line - Scales from Left */}
        <div
          className={`transition-all duration-[800ms] ease-out ${
            isVisible
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          }`}
          style={{ 
            transitionDelay: "250ms",
            transformOrigin: "left center"
          }}
        >
          <div className="h-[3px] w-16 bg-gradient-to-r from-[#E8871E] to-transparent rounded-full" />
        </div>

        {/* Paragraph 1 - Slides in from LEFT */}
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[350px]"
          }`}
          style={{ transitionDelay: "350ms" }}
        >
          <p className="text-[#5B6472] text-base leading-relaxed mb-4">
            Greenfield School has grown into one of the most trusted names in the
            region&apos;s educational landscape, shaping young minds since its
            very first day. What began as a single modest building has, over
            the years, blossomed into a thriving institution known for academic
            excellence and strong values.
          </p>
        </div>

        {/* Paragraph 2 - Slides in from LEFT */}
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[350px]"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <p className="text-[#5B6472] text-base leading-relaxed mb-4">
            Our journey has always been guided by a simple belief — every child
            deserves an environment where they can learn, grow, and discover
            their true potential. Driven by dedicated educators and a
            supportive community, Greenfield School has continuously evolved to
            meet the changing needs of education while staying true to its
            founding vision.
          </p>
        </div>

        {/* Stats - Slides UP from BOTTOM with staggered delays */}
        <div className="flex flex-wrap gap-6 mt-6">
          {/* Stat 1 */}
          <div
            className={`transition-all duration-[800ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[60px]"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="text-3xl font-extrabold text-[#E8871E]">25+</div>
            <div className="text-[#5B6472] text-sm font-medium">Years of Excellence</div>
          </div>

          {/* Stat 2 */}
          <div
            className={`transition-all duration-[800ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[60px]"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="text-3xl font-extrabold text-[#E8871E]">1500+</div>
            <div className="text-[#5B6472] text-sm font-medium">Happy Students</div>
          </div>

          {/* Stat 3 */}
          <div
            className={`transition-all duration-[800ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[60px]"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="text-3xl font-extrabold text-[#E8871E]">40+</div>
            <div className="text-[#5B6472] text-sm font-medium">Expert Teachers</div>
          </div>
        </div>
      </div>

      {/* Right Image with Parallax */}
      <div
        ref={imageRef}
        className={`relative transition-all duration-[1200ms] ease-out ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-[400px]"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <div
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300"
          style={{
            transform: isVisible 
              ? `perspective(1000px) rotateY(${parallaxX * 0.5}deg) rotateX(${-parallaxY * 0.5}deg) scale(1.02)` 
              : "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?fm=jpg&q=80&w=1200&auto=format&fit=crop"
            alt="School campus"
            fill
            className="object-cover transition-transform duration-700 hover:scale-110"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340]/20 via-transparent to-transparent" />

          {/* Floating Badge on Image */}
          <div
            className={`absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[40px]"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8871E]/20 flex items-center justify-center">
                <span className="text-[#E8871E] text-lg">🏫</span>
              </div>
              <div>
                <div className="text-sm font-bold text-[#0B2340]">Est. 2010</div>
                <div className="text-xs text-[#5B6472]">15+ Years of Legacy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}