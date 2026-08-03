/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

export default function Footer() {
  return (
    <>
      <div className="w-full h-16 bg-[#FAF9F6]" />
      <footer className={`${poppins.className} w-full bg-[#0B2340] text-white`}>
        {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Column 1 - Logo and Principal's Message */}
          <div className="lg:col-span-1">
            {/* Logo - Responsive Size */}
            <div className="mb-4">
              <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20 shadow-[0_4px_14px_rgba(232,135,30,0.3)] mx-auto sm:mx-0">
                <Image
                  src="/school.jpg"
                  alt="Greenfield School Logo"
                  width={100}
                  height={100}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Principal's Message - Centered on mobile */}
            <div className="text-center sm:text-left">
              <p className="text-white/80 text-xs sm:text-sm italic leading-relaxed">
                "Education is the most powerful weapon which you can use to change the world."
              </p>
              <p className="text-[#E8871E] text-xs sm:text-sm font-semibold mt-2">
                — Mrs. Ayesha Khan, Principal
              </p>
            </div>
          </div>

          {/* Column 2 - Social Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-center sm:text-left">Connect With Us</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-[#E8871E] transition-colors text-xs sm:text-sm flex items-center gap-2 justify-center sm:justify-start">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E8871E]"></span>
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#E8871E] transition-colors text-xs sm:text-sm flex items-center gap-2 justify-center sm:justify-start">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E8871E]"></span>
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#E8871E] transition-colors text-xs sm:text-sm flex items-center gap-2 justify-center sm:justify-start">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E8871E]"></span>
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#E8871E] transition-colors text-xs sm:text-sm flex items-center gap-2 justify-center sm:justify-start">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E8871E]"></span>
                  YouTube
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#E8871E] transition-colors text-xs sm:text-sm flex items-center gap-2 justify-center sm:justify-start">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E8871E]"></span>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-center sm:text-left">Contact Info</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-white/70 text-xs sm:text-sm text-center sm:text-left">
              <li>
                <span className="block">123 Education Street,</span>
                <span className="block">Lahore, Pakistan</span>
              </li>
              <li>
                <a href="tel:+923001234567" className="hover:text-white transition-colors block">
                  +92 300 1234567
                </a>
              </li>
              <li>
                <a href="mailto:admissions@greenfieldschool.edu.pk" className="hover:text-white transition-colors block">
                  admissions@greenfieldschool.edu.pk
                </a>
              </li>
              <li>
                <span className="block">Mon - Fri: 8:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-center sm:text-left">Stay Updated</h4>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4 text-center sm:text-left">
              Subscribe to our newsletter for the latest updates, events, and 
              important announcements.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2.5 sm:py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[#E8871E] transition-colors text-xs sm:text-sm"
              />
              <button
                type="submit"
                className="w-full px-6 py-2.5 sm:py-3 rounded-full bg-[#E8871E] text-white font-semibold text-xs sm:text-sm hover:bg-[#d1780f] transition-colors hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Simplified */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 lg:px-10 text-center">
          <p className="text-white/60 text-xs sm:text-sm">
            © {new Date().getFullYear()} Greenfield School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}