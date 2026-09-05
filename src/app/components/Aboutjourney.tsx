"use client";

import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

export default function AboutJourney() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15,
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
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#FFFFFF] overflow-hidden`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-16 px-6 py-20 lg:px-10">
        {/* Left: text */}
        <div className="flex-1 basis-[480px]">
          {/* Badge - Slides in from LEFT */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[300px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E]">
              About Our Journey
            </p>
          </div>

          {/* Heading - Slides in from LEFT with delay */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[400px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#0B0F19] sm:text-4xl">
              Al Noor College
            </h2>
          </div>

          {/* Paragraph 1 - Slides in from LEFT */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="mb-4 leading-relaxed text-[#5B6472]">
              Al Noor College has established itself as a beacon of quality 
              education, nurturing young minds with a commitment to academic 
              excellence and character development. From its humble beginnings, 
              the institution has grown into a renowned center of learning, 
              dedicated to empowering students for a bright future.
            </p>
          </div>

          {/* Paragraph 2 - Slides in from LEFT */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <p className="mb-4 leading-relaxed text-[#5B6472]">
              Driven by a vision of holistic development, Al Noor College 
              combines modern teaching methodologies with timeless values. 
              Our dedicated faculty and supportive community work together 
              to create an environment where every student can discover their 
              true potential and thrive academically, socially, and ethically.
            </p>
          </div>

          {/* Paragraph 3 - Slides in from LEFT */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="mb-8 leading-relaxed text-[#5B6472]">
              Today, Al Noor College stands as a symbol of educational 
              excellence, innovation, and integrity. With a legacy built on 
              passion and commitment, we continue to inspire and prepare 
              our students to become leaders of tomorrow, contributing 
              positively to society and the world at large.
            </p>
          </div>

          {/* Button - Slides in from LEFT with delay */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[400px]"
            }`}
            style={{ transitionDelay: "750ms" }}
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full bg-[#E8CA5E] px-7 py-3.5 text-base font-semibold text-[#0B0F19] shadow-lg shadow-[#E8CA5E]/30 transition-all hover:-translate-y-0.5 hover:bg-[#d4b84a] hover:shadow-xl hover:shadow-[#E8CA5E]/40"
            >
              Read More
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B0F19]/20 text-sm">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Right: photo collage - Slides in from RIGHT */}
        <div
          className={`relative aspect-[857/726] w-full flex-1 basis-[380px] sm:max-w-[480px] transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-[400px]"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Top frame — circle */}
          <div className="group absolute left-1/2 top-0 z-10 h-[68%] w-[72%] -translate-x-1/2 rounded-full bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src="/about/top.png"
                alt="Students having fun"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Bottom-left frame — oval */}
          <div className="group absolute bottom-0 left-0 z-20 h-[58%] w-[50%] rounded-[50%_50%_50%_50%/42%_42%_58%_58%] bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200">
            <div className="relative h-full w-full overflow-hidden rounded-[50%_50%_50%_50%/42%_42%_58%_58%]">
              <Image
                src="/about/left.png"
                alt="Student in classroom"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Bottom-right frame — oval */}
          <div className="group absolute bottom-0 right-0 z-20 h-[58%] w-[50%] rounded-[50%_50%_50%_50%/42%_42%_58%_58%] bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200">
            <div className="relative h-full w-full overflow-hidden rounded-[50%_50%_50%_50%/42%_42%_58%_58%]">
              <Image
                src="/about/right.png"
                alt="Students outdoors"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}