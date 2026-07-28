"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Multiple slides data
const SLIDES = [
  {
    id: 1,
    image: "/back1.jpg",
    heading: "Nurturing Minds Inspiring Futures",
    description: "A place to learn, grow, and achieve excellence every day.",
  },
  {
    id: 2,
    image: "/back2.jpg",
    heading: "Empowering Students for Tomorrow",
    description: "Building character, knowledge, and skills for a bright future.",
  },
  {
    id: 3,
    image: "/back3.jpg",
    heading: "Excellence in Education",
    description: "Where every child's potential is nurtured with care and dedication.",
  },
];

const WORDS_PER_LINE = 3;
const SLIDE_DURATION = 5000;
const TRANSITION_DURATION = 1000;

function chunkHeading(text: string, wordsPerLine: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }

  return lines;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const goToSlide = (index: number) => {
    setCurrentSlide((current) => {
      if (index === current) return current;
      setPrevSlide(current);
      return index;
    });
  };

  // Set loaded state after component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto slide change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % SLIDES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  // Clear the "previous" slide once its exit animation finishes
  useEffect(() => {
    if (prevSlide === null) return;
    const timeout = setTimeout(() => setPrevSlide(null), TRANSITION_DURATION);
    return () => clearTimeout(timeout);
  }, [prevSlide]);

  // Handle mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      section.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
        section.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const parallaxX = mousePosition.x * 20;
  const parallaxY = mousePosition.y * 20;

  const currentSlideData = SLIDES[currentSlide];
  const headingLines = chunkHeading(currentSlideData.heading, WORDS_PER_LINE);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[620px] w-full items-center justify-center overflow-hidden cursor-pointer"
    >
      {/* Background images — current slides up and out, next slides in from the bottom */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, index) => {
          const isCurrent = index === currentSlide;
          const isPrev = index === prevSlide;

          let translateY = "100%";
          let zIndex = 0;

          if (isCurrent) {
            translateY = "0%";
            zIndex = 2;
          } else if (isPrev) {
            translateY = "-100%";
            zIndex = 1;
          }

          const extraTransform = isCurrent
            ? ` translate(${parallaxX}px, ${parallaxY}px) scale(1.05)`
            : "";

          return (
            <div
              key={slide.id}
              className="absolute inset-0 transition-transform ease-in-out will-change-transform"
              style={{
                transform: `translateY(${translateY})${extraTransform}`,
                transitionDuration: `${TRANSITION_DURATION}ms`,
                zIndex,
              }}
            >
              <Image
                src={slide.image}
                alt={`Slide ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* Navy gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B2340]/15 via-[#081A30]/25 to-[#081A30]/40 z-10" />

      {/* Content with entry animations */}
      <div className="relative z-20 mx-auto max-w-3xl px-6 pb-24 pt-10 text-center text-white overflow-hidden">
        {/* Welcome Badge - Slides in from LEFT */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isLoaded
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[200px]"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#E8871E] font-['Poppins',_sans-serif]">
            Welcome to
          </p>
        </div>

        {/* Heading - Slides in from LEFT with delay */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isLoaded
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[300px]"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <h1
            key={`heading-${currentSlide}`}
            className="mb-5 text-4xl font-extrabold leading-tight sm:text-5xl font-['Poppins',_sans-serif]"
          >
            {headingLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
        </div>

        {/* Description - Slides UP from BOTTOM */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[200px]"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p
            key={`desc-${currentSlide}`}
            className="mx-auto mb-8 max-w-md text-base leading-relaxed text-[#F2F4F7] font-['Poppins',_sans-serif]"
          >
            {currentSlideData.description}
          </p>
        </div>

        {/* Button - Slides UP from BOTTOM with delay */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[250px]"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-[#2E9B5C] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#2E9B5C]/30 transition-all hover:-translate-y-0.5 hover:bg-[#278a51] hover:shadow-xl hover:shadow-[#2E9B5C]/40 font-['Poppins',_sans-serif]"
          >
            Apply Now
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-sm">
              →
            </span>
          </a>
        </div>
      </div>

      {/* Slide indicators / dots */}
      <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-2.5 bg-[#E8871E]"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 flex h-11 w-11 -translate-x-1/2 animate-bounce items-center justify-center rounded-full border border-white/60">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-none stroke-white stroke-2"
        >
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" />
        </svg>
      </div>

      {/* Bottom wave */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-[15] w-full leading-[0]">
        <svg
          className="h-16 w-full sm:h-24"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,120 L0,120 Z"
            fill="#081A30"
          />
        </svg>
      </div>
    </section>
  );
}