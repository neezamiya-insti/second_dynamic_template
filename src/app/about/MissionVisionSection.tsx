"use client";

import React from "react";
import { Poppins } from "next/font/google";
import { Target, Eye } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

export default function MissionVisionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Mouse move for 3D tilt effect on icons
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
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

  const tiltX = mousePosition.x * 8;
  const tiltY = mousePosition.y * 8;

  return (
    <div
      ref={sectionRef}
      className={`${poppins.className} grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 overflow-hidden px-4 md:px-0`}
    >
      {/* Mission - Left se slide in */}
      <div
        className={`group relative transition-all duration-[1000ms] ease-out cursor-pointer ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-[400px]"
        }`}
        style={{ transitionDelay: "0ms" }}
      >
        <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-[#E8871E]/10 hover:border-[#E8871E]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#E8871E]/5 overflow-hidden">
          
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-48 md:w-64 h-48 md:h-64 bg-[#E8871E]/5 rounded-full blur-3xl group-hover:bg-[#E8871E]/10 transition-all duration-700" />
          
          {/* 3D Icon with Tilt */}
          <div 
            className="relative w-16 h-16 rounded-2xl bg-[#E8871E]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#E8871E]/20 transition-all duration-500"
            style={{
              transform: isVisible 
                ? `perspective(600px) rotateY(${tiltX * 0.3}deg) rotateX(${-tiltY * 0.3}deg) translateZ(10px)`
                : "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* 3D Shadow Layer */}
            <div className="absolute inset-0 rounded-2xl bg-[#E8871E]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* 3D Icon with Depth */}
            <div className="relative z-10">
              <Target 
                className="w-8 h-8 text-[#E8871E] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" 
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(232,135,30,0.3))",
                }}
              />
            </div>

            {/* 3D Bottom Shadow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-[#E8871E]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </div>

          {/* Content */}
          <h3 className="text-xl md:text-2xl font-extrabold text-[#0B2340] mb-3 md:mb-4">
            Our Mission
          </h3>
          <p className="text-[#5B6472] text-sm md:text-base leading-relaxed">
            To provide a nurturing and inclusive learning environment that empowers 
            students to achieve academic excellence, develop strong character, and 
            become lifelong learners who contribute meaningfully to their communities.
          </p>

          {/* Decorative Line */}
          <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#E8871E] to-transparent group-hover:w-full transition-all duration-700 rounded-b-3xl" />
        </div>
      </div>

      {/* Vision - Right se slide in */}
      <div
        className={`group relative transition-all duration-[1000ms] ease-out cursor-pointer ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-[400px]"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-[#2E9B5C]/10 hover:border-[#2E9B5C]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#2E9B5C]/5 overflow-hidden">
          
          {/* Background Glow */}
          <div className="absolute -bottom-20 -left-20 w-48 md:w-64 h-48 md:h-64 bg-[#2E9B5C]/5 rounded-full blur-3xl group-hover:bg-[#2E9B5C]/10 transition-all duration-700" />
          
          {/* 3D Icon with Tilt */}
          <div 
            className="relative w-16 h-16 rounded-2xl bg-[#2E9B5C]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2E9B5C]/20 transition-all duration-500"
            style={{
              transform: isVisible 
                ? `perspective(600px) rotateY(${tiltX * 0.3}deg) rotateX(${-tiltY * 0.3}deg) translateZ(10px)`
                : "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* 3D Shadow Layer */}
            <div className="absolute inset-0 rounded-2xl bg-[#2E9B5C]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* 3D Icon with Depth */}
            <div className="relative z-10">
              <Eye 
                className="w-8 h-8 text-[#2E9B5C] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12" 
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(46,155,92,0.3))",
                }}
              />
            </div>

            {/* 3D Bottom Shadow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-[#2E9B5C]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </div>

          {/* Content */}
          <h3 className="text-xl md:text-2xl font-extrabold text-[#0B2340] mb-3 md:mb-4">
            Our Vision
          </h3>
          <p className="text-[#5B6472] text-sm md:text-base leading-relaxed">
            To be a beacon of educational excellence, recognized for developing 
            confident, compassionate, and innovative leaders who are prepared to 
            meet the challenges of tomorrow with courage and integrity.
          </p>

          {/* Decorative Line */}
          <div className="absolute bottom-0 right-0 w-0 h-1 bg-gradient-to-l from-[#2E9B5C] to-transparent group-hover:w-full transition-all duration-700 rounded-b-3xl" />
        </div>
      </div>
    </div>
  );
}