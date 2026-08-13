"use client";

import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";
import { useEffect, useState, useRef } from "react";

// Exact color tokens sampled from the source banner design
const COLORS = {
  cream: "#FDF7F2",
  navy: "#17263A",
  orange: "#E67E1F",
  orangeSoft: "#F0A249",
  green: "#3F8F62",
  blob: "#F0DEC7",
  iconCircle: "#F1D8B4",
  gray: "#6B6B6B",
};

function GraduationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3Z"
        fill="currentColor"
      />
      <path
        d="M5 10.18v4.4C5 17.5 8.13 19 12 19s7-1.5 7-4.42v-4.4l-7 3.18-7-3.18Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TrophyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 3h12v2h2a3 3 0 0 1-3 3h-.2A6.02 6.02 0 0 1 13 12.9V16h3v2H8v-2h3v-3.1A6.02 6.02 0 0 1 7.2 8H7a3 3 0 0 1-3-3h2V3Zm0 4h-.2c.1.9.5 1.7 1.1 2.3A5 5 0 0 1 6 7Zm12 0a5 5 0 0 1-.9 2.3c.6-.6 1-1.4 1.1-2.3H18ZM7 19h10v2H7v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function GreenfieldBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        width: "100%",
        aspectRatio: "1568 / 571",
        backgroundColor: COLORS.cream,
        containerType: "inline-size",
      }}
    >
      {/* Custom keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes badge-in {
          0% { opacity: 0; transform: rotate(-12deg) scale(0.7); }
          100% { opacity: 1; transform: rotate(-6deg) scale(1); }
        }
      `}</style>

      {/* Decorative dotted grid */}
      <div
        className="absolute grid grid-cols-3 gap-[0.85cqw]"
        style={{
          right: "3%",
          top: "4%",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1.2s ease-out 0.6s",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="rounded-full"
            style={{
              width: "0.45cqw",
              height: "0.45cqw",
              backgroundColor: COLORS.orange,
              opacity: 0.9,
              animation: isVisible
                ? `pulse-soft 3s ease-in-out ${i * 0.08}s infinite`
                : "none",
            }}
          />
        ))}
      </div>

      {/* Decorative arc */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "44cqw",
          height: "148%",
          left: "56%",
          top: "-24%",
          border: "1.5px solid #cfc3b3",
          opacity: isVisible ? 0.6 : 0,
          transition: "opacity 1.4s ease-out 0.3s",
        }}
      />

      {/* Main photo (oval) */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: "62%",
          width: "28cqw",
          top: "1%",
          height: "100%",
          borderRadius: "50%",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.92)",
          transition:
            "opacity 1s ease-out 0.2s, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }}
      >
        <Image
          src="/images/student-girl.jpg"
          alt="Smiling student in school uniform holding books"
          fill
          sizes="100vw"
          quality={100}
          unoptimized
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Discount badge */}
      <div
        className="absolute flex flex-col items-center justify-center text-center rounded-[1cqw] shadow-lg"
        style={{
          left: "51%",
          top: "13%",
          width: "12.6cqw",
          height: "12.5cqw",
          backgroundColor: "#fff",
          padding: "0.5cqw",
          animation: isVisible
            ? "badge-in 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both"
            : "none",
        }}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center rounded-[0.7cqw] text-white"
          style={{
            background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeSoft})`,
          }}
        >
          <span
            className="font-extrabold leading-none"
            style={{ fontSize: "2.2cqw", fontFamily: "var(--font-display)" }}
          >
            20%
          </span>
          <span
            className="font-semibold tracking-wide"
            style={{ fontSize: "1cqw", fontFamily: "var(--font-display)" }}
          >
            OFF
          </span>
          <span
            className="my-[0.5cqw]"
            style={{
              width: "70%",
              height: 1.5,
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
          />
          <span
            className="font-semibold leading-tight"
            style={{ fontSize: "0.85cqw", fontFamily: "var(--font-display)" }}
          >
            For Early
            <br />
            Applicants
          </span>
        </div>
      </div>

      {/* Diagonal accent */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: "50.2%",
          top: "12%",
          width: "1.6cqw",
          height: 3,
          backgroundColor: COLORS.navy,
          transform: "rotate(-45deg)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.6s ease-out 0.7s",
        }}
      />

      {/* Reading boy */}
      <div
        className="absolute"
        style={{
          left: "85.5%",
          top: "15%",
          width: "9.8cqw",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.9s ease-out 0.5s, transform 0.9s ease-out 0.5s",
          animation: isVisible ? "float 4.5s ease-in-out 1.2s infinite" : "none",
        }}
      >
        <Image
          src="/images/reading-boy1.png"
          alt="Illustration of a boy reading with science icons"
          width={400}
          height={400}
          className="w-full h-auto"
        />
      </div>

      {/* Study girl */}
      <div
        className="absolute"
        style={{
          left: "86.5%",
          top: "66%",
          width: "11.8cqw",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.9s ease-out 0.7s, transform 0.9s ease-out 0.7s",
          animation: isVisible ? "float-slow 5s ease-in-out 1.5s infinite" : "none",
        }}
      >
        <Image
          src="/images/study-illustration1.png"
          alt="Illustration of a girl studying with a laptop"
          width={1050}
          height={1050}
          className="w-full h-auto"
        />
      </div>

      {/* Book steps */}
      <div
        className="absolute"
        style={{
          left: "57%",
          top: "66%",
          width: "10.6cqw",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.95)",
          transition: "opacity 0.9s ease-out 0.55s, transform 0.9s ease-out 0.55s",
          animation: isVisible ? "float 4.2s ease-in-out 1.3s infinite" : "none",
        }}
      >
        <Image
          src="/images/book-step.png"
          alt="Illustration of a girl climbing a stack of books"
          width={400}
          height={400}
          className="w-full h-auto"
        />
      </div>

      {/* ================= LEFT CONTENT ================= */}
      <div
        className="absolute flex flex-col h-full"
        style={{
          left: "4%",
          top: "4%",
          width: "48cqw",
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out 0.15s, transform 0.8s ease-out 0.15s",
          }}
        >
          <h1
            className="font-extrabold uppercase leading-[1.05]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span style={{ fontSize: "2.35cqw", color: COLORS.navy, display: "block" }}>
              Greenfield
            </span>
            <span style={{ fontSize: "2.35cqw", color: COLORS.orange, display: "block" }}>
              School
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <p
          className="uppercase font-semibold tracking-[0.15em]"
          style={{
            fontSize: "0.85cqw",
            color: "#4b4b4b",
            marginTop: "1.1cqw",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.8s ease-out 0.25s, transform 0.8s ease-out 0.25s",
          }}
        >
          Nurturing Minds, Inspiring Futures
        </p>

        {/* 2026 row */}
        <div
          className="flex items-center"
          style={{
            marginTop: "1.6cqw",
            gap: "0.8cqw",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.8s ease-out 0.35s, transform 0.8s ease-out 0.35s",
          }}
        >
          <span
            className="font-bold"
            style={{
              fontSize: "1.9cqw",
              color: COLORS.orange,
              fontFamily: "var(--font-display)",
            }}
          >
            2026
          </span>
          <span style={{ width: "5.5cqw", height: 1.5, backgroundColor: "#c9c0b3" }} />
          <span
            className="rounded-full"
            style={{ width: "0.8cqw", height: "0.8cqw", backgroundColor: COLORS.orange }}
          />
        </div>

        {/* Admission Open */}
        <div
          className="relative"
          style={{
            marginTop: "0.4cqw",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.85s ease-out 0.4s, transform 0.85s ease-out 0.4s",
          }}
        >
          <h2
            className="font-extrabold uppercase leading-[1.05]"
            style={{
              fontSize: "4.2cqw",
              color: COLORS.navy,
              fontFamily: "var(--font-display)",
            }}
          >
            Admission
          </h2>
          <h2
            className="font-extrabold uppercase leading-[1.05]"
            style={{
              fontSize: "4.2cqw",
              color: COLORS.orange,
              fontFamily: "var(--font-display)",
            }}
          >
            Open
          </h2>
          <Image
            src="/images/graduation-cap1.png"
            alt="Graduation cap icon"
            width={200}
            height={200}
            className="absolute"
            style={{
              width: "6cqw",
              height: "auto",
              left: "29cqw",
              top: "-1.4cqw",
              animation: isVisible ? "float 3.8s ease-in-out 1s infinite" : "none",
            }}
          />
        </div>

        {/* Orange line */}
        <span
          style={{
            display: "block",
            width: isVisible ? "3.4cqw" : "0",
            height: 3,
            backgroundColor: COLORS.orange,
            marginTop: "0.8cqw",
            transition: "width 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s",
          }}
        />

        {/* Description */}
        <p
          className="leading-snug"
          style={{
            fontSize: "1cqw",
            color: COLORS.gray,
            marginTop: "0.6cqw",
            maxWidth: "22cqw",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s",
          }}
        >
          Empowering minds, shaping futures.
          <br />
          Join our community of learners today!
        </p>

        {/* Feature icons */}
        <div
          className="flex items-center"
          style={{
            marginTop: "1.2cqw",
            gap: "1.1cqw",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.85s ease-out 0.7s, transform 0.85s ease-out 0.7s",
          }}
        >
          <div className="flex items-center" style={{ gap: "0.7cqw" }}>
            <span
              className="flex items-center justify-center rounded-full shrink-0 transition-transform duration-300 hover:scale-110"
              style={{
                width: "3.6cqw",
                height: "3.6cqw",
                backgroundColor: COLORS.iconCircle,
              }}
            >
              <GraduationIcon
                style={{
                  color: COLORS.navy,
                  width: "1.7cqw",
                  height: "1.7cqw",
                }}
              />
            </span>
            <span
              className="font-bold leading-tight"
              style={{
                fontSize: "1cqw",
                color: COLORS.navy,
                fontFamily: "var(--font-display)",
              }}
            >
              Quality
              <br />
              Education
            </span>
          </div>

          <span style={{ width: 1, height: "3.2cqw", backgroundColor: "#d8d0c2" }} />

          <div className="flex items-center" style={{ gap: "0.7cqw" }}>
            <span
              className="flex items-center justify-center rounded-full shrink-0 transition-transform duration-300 hover:scale-110"
              style={{
                width: "3.6cqw",
                height: "3.6cqw",
                backgroundColor: COLORS.iconCircle,
              }}
            >
              <TrophyIcon
                style={{
                  color: COLORS.navy,
                  width: "1.7cqw",
                  height: "1.7cqw",
                }}
              />
            </span>
            <span
              className="font-bold leading-tight"
              style={{
                fontSize: "1cqw",
                color: COLORS.navy,
                fontFamily: "var(--font-display)",
              }}
            >
              Expert
              <br />
              Teachers
            </span>
          </div>

          <span style={{ width: 1, height: "3.2cqw", backgroundColor: "#d8d0c2" }} />

          <div className="flex items-center" style={{ gap: "0.7cqw" }}>
            <span
              className="flex items-center justify-center rounded-full shrink-0 transition-transform duration-300 hover:scale-110"
              style={{
                width: "3.6cqw",
                height: "3.6cqw",
                backgroundColor: COLORS.iconCircle,
              }}
            >
              <TrophyIcon
                style={{ color: COLORS.navy, width: "1.7cqw", height: "1.7cqw" }}
              />
            </span>
            <span
              className="font-bold leading-tight"
              style={{
                fontSize: "1cqw",
                color: COLORS.navy,
                fontFamily: "var(--font-display)",
              }}
            >
              Bright
              <br />
              Future
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="flex items-center"
          style={{
            marginTop: "1.2cqw",
            gap: "1cqw",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.85s ease-out 0.85s, transform 0.85s ease-out 0.85s",
          }}
        >
          <Link
            href="/admissions"
            className="flex items-center font-semibold text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              backgroundColor: COLORS.green,
              fontSize: "1.05cqw",
              padding: "1cqw 1.9cqw",
              gap: "0.7cqw",
              fontFamily: "var(--font-display)",
            }}
          >
            Apply Now
            <svg
              viewBox="0 0 24 12"
              style={{ width: "1.6cqw", height: "auto" }}
              fill="none"
            >
              <path d="M0 6h21M15 1l6 5-6 5" stroke="white" strokeWidth="1.5" />
            </svg>
          </Link>

          <Link
            href="/about"
            className="font-semibold rounded-full bg-white transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
            style={{
              color: COLORS.navy,
              border: `1.5px solid ${COLORS.navy}`,
              fontSize: "1.05cqw",
              padding: "0.8cqw 1.9cqw",
              fontFamily: "var(--font-display)",
            }}
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}