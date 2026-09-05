"use client";

import React from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

const faculty = [
  {
    name: "Dr. Fatima Al Noor",
    designation: "Principal",
    bio: "With over 15 years in academic leadership, she is dedicated to fostering a nurturing and disciplined environment where every student can thrive.",
    photo: "/faculty/principal.png",
  },
  {
    name: "Prof. Ahmed Raza",
    designation: "Vice Principal",
    bio: "A passionate educator who oversees academic planning and student affairs, ensuring smooth day-to-day operations across all departments.",
    photo: "/faculty/ahmed.png",
  },
  {
    name: "Prof. Sara Malik",
    designation: "Head of Science",
    bio: "She brings innovative teaching methods to the science department, inspiring students to explore, question, and discover the world around them.",
    photo: "/faculty/sara.png",
  },
  {
    name: "Prof. Bilal Hussain",
    designation: "Head of Arts",
    bio: "A creative mentor who nurtures artistic talent, encouraging students to express themselves through painting, music, and performing arts.",
    photo: "/faculty/bilal.png",
  },
];

export default function FacultySection() {
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
      className={`${poppins.className} w-full bg-[#0B0F19] py-20 px-6 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto overflow-hidden">
        {/* Header - Center Aligned */}
        <div className="text-center mb-14">
          {/* Badge - Slides in from LEFT */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[300px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-2">
              Our Team
            </p>
          </div>

          {/* Heading - Slides UP from BOTTOM */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[100px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Meet Our Faculty
            </h2>
          </div>

          {/* Description - Slides UP from BOTTOM */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[80px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[#9CA3AF] mt-3 max-w-xl mx-auto text-base">
              Dedicated educators committed to shaping bright futures with care,
              knowledge, and inspiration.
            </p>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {faculty.map((member, index) => (
            <div
              key={member.name}
              className={`flex flex-col items-center text-center group cursor-pointer transition-all duration-700 ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[120px]"
              }`}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
            >
              {/* Image Frame - Same shape for all */}
              <div className={`
                rounded-[50%_50%_50%_50%/42%_42%_58%_58%]
                bg-[#111722] p-3 shadow-xl transition-all duration-300 hover:scale-105 z-10 -mb-10 w-32 h-32 border border-white/10
              `}>
                <div className={`
                  relative w-full h-full overflow-hidden
                  rounded-[50%_50%_50%_50%/42%_42%_58%_58%]
                `}>
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Card Content */}
              <div className="bg-[#111722] rounded-full w-full min-h-[340px] pt-16 pb-8 px-6 flex flex-col items-center shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-white/5">
                <h3 className="text-xl font-bold text-white">
                  {member.name}
                </h3>
                <span className="text-sm font-semibold text-[#E8CA5E] mt-1 mb-4">
                  {member.designation}
                </span>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}