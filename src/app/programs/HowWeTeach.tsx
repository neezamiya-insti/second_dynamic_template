"use client";

import React, { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface Step {
  id: string;
  number: string;
  title: string;
  description: string[];
  color: string;
  cx: number;
  cy: number;
  textX: number;
}

export default function HowWeTeach() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  // Theme Colors
  const colors = {
    c1: "#E8871E", // Warm Orange
    c2: "#2E9B5C", // Growth Green
    c3: "#0B2340", // Deep Navy
    c4: "#E8871E", // Warm Orange
    chevron: "#B7BEC9",
    navy: "#0B2340",
    gray: "#5B6472",
    bg: "#FAF9F6",
  };

  const steps: Step[] = [
    {
      id: "interactive",
      number: "01",
      title: "Interactive Learning",
      description: ["Engaging students through", "discussions, group work, and", "hands-on activities."],
      color: colors.c1,
      cx: 90,
      cy: 210,
      textX: 155,
    },
    {
      id: "inquiry",
      number: "02",
      title: "Inquiry-Based Approach",
      description: ["Encouraging curiosity and", "critical thinking through", "questioning and exploration."],
      color: colors.c2,
      cx: 360,
      cy: 378,
      textX: 430,
    },
    {
      id: "collaborative",
      number: "03",
      title: "Collaborative Culture",
      description: ["Fostering teamwork,", "communication, and", "peer-to-peer learning."],
      color: colors.c3,
      cx: 565,
      cy: 540,
      textX: 635,
    },
    {
      id: "personalized",
      number: "04",
      title: "Personalized Support",
      description: ["Tailoring teaching to meet", "individual student needs", "and learning styles."],
      color: colors.c4,
      cx: 830,
      cy: 678, // Increased from 638 to 678 (40px down)
      textX: 900,
    },
  ];

  const dottedArc = (cx: number, cy: number) =>
    `M${cx - 18},${cy + 49} A52,52 0 0,1 ${cx - 40},${cy - 33}`;

  const connectors = [
    { 
      seg1: "M90,256 V362 A16,16 0 0,0 106,378 H197", 
      seg2: "M217,378 H308", 
      c1: colors.c1, 
      c2: colors.c2, 
      delay1: 200, 
      delay2: 500, 
      chevron: { x: 198, y: 371 }, 
      chevronDelay: 600 
    },
    { 
      seg1: "M360,424 V524 A16,16 0 0,0 376,540 H434", 
      seg2: "M454,540 H513", 
      c1: colors.c2, 
      c2: colors.c3, 
      delay1: 800, 
      delay2: 1100, 
      chevron: { x: 435, y: 533 }, 
      chevronDelay: 1200 
    },
    { 
      seg1: "M565,586 V662 A16,16 0 0,0 581,678 H669", // Adjusted for step 4
      seg2: "M689,678 H778", // Adjusted for step 4
      c1: colors.c3, 
      c2: colors.c4, 
      delay1: 1400, 
      delay2: 1700, 
      chevron: { x: 670, y: 671 }, // Adjusted
      chevronDelay: 1800 
    },
  ];

  const icons: Record<string, React.ReactNode> = {
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

  return (
    <div ref={sectionRef} className={`${poppins.className} w-full bg-[#FAF9F6] overflow-hidden`}>
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6 py-12 ">
        {/* Eyebrow - Center */}
        <div
          className={`flex items-center justify-center gap-3.5 mb-3 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <span className="w-11 h-[2px] rounded-full" style={{ backgroundColor: colors.c1 }} />
          <span className="font-bold text-[13px] tracking-[3px] text-[#E8871E]">
            HOW WE TEACH
          </span>
          <span className="w-11 h-[2px] rounded-full" style={{ backgroundColor: colors.c1 }} />
        </div>

        {/* Heading - Center */}
        <h1
          className={`font-['Poppins',sans-serif] font-extrabold text-center whitespace-nowrap leading-[1.2] m-0 mb-2 transition-all duration-700 ease-out delay-100 text-[22px] xs:text-[26px] sm:text-[34px] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ color: colors.navy }}
        >
          Our Learning <span style={{ color: colors.c1 }}>Methodology</span>
        </h1>

        {/* Subtitle - Center */}
        <p
          className={`max-w-[600px] mx-auto text-center text-[14.5px] sm:text-[16.5px] leading-relaxed mb-4 sm:mb-6 transition-all duration-700 ease-out delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ color: colors.gray }}
        >
          Innovative approaches that make learning engaging, effective, and fun for every student.
        </p>

        {/* ============ DESKTOP / TABLET: SVG staircase diagram ============ */}
        <div className="hidden sm:block">
          {/* Increased viewBox height from 720 to 770 to accommodate step 4 */}
          <svg viewBox="0 70 1150 770" xmlns="http://www.w3.org/2000/svg" className="block w-full h-auto">
            <defs>
              <filter id="htw-shadow" x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#0B2340" floodOpacity="0.1" />
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

            {/* Steps - Staggered bottom to top connection */}
            {steps.map((step, index) => {
              const prevColor = index === 0 ? step.color : steps[index - 1].color;
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
                  <circle cx={step.cx} cy={step.cy} r={46} fill="#fff" filter="url(#htw-shadow)" />
                  <g
                    transform={`translate(${step.cx - 20},${step.cy - 20}) scale(1.65)`}
                    stroke={step.color}
                    fill="none"
                    strokeWidth={1.6}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {icons[step.id]}
                  </g>

                  {/* text - with Poppins font */}
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
                  <text 
                    x={step.textX} 
                    y={step.cy + 24} 
                    className={`font-['Poppins',sans-serif] font-bold text-[17px]`} 
                    fill={colors.navy}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateX(0)" : "translateX(-10px)",
                      transition: `opacity 600ms ease-out ${delay + 250}ms, transform 600ms ease-out ${delay + 250}ms`,
                    }}
                  >
                    {step.title}
                  </text>
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
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
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
                    className="relative z-10 flex-none w-[60px] h-[60px] rounded-full bg-white flex items-center justify-center transition-all duration-500"
                    style={{
                      boxShadow: "0 4px 14px rgba(11,35,64,0.1)",
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
                      {icons[step.id]}
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
                        color: colors.navy,
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