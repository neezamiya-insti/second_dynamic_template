/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useRef, useState } from "react";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface ValueCard {
  id: string;
  title: string;
  description: string[];
  color: string;
  fillType: "filled" | "outline";
}

interface CoreValuesData {
  badgeText: string;
  heading: string;
  description: string;
  values: ValueCard[];
}

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: CoreValuesData;
  expiresAt: number;
}

const coreValuesCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): CoreValuesData | null {
  const entry = coreValuesCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    coreValuesCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: CoreValuesData): void {
  coreValuesCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = coreValuesCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) coreValuesCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Fixed positions — 6 slots (same as original design)
// ----------------------------------------------------------------------------
const CARD_POSITIONS = [
  { x: 40,  y: 160, width: 200, height: 80 },
  { x: 345, y: 50,  width: 200, height: 90 },
  { x: 700, y: 140, width: 220, height: 80 },
  { x: 40,  y: 385, width: 205, height: 80 },
  { x: 330, y: 425, width: 220, height: 80 },
  { x: 690, y: 385, width: 220, height: 80 },
];

// Connectors — fixed 6 paths
const CONNECTORS = [
  { d: "M200,240 V284 A16,16 0 0,0 216,300 H390", delay: 400 },
  { d: "M445,140 V264 A16,16 0 0,0 461,280 H500", delay: 450 },
  { d: "M740,220 V284 A16,16 0 0,1 724,300 H610", delay: 500 },
  { d: "M200,385 V366 A16,16 0 0,1 216,350 H390", delay: 550 },
  { d: "M440,425 V386 A16,16 0 0,1 456,370 H500", delay: 600 },
  { d: "M730,385 V366 A16,16 0 0,0 714,350 H610", delay: 650 },
];

