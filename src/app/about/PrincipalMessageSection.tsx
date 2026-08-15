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
    <div className={`${poppins.className} bg-white  shadow-xl overflow-hidden `}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative h-[400px] lg:h-auto">
          <Image
            src="/faculty/principal.png"
            alt="Principal Mrs. Ayesha Khan"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340]/60 via-transparent to-transparent lg:hidden" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8871E] mb-2">
            Principal's Message
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#0B2340] mb-4">
            Mrs. Ayesha Khan
          </h3>
          <div className="w-12 h-1 bg-[#E8871E] mb-6" />
          <p className="text-[#5B6472] text-base leading-relaxed mb-4">
            "Education is not just about academic achievement; it is about nurturing 
            the whole child — mind, heart, and spirit. At Greenfield School, we believe 
            that every child is unique and possesses immense potential waiting to be unlocked.
          </p>
          <p className="text-[#5B6472] text-base leading-relaxed mb-4">
            Our dedicated team of educators works tirelessly to create an environment 
            where students feel safe, valued, and inspired to explore their passions. 
            We are committed to developing not just scholars, but responsible citizens 
            who will contribute positively to society.
          </p>
          <p className="text-[#5B6472] text-base leading-relaxed">
            I invite you to join our community and experience the Greenfield difference — 
            where every child matters, and every dream is nurtured."
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-12 h-[2px] bg-[#E8871E]" />
            <span className="text-[#E8871E] font-semibold text-sm">— Mrs. Ayesha Khan, Principal</span>
          </div>
        </div>
      </div>
    </div>
  );
}