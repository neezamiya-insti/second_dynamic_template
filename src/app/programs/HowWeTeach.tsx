/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface Step {
  id: string;
  number: string;
  title: string;
  description: string[];
  color: string;
}

interface HowWeTeachData {
  badgeText: string;
  heading: string;
  headingHighlight: string;
  subtitle: string;
  steps: Step[];
}

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: HowWeTeachData;
  expiresAt: number;
}

const howWeTeachCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): HowWeTeachData | null {
  const entry = howWeTeachCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    howWeTeachCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: HowWeTeachData): void {
  howWeTeachCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = howWeTeachCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) howWeTeachCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function HowWeTeach() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<HowWeTeachData | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const collegeId = "10";
  const CACHE_KEY = `how_we_teach_${collegeId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached && cached.steps.length > 0) {
      console.log("📦 [HowWeTeach] Loading from memory cache");
      setData(cached);
      return;
    }

    async function fetchHowWeTeach() {
      try {
        console.log("🔄 [HowWeTeach] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=HowWeTeach`
        );
        const result = await res.json();
        console.log("📦 [HowWeTeach] API Response:", result);

        if (
          result.success &&
          result.content &&
          Array.isArray(result.content.steps) &&
          result.content.steps.length > 0
        ) {
          const c = result.content;
          const fetched: HowWeTeachData = {
            badgeText: c.badgeText || "HOW WE TEACH",
            heading: c.heading || "Our Learning",
            headingHighlight: c.headingHighlight || "Methodology",
            subtitle: c.subtitle || "",
            steps: c.steps.map((s: any, idx: number) => ({
              id: s.id || `step_${idx}`,
              number: s.number || String(idx + 1).padStart(2, "0"),
              title: s.title || "",
              description: Array.isArray(s.description)
                ? s.description
                : typeof s.description === "string"
                ? [s.description]
                : [],
              color: s.color || "#E8CA5E",
            })),
          };
          console.log("✅ [HowWeTeach] Data loaded:", fetched.steps.length);
          cacheSet(CACHE_KEY, fetched);
          setData(fetched);
        } else {
          console.log("⚠️ [HowWeTeach] No data from API");
          setData(null);
        }
      } catch (err) {
        console.error("❌ [HowWeTeach] Error:", err);
        setData(null);
      }
    }

    fetchHowWeTeach();
  }, [mounted]);

  // Intersection observer
  useEffect(() => {
    if (!data) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [data]);

  // ✅ Data nahi to kuch nahi
  if (!mounted || !data || data.steps.length === 0) return null;

  // ==================== POSITIONS (same for any number of steps) ====================
  // Har step ke liye hardcoded positions — same staircase pattern
  const stepPositions = [
    { cx: 90, cy: 210, textX: 155 },
    { cx: 360, cy: 378, textX: 430 },
    { cx: 565, cy: 540, textX: 635 },
    { cx: 830, cy: 678, textX: 900 },
  ];

  // Steps ko positions ke saath merge karo
  const positionedSteps = data.steps.map((step, idx) => {
    const pos = stepPositions[idx % stepPositions.length];
    return { ...step, ...pos };
  });

  // ==================== CONNECTORS (same for any number of steps) ====================
  const connectors = [
    {
      seg1: "M90,256 V362 A16,16 0 0,0 106,378 H197",
      seg2: "M217,378 H308",
      c1: positionedSteps[0]?.color || "#E8CA5E",
      c2: positionedSteps[1]?.color || "#E8CA5E",
      delay1: 200,
      delay2: 500,
      chevron: { x: 198, y: 371 },
      chevronDelay: 600,
    },
    {
      seg1: "M360,424 V524 A16,16 0 0,0 376,540 H434",
      seg2: "M454,540 H513",
      c1: positionedSteps[1]?.color || "#E8CA5E",
      c2: positionedSteps[2]?.color || "#E8CA5E",
      delay1: 800,
      delay2: 1100,
      chevron: { x: 435, y: 533 },
      chevronDelay: 1200,
    },
    {
      seg1: "M565,586 V662 A16,16 0 0,0 581,678 H669",
      seg2: "M689,678 H778",
      c1: positionedSteps[2]?.color || "#E8CA5E",
      c2: positionedSteps[3]?.color || "#E8CA5E",
      delay1: 1400,
      delay2: 1700,
      chevron: { x: 670, y: 671 },
      chevronDelay: 1800,
    },
  ];

  // Theme Colors
  const colors = {
    chevron: "#2A2F3F",
    gray: "#9CA3AF",
  };

  // Step ID to icon map
  const iconById: Record<string, React.ReactNode> = {
    interactive: (
      <>
        <path d="M12 6C10 4.5 7 4 4 4.5V17c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5C17 4 14 4.5 12 6z" />
        <path d="M12 6v12" />
      </>
    ),
    inquiry: (
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1.1 2.1h4.8c.1-.9.5-1.6 1.1-2.1A6 6 0 0 0 12 3z" />
    ),
    collaborative: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20c0-3.3 2.7-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
        <circle cx="16.5" cy="9" r="2.5" />
        <path d="M14.8 14.8c.5-.2 1-.3 1.7-.3 2.8 0 5 2.2 5 5" />
      </>
    ),
    personalized: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <path d="M17 7l3-3m0 0h-2.2M20 4v2.2" />
      </>
    ),
  };

  // Default fallback icons by index
  const defaultIcons = [
    iconById.interactive,
    iconById.inquiry,
    iconById.collaborative,
    iconById.personalized,
  ];

  const getIcon = (stepId: string, index: number) => {
    return iconById[stepId] || defaultIcons[index % defaultIcons.length];
  };

  const dottedArc = (cx: number, cy: number) =>
    `M${cx - 18},${cy + 49} A52,52 0 0,1 ${cx - 40},${cy - 33}`;

  return (
    <div ref={sectionRef} className={`${poppins.className} w-full bg-[#111722] overflow-hidden`}>
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6 py-12">
        {/* Eyebrow - Center */}
        <div
          className={`flex items-center justify-center gap-3.5 mb-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <span className="w-11 h-[2px] rounded-full" style={{ backgroundColor: positionedSteps[0]?.color || "#E8CA5E" }} />
          <span className="font-bold text-[13px] tracking-[3px] text-[#E8CA5E]">
            {data.badgeText}
          </span>
          <span className="w-11 h-[2px] rounded-full" style={{ backgroundColor: positionedSteps[0]?.color || "#E8CA5E" }} />
        </div>

        {/* Heading - Center */}
        <h1
          className={`font-['Poppins',sans-serif] font-extrabold text-center whitespace-nowrap leading-[1.2] m-0 mb-2 transition-all duration-700 ease-out delay-100 text-[22px] xs:text-[26px] sm:text-[34px] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ color: "#FFFFFF" }}
        >
          {data.heading}{" "}
          <span style={{ color: positionedSteps[0]?.color || "#E8CA5E" }}>
            {data.headingHighlight}
          </span>
        </h1>

        {/* Subtitle - Center */}
        <p
          className={`max-w-[600px] mx-auto text-center text-[14.5px] sm:text-[16.5px] leading-relaxed mb-4 sm:mb-6 transition-all duration-700 ease-out delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ color: colors.gray }}
        >
          {data.subtitle}
        </p>

        {/* ============ DESKTOP / TABLET: SVG staircase diagram ============ */}
        <div className="hidden sm:block">
          <svg viewBox="0 70 1150 770" xmlns="http://www.w3.org/2000/svg" className="block w-full h-auto">
            <defs>
              <filter id="htw-shadow" x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Connectors */}
            <g fill="none" strokeWidth={2.4} strokeLinecap="round">
              {connectors.map((c, i) => (
                <React.Fragment key={i}>
                  <path
                    d={c.seg1}
                    stroke={c.c1}
                    style={{
                      strokeDasharray: 400,
                      strokeDashoffset: isVisible ? 0 : 400,
                      transition: `stroke-dashoffset 1s ease-out ${c.delay1}ms`,
                    }}
                  />
                  <path
                    d={c.seg2}
                    stroke={c.c2}
                    style={{
                      strokeDasharray: 400,
                      strokeDashoffset: isVisible ? 0 : 400,
                      transition: `stroke-dashoffset 1s ease-out ${c.delay2}ms`,
                    }}
                  />
                </React.Fragment>
              ))}
            </g>

            {/* Chevrons */}
            {connectors.map((c, i) => (
              <g
                key={`chev-${i}`}
                fill="none"
                stroke={colors.chevron}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(6px)",
                  transition: `opacity 500ms ease-out ${c.chevronDelay}ms, transform 500ms ease-out ${c.chevronDelay}ms`,
                }}
              >
                <path d={`M${c.chevron.x},${c.chevron.y} l7,7 l-7,7 M${c.chevron.x + 8},${c.chevron.y} l7,7 l-7,7`} />
              </g>
            ))}

            {/* Steps */}
            {positionedSteps.map((step, index) => {
              const prevColor = index === 0 ? step.color : positionedSteps[index - 1].color;
              const delay = 200 + index * 300;
              return (
                <g
                  key={step.id}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transition: `opacity 600ms ease-out ${delay}ms, transform 700ms ease-out ${delay}ms`,
                  }}
                >
                  {/* dotted incoming arc */}
                  <path
                    d={dottedArc(step.cx, step.cy)}
                    fill="none"
                    stroke={prevColor}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray="1 7"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 800ms ease-out ${delay + 100}ms`,
                    }}
                  />

                  {/* icon circle */}
                  <circle cx={step.cx} cy={step.cy} r={46} fill="#0B0F19" filter="url(#htw-shadow)" stroke={step.color} strokeWidth={1.5} />
                  <g
                    transform={`translate(${step.cx - 20},${step.cy - 20}) scale(1.65)`}
                    stroke={step.color}
                    fill="none"
                    strokeWidth={1.6}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {getIcon(step.id, index)}
                  </g>

                  {/* number */}
                  <text
                    x={step.textX}
                    y={step.cy - 18}
                    className={`font-['Poppins',sans-serif] font-bold text-[19px]`}
                    fill={step.color}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                      transition: `opacity 600ms ease-out ${delay + 200}ms, transform 600ms ease-out ${delay + 200}ms`,
                    }}
                  >
                    {step.number}
                  </text>

                  {/* title */}
                  <text
                    x={step.textX}
                    y={step.cy + 24}
                    className={`font-['Poppins',sans-serif] font-bold text-[17px]`}
                    fill="#FFFFFF"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                      transition: `opacity 600ms ease-out ${delay + 250}ms, transform 600ms ease-out ${delay + 250}ms`,
                    }}
                  >
                    {step.title}
                  </text>

                  {/* description lines */}
                  {step.description.map((line, i) => (
                    <text
                      key={i}
                      x={step.textX}
                      y={step.cy + 49 + i * 20}
                      className={`font-['Poppins',sans-serif] font-normal text-[13.2px]`}
                      fill={colors.gray}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                        transition: `opacity 600ms ease-out ${delay + 300 + i * 100}ms, transform 600ms ease-out ${delay + 300 + i * 100}ms`,
                      }}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>

        {/* ============ MOBILE: stacked layout ============ */}
        <div className="sm:hidden">
          <div className="flex flex-col gap-6">
            {positionedSteps.map((step, index) => {
              const isLast = index === positionedSteps.length - 1;
              const delay = 200 + index * 200;
              return (
                <div
                  key={step.id}
                  className={`relative flex gap-4 ${isLast ? "pb-0" : "pb-6"} transition-all duration-700 ease-out`}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {!isLast && (
                    <span
                      className="absolute left-[29px] top-[60px] bottom-0 w-[2px]"
                      style={{
                        backgroundImage: `repeating-linear-gradient(to bottom, ${step.color} 0 4px, transparent 4px 10px)`,
                        opacity: isVisible ? 1 : 0,
                        transition: `opacity 800ms ease-out ${delay + 100}ms`,
                      }}
                    />
                  )}
                  <div
                    className="relative z-10 flex-none w-[60px] h-[60px] rounded-full bg-[#0B0F19] flex items-center justify-center transition-all duration-500 border border-[#E8CA5E]/30"
                    style={{
                      boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                      transform: isVisible ? "scale(1)" : "scale(0.8)",
                      opacity: isVisible ? 1 : 0,
                      transitionDelay: `${delay + 50}ms`,
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-[26px] h-[26px]"
                      fill="none"
                      stroke={step.color}
                      strokeWidth={1.6}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    >
                      {getIcon(step.id, index)}
                    </svg>
                  </div>
                  <div className="pt-0.5">
                    <p
                      className={`font-['Poppins',sans-serif] font-bold text-[16px] m-0 mb-0.5`}
                      style={{
                        color: step.color,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                        transition: `opacity 600ms ease-out ${delay + 150}ms, transform 600ms ease-out ${delay + 150}ms`,
                      }}
                    >
                      {step.number}
                    </p>
                    <p
                      className={`font-['Poppins',sans-serif] font-bold text-[15.5px] m-0 mb-1.5`}
                      style={{
                        color: "#FFFFFF",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                        transition: `opacity 600ms ease-out ${delay + 200}ms, transform 600ms ease-out ${delay + 200}ms`,
                      }}
                    >
                      {step.title}
                    </p>
                    <p
                      className={`font-['Poppins',sans-serif] text-[13.5px] leading-relaxed m-0`}
                      style={{
                        color: colors.gray,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                        transition: `opacity 600ms ease-out ${delay + 250}ms, transform 600ms ease-out ${delay + 250}ms`,
                      }}
                    >
                      {step.description.join(" ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}