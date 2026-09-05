"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ----------------------------------------------------------------------------
// Theme tokens
// ----------------------------------------------------------------------------
const BG = "#0B0F19";
const GOLD = "#E8CA5E";
const BLUE = "#0066FF";

// Multiple slides data
const SLIDES = [
  {
    id: 1,
    image: "/Hero/desktop1.png",
    mobileImage: "/Hero/mobile1.png",
    heading: "Build Your Future With Excellence",
    description:
      "A modern learning environment where students discover knowledge, develop confidence, and prepare for a successful future.",
  },
  {
    id: 2,
    image: "/Hero/desktop2.png",
    mobileImage: "/Hero/mobile2.png",
    heading: "Learn. Grow. Succeed.",
    description:
      "Empowering students through quality education, experienced faculty, and an environment designed for academic growth.",
  },
  {
    id: 3,
    image: "/Hero/desktop3.png",
    // Only two mobile-specific images were provided, so this slide falls
    // back to the desktop image on mobile too.
    mobileImage: null,
    heading: "A Place Where Potential Becomes Success",
    description:
      "Join a community focused on achievement, character, innovation, and lifelong learning.",
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
    // Defer state update to next animation frame to avoid synchronous setState
    // which can trigger cascading renders and lint warnings.
    let raf = 0;
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
      raf = window.requestAnimationFrame(() => setIsLoaded(true));
    } else {
      // Fallback for environments without requestAnimationFrame
      const t = setTimeout(() => setIsLoaded(true), 0);
      return () => clearTimeout(t);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
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
      style={{ backgroundColor: BG }}
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
              {slide.mobileImage ? (
                <>
                  <Image
                    src={slide.mobileImage}
                    alt={`Slide ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="block object-cover object-bottom sm:hidden"
                    sizes="100vw"
                  />
                  <Image
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="hidden object-cover object-bottom sm:block"
                    sizes="100vw"
                  />
                </>
              ) : (
                <Image
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover object-bottom"
                  sizes="100vw"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Flat dark overlay for legibility — no gradient */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: "rgba(11,15,25,0.35)" }}
      />

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
          <p
            className="mb-4 text-sm font-medium tracking-wide"
            style={{ color: BLUE }}
          >
            Admissions open for the new academic session
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
            className="mb-5 text-4xl font-semibold leading-tight sm:text-5xl"
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
            className="mx-auto mb-8 max-w-md text-base leading-relaxed text-gray-200"
          >
            {currentSlideData.description}
          </p>
        </div>

        {/* Buttons - Slide UP from BOTTOM with delay (fixed across all slides) */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isLoaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[250px]"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/admissions"
              className="inline-flex cursor-pointer items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: GOLD, color: BG }}
            >
              Start Your Application
            </a>
            <a
              href="/contact"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/70"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Slide indicators / dots */}
      <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all duration-300 rounded-full cursor-pointer"
            style={{
              width: index === currentSlide ? "2rem" : "0.625rem",
              height: "0.625rem",
              backgroundColor:
                index === currentSlide ? GOLD : "rgba(255,255,255,0.35)",
            }}
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
            fill={BG}
          />
        </svg>
      </div>
    </section>
  );
}