/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface AboutStoryData {
  badgeText: string;
  heading: string;
  historyDesktopImage: string;
  historyMobileImage: string;
  story: string[];
}

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: AboutStoryData;
  expiresAt: number;
}

const storyCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): AboutStoryData | null {
  const entry = storyCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    storyCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: AboutStoryData): void {
  storyCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = storyCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) storyCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------------------
function AboutStorySkeleton() {
  return (
    <div className={`${poppins.className} grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20`}>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(11, 35, 64, 0.04) 0%,
            rgba(11, 35, 64, 0.08) 50%,
            rgba(11, 35, 64, 0.04) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      <div className="shimmer w-full aspect-[4/5] rounded-2xl" />

      <div className="space-y-4">
        <div className="shimmer h-4 w-32 rounded" />
        <div className="shimmer h-10 w-80 max-w-full rounded-lg" />
        <div className="shimmer h-[3px] w-16 rounded-full" />
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-11/12 rounded" />
        <div className="shimmer h-4 w-full rounded" />
        <div className="shimmer h-4 w-10/12 rounded" />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function AboutStorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<AboutStoryData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const collegeId = "10";
  const CACHE_KEY = `about_story_${collegeId}`;

  // Mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Fetch data
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      console.log("📦 [AboutStory] Loading from memory cache");
      setData(cached);
      return;
    }

    async function fetchData() {
      try {
        console.log("🔄 [AboutStory] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=About`
        );
        const result = await res.json();
        console.log("📦 [AboutStory] API Response:", result);

        if (result.success && result.content) {
          const c = result.content;

          const fetched: AboutStoryData = {
            badgeText: c.storyBadgeText || "Our Story",
            heading: c.storyHeading || "A Legacy of Excellence",
            historyDesktopImage: c.historyDesktopImage || "",
            historyMobileImage: c.historyMobileImage || "",
            story: Array.isArray(c.story) && c.story.length > 0 ? c.story : [],
          };

          cacheSet(CACHE_KEY, fetched);
          setData(fetched);
        } else {
          console.log("⚠️ [AboutStory] No data from API");
          setData(null);
        }
      } catch (err) {
        console.error("❌ [AboutStory] Error:", err);
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

  // Loading
  if (!mounted || !data) {
    return <AboutStorySkeleton />;
  }

  // ✅ Story empty aur image bhi nahi — kuch nahi
  if (data.story.length === 0 && !data.historyDesktopImage) {
    return null;
  }

  // ✅ Device-based image
  const image = isMobile
    ? data.historyMobileImage || data.historyDesktopImage
    : data.historyDesktopImage || data.historyMobileImage;

  return (
    <div
      ref={sectionRef}
      className={`${poppins.className} grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20`}
    >
      {/* Left Image */}
      {image && (
        <div
          ref={imageRef}
          className={`relative transition-all duration-[1200ms] ease-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[400px]"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group">
            <Image
              src={image}
              alt="College Campus"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Right Content */}
      <div className="space-y-4">
        {/* Badge */}
        {data.badgeText && (
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[300px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-3">
              {data.badgeText}
            </p>
          </div>
        )}

        {/* Heading */}
        {data.heading && (
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[400px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#0B0F19] mb-6">
              {data.heading}
            </h2>
          </div>
        )}

        {/* Decorative Line */}
        <div
          className={`transition-all duration-[800ms] ease-out ${
            isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
          style={{
            transitionDelay: "250ms",
            transformOrigin: "left center",
          }}
        >
          <div className="h-[3px] w-16 bg-gradient-to-r from-[#E8CA5E] to-transparent rounded-full" />
        </div>

        {/* Story Paragraphs — dynamic */}
        {data.story.map((paragraph, index) => (
          <div
            key={index}
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[350px]"
            }`}
            style={{ transitionDelay: `${350 + index * 150}ms` }}
          >
            <p className="text-[#5B6472] text-sm sm:text-base leading-relaxed mb-4">
              {paragraph}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}