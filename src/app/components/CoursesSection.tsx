/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Star, Search, Filter, X } from "lucide-react";
import { useEffect, useRef } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface Course {
  id: number;
  title: string;
  category: string;
  image: string;
  duration: string;
  tag: string;
  stars: number;
}

interface CoursesData {
  badgeText: string;
  heading: string;
  description: string;
  courses: Course[];
  categories: string[];
}

interface CacheEntry {
  data: CoursesData;
  expiresAt: number;
}

const coursesCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): CoursesData | null {
  const entry = coursesCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    coursesCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: CoursesData): void {
  coursesCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = coursesCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) coursesCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// Shimmer Skeleton
function CoursesSkeleton() {
  return (
    <section className={`${poppins.className} w-full bg-[#111722] py-20`}>
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
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <div className="shimmer h-4 w-32 rounded-full mb-3" />
          <div className="shimmer h-10 w-80 max-w-full rounded-lg mb-3" />
          <div className="shimmer h-4 w-[500px] max-w-full rounded" />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="shimmer flex-1 h-12 rounded-full" />
          <div className="flex items-center gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="shimmer h-11 w-24 rounded-full" />
            ))}
          </div>
        </div>
        <div className="shimmer h-4 w-48 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[#0B0F19] rounded-2xl overflow-hidden border border-white/5">
              <div className="shimmer w-full h-[200px]" />
              <div className="p-5 text-center">
                <div className="shimmer h-4 w-4/5 mx-auto rounded mb-2" />
                <div className="shimmer h-3 w-2/3 mx-auto rounded mb-3" />
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="shimmer w-4 h-4 rounded-full" />
                  ))}
                </div>
                <div className="shimmer h-3 w-20 mx-auto rounded mb-4" />
                <div className="shimmer h-4 w-24 mx-auto rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CoursesSection() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CoursesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const collegeId = "10";
  const CACHE_KEY = `courses_${collegeId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached && cached.courses.length > 0) {
      console.log("📦 [Courses] Loading from memory cache");
      setData(cached);
      setIsLoading(false);
      return;
    }

    async function fetchCourses() {
      try {
        console.log("🔄 [Courses] Fetching for college:", collegeId);
        setIsLoading(true);

        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=Programs`
        );
        const result = await res.json();
        console.log("📦 [Courses] API Response:", result);

        if (result.success && result.content) {
          const c = result.content;

          // ✅ levels se courses flatten karo
          const allCourses: Course[] = [];
          const levelLabels: string[] = [];

          if (Array.isArray(c.levels)) {
            c.levels.forEach((level: any) => {
              if (level.label) levelLabels.push(level.label);
              if (Array.isArray(level.programs)) {
                level.programs.forEach((prog: any) => {
                  allCourses.push({
                    id: prog.id ?? allCourses.length + 1,
                    title: prog.name || prog.full || "Untitled",
                    category: level.label || "General",
                    image: prog.image || c.heroImage || "",
                    duration: prog.duration || "",
                    tag: level.label || "",
                    stars: 5,
                  });
                });
              }
            });
          }

          if (allCourses.length > 0) {
            const fetched: CoursesData = {
              badgeText: "Our Programs",
              heading: c.heroTitle || "Explore Our Programs",
              description: c.heroSubtitle || "",
              categories: ["All", ...levelLabels.filter(Boolean)],
              courses: allCourses,
            };
            console.log("✅ [Courses] Data loaded:", fetched.courses.length);
            cacheSet(CACHE_KEY, fetched);
            setData(fetched);
          } else {
            console.log("⚠️ [Courses] No programs found in levels");
            setData(null);
          }
        } else {
          console.log("⚠️ [Courses] No content from API");
          setData(null);
        }
      } catch (err) {
        console.error("❌ [Courses] Error:", err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, [mounted]);

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

  if (!mounted || isLoading) {
    return <CoursesSkeleton />;
  }

  if (!data || data.courses.length === 0) return null;

  const filteredCourses = data.courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#111722] py-20 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          {data.badgeText && (
            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[300px]"
              }`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-2">
                {data.badgeText}
              </p>
            </div>
          )}

          {data.heading && (
            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[400px]"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                {data.heading}
              </h2>
            </div>
          )}

          {data.description && (
            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[350px]"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <p className="text-[#9CA3AF] mt-3 max-w-2xl text-base">
                {data.description}
              </p>
            </div>
          )}
        </div>

        {/* Search + Filter */}
        <div
          className={`flex flex-col md:flex-row gap-4 mb-10 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
          }`}
          style={{ transitionDelay: "350ms" }}
        >
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full bg-[#0B0F19] border border-white/10 text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#E8CA5E] transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B0F19] border border-white/10 text-white font-semibold hover:border-[#E8CA5E] transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>

          {data.categories.length > 1 && (
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {data.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#E8CA5E] text-[#0B0F19]"
                      : "bg-[#0B0F19] text-[#9CA3AF] hover:text-white hover:border-[#E8CA5E] border border-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Filter Dropdown */}
        {isFilterOpen && data.categories.length > 1 && (
          <div className="md:hidden mb-6 p-4 bg-[#0B0F19] rounded-2xl border border-white/10">
            <div className="flex flex-wrap gap-2">
              {data.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsFilterOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#E8CA5E] text-[#0B0F19]"
                      : "bg-[#111722] text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 text-[#9CA3AF] text-sm">
          Showing {filteredCourses.length} of {data.courses.length} programs
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className={`group bg-[#0B0F19] rounded-2xl overflow-hidden border border-white/5 transition-all duration-700 ease-out hover:border-[#E8CA5E] hover:shadow-[0_8px_30px_rgba(232,202,94,0.08)] hover:-translate-y-2 cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[100px]"
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              {course.image && (
                <div className="relative w-full h-[200px] overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {course.tag && (
                      <span className="bg-[#E8CA5E] text-[#0B0F19] text-xs font-bold px-3 py-1 rounded-full">
                        {course.tag}
                      </span>
                    )}
                    {course.duration && (
                      <span className="bg-[#0B0F19]/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                        {course.duration}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="p-5 text-center">
                <h3 className="text-base font-bold text-white mb-1 line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < course.stars
                          ? "fill-[#E8CA5E] text-[#E8CA5E]"
                          : "fill-[#2A2F3F] text-[#2A2F3F]"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-[#9CA3AF] text-sm font-medium">
                    {course.category}
                  </span>
                </div>

                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#E8CA5E] hover:text-white transition-all duration-300 group-hover:gap-3"
                >
                  View More
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#9CA3AF] text-lg">No courses found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-[#E8CA5E] hover:text-white transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}