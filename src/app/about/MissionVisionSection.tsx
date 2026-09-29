/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import { Target, Eye } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface MissionVisionData {
  mission: string;
  vision: string;
}

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: MissionVisionData;
  expiresAt: number;
}

const missionCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): MissionVisionData | null {
  const entry = missionCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    missionCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: MissionVisionData): void {
  missionCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = missionCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) missionCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------------------
function MissionVisionSkeleton() {
  return (
    <div
      className={`${poppins.className} grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 px-4 md:px-0`}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-[#0B0F19] rounded-3xl p-6 md:p-10 border border-white/10"
        >
          <div className="shimmer w-16 h-16 rounded-2xl mb-6" />
          <div className="shimmer h-8 w-48 rounded mb-4" />
          <div className="shimmer h-4 w-full rounded mb-2" />
          <div className="shimmer h-4 w-11/12 rounded mb-2" />
          <div className="shimmer h-4 w-full rounded mb-2" />
          <div className="shimmer h-4 w-4/5 rounded" />
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function MissionVisionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<MissionVisionData | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const collegeId = "10";
  const CACHE_KEY = `mission_vision_${collegeId}`;

  // Mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch data
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      console.log("📦 [MissionVision] Loading from memory cache");
      setData(cached);
      return;
    }

    async function fetchData() {
      try {
        console.log("🔄 [MissionVision] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=About`
        );
        const result = await res.json();
        console.log("📦 [MissionVision] API Response:", result);

        if (result.success && result.content) {
          const c = result.content;
          const fetched: MissionVisionData = {
            mission: c.mission || "",
            vision: c.vision || "",
          };

          // ✅ Dono empty — kuch nahi
          if (!fetched.mission && !fetched.vision) {
            console.log("⚠️ [MissionVision] Both mission & vision empty");
            setData(null);
            return;
          }

          cacheSet(CACHE_KEY, fetched);
          setData(fetched);
        } else {
          console.log("⚠️ [MissionVision] No data from API");
          setData(null);
        }
      } catch (err) {
        console.error("❌ [MissionVision] Error:", err);
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

  // Mouse tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };

    const section = sectionRef.current;
    if (section) section.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (section) section.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Loading
  if (!mounted || !data) {
    return <MissionVisionSkeleton />;
  }

  const tiltX = mousePosition.x * 8;
  const tiltY = mousePosition.y * 8;

  return (
    <div
      ref={sectionRef}
      className={`${poppins.className} grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 overflow-hidden px-4 md:px-0`}
    >
      {/* Mission - Left se slide in */}
      {data.mission && (
        <div
          className={`group relative transition-all duration-[1000ms] ease-out cursor-pointer ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[400px]"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <div className="relative bg-[#0B0F19] rounded-3xl p-6 md:p-10 border border-white/10 hover:border-[#E8CA5E]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#E8CA5E]/10 overflow-hidden h-full">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-48 md:w-64 h-48 md:h-64 bg-[#E8CA5E]/5 rounded-full blur-3xl group-hover:bg-[#E8CA5E]/10 transition-all duration-700" />

            {/* 3D Icon */}
            <div
              className="relative w-16 h-16 rounded-2xl bg-[#E8CA5E]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#E8CA5E]/20 transition-all duration-500"
              style={{
                transform: isVisible
                  ? `perspective(600px) rotateY(${tiltX * 0.3}deg) rotateX(${-tiltY * 0.3}deg) translateZ(10px)`
                  : "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-[#E8CA5E]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <Target
                  className="w-8 h-8 text-[#E8CA5E] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                  style={{
                    filter: "drop-shadow(0 4px 6px rgba(232,202,94,0.3))",
                  }}
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-[#E8CA5E]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>

            {/* Content */}
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3 md:mb-4">
              Our Mission
            </h3>
            <p className="text-[#9CA3AF] text-sm md:text-base leading-relaxed">
              {data.mission}
            </p>

            {/* Decorative Line */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#E8CA5E] to-transparent group-hover:w-full transition-all duration-700 rounded-b-3xl" />
          </div>
        </div>
      )}

      {/* Vision - Right se slide in */}
      {data.vision && (
        <div
          className={`group relative transition-all duration-[1000ms] ease-out cursor-pointer ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[400px]"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="relative bg-[#0B0F19] rounded-3xl p-6 md:p-10 border border-white/10 hover:border-[#E8CA5E]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#E8CA5E]/10 overflow-hidden h-full">
            {/* Background Glow */}
            <div className="absolute -bottom-20 -left-20 w-48 md:w-64 h-48 md:w-64 bg-[#E8CA5E]/5 rounded-full blur-3xl group-hover:bg-[#E8CA5E]/10 transition-all duration-700" />

            {/* 3D Icon */}
            <div
              className="relative w-16 h-16 rounded-2xl bg-[#E8CA5E]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#E8CA5E]/20 transition-all duration-500"
              style={{
                transform: isVisible
                  ? `perspective(600px) rotateY(${tiltX * 0.3}deg) rotateX(${-tiltY * 0.3}deg) translateZ(10px)`
                  : "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-[#E8CA5E]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <Eye
                  className="w-8 h-8 text-[#E8CA5E] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12"
                  style={{
                    filter: "drop-shadow(0 4px 6px rgba(232,202,94,0.3))",
                  }}
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-[#E8CA5E]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>

            {/* Content */}
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3 md:mb-4">
              Our Vision
            </h3>
            <p className="text-[#9CA3AF] text-sm md:text-base leading-relaxed">
              {data.vision}
            </p>

            {/* Decorative Line */}
            <div className="absolute bottom-0 right-0 w-0 h-1 bg-gradient-to-l from-[#E8CA5E] to-transparent group-hover:w-full transition-all duration-700 rounded-b-3xl" />
          </div>
        </div>
      )}
    </div>
  );
}