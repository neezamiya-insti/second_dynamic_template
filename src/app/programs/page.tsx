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

// ✅ ALL IMAGES FIXED - Proper paths with / and local images
const courses = [
  {
    id: 1,
    title: "Play Group",
    image: "/play_group.png",
    price: "PKR 25,000",
    tag: "New",
    category: "Early Years",
    stars: 5,
    description: "A nurturing environment for our youngest learners to explore and grow. Through play-based learning, children develop social skills, creativity, and a love for discovery.",
    fullDescription: "Our Play Group program is designed to provide a safe, nurturing, and stimulating environment where children aged 3-4 years can explore, learn, and grow. We focus on developing social skills, emotional intelligence, and cognitive abilities through structured play, creative activities, and guided exploration. Our experienced teachers create a warm and welcoming atmosphere that makes every child feel valued and supported.",
  },
  {
    id: 2,
    title: "Nursery",
    image: "/nursery.png",
    price: "PKR 25,000",
    tag: "New",
    category: "Early Years",
    stars: 5,
    description: "Building foundational skills through play-based and structured activities that prepare children for formal education.",
    fullDescription: "Our Nursery program bridges the gap between playgroup and formal schooling. Children aged 4-5 years engage in structured learning activities that build foundational skills in literacy, numeracy, and social interaction. We use a balanced approach that combines teacher-guided instruction with child-led exploration, ensuring each child develops confidence and independence.",
  },
  {
    id: 3,
    title: "Primary",
    image: "/primary.png",
    price: "PKR 30,000",
    tag: "New",
    category: "Primary",
    stars: 5,
    description: "Core academic subjects combined with creative and physical education to develop well-rounded individuals.",
    fullDescription: "Our Primary program (Grades 1-5) provides a strong academic foundation while nurturing creativity, critical thinking, and physical development. Students explore core subjects including English, Mathematics, Science, and Social Studies, alongside art, music, and physical education. We emphasize character building, teamwork, and a growth mindset.",
  },
  {
    id: 4,
    title: "Middle",
    image: "/middle.png",
    price: "PKR 35,000",
    tag: "New",
    category: "Secondary",
    stars: 5,
    description: "Advanced curriculum with a focus on critical thinking and independent study skills.",
    fullDescription: "The Middle School program (Grades 6-8) builds on foundational knowledge while introducing more complex concepts across all subjects. Students develop critical thinking, research, and independent study skills through project-based learning and collaborative assignments. We prepare students for the rigors of secondary education while nurturing their individual interests and talents.",
  },
  {
    id: 5,
    title: "Secondary",
    image: "/secondary.png",
    price: "PKR 40,000",
    tag: "Popular",
    category: "Secondary",
    stars: 5,
    description: "Preparing students for higher education with specialized subject streams and career guidance.",
    fullDescription: "Our Secondary program (Grades 9-10) prepares students for O-Level/Matriculation examinations with a comprehensive curriculum across sciences, humanities, and commerce streams. Students receive career guidance, academic counseling, and exposure to various fields through guest lectures and workshops. We focus on developing analytical skills, leadership qualities, and a strong sense of responsibility.",
  },
  {
    id: 6,
    title: "A-Levels",
    image: "/alevels.png",
    price: "PKR 50,000",
    tag: "Advanced",
    category: "Higher Secondary",
    stars: 5,
    description: "Rigorous pre-university program with expert faculty and comprehensive career preparation.",
    fullDescription: "Our A-Level program (Grades 11-12) offers a rigorous academic experience with subject specialization across sciences, arts, and commerce. Students benefit from expert faculty, small class sizes, and personalized mentoring. We provide extensive university preparation, including application guidance, entrance exam preparation, and career counseling to ensure students are well-prepared for their future endeavors.",
  },
];

// Categories for filter
const categories = [
  "All",
  "Early Years",
  "Primary",
  "Secondary",
  "Higher Secondary",
];

// ✅ FALLBACK IMAGE for error handling
const FALLBACK_IMAGE = "/fallback-image.png";

