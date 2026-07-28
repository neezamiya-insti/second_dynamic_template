"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const TIMELINE = [
  {
    year: "2015",
    title: "The Beginning",
    desc: "Laid the foundation with a vision to provide quality education.",
    seed: "campus2015",
  },
  {
    year: "2017",
    title: "Growing Stronger",
    desc: "Expanded our facilities and introduced innovative learning.",
    seed: "classroom2017",
  },
  {
    year: "2019",
    title: "Rising Higher",
    desc: "Students excelled in academics, sports and co-curricular activities.",
    seed: "team2019",
  },
  {
    year: "2021",
    title: "National Recognition",
    desc: "Received national awards for excellence in greater impact.",
    seed: "award2021",
  },
  {
    year: "2023",
    title: "Global Partnerships",
    desc: "Collaborated with international institutions for greater impact.",
    seed: "partners2023",
  },
  {
    year: "2025",
    title: "Towards the Future",
    desc: "Continuing our journey towards a brighter and better tomorrow.",
    seed: "future2025",
  },
];

// Staircase geometry (desktop) — each step is taller than the last, so the row
// visually climbs from bottom-left (2015) to top-right (2025).
const STEP = 36; // px added per step
const BASE = 22; // px height of the first (shortest) step
const CONTENT_ALLOWANCE = 190; // px reserved above the tallest bar for circle+text

// Staircase geometry (mobile) — same idea, scaled down since it scrolls
// horizontally on small screens instead of squeezing into one row.
const STEP_MOBILE = 20;
const BASE_MOBILE = 14;
const CONTENT_ALLOWANCE_MOBILE = 150;

export default function JourneyTimeline() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // fire once, then stop observing — keeps it cheap
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const barHeights = TIMELINE.map((_, i) => BASE + i * STEP);
  const maxBar = Math.max(...barHeights);
  const rowHeight = maxBar + CONTENT_ALLOWANCE;

  const barHeightsMobile = TIMELINE.map((_, i) => BASE_MOBILE + i * STEP_MOBILE);
  const maxBarMobile = Math.max(...barHeightsMobile);
  const rowHeightMobile = maxBarMobile + CONTENT_ALLOWANCE_MOBILE;

  return (
    <section ref={sectionRef} className="overflow-hidden px-5 pb-5 pt-16 text-center">
      <div
        className="mb-2.5 flex items-center justify-center gap-2 text-[12.5px] font-extrabold tracking-wider text-[#E8871E] transition-all duration-700 ease-out will-change-transform"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <span className="h-px w-[18px] bg-[#E8871E]" />
        OUR JOURNEY
        <span className="h-px w-[18px] bg-[#E8871E]" />
      </div>

      <h2
        className="mb-2 text-2xl font-extrabold text-[#0B2340] transition-all duration-700 ease-out will-change-transform"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(24px)",
          transitionDelay: "80ms",
        }}
      >
        Building Excellence Over the Years
      </h2>

      <p
        className="mb-11 text-[13.5px] text-[#5B6472] transition-all duration-700 ease-out will-change-transform"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(24px)",
          transitionDelay: "150ms",
        }}
      >
        A timeline of our growth, achievements and continued pursuit of
        excellence.
      </p>

      {/* ===================== DESKTOP / TABLET — staircase ===================== */}
      <div
        className="relative mx-auto hidden max-w-6xl items-end justify-between gap-3 md:flex"
        style={{ height: `${rowHeight}px` }}
      >
        {TIMELINE.map((item, i) => (
          <div
            key={item.year}
            className="group relative flex h-full flex-1 flex-col items-center justify-end transition-all duration-[700ms] ease-out will-change-transform"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(60px)",
              transitionDelay: `${220 + i * 90}ms`,
            }}
          >
            {/* content sits directly above its step */}
            <div className="mb-3 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
              <div className="relative mb-3 h-[62px] w-[62px] overflow-hidden rounded-full border-[3px] border-[#E8871E] bg-gray-200 shadow-md">
                <Image
                  src={`https://picsum.photos/seed/${item.seed}/140/140`}
                  alt={item.year}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mb-1 text-[13px] font-extrabold text-[#E8871E]">
                {item.year}
              </div>
              <div className="mb-1 text-[13px] font-bold leading-snug text-[#0B2340]">
                {item.title}
              </div>
              <p className="mx-auto max-w-[120px] text-[11px] leading-relaxed text-[#5B6472]">
                {item.desc}
              </p>
            </div>

            {/* the step itself */}
            <div
              className="w-3/5 rounded-t-md bg-[#E8871E] transition-colors duration-300 group-hover:bg-[#0B2340]"
              style={{ height: `${barHeights[i]}px` }}
            />
          </div>
        ))}
      </div>

      {/* ===================== MOBILE — same staircase, horizontally scrollable ===================== */}
      <div className="md:hidden">
        <div
          className="scrollbar-hide -mx-5 flex items-end gap-4 overflow-x-auto px-5 pb-4"
          style={{
            height: `${rowHeightMobile}px`,
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {TIMELINE.map((item, i) => (
            <div
              key={item.year}
              className="flex h-full w-[92px] flex-shrink-0 flex-col items-center justify-end transition-all duration-700 ease-out will-change-transform"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${220 + i * 90}ms`,
                scrollSnapAlign: "center",
              }}
            >
              {/* content sits directly above its step, same as desktop */}
              <div className="mb-2.5 flex flex-col items-center">
                <div className="relative mb-2 h-[48px] w-[48px] overflow-hidden rounded-full border-[3px] border-[#E8871E] bg-gray-200 shadow-md">
                  <Image
                    src={`https://picsum.photos/seed/${item.seed}/140/140`}
                    alt={item.year}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mb-1 text-[11.5px] font-extrabold text-[#E8871E]">
                  {item.year}
                </div>
                <div className="mb-1 text-[11.5px] font-bold leading-snug text-[#0B2340]">
                  {item.title}
                </div>
                <p className="mx-auto max-w-[86px] text-[9.5px] leading-relaxed text-[#5B6472]">
                  {item.desc}
                </p>
              </div>

              {/* the step itself */}
              <div
                className="w-3/5 rounded-t-md bg-[#E8871E]"
                style={{ height: `${barHeightsMobile[i]}px` }}
              />
            </div>
          ))}
        </div>

        {/* subtle hint that the staircase scrolls */}
        <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-[#9AA3AF]">
          <span>swipe to see full journey</span>
        </div>
      </div>
    </section>
  );
}