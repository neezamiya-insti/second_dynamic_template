/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import { Plus, Minus } from "lucide-react";
import { useEffect, useRef } from "react";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQData {
  badgeText: string;
  heading: string;
  description: string;
  faqs: FAQItem[];
  image: string;
  imageBadgeText: string;
}

const DEFAULT_DATA: FAQData = {
  badgeText: "Got Questions?",
  heading: "Frequently Asked Questions",
  description:
    "Find answers to the most common questions about our college, admissions, and student life.",
  image: "/faq1.png",
  imageBadgeText: "Have Questions?",
  faqs: [
    {
      id: 1,
      question: "What is the admission process at Al Noor College?",
      answer:
        "The admission process begins with filling out an online application form, followed by an entrance test and interview.",
    },
    {
      id: 2,
      question: "What are the college timings?",
      answer:
        "Our college timings are from 8:00 AM to 4:00 PM, Monday through Friday.",
    },
    {
      id: 3,
      question: "What extracurricular activities do you offer?",
      answer:
        "We offer a wide range of extracurricular activities including sports, arts, and academic clubs.",
    },
  ],
};

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: FAQData;
  expiresAt: number;
}

const faqCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): FAQData | null {
  const entry = faqCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    faqCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: FAQData): void {
  faqCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = faqCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) faqCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function FAQSection() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<FAQData>(DEFAULT_DATA);
  const [openId, setOpenId] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // ✅ Hardcoded college ID
  const collegeId = "10";
  const CACHE_KEY = `faq_${collegeId}`;

  // ✅ Mounted flag — hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch data
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      console.log("📦 [FAQ] Loading from memory cache (instant)");
      setData(cached);
      return;
    }

    async function fetchFAQ() {
      try {
        console.log("🔄 [FAQ] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=FAQ`
        );
        const result = await res.json();
        console.log("📦 [FAQ] API Response:", result);

        let fetched: FAQData = DEFAULT_DATA;

        if (result.success && result.content) {
          const c = result.content;
          fetched = {
            badgeText: c.badgeText || DEFAULT_DATA.badgeText,
            heading: c.heading || DEFAULT_DATA.heading,
            description: c.description || DEFAULT_DATA.description,
            image: c.image || DEFAULT_DATA.image,
            imageBadgeText: c.imageBadgeText || DEFAULT_DATA.imageBadgeText,
            faqs:
              Array.isArray(c.faqs) && c.faqs.length > 0
                ? c.faqs.map((f: any, idx: number) => ({
                    id: f.id ?? idx + 1,
                    question: f.question || "",
                    answer: f.answer || "",
                  }))
                : DEFAULT_DATA.faqs,
          };
          console.log("✅ [FAQ] Data loaded, faqs:", fetched.faqs.length);
        } else {
          console.log("⚠️ [FAQ] No data, using defaults");
        }

        cacheSet(CACHE_KEY, fetched);
        setData(fetched);
      } catch (err) {
        console.error("❌ [FAQ] Error:", err);
        setData(DEFAULT_DATA);
      }
    }

    fetchFAQ();
  }, [mounted]);

  // Intersection observer
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

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#111722] py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header - Center Aligned */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          {/* Badge */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
            }`}
          >
            <p className="text-[11px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E8CA5E] mb-1.5 sm:mb-2">
              {data.badgeText}
            </p>
          </div>

          {/* Heading */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[60px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              {data.heading}
            </h2>
          </div>

          {/* Description */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[#9CA3AF] mt-2 sm:mt-3 max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0">
              {data.description}
            </p>
          </div>
        </div>

        {/* FAQ Content - Accordion Left + Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">

          {/* LEFT SIDE - FAQ Accordion */}
          <div className="space-y-3 sm:space-y-4">
            {data.faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className={`bg-[#0B0F19] rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden transition-all duration-700 ease-out hover:border-[#E8CA5E]/30 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[100px]"
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left cursor-pointer transition-colors hover:bg-white/5 active:bg-white/5 min-h-[60px] sm:min-h-[72px] group"
                >
                  <span className="text-sm sm:text-base font-semibold text-white pr-3 sm:pr-4 leading-snug sm:leading-normal">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 ml-3 sm:ml-4 text-[#E8CA5E] transition-transform duration-300 group-hover:scale-110">
                    {openId === faq.id ? (
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openId === faq.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 sm:pt-1 text-[#9CA3AF] text-xs sm:text-sm leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE - Image */}
          <div
            className={`relative h-[200px] sm:h-[280px] md:h-[350px] lg:h-[550px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-[1200ms] ease-out cursor-pointer group ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[100px]"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <Image
              src={data.image || "/faq1.png"}
              alt="Students learning together"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/60 via-transparent to-transparent" />

            {data.imageBadgeText && (
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hidden xs:block">
                <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wide">
                  {data.imageBadgeText}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div
          className={`flex justify-center mt-10 sm:mt-12 transition-all duration-[1000ms] ease-out ${
            isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          <div className="h-[2px] w-20 sm:w-32 bg-gradient-to-r from-transparent via-[#E8CA5E] to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
}