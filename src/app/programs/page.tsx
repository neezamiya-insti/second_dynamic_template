/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Star, Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import ContactSection from "../components/ContactSection";
import HowWeTeach from "./HowWeTeach";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface Course {
  id: number;
  title: string;
  image: string;
  price: string;
  tag: string;
  category: string;
  stars: number;
  description: string;
  fullDescription: string;
}

interface HeroData {
  heroImage: string;
  badgeText: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
}

interface CoursesPageData {
  hero: HeroData;
  courses: Course[];
  categories: string[];
}

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: CoursesPageData;
  expiresAt: number;
}

const programsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): CoursesPageData | null {
  const entry = programsCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    programsCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: CoursesPageData): void {
  programsCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = programsCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) programsCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Shimmer Skeleton
// ----------------------------------------------------------------------------
function PageSkeleton() {
  return (
    <section className={`${poppins.className} w-full bg-[#FAF9F6]`}>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.04) 0%,
            rgba(0, 0, 0, 0.08) 50%,
            rgba(0, 0, 0, 0.04) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      {/* Hero Skeleton */}
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] bg-[#0B0F19]/80">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-4">
          <div className="shimmer h-6 w-40 rounded-full" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
          <div className="shimmer h-10 w-96 max-w-full rounded-lg" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
          <div className="shimmer h-4 w-80 max-w-full rounded" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
          <div className="shimmer h-14 w-[500px] max-w-full rounded-full mt-4" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
        </div>
      </div>

      {/* Courses Grid Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-14">
          <div className="shimmer h-4 w-32 mx-auto rounded mb-3" />
          <div className="shimmer h-8 w-80 max-w-full mx-auto rounded-lg" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Filter Sidebar Skeleton */}
          <div className="md:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="shimmer h-4 w-20 rounded mb-4" />
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="shimmer h-10 w-full rounded-xl mb-2" />
              ))}
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="shimmer w-full h-[180px]" />
                  <div className="p-5">
                    <div className="shimmer h-5 w-3/4 mx-auto rounded mb-3" />
                    <div className="shimmer h-3 w-20 mx-auto rounded mb-3" />
                    <div className="shimmer h-3 w-full rounded mb-2" />
                    <div className="shimmer h-3 w-2/3 mx-auto rounded mb-4" />
                    <div className="shimmer h-4 w-24 mx-auto rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function ProgramsPage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CoursesPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const collegeId = "10";
  const CACHE_KEY = `programs_page_${collegeId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached && cached.courses.length > 0) {
      console.log("📦 [Programs] Loading from memory cache");
      setData(cached);
      setIsLoading(false);
      return;
    }

    async function fetchPrograms() {
      try {
        console.log("🔄 [Programs] Fetching for college:", collegeId);
        setIsLoading(true);

        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=Programs`
        );
        const result = await res.json();
        console.log("📦 [Programs] API Response:", result);

        if (result.success && result.content) {
          const c = result.content;

          // ✅ levels[].programs[] flatten karo
          const allCourses: Course[] = [];
          const categorySet = new Set<string>();

          if (Array.isArray(c.levels)) {
            c.levels.forEach((level: any) => {
              if (level.label) categorySet.add(level.label);
              if (Array.isArray(level.programs)) {
                level.programs.forEach((prog: any, idx: number) => {
                  allCourses.push({
                    id: prog.id ?? allCourses.length + 1,
                    title: prog.name || prog.full || "Untitled Program",
                    image: prog.image || c.heroImage || "",
                    price: prog.price || prog.fee || "Contact for fee",
                    tag: prog.tag || level.label || "New",
                    category: level.label || "General",
                    stars: prog.stars ?? 5,
                    description: prog.description || prog.full || "",
                    fullDescription:
                      prog.fullDescription ||
                      prog.description ||
                      `Complete details about ${prog.name || "this program"}. Contact us for more information.`,
                  });
                });
              }
            });
          }

          if (allCourses.length > 0) {
            const fetched: CoursesPageData = {
              hero: {
                heroImage: c.heroImage || "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=1172&auto=format&fit=crop",
                badgeText: "Explore Our Programs",
                heroTitle: c.heroTitle || "Learn, Grow &",
                heroHighlight: "Inspire Together",
                heroSubtitle:
                  c.heroSubtitle ||
                  "Browse our comprehensive range of degree programs designed to shape future leaders and build successful careers.",
              },
              courses: allCourses,
              categories: ["All", ...Array.from(categorySet)],
            };
            console.log("✅ [Programs] Data loaded:", fetched.courses.length);
            cacheSet(CACHE_KEY, fetched);
            setData(fetched);
          } else {
            console.log("⚠️ [Programs] No programs found");
            setData(null);
          }
        } else {
          console.log("⚠️ [Programs] No content from API");
          setData(null);
        }
      } catch (err) {
        console.error("❌ [Programs] Error:", err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrograms();
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
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [data]);

  if (!mounted || isLoading) {
    return <PageSkeleton />;
  }

  if (!data || data.courses.length === 0) return null;

  const filteredCourses = data.courses.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#FAF9F6] overflow-hidden`}
    >
      {/* ====== HERO SECTION ====== */}
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden">
        <div
          className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
            isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
        >
          <Image
            src={data.hero.heroImage}
            alt="Students learning"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-b from-[#0B0F19]/60 via-[#0B0F19]/70 to-[#0B0F19]/80 transition-all duration-[1000ms] ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="inline-block text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#E8CA5E] mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 border border-[#E8CA5E]/30 rounded-full bg-[#E8CA5E]/10 backdrop-blur-sm">
              ✦ {data.hero.badgeText} ✦
            </p>
          </div>

          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[300px]"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-2xl">
              {data.hero.heroTitle} <br />
              <span className="text-[#E8CA5E]">{data.hero.heroHighlight}</span>
            </h1>
          </div>

          <div
            className={`flex justify-center transition-all duration-[800ms] ease-out ${
              isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="h-[2px] sm:h-[3px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#E8CA5E] to-transparent rounded-full my-3 sm:my-4" />
          </div>

          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[80px]"
            }`}
            style={{ transitionDelay: "750ms" }}
          >
            <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-base max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
              {data.hero.heroSubtitle}
            </p>
          </div>

          {/* Search Input */}
          <div
            className={`max-w-xl w-full mx-auto transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[60px]"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1.5 sm:p-2 transition-all duration-300 focus-within:border-[#E8CA5E] focus-within:shadow-[0_0_20px_rgba(232,202,94,0.2)]">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder:text-white/60 px-3 sm:px-4 py-1.5 sm:py-2 outline-none text-xs sm:text-base font-medium"
              />
              <button className="bg-[#E8CA5E] text-[#0B0F19] p-2 sm:p-3 rounded-full hover:bg-[#d4b84a] transition-all hover:scale-105 cursor-pointer">
                <Search className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div
          className={`absolute bottom-0 left-0 w-full transition-all duration-[1200ms] ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <svg viewBox="0 0 1440 60" className="w-full h-8 sm:h-10 md:h-12 lg:h-16" preserveAspectRatio="none">
            <path
              d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,60 L0,60 Z"
              fill="#FAF9F6"
            />
          </svg>
        </div>
      </div>

      {/* ====== COURSES SECTION WITH FILTER ====== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
            }`}
            style={{ transitionDelay: "1100ms" }}
          >
            <p className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E8CA5E] mb-2">
              Our Programs
            </p>
          </div>
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B2340]">
              Explore Our Degree Programs
            </h2>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* LEFT SIDEBAR - Filter */}
          <div className="md:w-[280px] flex-shrink-0">
            <div
              className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,35,64,0.06)] p-4 sm:p-6 sticky top-24 transition-all duration-[800ms] ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[100px]"
              }`}
              style={{ transitionDelay: "1300ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#5B6472] flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </h3>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="text-xs text-[#E8CA5E] hover:text-[#d4b84a] transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="w-full md:hidden flex items-center justify-between px-4 py-2 bg-[#F2F4F7] rounded-xl text-[#0B2340] font-semibold text-sm mb-3 cursor-pointer"
              >
                <span>{selectedCategory}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileFilterOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={`${isMobileFilterOpen ? "block" : "hidden"} md:block space-y-1`}>
                {data.categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                      selectedCategory === category
                        ? "bg-[#E8CA5E] text-[#0B0F19] shadow-lg shadow-[#E8CA5E]/20"
                        : "text-[#5B6472] hover:bg-[#F2F4F7] hover:text-[#0B2340]"
                    }`}
                  >
                    {category}
                    {selectedCategory === category && (
                      <span className="float-right text-xs bg-[#0B0F19]/20 px-2 py-0.5 rounded-full">
                        {filteredCourses.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#F2F4F7]">
                <p className="text-xs text-[#5B6472]">
                  Showing <span className="font-bold text-[#0B2340]">{filteredCourses.length}</span> programs
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Courses Grid */}
          <div className="flex-1">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#5B6472] text-lg">No programs found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-[#E8CA5E] font-semibold hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredCourses.map((course, index) => {
                  const isExpanded = expandedCard === course.id;

                  return (
                    <div
                      key={course.id}
                      className={`group bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,35,64,0.06)] transition-all duration-700 ease-out hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] hover:-translate-y-2 cursor-pointer ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[100px]"
                      }`}
                      style={{ transitionDelay: `${1400 + index * 150}ms` }}
                    >
                      {course.image && (
                        <div className="relative w-full h-[150px] sm:h-[180px] overflow-hidden bg-[#F2F4F7]">
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-1.5 sm:gap-2">
                            {course.tag && (
                              <span className="bg-[#E8CA5E] text-[#0B0F19] text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                {course.tag}
                              </span>
                            )}
                            {course.category && (
                              <span className="bg-[#0B0F19] text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                {course.category}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="p-3 sm:p-5">
                        <h3 className="text-base sm:text-lg font-bold text-[#0B2340] mb-1 text-center">
                          {course.title}
                        </h3>
                        <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                i < course.stars
                                  ? "fill-[#E8CA5E] text-[#E8CA5E]"
                                  : "fill-[#F2F4F7] text-[#F2F4F7]"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="text-[#5B6472] text-xs sm:text-sm leading-relaxed mb-3">
                          {isExpanded ? (
                            <p>{course.fullDescription}</p>
                          ) : (
                            <p className="line-clamp-2">{course.description}</p>
                          )}
                        </div>

                        {course.price && (
                          <div className="flex items-center justify-center mb-3">
                            <span className="text-[#E8CA5E] font-bold text-sm sm:text-base">
                              {course.price}
                            </span>
                            <span className="text-[#5B6472] text-xs ml-1">/ year</span>
                          </div>
                        )}

                        <div className="text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(course.id);
                            }}
                            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#E8CA5E] hover:text-[#0B0F19] transition-all duration-300 cursor-pointer"
                          >
                            {isExpanded ? (
                              <>
                                Read Less
                                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              </>
                            ) : (
                              <>
                                Read More
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <HowWeTeach />
      <ContactSection />
    </section>
  );
}