export default function CoursesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
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
        threshold: 0.05,
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

  // Filter courses based on category and search
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#FAF9F6] overflow-hidden`}
    >
      {/* ====== HERO SECTION - Mobile Responsive ====== */}
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden">
        <div
          className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
            isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Students learning"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-b from-[#0B2340]/60 via-[#0B2340]/70 to-[#0B2340]/80 transition-all duration-[1000ms] ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[30px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="inline-block text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#E8871E] mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 border border-[#E8871E]/30 rounded-full bg-[#E8871E]/10 backdrop-blur-sm">
              ✦ Explore Our Programs ✦
            </p>
          </div>

          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[300px]"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-2xl">
              Learn, Grow & <br />
              <span className="text-[#E8871E]">Inspire Together</span>
            </h1>
          </div>

          <div
            className={`flex justify-center transition-all duration-[800ms] ease-out ${
              isVisible
                ? "opacity-100 scale-x-100"
                : "opacity-0 scale-x-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="h-[2px] sm:h-[3px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#E8871E] to-transparent rounded-full my-3 sm:my-4" />
          </div>

          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[80px]"
            }`}
            style={{ transitionDelay: "750ms" }}
          >
            <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
              Browse our comprehensive range of courses designed to nurture young minds
              and build a strong foundation for lifelong learning.
            </p>
          </div>

          {/* Search Input - Mobile Responsive */}
          <div
            className={`max-w-xl w-full mx-auto transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[60px]"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1.5 sm:p-2 transition-all duration-300 focus-within:border-[#E8871E] focus-within:shadow-[0_0_20px_rgba(232,135,30,0.2)]">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder:text-white/60 px-3 sm:px-4 py-1.5 sm:py-2 outline-none text-xs sm:text-base font-medium"
              />
              <button className="bg-[#E8871E] text-white p-2 sm:p-3 rounded-full hover:bg-[#d1780f] transition-all hover:scale-105 cursor-pointer">
                <Search className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Wave - Mobile Responsive */}
        <div
          className={`absolute bottom-0 left-0 w-full transition-all duration-[1200ms] ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[20px]"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <svg
            viewBox="0 0 1440 60"
            className="w-full h-8 sm:h-10 md:h-12 lg:h-16"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,60 L0,60 Z"
              fill="#FAF9F6"
            />
          </svg>
        </div>
      </div>

      {/* ====== COURSES SECTION WITH FILTER ====== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {/* Header - Center Aligned */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[30px]"
            }`}
            style={{ transitionDelay: "1100ms" }}
          >
            <p className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E8871E] mb-2">
              Our Courses
            </p>
          </div>
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[30px]"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B2340]">
              Explore Our Courses
            </h2>
          </div>
        </div>

        {/* Filter + Courses Grid */}
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* LEFT SIDEBAR - Filter */}
          <div className="md:w-[280px] flex-shrink-0">
            <div
              className={`bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,35,64,0.06)] p-4 sm:p-6 sticky top-24 transition-all duration-[800ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-[100px]"
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
                    className="text-xs text-[#E8871E] hover:text-[#d1780f] transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="w-full md:hidden flex items-center justify-between px-4 py-2 bg-[#F2F4F7] rounded-xl text-[#0B2340] font-semibold text-sm mb-3 cursor-pointer"
              >
                <span>{selectedCategory}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Categories */}
              <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} md:block space-y-1`}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                      selectedCategory === category
                        ? "bg-[#E8871E] text-white shadow-lg shadow-[#E8871E]/20"
                        : "text-[#5B6472] hover:bg-[#F2F4F7] hover:text-[#0B2340]"
                    }`}
                  >
                    {category}
                    {selectedCategory === category && (
                      <span className="float-right text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {filteredCourses.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-[#F2F4F7]">
                <p className="text-xs text-[#5B6472]">
                  Showing <span className="font-bold text-[#0B2340]">{filteredCourses.length}</span> courses
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Courses Grid - Responsive */}
          <div className="flex-1">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#5B6472] text-lg">No courses found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-[#E8871E] font-semibold hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredCourses.map((course, index) => {
                  const isExpanded = expandedCard === course.id;
                  const hasError = imageErrors[course.id];
                  const imageSrc = hasError ? FALLBACK_IMAGE : course.image;

                  return (
                    <div
                      key={course.id}
                      className={`group bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,35,64,0.06)] transition-all duration-700 ease-out hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] hover:-translate-y-2 cursor-pointer ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-[100px]"
                      }`}
                      style={{ transitionDelay: `${1400 + index * 150}ms` }}
                    >
                      <div className="relative w-full h-[150px] sm:h-[180px] overflow-hidden bg-[#F2F4F7]">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={() => handleImageError(course.id)}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#5B6472] bg-[#F2F4F7]">
                            <span className="text-sm">No Image</span>
                          </div>
                        )}
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-1.5 sm:gap-2">
                          <span className="bg-[#E8871E] text-[#FFFFFF] text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                            {course.tag}
                          </span>
                          <span className="bg-[#0B2340] text-[#FFFFFF] text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                            {course.category}
                          </span>
                        </div>
                      </div>
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
                                  ? "fill-[#E8871E] text-[#E8871E]"
                                  : "fill-[#F2F4F7] text-[#F2F4F7]"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Description - Short or Full */}
                        <div className="text-[#5B6472] text-xs sm:text-sm leading-relaxed mb-3">
                          {isExpanded ? (
                            <div className="space-y-2">
                              <p>{course.fullDescription}</p>
                            </div>
                          ) : (
                            <p className="line-clamp-2">{course.description}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-center mb-3">
                          <span className="text-[#E8871E] font-bold text-sm sm:text-base">
                            {course.price}
                          </span>
                        </div>

                        {/* Read More / Read Less Button */}
                        <div className="text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(course.id);
                            }}
                            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#2E9B5C] hover:text-[#081A30] transition-all duration-300 cursor-pointer"
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