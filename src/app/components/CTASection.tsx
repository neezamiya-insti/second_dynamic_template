"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

export default function CTASection() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  return (
    <section className={`
      ${poppins.className} 
      relative w-full py-20 px-0 overflow-hidden 
      ${!isHomepage ? 'rounded-[40px]' : ''}
    `}>
      {/* Background Image - Public folder se */}
      <div className={`absolute inset-0 z-0 ${!isHomepage ? 'rounded-[40px] overflow-hidden' : ''}`}>
        <Image
          src="/contact.jpg"
          alt="School building background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className={`absolute inset-0 bg-[#0B2340]/80 ${!isHomepage ? 'rounded-[40px]' : ''}`} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8871E] mb-4">
            Join Our Community
          </p>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
            Ready to Shape the Future?
          </h2>

          {/* Description */}
          <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Give your child the gift of quality education, character building, 
            and endless opportunities. Join Greenfield School today and be 
            part of a community that nurtures excellence.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 rounded-full bg-[#2E9B5C] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#2E9B5C]/30 transition-all hover:-translate-y-0.5 hover:bg-[#278a51] hover:shadow-xl hover:shadow-[#2E9B5C]/40"
            >
              Apply Now
              <span className="text-lg">→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/50"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Element - Bottom Gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0B2340]/20 to-transparent pointer-events-none ${!isHomepage ? 'rounded-b-[40px]' : ''}`} />
    </section>
  );
}