const CONNECTION_DOTS: [number, number][] = [
  [200, 240], [390, 300], [445, 140], [500, 280],
  [740, 220], [610, 300], [200, 385], [390, 350],
  [440, 425], [500, 370], [730, 385], [610, 350],
];

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function CoreValues() {
  const [isVisible, setIsVisible] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CoreValuesData | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const collegeId = "10";
  const CACHE_KEY = `core_values_${collegeId}`;

  // Mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch data
  useEffect(() => {
    if (!mounted) return;

    // ✅ Helper — description ko 2 lines me todo (useEffect ke ANDAR)
    function splitDescription(text: string): string[] {
      if (!text) return [""];
      const trimmed = text.trim();

      // Agar already chhoti hai (60 chars se kam) — 1 line
      if (trimmed.length <= 60) return [trimmed];

      // Words me tod do
      const words = trimmed.split(" ");
      const midpoint = Math.ceil(words.length / 2);
      const line1 = words.slice(0, midpoint).join(" ");
      const line2 = words.slice(midpoint).join(" ");

      return [line1, line2];
    }

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      console.log("📦 [CoreValues] Loading from memory cache");
      setData(cached);
      return;
    }

    async function fetchData() {
      try {
        console.log("🔄 [CoreValues] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=CoreValues`
        );
        const result = await res.json();
        console.log("📦 [CoreValues] API Response:", result);

        if (
          result.success &&
          result.content &&
          Array.isArray(result.content.values) &&
          result.content.values.length > 0
        ) {
          const c = result.content;
          const fetched: CoreValuesData = {
            badgeText: c.badgeText || "What We Stand For",
            heading: c.heading || "Our Core Values",
            description: c.description || "",
            values: c.values.slice(0, 6).map((v: any, idx: number) => ({
              id: `value_${idx}`,
              title: (v.title || "").toUpperCase(),
              description: splitDescription(v.description || ""),
              color: v.color || "#E8CA5E",
              fillType: idx % 2 === 0 ? "outline" : "filled",
            })),
          };
          cacheSet(CACHE_KEY, fetched);
          setData(fetched);
        } else {
          console.log("⚠️ [CoreValues] No data from API");
          setData(null);
        }
      } catch (err) {
        console.error("❌ [CoreValues] Error:", err);
        setData(null);
      }
    }

    fetchData();
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [data]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setEntranceDone(true), 1600);
    return () => clearTimeout(timer);
  }, [isVisible]);

  // ✅ Loading skeleton
  if (!mounted || !data) {
    return (
      <div className="w-full bg-[#111722] p-6 sm:p-8 md:p-10 overflow-hidden">
        <div className="h-8 w-64 bg-white/5 rounded mb-10 animate-pulse" />
        <div className="hidden sm:block h-[640px] bg-white/5 rounded-[30px] animate-pulse" />
        <div className="sm:hidden space-y-4">
          <div className="h-20 bg-white/5 rounded-[16px] animate-pulse" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/5 rounded-[14px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ✅ Data empty
  if (data.values.length === 0) return null;

  // Merge values with fixed positions
  const positionedValues = data.values.map((v, idx) => ({
    ...v,
    ...CARD_POSITIONS[idx % CARD_POSITIONS.length],
  }));

  const getHoverColor = () => {
    if (!hoveredCard) return "#E8CA5E";
    if (hoveredCard === "hub") return "#0B0F19";
    const match = positionedValues.find((v) => v.id === hoveredCard);
    return match ? match.color : "#E8CA5E";
  };

  return (
    <div
      ref={sectionRef}
      className="w-full font-['Inter',sans-serif] overflow-hidden px-0 py-8 sm:py-12"
    >
      <div className="w-full">
        <div className="bg-[#111722] p-6 sm:p-8 md:p-10">
          {/* Heading */}
          <div
            className={`max-w-[520px] mb-8 sm:mb-10 transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[100px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            {data.badgeText && (
              <p className="text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.2em] text-[#E8CA5E] mb-2">
                {data.badgeText}
              </p>
            )}
            <h1 className="font-['Poppins',sans-serif] font-bold text-[24px] sm:text-[27px] md:text-[30px] leading-[1.35] text-white m-0">
              {data.heading}
            </h1>
            {data.description && (
              <p className="text-[13px] sm:text-sm text-white/60 mt-3 leading-relaxed max-w-[500px]">
                {data.description}
              </p>
            )}
          </div>

          {/* ============ DESKTOP / TABLET: SVG diagram ============ */}
          <div
            className={`hidden sm:block bg-[#0B0F19] border border-white/10 rounded-[30px] p-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <svg viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg" className="block w-full h-auto">
              <defs>
                <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
                </filter>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#E8CA5E" floodOpacity="0.3" />
                </filter>
                <filter id="pulseGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#E8CA5E" floodOpacity="0.9" />
                </filter>
              </defs>

              {/* Connectors */}
              <g className="fill-none stroke-[#2A2F3F] stroke-[1.6] stroke-linecap-round">
                {CONNECTORS.slice(0, positionedValues.length).map((c, i) => (
                  <path
                    key={i}
                    className="transition-all duration-[1200ms] ease-out"
                    style={{
                      transitionDelay: `${c.delay}ms`,
                      strokeDasharray: 1000,
                      strokeDashoffset: isVisible ? 0 : 1000,
                      opacity: isVisible ? 1 : 0,
                    }}
                    d={c.d}
                  />
                ))}
              </g>

              {/* Traveling pulse dots */}
              {isVisible && (
                <g>
                  {CONNECTORS.slice(0, positionedValues.length).map((c, i) => (
                    <circle key={`pulse-${i}`} r="3.2" fill="#E8CA5E" filter="url(#pulseGlow)" opacity="0">
                      <animateMotion
                        dur="1.4s"
                        begin={`${c.delay + 1200}ms`}
                        repeatCount="1"
                        fill="freeze"
                        path={c.d}
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.1;0.8;1"
                        dur="1.4s"
                        begin={`${c.delay + 1200}ms`}
                        repeatCount="1"
                        fill="freeze"
                      />
                    </circle>
                  ))}
                </g>
              )}

              {/* Connection Dots */}
              <g
                className={`transition-opacity duration-[1000ms] ease-out ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: "700ms" }}
              >
                {CONNECTION_DOTS.slice(0, positionedValues.length * 2).map((pos, i) => (
                  <circle
                    key={i}
                    cx={pos[0]}
                    cy={pos[1]}
                    r={hoveredCard ? 5 : 4}
                    fill={getHoverColor()}
                    style={{ transition: "fill 250ms ease-out, r 250ms ease-out" }}
                  />
                ))}
              </g>

              {/* Value Cards */}
              {positionedValues.map((card, index) => {
                const isFilled = card.fillType === "filled";
                const isHovered = hoveredCard === card.id;

                return (
                  <g
                    key={card.id}
                    className="cursor-pointer"
                    style={{
                      filter: isHovered
                        ? "drop-shadow(0 4px 6px rgba(0,0,0,0.3)) drop-shadow(0 0 10px rgba(232,202,94,0.35))"
                        : "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
                      transition: "filter 280ms ease-out",
                    }}
                    onMouseEnter={() => setHoveredCard(card.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <rect
                      className={isHovered ? "scale-[1.035]" : "scale-100"}
                      style={{
                        transformOrigin: `${card.x + card.width / 2}px ${card.y + card.height / 2}px`,
                        transition: entranceDone
                          ? "transform 220ms ease-out"
                          : `opacity 500ms ease-out ${800 + index * 100}ms, transform 220ms ease-out`,
                        fill: isFilled ? card.color : "#0B0F19",
                        stroke: card.color,
                        strokeWidth: isFilled ? "0" : "1.6",
                        opacity: isVisible ? 1 : 0,
                      }}
                      x={card.x}
                      y={card.y}
                      width={card.width}
                      height={card.height}
                      rx="12"
                    />

                    {/* Title */}
                    <text
                      className="font-['Inter',sans-serif] font-bold text-[13.5px] transition-all duration-300"
                      style={{
                        fill: isFilled ? "#0B0F19" : card.color,
                        opacity: isVisible ? 1 : 0,
                        transitionDelay: `${900 + index * 100}ms`,
                      }}
                      x={card.x + card.width / 2}
                      y={card.y + 33}
                      textAnchor="middle"
                    >
                      {card.title}
                    </text>

                    {/* Description */}
                    {card.description.map((line, i) => (
                      <text
                        key={i}
                        className={`font-['Inter',sans-serif] font-normal text-[11px] transition-all duration-300 ${
                          isFilled ? "fill-[#0B0F19]/80" : "fill-[#9CA3AF]"
                        }`}
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transitionDelay: `${1000 + index * 100 + i * 50}ms`,
                        }}
                        x={card.x + card.width / 2}
                        y={card.y + 53 + i * 14}
                        textAnchor="middle"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}

              {/* Hub - Core Values Center */}
              <g
                filter="url(#soft)"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredCard("hub")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <rect
                  className={`transition-all duration-500 ease-out fill-[#E8CA5E] stroke-[#E8CA5E] ${
                    hoveredCard === "hub" ? "scale-105" : "scale-100"
                  }`}
                  style={{
                    transformOrigin: "500px 325px",
                    transitionDelay: "700ms",
                    opacity: isVisible ? 1 : 0,
                  }}
                  x="390"
                  y="280"
                  width="220"
                  height="90"
                  rx="14"
                />

                <text
                  className="font-['Poppins',sans-serif] font-bold text-[15px] fill-[#0B0F19] transition-all duration-300"
                  style={{ opacity: isVisible ? 1 : 0, transitionDelay: "750ms" }}
                  x="500"
                  y="316"
                  textAnchor="middle"
                >
                  OUR CORE VALUES
                </text>
                <text
                  className="font-['Inter',sans-serif] font-medium text-[11px] fill-[#0B0F19]/70 transition-all duration-300"
                  style={{ opacity: isVisible ? 1 : 0, transitionDelay: "800ms" }}
                  x="500"
                  y="337"
                  textAnchor="middle"
                >
                  What we stand for
                </text>
              </g>
            </svg>
          </div>

          {/* ============ MOBILE: stacked cards ============ */}
          <div className="sm:hidden relative">
            {/* Hub */}
            <div
              className={`relative z-10 rounded-[16px] bg-[#E8CA5E] px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <p className="font-['Poppins',sans-serif] font-bold text-[15px] text-[#0B0F19] m-0">
                OUR CORE VALUES
              </p>
              <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#0B0F19]/70 mt-1 mb-0">
                What we stand for
              </p>
            </div>

            {/* Vertical connector line */}
            <div className="relative pl-4">
              <div className="absolute left-[15px] top-0 bottom-0 w-[2px] overflow-hidden">
                <div
                  className="w-full bg-gradient-to-b from-[#2A2F3F] to-[#2A2F3F] origin-top transition-transform duration-[1400ms] ease-out"
                  style={{
                    height: "100%",
                    transitionDelay: "300ms",
                    transform: isVisible ? "scaleY(1)" : "scaleY(0)",
                  }}
                />
                {isVisible && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#E8CA5E]"
                    style={{
                      boxShadow: "0 0 8px 2px rgba(232,202,94,0.7)",
                      animation: "mobilePulseDown 1.6s ease-in-out 1.7s 1 forwards",
                    }}
                  />
                )}
              </div>

              <div className="flex flex-col gap-4 pt-6 pb-2">
                {positionedValues.map((card, index) => {
                  const isFilled = card.fillType === "filled";
                  return (
                    <div key={card.id} className="relative pl-3">
                      <div
                        className="absolute left-[-2px] top-[18px] w-[8px] h-[8px] rounded-full transition-opacity duration-500"
                        style={{
                          backgroundColor: card.color,
                          opacity: isVisible ? 1 : 0,
                          transitionDelay: `${500 + index * 120}ms`,
                        }}
                      />
                      <div
                        className="rounded-[14px] px-4 py-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out"
                        style={{
                          backgroundColor: isFilled ? card.color : "#0B0F19",
                          border: isFilled ? "none" : `1.6px solid ${card.color}`,
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? "translateY(0)" : "translateY(16px)",
                          transitionDelay: `${550 + index * 120}ms`,
                        }}
                      >
                        <p
                          className="font-['Inter',sans-serif] font-bold text-[13px] m-0"
                          style={{ color: isFilled ? "#0B0F19" : card.color }}
                        >
                          {card.title}
                        </p>
                        <p
                          className="font-['Inter',sans-serif] font-normal text-[11.5px] mt-1 mb-0 leading-snug"
                          style={{ color: isFilled ? "#0B0F19/80" : "#9CA3AF" }}
                        >
                          {card.description.join(" ")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div
            className={`flex justify-center mt-8 sm:mt-10 transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            style={{ transitionDelay: "1800ms" }}
          >
            <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#E8CA5E] to-transparent rounded-full" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .transition-all {
          transition-property: all;
        }
        .ease-out {
          transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
        @keyframes mobilePulseDown {
          0% {
            top: 0%;
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}