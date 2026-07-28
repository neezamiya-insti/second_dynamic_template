"use client";

import React, { useEffect, useRef, useState } from "react";

interface ValueCard {
  id: string;
  title: string;
  description: string[];
  color: string;
  fillType: "filled" | "outline";
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CoreValues() {
  const [isVisible, setIsVisible] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

  // Once the staggered entrance animation has played out, drop the per-card
  // transition delay so hover feedback (scale + dot color) feels instant.
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setEntranceDone(true), 1600);
    return () => clearTimeout(timer);
  }, [isVisible]);

  // Color the connection dots (and the hub, when relevant) to match whichever
  // card is currently hovered, falling back to the default accent color.
  const getHoverColor = () => {
    if (!hoveredCard) return "#E8871E";
    if (hoveredCard === "hub") return "#0B2340";
    const match = values.find((v) => v.id === hoveredCard);
    return match ? match.color : "#E8871E";
  };

  const values: ValueCard[] = [
    {
      id: "integrity",
      title: "INTEGRITY",
      description: ["Honesty and ethics in", "everything we do"],
      color: "#E8871E",
      fillType: "outline",
      x: 40,
      y: 160,
      width: 200,
      height: 80,
    },
    {
      id: "compassion",
      title: "COMPASSION",
      description: ["A caring environment for", "every individual"],
      color: "#E8871E",
      fillType: "filled",
      x: 345,
      y: 50,
      width: 200,
      height: 90,
    },
    {
      id: "innovation",
      title: "INNOVATION",
      description: ["Creative thinking and new", "ideas in learning"],
      color: "#2E9B5C",
      fillType: "outline",
      x: 700,
      y: 140,
      width: 220,
      height: 80,
    },
    {
      id: "community",
      title: "COMMUNITY",
      description: ["Strong partnerships with", "parents and community"],
      color: "#2E9B5C",
      fillType: "filled",
      x: 40,
      y: 385,
      width: 205,
      height: 80,
    },
    {
      id: "lifelong",
      title: "LIFELONG LEARNING",
      description: ["A love for learning beyond", "the classroom"],
      color: "#0B2340",
      fillType: "outline",
      x: 330,
      y: 425,
      width: 220,
      height: 80,
    },
    {
      id: "excellence",
      title: "EXCELLENCE",
      description: ["Striving for excellence in", "education and growth"],
      color: "#E8871E",
      fillType: "filled",
      x: 690,
      y: 385,
      width: 220,
      height: 80,
    },
  ];

  // Connector paths, each with a fixed length used for the "generating" draw + pulse animation
  const connectors = [
    { d: "M200,240 V284 A16,16 0 0,0 216,300 H390", delay: 400 },
    { d: "M445,140 V264 A16,16 0 0,0 461,280 H500", delay: 450 },
    { d: "M740,220 V284 A16,16 0 0,1 724,300 H610", delay: 500 },
    { d: "M200,385 V366 A16,16 0 0,1 216,350 H390", delay: 550 },
    { d: "M440,425 V386 A16,16 0 0,1 456,370 H500", delay: 600 },
    { d: "M730,385 V366 A16,16 0 0,0 714,350 H610", delay: 650 },
  ];

  return (
    <div ref={sectionRef} className="w-full bg-[#FAF9F6] font-['Inter',sans-serif] overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-[30px] sm:py-[25px] ">
        {/* Heading */}
        <div
          className={`max-w-[520px] mb-8 sm:mb-10 transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[100px]"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <h1 className="font-['Poppins',sans-serif] font-bold text-[24px] sm:text-[27px] md:text-[30px] leading-[1.35] text-[#0B2340] m-0">
            What defines our school<br className="hidden sm:block" />community?
          </h1>
        </div>

        {/* ============ DESKTOP / TABLET: SVG diagram ============ */}
        <div
          className={`hidden sm:block bg-white border border-[#F2F4F7] rounded-[20px] p-[10px] shadow-[0_4px_20px_rgba(11,35,64,0.06)] transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[50px]"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <svg viewBox="0 0 1000 640" xmlns="http://www.w3.org/2000/svg" className="block w-full h-auto">
            <defs>
              <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0B2340" floodOpacity="0.12" />
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#E8871E" floodOpacity="0.3" />
              </filter>
              <filter id="pulseGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#E8871E" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Connectors - "generating" draw-in animation */}
            <g className="fill-none stroke-[#C3CCF2] stroke-[1.6] stroke-linecap-round">
              {connectors.map((c, i) => (
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

            {/* Traveling pulse dots - runs ONCE per connector right after it draws in, showing the flow from the hub out to each value */}
            {isVisible && (
              <g>
                {connectors.map((c, i) => (
                  <circle key={`pulse-${i}`} r="3.2" fill="#E8871E" filter="url(#pulseGlow)" opacity="0">
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

            {/* Connection Dots - color follows whichever card is hovered */}
            <g
              className={`transition-opacity duration-[1000ms] ease-out ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              {[
                [200, 240], [390, 300], [445, 140], [500, 280],
                [740, 220], [610, 300], [200, 385], [390, 350],
                [440, 425], [500, 370], [730, 385], [610, 350]
              ].map((pos, i) => (
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
            {values.map((card, index) => {
              const isFilled = card.fillType === "filled";
              const isHovered = hoveredCard === card.id;

              return (
                <g
                  key={card.id}
                  className="cursor-pointer"
                  style={{
                    filter: isHovered
                      ? "drop-shadow(0 4px 6px rgba(11,35,64,0.12)) drop-shadow(0 0 10px rgba(232,135,30,0.35))"
                      : "drop-shadow(0 4px 6px rgba(11,35,64,0.12))",
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
                      fill: isFilled ? card.color : "white",
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
                      fill: isFilled ? "white" : card.color,
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
                        isFilled ? "fill-[#E4E8FF]" : "fill-[#5B6472]"
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
                className={`transition-all duration-500 ease-out fill-[#0B2340] stroke-[#0B2340] ${
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
                className="font-['Poppins',sans-serif] font-bold text-[15px] fill-white transition-all duration-300"
                style={{ opacity: isVisible ? 1 : 0, transitionDelay: "750ms" }}
                x="500"
                y="316"
                textAnchor="middle"
              >
                OUR CORE VALUES
              </text>
              <text
                className="font-['Inter',sans-serif] font-medium text-[11px] fill-[#AEB8E8] transition-all duration-300"
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

        {/* ============ MOBILE: stacked cards with generating vertical line ============ */}
        <div className="sm:hidden relative">
          {/* Hub */}
          <div
            className={`relative z-10 rounded-[16px] bg-[#0B2340] px-5 py-4 shadow-[0_4px_20px_rgba(11,35,64,0.15)] transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <p className="font-['Poppins',sans-serif] font-bold text-[15px] text-white m-0">
              OUR CORE VALUES
            </p>
            <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#AEB8E8] mt-1 mb-0">
              What we stand for
            </p>
          </div>

          {/* Vertical connector line container */}
          <div className="relative pl-4">
            <div className="absolute left-[15px] top-0 bottom-0 w-[2px] overflow-hidden">
              <div
                className="w-full bg-gradient-to-b from-[#C3CCF2] to-[#C3CCF2] origin-top transition-transform duration-[1400ms] ease-out"
                style={{
                  height: "100%",
                  transitionDelay: "300ms",
                  transform: isVisible ? "scaleY(1)" : "scaleY(0)",
                }}
              />
              {/* Traveling pulse down the line - runs once, right after the line finishes drawing */}
              {isVisible && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-[#E8871E]"
                  style={{
                    boxShadow: "0 0 8px 2px rgba(232,135,30,0.7)",
                    animation: "mobilePulseDown 1.6s ease-in-out 1.7s 1 forwards",
                  }}
                />
              )}
            </div>

            <div className="flex flex-col gap-4 pt-6 pb-2">
              {values.map((card, index) => {
                const isFilled = card.fillType === "filled";
                return (
                  <div key={card.id} className="relative pl-3">
                    {/* dot on the line */}
                    <div
                      className="absolute left-[-2px] top-[18px] w-[8px] h-[8px] rounded-full transition-opacity duration-500"
                      style={{
                        backgroundColor: card.color,
                        opacity: isVisible ? 1 : 0,
                        transitionDelay: `${500 + index * 120}ms`,
                      }}
                    />
                    <div
                      className="rounded-[14px] px-4 py-3.5 shadow-[0_4px_16px_rgba(11,35,64,0.08)] transition-all duration-500 ease-out"
                      style={{
                        backgroundColor: isFilled ? card.color : "white",
                        border: isFilled ? "none" : `1.6px solid ${card.color}`,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(16px)",
                        transitionDelay: `${550 + index * 120}ms`,
                      }}
                    >
                      <p
                        className="font-['Inter',sans-serif] font-bold text-[13px] m-0"
                        style={{ color: isFilled ? "white" : card.color }}
                      >
                        {card.title}
                      </p>
                      <p
                        className="font-['Inter',sans-serif] font-normal text-[11.5px] mt-1 mb-0 leading-snug"
                        style={{ color: isFilled ? "#E4E8FF" : "#5B6472" }}
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
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#E8871E] to-transparent rounded-full" />
        </div>
      </div>

      {/* Custom CSS for animations */}
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