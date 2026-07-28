"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

const courses = [
  {
    id: 1,
    title: "Play Group",
    image: "https://loremflickr.com/400/300/preschool,kids",
    price: "PKR 25,000",
    tag: "New",
    stars: 5,
  },
  {
    id: 2,
    title: "Nursery",
    image: "https://loremflickr.com/400/300/nursery,children",
    price: "PKR 25,000",
    tag: "New",
    stars: 5,
  },
  {
    id: 3,
    title: "Primary",
    image: "https://loremflickr.com/400/300/classroom,school",
    price: "PKR 30,000",
    tag: "New",
    stars: 5,
  },
  {
    id: 4,
    title: "Middle",
    image: "https://loremflickr.com/400/300/students,library",
    price: "PKR 35,000",
    tag: "New",
    stars: 5,
  },
];

export default function CoursesSection() {
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#FAF9F6] py-20 px-6 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header - Left Aligned */}
        <div className="mb-14">
          {/* Badge - Slides in from LEFT */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[300px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8871E] mb-2">
              Our Courses
            </p>
          </div>

          {/* Heading - Slides in from LEFT */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[400px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B2340]">
              Explore Our Courses
            </h2>
          </div>

          {/* Description - Slides in from LEFT */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[#5B6472] mt-3 max-w-2xl text-base">
              Discover our comprehensive programs designed to nurture young minds 
              and build a strong foundation for lifelong learning.
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className={`group bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,35,64,0.06)] transition-all duration-700 ease-out hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] hover:-translate-y-2 cursor-pointer ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[100px]"
              }`}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
            >
              {/* Course Image */}
              <div className="relative w-full h-[180px] overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Tags on image */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#E8871E] text-[#FFFFFF] text-xs font-bold px-3 py-1 rounded-full">
                    {course.tag}
                  </span>
                  <span className="bg-[#0B2340] text-[#FFFFFF] text-xs font-bold px-3 py-1 rounded-full">
                    Class
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-[#0B2340] mb-1">
                  {course.title}
                </h3>
                
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < course.stars 
                          ? "fill-[#E8871E] text-[#E8871E]" 
                          : "fill-[#F2F4F7] text-[#F2F4F7]"
                      }`}
                    />
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-center">
                  <span className="text-[#E8871E] font-bold text-base">
                    {course.price}
                  </span>
                </div>

                {/* View More Button */}
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#2E9B5C] hover:text-[#081A30] transition-all duration-300 group-hover:gap-3"
                >
                  View More
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Row - Admission Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* Left Mascot */}
          <div
            className={`bg-[#F2F4F7] rounded-2xl flex items-center justify-center p-6 min-h-[200px] transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[100px]"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <img
              src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
              alt="Student mascot"
              className="h-[160px] w-auto"
            />
          </div>

          {/* Admission Banner */}
          <div
            className={`relative bg-gradient-to-br from-[#E8871E] to-[#0B2340] rounded-2xl flex flex-col items-center justify-center text-center p-8 min-h-[200px] shadow-lg transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-[100px] scale-90"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <span className="absolute top-4 left-5 font-extrabold text-[#FFFFFF] text-lg">
              2026
            </span>
            <span className="absolute top-4 right-5 text-right">
              <span className="text-2xl font-extrabold text-[#E8871E] bg-[#FFFFFF] px-2 py-0.5 rounded">
                20<span className="text-base">%</span>
              </span>
              <span className="block text-[10px] font-bold text-[#FFFFFF] -mt-1">
                OFF
              </span>
            </span>
            <div className="text-5xl mb-2">🎓</div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#FFFFFF] leading-tight">
              Admission<br />Open
            </h3>
            <Link
              href="/admissions"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2E9B5C] px-6 py-2.5 text-sm font-semibold text-[#FFFFFF] transition-all hover:bg-[#081A30] hover:scale-105"
            >
              Apply Now
              <span>→</span>
            </Link>
          </div>

          {/* Right Mascot */}
          <div
            className={`bg-[#F2F4F7] rounded-2xl flex items-center justify-center p-6 min-h-[200px] transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[100px]"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <img
              src="https://illustrations.popsy.co/amber/genius.svg"
              alt="Curious student mascot"
              className="h-[160px] w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}