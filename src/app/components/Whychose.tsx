"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// The whole design is built once at this fixed size, then scaled down
// (via CSS transform) to fit whatever screen it's shown on — mobile,
// tablet or desktop. This keeps the layout 100% identical everywhere.
const CONTAINER_WIDTH = 1081;
const CONTAINER_HEIGHT = 721;

export default function SchoolHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Sirf ek baar trigger
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

  // Recompute the scale factor whenever the available width changes, so the
  // design shrinks/grows smoothly instead of jumping between breakpoints.
  // FIXED: Added window check
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    function updateScale() {
      const el = wrapperRef.current;
      if (!el) return;
      const availableWidth = el.offsetWidth;
      const nextScale = Math.min(availableWidth / CONTAINER_WIDTH, 1);
      setScale(nextScale);
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Counter-scale for text: the whole layout shrinks via `scale` on mobile,
  // which would make the small font sizes unreadable. Multiplying text by
  // 1/scale cancels that out, so headings/numbers/titles stay at their
  // original readable size while icons, arcs, spacing and the image still
  // shrink to fit the screen.
  const textScale = scale > 0 ? 1 / scale : 1;

  // Check if mobile
  const isMobile = scale < 0.6;

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} relative w-full overflow-hidden bg-[#FAF9F6]`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#FAF9F6]" />

      {/* Outer wrapper reserves exactly the scaled height so there's no
          extra empty space below the design on small screens. */}
      <div
        ref={wrapperRef}
        className="relative mx-auto w-full max-w-[1081px] overflow-hidden"
        style={{ height: `${(CONTAINER_HEIGHT + 30) * scale}px` }}
      >
        {/* Fixed-size design, scaled down to fit the wrapper's actual width */}
        <div
          className="absolute left-0 top-0"
          style={{
            width: `${CONTAINER_WIDTH}px`,
            height: `${CONTAINER_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Badge */}
          <div
            className={`absolute left-0 right-0 top-[34px] text-center transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[300px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p
              className="text-center text-[13px] font-bold tracking-[7px] text-[#E8871E]"
              style={{ 
                transform: `scale(${textScale})`, 
                transformOrigin: "top center",
                fontSize: isMobile ? "10px" : "13px"
              }}
            >
              Our Achievements
            </p>
          </div>

          {/* Heading */}
          <div
            className={`absolute left-0 right-0 top-[100px] text-center transition-all duration-1000 ease-out md:top-[65px] ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[400px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h1
              className="text-center text-[28px] font-bold leading-[1.28] text-[#0B2340] md:text-[39px]"
              style={{ 
                transform: `scale(${textScale})`, 
                transformOrigin: "top center",
                fontSize: isMobile ? "22px" : "28px"
              }}
            >
              WHY CHOOSE US
            </h1>
          </div>

          {/* Underline - hidden on mobile, visible on desktop */}
          <div
            className={`absolute left-1/2 top-[130px] h-[2px] w-[150px] -translate-x-1/2 bg-[#E8871E] transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            } hidden md:block`}
            style={{ transitionDelay: "250ms" }}
          />

          {/* 15+ Grade Programs — desktop only (centered under heading) */}
          <div
            className={`absolute left-1/2 top-[150px] -translate-x-1/2 text-center transition-all duration-1000 ease-out hidden md:block ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[100px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div style={{ transform: `scale(${textScale})`, transformOrigin: "top center" }}>
              <span className="text-[#E8871E] font-bold text-[22px] md:text-[29px]">15+</span>
              <span className="text-[#0B2340] font-bold text-[13px] tracking-wide ml-2 md:text-[14.5px]">
                GRADE PROGRAMS
              </span>
            </div>
            <p className="hidden text-[12.5px] text-[#5B6472] mt-1 md:block">
              Wide range of grades and activities designed for young learners.
            </p>
          </div>

          {/* Arc connectors - thicker on mobile */}
          <svg
            className="absolute left-0 top-0"
            width="1081"
            height="721"
            viewBox="0 0 1081 721"
          >
            <path
              d="M342,330 C342,255 460,225 533,225 C606,225 724,255 724,330"
              stroke="#E8871E"
              strokeWidth={isMobile ? "8" : "6"}
              fill="none"
            />
            <path
              d="M320,352 C280,360 285,420 283,494"
              stroke="#E8871E"
              strokeWidth={isMobile ? "5" : "3.4"}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M746,352 C786,360 790,420 786,494"
              stroke="#E8871E"
              strokeWidth={isMobile ? "5" : "3.4"}
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Node 1 - Center Top */}
          <div
            className={`absolute left-[500px] top-[220px] flex items-center justify-center rounded-full border-[#E8871E] bg-white shadow-lg transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[150px]"
            }`}
            style={{ 
              transitionDelay: "400ms",
              width: isMobile ? "80px" : "66px",
              height: isMobile ? "80px" : "66px",
              borderWidth: isMobile ? "2.5px" : "1.5px"
            }}
          >
            <svg viewBox="0 0 24 24" className={isMobile ? "h-9 w-9" : "h-7 w-7"} fill="none" stroke="#E8871E" strokeWidth={isMobile ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 1.5 8 12 13l10.5-5L12 3z" />
              <path d="M5.5 10.3V15c0 2 3 3.6 6.5 3.6s6.5-1.6 6.5-3.6v-4.7" />
              <path d="M22.5 8v6" />
            </svg>
          </div>

          {/* Node 2 - Left Top */}
          <div
            className={`absolute left-[309px] top-[320px] flex items-center justify-center rounded-full border-[#E8871E] bg-white shadow-lg transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[150px]"
            }`}
            style={{ 
              transitionDelay: "500ms",
              width: isMobile ? "80px" : "66px",
              height: isMobile ? "80px" : "66px",
              borderWidth: isMobile ? "2.5px" : "1.5px"
            }}
          >
            <svg viewBox="0 0 24 24" className={isMobile ? "h-9 w-9" : "h-7 w-7"} fill="none" stroke="#E8871E" strokeWidth={isMobile ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
              <path d="M7 5H4.5A2.5 2.5 0 0 0 7 9.5" />
              <path d="M17 5h2.5A2.5 2.5 0 0 1 17 9.5" />
              <path d="M9.5 17h5l1 3h-7l1-3z" />
              <path d="M11 14v3M13 14v3" />
            </svg>
          </div>

          {/* Node 3 - Right Top */}
          <div
            className={`absolute left-[693px] top-[320px] flex items-center justify-center rounded-full border-[#E8871E] bg-white shadow-lg transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[150px]"
            }`}
            style={{ 
              transitionDelay: "500ms",
              width: isMobile ? "80px" : "66px",
              height: isMobile ? "80px" : "66px",
              borderWidth: isMobile ? "2.5px" : "1.5px"
            }}
          >
            <svg viewBox="0 0 24 24" className={isMobile ? "h-9 w-9" : "h-7 w-7"} fill="none" stroke="#E8871E" strokeWidth={isMobile ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="8" r="3.2" />
              <path d="M2.8 20.5c0-3.6 2.8-5.5 6.2-5.5s6.2 1.9 6.2 5.5" />
              <circle cx="17.5" cy="9" r="2.4" />
              <path d="M15.8 15.3c2.7.2 4.9 1.9 4.9 5.2" />
            </svg>
          </div>

          {/* Node 4 - Left Bottom */}
          <div
            className={`absolute left-[250px] top-[490px] flex items-center justify-center rounded-full border-[#E8871E] bg-white shadow-lg transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[150px]"
            }`}
            style={{ 
              transitionDelay: "600ms",
              width: isMobile ? "80px" : "66px",
              height: isMobile ? "80px" : "66px",
              borderWidth: isMobile ? "2.5px" : "1.5px"
            }}
          >
            <svg viewBox="0 0 24 24" className={isMobile ? "h-9 w-9" : "h-7 w-7"} fill="none" stroke="#E8871E" strokeWidth={isMobile ? "2" : "1.7"} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21V12" />
              <path d="M9 21V9" />
              <path d="M15 21v-6" />
              <path d="M21 21V6" />
              <path d="M15 8l5-4 -2 5" />
            </svg>
          </div>

          {/* Node 5 - Right Bottom */}
          <div
            className={`absolute left-[753px] top-[490px] flex items-center justify-center rounded-full border-[#E8871E] bg-white shadow-lg transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[150px]"
            }`}
            style={{ 
              transitionDelay: "600ms",
              width: isMobile ? "80px" : "66px",
              height: isMobile ? "80px" : "66px",
              borderWidth: isMobile ? "2.5px" : "1.5px"
            }}
          >
            <svg viewBox="0 0 24 24" className={isMobile ? "h-9 w-9" : "h-7 w-7"} fill="none" stroke="#E8871E" strokeWidth={isMobile ? "2" : "1.6"} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.6 1.6 6.7L12 17.6 5.8 20.8l1.6-6.7-5.2-4.6 6.9-.7L12 2.5z" />
            </svg>
          </div>

          {/* Stat: Years of Excellence — desktop only, hidden on mobile */}
          <div
            className={`absolute left-[20px] top-[290px] w-[210px] text-right transition-all duration-1000 ease-out hidden md:block ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[200px]"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <div style={{ transform: `scale(${textScale})`, transformOrigin: "top right" }}>
              <div className="text-[22px] font-bold leading-none text-[#E8871E] md:text-[29px]">25+</div>
              <div className="mt-1.5 text-[13px] font-bold leading-tight tracking-wide text-[#0B2340] md:text-[14.5px]">
                YEARS OF
                <br />
                EXCELLENCE
              </div>
            </div>
            <div className="my-2.5 ml-auto h-[2px] w-[34px] bg-[#E8871E]" />
            <p className="hidden text-[12.5px] leading-relaxed text-[#5B6472] md:block">
              A legacy of trust, quality schooling and continuous improvement.
            </p>
          </div>

          {/* Stat: 15+ Grade Programs — mobile only, takes the left slot instead of Years of Excellence */}
          <div
            className={`absolute left-[20px] top-[290px] w-[210px] text-right transition-all duration-1000 ease-out md:hidden ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[200px]"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <div style={{ transform: `scale(${textScale})`, transformOrigin: "top right" }}>
              <div className="text-[22px] font-bold leading-none text-[#E8871E]">15+</div>
              <div className="mt-1.5 text-[10px] font-bold leading-tight tracking-wide text-[#0B2340]">
                GRADE
                <br />
                PROGRAMS
              </div>
            </div>
            <div className="my-2.5 ml-auto h-[2px] w-[34px] bg-[#E8871E]" />
          </div>

          {/* Stat: Expert Teachers */}
          <div
            className={`absolute left-[840px] top-[290px] w-[210px] text-left transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[200px]"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div style={{ transform: `scale(${textScale})`, transformOrigin: "top left" }}>
              <div className="text-[22px] font-bold leading-none text-[#E8871E] md:text-[29px]">40+</div>
              <div className="mt-1.5 text-[10px] font-bold leading-tight tracking-wide text-[#0B2340] md:text-[14.5px]">
                EXPERT
                <br />
                TEACHERS
              </div>
            </div>
            <div className="my-2.5 h-[2px] w-[34px] bg-[#E8871E]" />
            <p className="hidden text-[12.5px] leading-relaxed text-[#5B6472] md:block">
              Experienced and caring teachers committed to every child&apos;s success.
            </p>
          </div>

          {/* Stat: Success Rate — desktop only (right side) */}
          <div
            className={`absolute left-[880px] top-[470px] w-[210px] text-left transition-all duration-1000 ease-out hidden md:block ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[200px]"
            }`}
            style={{ transitionDelay: "550ms" }}
          >
            <div style={{ transform: `scale(${textScale})`, transformOrigin: "top left" }}>
              <div className="text-[22px] font-bold leading-none text-[#E8871E] md:text-[29px]">97%</div>
              <div className="mt-1.5 text-[10px] font-bold leading-tight tracking-wide text-[#0B2340] md:text-[14.5px]">
                SUCCESS
                <br />
                RATE
              </div>
            </div>
            <div className="my-2.5 h-[2px] w-[34px] bg-[#E8871E]" />
            <p className="hidden text-[12.5px] leading-relaxed text-[#5B6472] md:block">
              Our students achieve top grades and results year after year.
            </p>
          </div>

          {/* Stat: Success Rate — mobile only, shown at the bottom center */}
          <div
            className={`absolute left-1/2 top-[650px] w-[210px] -translate-x-1/2 text-center transition-all duration-1000 ease-out md:hidden ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[200px]"
            }`}
            style={{ transitionDelay: "550ms" }}
          >
            <div
              className="flex items-center justify-center gap-2"
              style={{ transform: `scale(${textScale})`, transformOrigin: "top center" }}
            >
              <div className="text-[22px] font-bold leading-none text-[#E8871E]">97%</div>
              <div className="text-[10px] font-bold leading-tight tracking-wide text-[#0B2340]">
                SUCCESS
                <br />
                RATE
              </div>
            </div>
            <div className="mx-auto my-2.5 h-[2px] w-[34px] bg-[#E8871E]" />
          </div>

          {/* Stat: Beyond Academics — desktop only, removed on mobile */}
          <div
            className={`absolute left-[20px] top-[490px] w-[210px] text-right transition-all duration-1000 ease-out hidden md:block ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[200px]"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div style={{ transform: `scale(${textScale})`, transformOrigin: "top right" }}>
              <div className="text-[10px] font-bold leading-tight tracking-wide text-[#0B2340] md:text-[15px]">
                BEYOND
                <br />
                ACADEMICS
              </div>
            </div>
            <div className="my-2.5 ml-auto h-[2px] w-[34px] bg-[#E8871E]" />
            <p className="hidden text-[12.5px] leading-relaxed text-[#5B6472] md:block">
              Focus on character building, leadership and real-world skills.
            </p>
          </div>

          {/* Center dome with school.jpg */}
          <div
            className={`absolute bottom-0 left-1/2 h-[310px] w-[460px] -translate-x-1/2 translate-y-[-95px] transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-[-95px]" : "opacity-0 translate-y-[150px]"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <div className="absolute bottom-0 left-0 h-[280px] w-full overflow-hidden rounded-t-[240px]">
              <Image
                src="/school.jpg"
                alt="School building"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}