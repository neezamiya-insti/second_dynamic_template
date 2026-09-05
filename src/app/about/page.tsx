"use client";

import React from "react";
import { Poppins } from "next/font/google";
import AboutHeroSection from "./AboutHeroSection";
import AboutStorySection from "./AboutStorySection";
import MissionVisionSection from "./MissionVisionSection";
import CoreValues from "./CoreValues";
import PrincipalMessageSection from "./PrincipalMessageSection";
import FacultySection from "../components/FacultySection";
import CTASection from "../components/CTASection";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

export default function AboutPage() {
  return (
    <section className={`${poppins.className} w-full bg-[#FAF9F6]`}>
      {/* 1. HERO SECTION */}
      <AboutHeroSection />

      <div className="py-20">
        {/* 2. SCHOOL INTRODUCTION - Our Story */}
        <AboutStorySection />

        {/* 3. MISSION & VISION */}
        <MissionVisionSection />

        {/* 4. CORE VALUES */}
        <CoreValues />

        {/* 5. PRINCIPAL'S MESSAGE */}
        <PrincipalMessageSection />

        {/* 6. FACULTY SECTION */}
      
        <FacultySection />

    
      </div>
    </section>
  );
}