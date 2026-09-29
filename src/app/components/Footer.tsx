/* eslint-disable react/no-unescaped-entities */
"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface Program {
  name: string;
  link: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  officeHours: string;
}

interface FooterData {
  logo: string;
  collegeName: string;
  tagline: string;
  description: string;
  programs: Program[];
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  accentColor: string;
  darkBgColor: string;
}

const DEFAULT_DATA: FooterData = {
  logo: "",
  collegeName: "Al Noor College",
  tagline: "Empowering Minds. Shaping Futures.",
  description:
    "Al Noor College is committed to academic excellence, innovation, and holistic development. We provide quality education that empowers students to become leaders, critical thinkers, and responsible citizens.",
  programs: [
    { name: "FSc Pre-Medical", link: "/programs/fsc-pre-medical" },
    { name: "FSc Pre-Engineering", link: "/programs/fsc-pre-engineering" },
    { name: "ICS", link: "/programs/ics" },
    { name: "I.Com", link: "/programs/i-com" },
    { name: "DAE", link: "/programs/dae" },
    { name: "DIT", link: "/programs/dit" },
  ],
  contactInfo: {
    address: "123 Education Boulevard, Lahore",
    phone: "+92-42-111-222-333",
    email: "info@alnoorcollege.edu.pk",
    officeHours: "Mon-Fri: 8:00 AM - 6:00 PM",
  },
  socialLinks: [
    { name: "Facebook", url: "https://facebook.com", icon: "facebook" },
    { name: "Twitter", url: "https://twitter.com", icon: "twitter" },
    { name: "Instagram", url: "https://instagram.com", icon: "instagram" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
    { name: "YouTube", url: "https://youtube.com", icon: "youtube" },
  ],
  accentColor: "#E8CA5E",
  darkBgColor: "#080B12",
};

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: FooterData;
  expiresAt: number;
}

const footerCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): FooterData | null {
  const entry = footerCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    footerCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: FooterData): void {
  footerCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = footerCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) footerCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Inline SVG Icons (no external library)
// ----------------------------------------------------------------------------
const IconMapPin = ({ color }: { color: string }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconPhone = ({ color }: { color: string }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
  </svg>
);

const IconMail = ({ color }: { color: string }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const IconClock = ({ color }: { color: string }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const IconFacebook = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8v-6.93H7.9V12H10V9.8c0-2.07 1.23-3.2 3.12-3.2.9 0 1.84.16 1.84.16v2.02h-1.04c-1.02 0-1.34.63-1.34 1.28V12h2.28l-.36 2.87h-1.92v6.93c4.56-.93 8-4.96 8-9.8z" />
  </svg>
);

const IconTwitter = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.9 2H22l-7.2 8.3L23.3 22h-6.6l-5.2-6.8L5.5 22H2.4l7.7-8.8L1 2h6.8l4.7 6.2L18.9 2zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20z" />
  </svg>
);

const IconInstagram = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const IconLinkedin = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
  </svg>
);

const IconYoutube = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.3 5.2 12 5.2 12 5.2s-7.3 0-8.9.4a2.5 2.5 0 0 0-1.7 1.7C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.6.4 8.9.4 8.9.4s7.3 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7C23 15.2 23 12 23 12zM9.8 15.2V8.8l6 3.2-6 3.2z" />
  </svg>
);

function SocialIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "facebook":  return <IconFacebook />;
    case "twitter":   return <IconTwitter />;
    case "instagram": return <IconInstagram />;
    case "linkedin":  return <IconLinkedin />;
    case "youtube":   return <IconYoutube />;
    default:          return <IconFacebook />;
  }
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<FooterData>(DEFAULT_DATA);

  const collegeId = "10";
  const CACHE_KEY = `footer_data_${collegeId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      setData(cached);
      return;
    }

    async function fetchFooter() {
      try {
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=Footer`
        );
        const result = await res.json();

        let fetched: FooterData = DEFAULT_DATA;

        if (result.success && result.content) {
          const c = result.content;
          fetched = {
            logo: c.logo || "",
            collegeName: c.collegeName || DEFAULT_DATA.collegeName,
            tagline: c.tagline || DEFAULT_DATA.tagline,
            description: c.description || DEFAULT_DATA.description,
            programs: Array.isArray(c.programs) && c.programs.length > 0
              ? c.programs : DEFAULT_DATA.programs,
            contactInfo: {
              address: c.contactInfo?.address || DEFAULT_DATA.contactInfo.address,
              phone: c.contactInfo?.phone || DEFAULT_DATA.contactInfo.phone,
              email: c.contactInfo?.email || DEFAULT_DATA.contactInfo.email,
              officeHours: c.contactInfo?.officeHours || DEFAULT_DATA.contactInfo.officeHours,
            },
            socialLinks: Array.isArray(c.socialLinks) && c.socialLinks.length > 0
              ? c.socialLinks : DEFAULT_DATA.socialLinks,
            accentColor: c.accentColor || DEFAULT_DATA.accentColor,
            darkBgColor: c.darkBgColor || DEFAULT_DATA.darkBgColor,
          };
        }

        cacheSet(CACHE_KEY, fetched);
        setData(fetched);
      } catch (err) {
        console.error("❌ [Footer] Error:", err);
        setData(DEFAULT_DATA);
      }
    }

    fetchFooter();
  }, [mounted]);

  const currentYear = mounted ? new Date().getFullYear() : 2026;

  return (
    <footer
      className={`${poppins.className} w-full text-white`}
      style={{ backgroundColor: data.darkBgColor }}
    >
      {/* Sirf padding kam ki: py-8 sm:py-12 → py-4 sm:py-6 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:px-10">
        {/* Sirf gap kam kiya: gap-8 sm:gap-10 → gap-4 sm:gap-6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Column 1 — Logo + Name + Tagline + Description */}
          <div className="lg:col-span-1">
            {/* Sirf margin kam kiya: mb-4 → mb-2 */}
            <div className="mb-2">
              {/* Logo size same rakha: 80/100 */}
              <div
                className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden flex-shrink-0 border-2 mx-auto sm:mx-0"
                style={{ borderColor: `${data.accentColor}4D` }}
              >
                <Image
                  src={data.logo || "/school.jpg"}
                  alt={`${data.collegeName} Logo`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                  priority
                  unoptimized
                />
              </div>
            </div>

            <div className="text-center sm:text-left">
              {/* Font sizes same */}
              <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: data.accentColor }}>
                {data.collegeName}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm font-medium mb-2">
                {data.tagline}
              </p>
              {/* Sirf leading thodi tight ki: leading-relaxed → leading-snug */}
              <p className="text-white/60 text-xs sm:text-sm italic leading-snug">
                {data.description}
              </p>
            </div>
          </div>

          {/* Column 2 — Programs */}
          <div>
            {/* Font size same, sirf margin kam: mb-4 → mb-2 */}
            <h4 className="text-base sm:text-lg font-semibold mb-2 text-center sm:text-left text-white">
              Programs
            </h4>
            {/* Sirf spacing kam: space-y-2.5 sm:space-y-3 → space-y-1.5 */}
            <ul className="space-y-1.5">
              {data.programs.map((p, i) => (
                <li key={i}>
                  <a
                    href={p.link}
                    className="text-white/60 hover:text-white transition-colors text-xs sm:text-sm flex items-center gap-2 justify-center sm:justify-start"
                  >
                    <span
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                      style={{ backgroundColor: data.accentColor }}
                    ></span>
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 text-center sm:text-left text-white">
              Contact Info
            </h4>
            <ul className="space-y-1.5 text-white/60 text-xs sm:text-sm text-center sm:text-left">
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <span className="mt-0.5 flex-shrink-0"><IconMapPin color={data.accentColor} /></span>
                <span>{data.contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="flex-shrink-0"><IconPhone color={data.accentColor} /></span>
                <a href={`tel:${data.contactInfo.phone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">
                  {data.contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="flex-shrink-0"><IconMail color={data.accentColor} /></span>
                <a href={`mailto:${data.contactInfo.email}`} className="hover:text-white transition-colors break-all">
                  {data.contactInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="flex-shrink-0"><IconClock color={data.accentColor} /></span>
                <span>{data.contactInfo.officeHours}</span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Social Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-2 text-center sm:text-left text-white">
              Connect With Us
            </h4>
            {/* Sirf gap kam: gap-3 → gap-2 */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {data.socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  /* Icon button size same: w-9 h-9 */
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-white/15 text-white/70 transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = data.accentColor;
                    e.currentTarget.style.color = data.darkBgColor;
                    e.currentTarget.style.borderColor = data.accentColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar — sirf padding kam: py-4 → py-2.5 */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 lg:px-10 text-center">
          <p className="text-white/40 text-xs sm:text-sm">
            © {currentYear} {data.collegeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}