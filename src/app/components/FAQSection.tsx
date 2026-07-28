"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef } from "react";
import Image from "next/image";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

const faqs = [
  {
    id: 1,
    question: "What is the admission process at Greenfield School?",
    answer: "The admission process at Greenfield School begins with filling out an online application form, followed by a parent-school interaction session. After the interaction, successful candidates receive an admission offer. Please visit our Admissions page for detailed information and important deadlines."
  },
  {
    id: 2,
    question: "What are the school timings?",
    answer: "Our school timings are from 8:00 AM to 4:00 PM, Monday through Friday. The morning assembly starts at 7:55 AM, and students are expected to be in school by 7:50 AM. After-school activities are conducted from 2:30 PM to 4:00 PM."
  },
  {
    id: 3,
    question: "What extracurricular activities do you offer?",
    answer: "We offer a wide range of extracurricular activities including sports (cricket, football, basketball, swimming), arts (painting, music, drama, dance), and academic clubs (science club, debate club, coding club, literary society). Students are encouraged to participate in at least one activity of their choice."
  },
  {
    id: 4,
    question: "Do you provide transportation facilities?",
    answer: "Yes, we provide safe and reliable transportation services for students. Our school buses cover all major areas of the city with GPS tracking and trained attendants on each bus. Parents can track the bus location through our mobile app."
  },
  {
    id: 5,
    question: "What is the teacher-to-student ratio?",
    answer: "Our teacher-to-student ratio is maintained at a healthy 1:20 for primary classes and 1:25 for secondary classes. This ensures that every student receives individual attention and support from their teachers."
  },
  {
    id: 6,
    question: "Does the school have a canteen facility?",
    answer: "Yes, we have a well-maintained canteen that provides nutritious and hygienic meals and snacks. The menu is designed by nutritionists to ensure balanced diets, and we also accommodate special dietary requirements and allergies."
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);
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

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#FAF9F6] py-12 sm:py-16 md:py-20 px-4 sm:px-6 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header - Center Aligned */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          {/* Badge - Slides UP from BOTTOM */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[50px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="text-[11px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E8871E] mb-1.5 sm:mb-2">
              Got Questions?
            </p>
          </div>

          {/* Heading - Slides UP from BOTTOM */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[60px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B2340]">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Description - Slides UP from BOTTOM */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[50px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[#5B6472] mt-2 sm:mt-3 max-w-2xl mx-auto text-sm sm:text-base px-2 sm:px-0">
              Find answers to the most common questions about our school, admissions, 
              and student life.
            </p>
          </div>
        </div>

        {/* FAQ Content - Image Left + Accordion Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE - Image */}
          <div
            className={`relative h-[200px] sm:h-[280px] md:h-[350px] lg:h-[550px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-[1200ms] ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[100px]"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1652795385688-9bafaac3100f?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Students learning together"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340]/30 via-transparent to-transparent" />
            
            {/* Decorative Badge on Image - Hidden on very small screens */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hidden xs:block">
              <span className="text-white text-[10px] sm:text-xs font-semibold tracking-wide">
                Have Questions? 
              </span>
            </div>
          </div>

          {/* RIGHT SIDE - FAQ Accordion */}
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_20px_rgba(11,35,64,0.06)] overflow-hidden transition-all duration-700 ease-out hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-[100px]"
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left cursor-pointer transition-colors hover:bg-[#FAF9F6] active:bg-[#FAF9F6] min-h-[60px] sm:min-h-[72px]"
                >
                  <span className="text-sm sm:text-base font-semibold text-[#0B2340] pr-3 sm:pr-4 leading-snug sm:leading-normal">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 ml-3 sm:ml-4 text-[#E8871E]">
                    {openId === faq.id ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </span>
                </button>

                {/* Answer - Expandable */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openId === faq.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 sm:pt-1 text-[#5B6472] text-xs sm:text-sm leading-relaxed border-t border-[#F2F4F7]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div
          className={`flex justify-center mt-10 sm:mt-12 transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          <div className="h-[2px] w-20 sm:w-32 bg-gradient-to-r from-transparent via-[#E8871E] to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
}