/* eslint-disable react/no-unescaped-entities */
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

  return (
    <div
      ref={sectionRef}
      className={`${poppins.className} grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20`}
    >
      {/* Left Image */}
      <div
        ref={imageRef}
        className={`relative transition-all duration-[1200ms] ease-out ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-[400px]"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group">
          <Image
            src="/about/left.png"
            alt="Al Noor College Campus"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Right Content */}
      <div className="space-y-4">
        {/* Badge */}
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-[300px]"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-3">
            Our Story
          </p>
        </div>

        {/* Heading */}
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-[400px]"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#0B0F19] mb-6">
            A Legacy of Excellence
          </h2>
        </div>

        {/* Decorative Line */}
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
          <div className="h-[3px] w-16 bg-gradient-to-r from-[#E8CA5E] to-transparent rounded-full" />
        </div>

        {/* Paragraph 1 */}
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-[350px]"
          }`}
          style={{ transitionDelay: "350ms" }}
        >
          <p className="text-[#5B6472] text-sm sm:text-base leading-relaxed mb-4">
            Al Noor College has grown into one of the most trusted names in the
            region's educational landscape, shaping young minds since its
            very first day. What began as a single modest building has, over
            the years, blossomed into a thriving institution known for academic
            excellence and strong values.
          </p>
        </div>

        {/* Paragraph 2 */}
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-[350px]"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <p className="text-[#5B6472] text-sm sm:text-base leading-relaxed mb-4">
            Our journey has always been guided by a simple belief — every student
            deserves an environment where they can learn, grow, and discover
            their true potential. Driven by dedicated educators and a
            supportive community, Al Noor College has continuously evolved to
            meet the changing needs of education while staying true to its
            founding vision.
          </p>
        </div>

        {/* Stats */}
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
            <div className="text-2xl sm:text-3xl font-extrabold text-[#E8CA5E]">25+</div>
            <div className="text-[#5B6472] text-xs sm:text-sm font-medium">Years of Excellence</div>
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
            <div className="text-2xl sm:text-3xl font-extrabold text-[#E8CA5E]">1500+</div>
            <div className="text-[#5B6472] text-xs sm:text-sm font-medium">Happy Students</div>
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
            <div className="text-2xl sm:text-3xl font-extrabold text-[#E8CA5E]">40+</div>
            <div className="text-[#5B6472] text-xs sm:text-sm font-medium">Expert Teachers</div>
          </div>
        </div>
      </div>
    </div>
  );
}