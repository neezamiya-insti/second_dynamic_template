/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface PrincipalMessageData {
  badgeText: string;
  principalName: string;
  paragraphs: string[];
  signature: string;
  image: string;
}

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: PrincipalMessageData;
  expiresAt: number;
}

const principalCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): PrincipalMessageData | null {
  const entry = principalCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    principalCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: PrincipalMessageData): void {
  principalCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = principalCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) principalCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------------------
function PrincipalSkeleton() {
  return (
    <div className={`${poppins.className} bg-[#FFFFFF] shadow-xl overflow-hidden`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 py-12">
        <div className="shimmer h-[400px] lg:h-[500px] rounded-2xl" />

        <div className="flex flex-col justify-center space-y-4">
          <div className="shimmer h-4 w-40 rounded" />
          <div className="shimmer h-10 w-72 max-w-full rounded-lg" />
          <div className="shimmer h-1 w-12 rounded-full" />
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-11/12 rounded" />
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-5/6 rounded" />
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-2/3 rounded" />
          <div className="shimmer h-4 w-56 rounded mt-6" />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function PrincipalMessageSection() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<PrincipalMessageData | null>(null);

  const collegeId = "10";
  const CACHE_KEY = `principal_message_${collegeId}`;

  // Mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      console.log("📦 [PrincipalMessage] Loading from memory cache");
      setData(cached);
      return;
    }

    async function fetchData() {
      try {
        console.log("🔄 [PrincipalMessage] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=PrincipalMessage`
        );
        const result = await res.json();
        console.log("📦 [PrincipalMessage] API Response:", result);

        if (result.success && result.content) {
          const c = result.content;
          const fetched: PrincipalMessageData = {
            badgeText: c.badgeText || "Principal's Message",
            principalName: c.principalName || "",
            paragraphs:
              Array.isArray(c.paragraphs) && c.paragraphs.length > 0
                ? c.paragraphs
                : [],
            signature: c.signature || "",
            image: c.image || "",
          };

          // ✅ Agar sab kuch khali hai to render nahi
          if (
            !fetched.principalName &&
            fetched.paragraphs.length === 0 &&
            !fetched.image
          ) {
            console.log("⚠️ [PrincipalMessage] All fields empty");
            setData(null);
            return;
          }

          cacheSet(CACHE_KEY, fetched);
          setData(fetched);
        } else {
          console.log("⚠️ [PrincipalMessage] No data from API");
          setData(null);
        }
      } catch (err) {
        console.error("❌ [PrincipalMessage] Error:", err);
        setData(null);
      }
    }

    fetchData();
  }, [mounted]);

  // Loading
  if (!mounted || !data) {
    return <PrincipalSkeleton />;
  }

  return (
    <div className={`${poppins.className} bg-[#FFFFFF] shadow-xl overflow-hidden`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 py-12">
        {/* Left Side - Image */}
        {data.image && (
          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden cursor-pointer group">
            <Image
              src={data.image}
              alt={data.principalName || "Principal"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/40 via-transparent to-transparent lg:hidden" />
          </div>
        )}

        {/* Right Side - Content */}
        <div className={`flex flex-col justify-center ${!data.image ? "lg:col-span-2" : ""}`}>
          {/* Badge */}
          {data.badgeText && (
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-2">
              {data.badgeText}
            </p>
          )}

          {/* Name */}
          {data.principalName && (
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#0B0F19] mb-4">
              {data.principalName}
            </h3>
          )}

          {/* Decorative Line */}
          <div className="w-12 h-1 bg-[#E8CA5E] mb-6" />

          {/* Paragraphs */}
          {data.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-[#5B6472] text-base leading-relaxed mb-4"
            >
              {paragraph}
            </p>
          ))}

          {/* Signature */}
          {data.signature && (
            <div className="mt-6 flex items-center gap-3">
              <div className="w-12 h-[2px] bg-[#E8CA5E]" />
              <span className="text-[#E8CA5E] font-semibold text-sm">
                {data.signature}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}