/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

export default function PrincipalMessageSection() {
  return (
    <div className={`${poppins.className} bg-[#FFFFFF] shadow-xl overflow-hidden`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 py-12">
        {/* Left Side - Image with hover effects */}
        <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden cursor-pointer group">
          <Image
            src="/faculty/principal.png"
            alt="Principal Dr. Fatima Al Noor"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/40 via-transparent to-transparent lg:hidden" />
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-2">
            Principal's Message
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#0B0F19] mb-4">
            Dr. Fatima Al Noor
          </h3>
          <div className="w-12 h-1 bg-[#E8CA5E] mb-6" />
          <p className="text-[#5B6472] text-base leading-relaxed mb-4">
            "Education is the foundation upon which we build our future. At Al Noor College, 
            we believe that true learning goes beyond textbooks — it shapes character, 
            builds resilience, and ignites the passion for lifelong discovery.
          </p>
          <p className="text-[#5B6472] text-base leading-relaxed mb-4">
            Our distinguished faculty and dedicated staff are committed to providing 
            an environment where every student can thrive academically, socially, 
            and ethically. We strive to nurture leaders who will make meaningful 
            contributions to their communities and the world at large.
          </p>
          <p className="text-[#5B6472] text-base leading-relaxed">
            I warmly invite you to join the Al Noor College family — where excellence 
            is a tradition, and every student's potential is our priority."
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-12 h-[2px] bg-[#E8CA5E]" />
            <span className="text-[#E8CA5E] font-semibold text-sm">— Dr. Fatima Al Noor, Principal</span>
          </div>
        </div>
      </div>
    </div>
  );
}