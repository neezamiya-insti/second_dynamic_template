"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Star, Search, Filter, X } from "lucide-react";
import { useEffect, useRef } from "react";
import GreenfieldBanner from "./GreenfieldBanner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const courses = [
  {
    id: 1,
    title: "Bachelor of Science (CS)",
    category: "Science",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    duration: "4 Years",
    tag: "Popular",
    stars: 5,
  },
  {
    id: 2,
    title: "Bachelor of Business Administration",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    duration: "4 Years",
    tag: "New",
    stars: 5,
  },
  {
    id: 3,
    title: "Bachelor of Arts (English)",
    category: "Arts",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    duration: "3 Years",
    tag: "Popular",
    stars: 5,
  },
  {
    id: 4,
    title: "Master of Science (CS)",
    category: "Science",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    duration: "2 Years",
    tag: "New",
    stars: 5,
  },
  {
    id: 5,
    title: "Master of Business Administration",
    category: "Business",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    duration: "2 Years",
    tag: "Popular",
    stars: 5,
  },
  {
    id: 6,
    title: "Bachelor of Education",
    category: "Education",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    duration: "4 Years",
    tag: "New",
    stars: 5,
  },
  {
    id: 7,
    title: "Bachelor of Law (LLB)",
    category: "Law",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    duration: "5 Years",
    tag: "Popular",
    stars: 5,
  },
  {
    id: 8,
    title: "Bachelor of Design (B.Des)",
    category: "Arts",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?fm=jpg&q=80&w=1200&auto=format&fit=crop",
    duration: "4 Years",
    tag: "New",
    stars: 5,
  },
];

const categories = ["All", "Science", "Business", "Arts", "Education", "Law"];

export default function CoursesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  // Filter courses based on search and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#111722] py-20 overflow-hidden`}
    >
      {/* ========== COURSES CONTENT ========== */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[300px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-2">
              Our Courses
            </p>
          </div>

          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[400px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Explore Our Programs
            </h2>
          </div>

          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[#9CA3AF] mt-3 max-w-2xl text-base">
              Discover our comprehensive degree programs designed to shape future
              leaders and build successful careers.
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div
          className={`flex flex-col md:flex-row gap-4 mb-10 transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[50px]"
          }`}
          style={{ transitionDelay: "350ms" }}
        >
          {/* Search Input */}
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

          {/* Filter Button - Mobile */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B0F19] border border-white/10 text-white font-semibold hover:border-[#E8CA5E] transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>

          {/* Category Filters - Desktop */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {categories.map((category) => (
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
        </div>

        {/* Mobile Filter Dropdown */}
        {isFilterOpen && (
          <div className="md:hidden mb-6 p-4 bg-[#0B0F19] rounded-2xl border border-white/10">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
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
          Showing {filteredCourses.length} of {courses.length} programs
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => (
            <div
              key={course.id}
              className={`group bg-[#0B0F19] rounded-2xl overflow-hidden border border-white/5 transition-all duration-700 ease-out hover:border-[#E8CA5E] hover:shadow-[0_8px_30px_rgba(232,202,94,0.08)] hover:-translate-y-2 cursor-pointer ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[100px]"
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="relative w-full h-[200px] overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#E8CA5E] text-[#0B0F19] text-xs font-bold px-3 py-1 rounded-full">
                    {course.tag}
                  </span>
                  <span className="bg-[#0B0F19]/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                    {course.duration}
                  </span>
                </div>
              </div>

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

        {/* No Results */}
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

      {/* ========== FULL WIDTH BANNER ========== */}
    
    </section>
  );
}