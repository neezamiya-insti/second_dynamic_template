"use client";

/**
 * Navbar.tsx
 * Next.js (App Router) + TypeScript + Tailwind CSS
 */

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/programs" },
  { label: "Admissions", href: "/admissions" },
  { label: "Student Life", href: "/student-life" },
  { label: "Achievements", href: "/achievements" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event - FIXED: Check if window is defined
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`w-full sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]" 
          : "bg-[radial-gradient(1200px_300px_at_15%_0%,rgba(20,45,80,0.55),transparent_60%),linear-gradient(120deg,#060E1C_0%,#0B2340_60%,#0d2c50_100%)] shadow-[0_6px_24px_rgba(6,14,28,0.25)]"
      }`}
    >
      {/* ============ Main nav row ============ */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-8 py-3 flex items-center justify-between gap-6">
        {/* Logo - FULL ROUNDED (circle) */}
        <Link href="/" className="flex items-center gap-3 shrink-0 cursor-pointer">
          <div className={`w-[76px] h-[76px] rounded-full overflow-hidden flex-shrink-0 border-2 transition-all duration-300 cursor-pointer ${
            isScrolled 
              ? "border-gray-200 shadow-[0_4px_14px_rgba(0,0,0,0.1)]" 
              : "border-white/20 shadow-[0_4px_14px_rgba(232,135,30,0.3)] hover:border-[#E8871E]"
          }`}>
            <Image
              src="/school.jpg"
              alt="Greenfield School Logo"
              width={100}
              height={100}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-[1.05]">
            <span className={`font-['Poppins',_sans-serif] font-bold text-[19px] transition-colors duration-300 cursor-pointer ${
              isScrolled ? "text-[#0B2340]" : "text-white"
            }`}>
              Greenfield School
            </span>
          </div>
        </Link>

        {/* Desktop nav - FULL ROUNDED CARD with increased height */}
        <div className={`hidden lg:flex items-center gap-0 rounded-full transition-all duration-300 ${
          isScrolled 
            ? "bg-gray-100/80 backdrop-blur-sm" 
            : "bg-white/10 backdrop-blur-sm border border-white/15"
        }`}>
          {/* Nav links */}
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-[14px] py-3.5 rounded-full font-['Poppins',_sans-serif] text-[14.5px] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isScrolled 
                  ? "text-gray-700 hover:text-[#E8871E] hover:bg-gray-200/70" 
                  : "text-white hover:text-[#E8871E] hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Apply Now - Inside card, properly contained */}
          <Link
            href="/admissions/apply"
            className={`flex items-center px-6 py-3.5 rounded-full font-['Poppins',_sans-serif] font-semibold text-[14px] transition-all duration-300 cursor-pointer ${
              isScrolled 
                ? "bg-[#2E9B5C] text-white hover:bg-[#278a51]" 
                : "bg-[#2E9B5C] text-white hover:bg-[#278a51]"
            }`}
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className={`relative block w-5 h-0.5 ${
            isScrolled ? "bg-[#0B2340]" : "bg-white"
          }`}>
            <span className={`absolute left-0 -top-[6px] w-5 h-0.5 ${
              isScrolled ? "bg-[#0B2340]" : "bg-white"
            }`} />
            <span className={`absolute left-0 top-[6px] w-5 h-0.5 ${
              isScrolled ? "bg-[#0B2340]" : "bg-white"
            }`} />
          </span>
        </button>
      </div>

      {/* ============ Mobile menu ============ */}
      <div
        className={`fixed inset-0 z-[60] bg-[#0B2340] transition-transform duration-300 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <span className="font-['Poppins',_sans-serif] font-bold text-white text-lg">Menu</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-4 overflow-y-auto h-[calc(100%-72px)]">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="block px-3 py-4 border-b border-white/5 font-['Poppins',_sans-serif] text-white font-medium text-[15px] hover:text-[#E8871E] transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-6 flex flex-col gap-3 px-3">
            <Link
              href="/admissions/apply"
              className="mt-2 text-center bg-[#2E9B5C] text-white font-['Poppins',_sans-serif] font-semibold text-sm py-3 rounded-full cursor-pointer hover:bg-[#278a51] transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}