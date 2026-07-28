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
        // Jab section viewport mein aaye
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: observer disconnect kar denge taake dubara trigger na ho
          // observer.disconnect();
        }
      },
      {
        threshold: 0.15, // 15% section visible ho to trigger
        rootMargin: "0px 0px -50px 0px", // thoda trigger delay
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
      className={`${poppins.className} w-full bg-[#FAF9F6] overflow-hidden`}
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
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#E8871E]">
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
            <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#0B2340] sm:text-4xl">
              Greenfield School
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
              Greenfield School has grown into one of the most trusted names in the
              region&apos;s educational landscape, shaping young minds since its
              very first day. What began as a single modest building has, over
              the years, blossomed into a thriving institution known for academic
              excellence and strong values.
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
              Our journey has always been guided by a simple belief — every child
              deserves an environment where they can learn, grow, and discover
              their true potential. Driven by dedicated educators and a
              supportive community, Greenfield School has continuously evolved to
              meet the changing needs of education while staying true to its
              founding vision.
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
              Today, Greenfield School stands as a symbol of quality education,
              character building, and holistic development, carrying forward a
              legacy built on years of hard work, passion, and commitment to
              every student who walks through our doors.
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
              className="inline-flex items-center gap-2 rounded-full bg-[#2E9B5C] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#2E9B5C]/30 transition-all hover:-translate-y-0.5 hover:bg-[#278a51] hover:shadow-xl hover:shadow-[#2E9B5C]/40"
            >
              Read More
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-sm">
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
          <div className="group absolute left-1/2 top-0 z-10 h-[68%] w-[72%] -translate-x-1/2 rounded-full bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Students having fun"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Bottom-left frame — oval */}
          <div className="group absolute bottom-0 left-0 z-20 h-[58%] w-[50%] rounded-[50%_50%_50%_50%/42%_42%_58%_58%] bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="relative h-full w-full overflow-hidden rounded-[50%_50%_50%_50%/42%_42%_58%_58%]">
              <Image
                src="https://images.unsplash.com/photo-1759143101324-d375443f1955?fm=jpg&q=80&w=1200&auto=format&fit=crop"
                alt="Student in classroom"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Bottom-right frame — oval */}
          <div className="group absolute bottom-0 right-0 z-20 h-[58%] w-[50%] rounded-[50%_50%_50%_50%/42%_42%_58%_58%] bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="relative h-full w-full overflow-hidden rounded-[50%_50%_50%_50%/42%_42%_58%_58%]">
              <Image
                src="https://images.unsplash.com/photo-1502781252888-9143ba7f074e?fm=jpg&q=80&w=1200&auto=format&fit=crop"
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