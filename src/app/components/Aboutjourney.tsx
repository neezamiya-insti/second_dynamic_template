"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface AboutJourneyData {
  badgeText: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  buttonText: string;
  buttonLink: string;
  topImage: string;
  leftImage: string;
  rightImage: string;
}

const DEFAULT_DATA: AboutJourneyData = {
  badgeText: "About Our Journey",
  heading: "Al Noor College",
  paragraph1:
    "Al Noor College has established itself as a beacon of quality education, nurturing young minds with a commitment to academic excellence and character development.",
  paragraph2:
    "Driven by a vision of holistic development, Al Noor College combines modern teaching methodologies with timeless values.",
  paragraph3:
    "Today, Al Noor College stands as a symbol of educational excellence, innovation, and integrity.",
  buttonText: "Read More",
  buttonLink: "/about",
  topImage: "/about/top.png",
  leftImage: "/about/left.png",
  rightImage: "/about/right.png",
};

// ----------------------------------------------------------------------------
// In-memory cache (module-level) — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: AboutJourneyData;
  expiresAt: number;
}

const journeyCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): AboutJourneyData | null {
  const entry = journeyCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    journeyCache.delete(key);
    console.log(`🗑️ [AboutJourneyCache] Expired: "${key}"`);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: AboutJourneyData): void {
  journeyCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  console.log(`✅ [AboutJourneyCache] Set: "${key}"`);
  setTimeout(() => {
    const cur = journeyCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) journeyCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function AboutJourney() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<AboutJourneyData>(DEFAULT_DATA);
  const sectionRef = useRef<HTMLElement>(null);

  // ✅ Hardcoded college ID
  const collegeId = "10";
  const CACHE_KEY = `about_journey_${collegeId}`;

  // Mounted flag — hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      console.log("📦 [AboutJourney] Loading from memory cache (instant)");
      setData(cached);
      return;
    }

    async function fetchJourney() {
      try {
        console.log("🔄 [AboutJourney] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=AboutJourney`
        );
        const result = await res.json();
        console.log("📦 [AboutJourney] API Response:", result);

        let fetched: AboutJourneyData = DEFAULT_DATA;

        if (result.success && result.content) {
          const c = result.content;
          fetched = {
            badgeText: c.badgeText || DEFAULT_DATA.badgeText,
            heading: c.heading || DEFAULT_DATA.heading,
            paragraph1: c.paragraph1 || DEFAULT_DATA.paragraph1,
            paragraph2: c.paragraph2 || DEFAULT_DATA.paragraph2,
            paragraph3: c.paragraph3 || DEFAULT_DATA.paragraph3,
            buttonText: c.buttonText || DEFAULT_DATA.buttonText,
            buttonLink: c.buttonLink || DEFAULT_DATA.buttonLink,
            topImage: c.topImage || DEFAULT_DATA.topImage,
            leftImage: c.leftImage || DEFAULT_DATA.leftImage,
            rightImage: c.rightImage || DEFAULT_DATA.rightImage,
          };
          console.log("✅ [AboutJourney] Data loaded");
        } else {
          console.log("⚠️ [AboutJourney] No data, using defaults");
        }

        cacheSet(CACHE_KEY, fetched);
        setData(fetched);
      } catch (err) {
        console.error("❌ [AboutJourney] Error:", err);
        setData(DEFAULT_DATA);
      }
    }

    fetchJourney();
  }, [mounted]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#FFFFFF] overflow-hidden`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-16 px-6 py-20 lg:px-10">
        {/* Left: text */}
        <div className="flex-1 basis-[480px]">
          {/* Badge */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[300px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E]">
              {data.badgeText}
            </p>
          </div>

          {/* Heading */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[400px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="mb-6 text-3xl font-extrabold leading-tight text-[#0B0F19] sm:text-4xl">
              {data.heading}
            </h2>
          </div>

          {/* Paragraph 1 */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="mb-4 leading-relaxed text-[#5B6472]">
              {data.paragraph1}
            </p>
          </div>

          {/* Paragraph 2 */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <p className="mb-4 leading-relaxed text-[#5B6472]">
              {data.paragraph2}
            </p>
          </div>

          {/* Paragraph 3 */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="mb-8 leading-relaxed text-[#5B6472]">
              {data.paragraph3}
            </p>
          </div>

          {/* Button */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[400px]"
            }`}
            style={{ transitionDelay: "750ms" }}
          >
            <Link
              href={data.buttonLink || "/about"}
              className="inline-flex items-center gap-2 rounded-full bg-[#E8CA5E] px-7 py-3.5 text-base font-semibold text-[#0B0F19] shadow-lg shadow-[#E8CA5E]/30 transition-all hover:-translate-y-0.5 hover:bg-[#d4b84a] hover:shadow-xl hover:shadow-[#E8CA5E]/40"
            >
              {data.buttonText}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B0F19]/20 text-sm">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Right: photo collage */}
        <div
          className={`relative aspect-[857/726] w-full flex-1 basis-[380px] sm:max-w-[480px] transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-[400px]"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Top frame — circle */}
          <div className="group absolute left-1/2 top-0 z-10 h-[68%] w-[72%] -translate-x-1/2 rounded-full bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src={data.topImage || "/about/top.png"}
                alt="Students having fun"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
            </div>
          </div>

          {/* Bottom-left frame — oval */}
          <div className="group absolute bottom-0 left-0 z-20 h-[58%] w-[50%] rounded-[50%_50%_50%_50%/42%_42%_58%_58%] bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200">
            <div className="relative h-full w-full overflow-hidden rounded-[50%_50%_50%_50%/42%_42%_58%_58%]">
              <Image
                src={data.leftImage || "/about/left.png"}
                alt="Student in classroom"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
            </div>
          </div>

          {/* Bottom-right frame — oval */}
          <div className="group absolute bottom-0 right-0 z-20 h-[58%] w-[50%] rounded-[50%_50%_50%_50%/42%_42%_58%_58%] bg-white p-3 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200">
            <div className="relative h-full w-full overflow-hidden rounded-[50%_50%_50%_50%/42%_42%_58%_58%]">
              <Image
                src={data.rightImage || "/about/right.png"}
                alt="Students outdoors"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}