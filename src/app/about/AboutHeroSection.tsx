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
interface AboutHeroData {
  heroTitle: string;
  heroSubtitle: string;
  heroDesktopImage: string;
  heroMobileImage: string;
}

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: AboutHeroData;
  expiresAt: number;
}

const heroCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): AboutHeroData | null {
  const entry = heroCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    heroCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: AboutHeroData): void {
  heroCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = heroCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) heroCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------------------
function AboutHeroSkeleton() {
  return (
    <div
      className={`${poppins.className} relative w-full max-w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] bg-[#0B0F19] overflow-hidden`}
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
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full flex flex-col items-center gap-4">
          <div className="shimmer h-7 w-40 rounded-full" />
          <div className="shimmer h-12 w-full max-w-xl rounded-lg" />
          <div className="shimmer h-[3px] w-20 rounded-full" />
          <div className="shimmer h-4 w-full max-w-2xl rounded" />
          <div className="shimmer h-4 w-5/6 max-w-xl rounded" />
          <div className="shimmer h-12 w-40 rounded-full mt-4" />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function AboutHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<AboutHeroData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  const collegeId = "10";
  const CACHE_KEY = `about_hero_${collegeId}`;

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
      console.log("📦 [AboutHero] Loading from memory cache");
      setData(cached);
      return;
    }

    async function fetchData() {
      try {
        console.log("🔄 [AboutHero] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=About`
        );
        const result = await res.json();
        console.log("📦 [AboutHero] API Response:", result);

        if (result.success && result.content) {
          const c = result.content;
          const fetched: AboutHeroData = {
            heroTitle: c.heroTitle || "About Our College",
            heroSubtitle: c.heroSubtitle || "",
            heroDesktopImage: c.heroDesktopImage || c.heroImage || "",
            heroMobileImage: c.heroMobileImage || c.mobileImage || "",
          };
          cacheSet(CACHE_KEY, fetched);
          setData(fetched);
        } else {
          console.log("⚠️ [AboutHero] No data from API");
          setData(null);
        }
      } catch (err) {
        console.error("❌ [AboutHero] Error:", err);
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

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const rawX = (e.clientX - rect.left) / rect.width - 0.5;
      const rawY = (e.clientY - rect.top) / rect.height - 0.5;
      const x = Math.min(0.5, Math.max(-0.5, rawX));
      const y = Math.min(0.5, Math.max(-0.5, rawY));
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
    return <AboutHeroSkeleton />;
  }

  // ✅ Agar sab empty — kuch nahi
  if (!data.heroTitle && !data.heroDesktopImage && !data.heroMobileImage) {
    return null;
  }

  const parallaxX = mousePosition.x * 14;
  const parallaxY = mousePosition.y * 14;

  // ✅ Device-based image
  const heroImage = isMobile
    ? data.heroMobileImage || data.heroDesktopImage
    : data.heroDesktopImage || data.heroMobileImage;

  return (
    <div
      ref={sectionRef}
      className={`${poppins.className} relative w-full max-w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden cursor-pointer`}
    >
      {/* Background Image with Smooth Zoom + Parallax */}
      <div
        className={`absolute inset-0 overflow-hidden transition-all duration-[1500ms] ease-out ${
          isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
        }`}
        style={{
          transform: isVisible
            ? `scale(1.05) translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`
            : "scale(1.1)",
          transitionDelay: "0ms",
        }}
      >
        {heroImage ? (
          <Image
            src={heroImage}
            alt={data.heroTitle}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?fm=jpg&q=80&w=1920&auto=format&fit=crop"
            alt="College Campus"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}
      </div>

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#0B0F19]/50 via-[#0B0F19]/70 to-[#0B0F19]/85 transition-all duration-[1200ms] ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "200ms" }}
      />

      {/* Pattern Overlay */}
      <div
        className={`hidden sm:block absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] transition-all duration-[1000ms] ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "300ms" }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 sm:px-6">
        <div className="relative z-10 max-w-4xl w-full overflow-hidden">
          {/* Badge */}
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <p className="inline-block text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#E8CA5E] mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 border border-[#E8CA5E]/30 rounded-full bg-[#E8CA5E]/10 backdrop-blur-sm">
              ✦ About Us ✦
            </p>
          </div>

          {/* Heading */}
          {data.heroTitle && (
            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
              }`}
              style={{ transitionDelay: "550ms" }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl font-extrabold text-white leading-tight drop-shadow-2xl">
                {data.heroTitle}
              </h1>
            </div>
          )}

          {/* Decorative Line */}
          <div
            className={`flex justify-center transition-all duration-[800ms] ease-out ${
              isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="h-[2px] sm:h-[3px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#E8CA5E] to-transparent rounded-full my-3 sm:my-4" />
          </div>

          {/* Description */}
          {data.heroSubtitle && (
            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[80px]"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-base max-w-2xl mx-auto leading-relaxed px-2">
                {data.heroSubtitle}
              </p>
            </div>
          )}

          {/* CTA */}
          <div
            className={`transition-all duration-[800ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-[40px] scale-90"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-4 sm:mt-6 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#E8CA5E] text-[#0B0F19] font-semibold hover:bg-[#d4b84a] transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E8CA5E]/30 text-sm sm:text-base"
            >
              Explore More
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div
        className={`absolute bottom-0 left-0 w-full transition-all duration-[1200ms] ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
        }`}
        style={{ transitionDelay: "1100ms" }}
      >
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-8 sm:h-10 md:h-12 lg:h-16"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,60 L0,60 Z"
            fill="#111722"
          />
        </svg>
      </div>
    </div>
  );
}