"use client";

/**
 * Navbar.tsx
 * Next.js (App Router) + TypeScript + Tailwind CSS
 */

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

  return (
    <header className="w-full sticky top-0 z-40 bg-[#FFF8F0] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      {/* ============ Main nav row ============ */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-8 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 cursor-pointer">
          <div className="w-[76px] h-[76px] rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200 shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:border-[#E8871E] transition-all duration-300">
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
            <span className="font-['Poppins',_sans-serif] font-bold text-[19px] text-[#0B2340]">
              Greenfield School
            </span>
          </div>
        </Link>

        {/* Desktop nav - No background on container */}
        <div className="hidden lg:flex items-center gap-0">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center px-[14px] py-3 rounded-full font-['Poppins',_sans-serif] text-[14.5px] font-medium transition-all duration-200 whitespace-nowrap text-gray-700 hover:text-[#E8871E] hover:bg-gray-100/70"
            >
              {item.label}
            </Link>
          ))}

          {/* Apply Now button */}
          <Link
            href="/admissions/apply"
            className="flex items-center px-6 py-3 rounded-full font-['Poppins',_sans-serif] font-semibold text-[14px] transition-all duration-300 bg-[#2E9B5C] text-white hover:bg-[#278a51] ml-1"
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
          <span className="relative block w-5 h-0.5 bg-[#0B2340]">
            <span className="absolute left-0 -top-[6px] w-5 h-0.5 bg-[#0B2340]" />
            <span className="absolute left-0 top-[6px] w-5 h-0.5 bg-[#0B2340]" />
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
          <span className="font-['Poppins',_sans-serif] font-bold text-white text-lg">
            Menu
          </span>
          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
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
              onClick={() => setIsMobileOpen(false)}
              className="mt-2 text-center bg-[#2E9B5C] text-white font-['Poppins',_sans-serif] font-semibold text-sm py-3 rounded-full hover:bg-[#278a51] transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}