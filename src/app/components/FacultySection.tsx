/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";
/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Inline SVG Icons — no external library
// ----------------------------------------------------------------------------
const IconMail = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const IconLinkedin = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
  </svg>
);

const IconX = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconBriefcase = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconAward = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const IconUser = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconInfo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface FacultyMember {
  id: number;
  name: string;
  position: string;
  designation: string;
  linkedin?: string;
  email?: string;
  quote: string;
  expertise: string[];
  experience: string;
  description: string;
  image: string;
  order: number;
}

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: FacultyMember[];
  expiresAt: number;
}

const facultyCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): FacultyMember[] | null {
  const entry = facultyCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    facultyCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: FacultyMember[]): void {
  facultyCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = facultyCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) facultyCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------------------
function FacultySkeleton() {
  return (
    <section className={`${poppins.className} w-full bg-[#0B0F19] py-20 px-6`}>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="shimmer h-4 w-32 rounded mx-auto mb-3" />
          <div className="shimmer h-10 w-72 max-w-full rounded-lg mx-auto mb-3" />
          <div className="shimmer h-4 w-96 max-w-full rounded mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="shimmer w-32 h-32 rounded-full mb-[-40px] z-10" />
              <div className="bg-[#111722] rounded-[40px] w-full min-h-[340px] pt-16 pb-8 px-6 border border-white/5">
                <div className="shimmer h-6 w-32 rounded mx-auto mb-3" />
                <div className="shimmer h-4 w-24 rounded mx-auto mb-4" />
                <div className="shimmer h-3 w-full rounded mb-2" />
                <div className="shimmer h-3 w-5/6 rounded mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function FacultySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [faculty, setFaculty] = useState<FacultyMember[] | null>(null);
  const [selectedMember, setSelectedMember] = useState<FacultyMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const collegeId = "10";
  const CACHE_KEY = `faculty_${collegeId}`;

  // ✅ Modal handlers
  const openModal = (member: FacultyMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  // Mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached && cached.length > 0) {
      console.log("📦 [Faculty] Loading from memory cache");
      setFaculty(cached);
      return;
    }

    async function fetchData() {
      try {
        console.log("🔄 [Faculty] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=Faculty`
        );
        const result = await res.json();
        console.log("📦 [Faculty] API Response:", result);

        if (
          result.success &&
          result.content &&
          Array.isArray(result.content.faculty) &&
          result.content.faculty.length > 0
        ) {
          const sorted = [...result.content.faculty].sort(
            (a: any, b: any) => (a.order || 0) - (b.order || 0)
          );
          cacheSet(CACHE_KEY, sorted);
          setFaculty(sorted);
        } else {
          console.log("⚠️ [Faculty] No data from API");
          setFaculty(null);
        }
      } catch (err) {
        console.error("❌ [Faculty] Error:", err);
        setFaculty(null);
      }
    }

    fetchData();
  }, [mounted]);

  // Intersection observer
  useEffect(() => {
    if (!faculty) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [faculty]);

  // ESC to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isModalOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Loading
  if (!mounted || !faculty) {
    return <FacultySkeleton />;
  }

  if (faculty.length === 0) return null;

  return (
    <>
      <section
        ref={sectionRef}
        className={`${poppins.className} w-full bg-[#0B0F19] py-20 px-6 overflow-hidden`}
      >
        {/* ✅ max-w-5xl + mx-auto = screen ke center me */}
        <div className="max-w-5xl mx-auto overflow-hidden">
          {/* Header */}
          <div className="text-center mb-14">
            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[300px]"
              }`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-2">
                Our Team
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[100px]"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Meet Our Faculty
              </h2>
            </div>

            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[80px]"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <p className="text-[#9CA3AF] mt-3 max-w-xl mx-auto text-base">
                Dedicated educators committed to shaping bright futures with care,
                knowledge, and inspiration.
              </p>
            </div>
          </div>

          {/* ✅ Faculty Grid — 3 per row, centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 justify-items-center">
            {faculty.map((member, index) => (
              <div
                key={member.id || index}
                onClick={() => openModal(member)}
                className={`w-full max-w-[300px] flex flex-col items-center text-center group cursor-pointer transition-all duration-700 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[120px]"
                }`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                {/* Image Frame */}
                <div
                  className={`
                    rounded-[50%_50%_50%_50%/42%_42%_58%_58%]
                    bg-[#111722] p-3 shadow-xl transition-all duration-300 hover:scale-105 z-10 -mb-10 w-32 h-32 border border-white/10
                  `}
                >
                  <div
                    className={`
                      relative w-full h-full overflow-hidden
                      rounded-[50%_50%_50%_50%/42%_42%_58%_58%]
                    `}
                  >
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0B0F19] flex items-center justify-center text-[#E8CA5E]/30">
                        <IconUser className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="bg-[#111722] rounded-[40px] w-full min-h-[340px] pt-16 pb-8 px-6 flex flex-col items-center shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-white/5">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <span className="text-sm font-semibold text-[#E8CA5E] mt-1 mb-4">
                    {member.designation || member.position}
                  </span>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed line-clamp-5">
                    {member.description || member.quote}
                  </p>
                  <span className="text-[11px] text-[#E8CA5E]/70 mt-4 group-hover:text-[#E8CA5E] transition-colors">
                    Click for more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MODAL ============ */}
      {isModalOpen && selectedMember && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#111722] rounded-[32px] border border-white/10 shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-[#E8CA5E] transition-all flex items-center justify-center cursor-pointer border border-white/20 hover:border-[#E8CA5E] group text-white hover:text-[#0B0F19]"
              aria-label="Close"
            >
              <IconX className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div className="relative w-full h-[240px] sm:h-[280px] bg-gradient-to-br from-[#0B0F19] to-[#111722] rounded-t-[32px] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[180px] h-[180px] rounded-[50%_50%_50%_50%/42%_42%_58%_58%] overflow-hidden border-4 border-[#E8CA5E]/30 shadow-2xl">
                  {selectedMember.image ? (
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0B0F19] flex items-center justify-center text-[#E8CA5E]/30">
                      <IconUser className="w-16 h-16" />
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111722] to-transparent" />
            </div>

            {/* Content */}
            <div className="px-6 sm:px-10 pb-10 pt-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-2">
                {selectedMember.name}
              </h2>

              {(selectedMember.designation || selectedMember.position) && (
                <p className="text-[#E8CA5E] font-semibold text-center text-sm sm:text-base mb-1">
                  {selectedMember.designation}
                </p>
              )}
              {selectedMember.position &&
                selectedMember.position !== selectedMember.designation && (
                  <p className="text-white/60 text-center text-xs sm:text-sm">
                    {selectedMember.position}
                  </p>
                )}

              <div className="flex items-center justify-center gap-2 my-5">
                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#E8CA5E]" />
                <div className="w-2 h-2 bg-[#E8CA5E] rotate-45" />
                <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#E8CA5E]" />
              </div>

              {selectedMember.experience && (
                <div className="flex items-center justify-center gap-2 mb-5 text-[#E8CA5E]">
                  <IconBriefcase className="w-4 h-4" />
                  <span className="font-semibold text-sm">
                    {selectedMember.experience} Experience
                  </span>
                </div>
              )}

              {selectedMember.quote && (
                <div className="bg-[#0B0F19] rounded-2xl p-5 mb-5 border border-[#E8CA5E]/20">
                  <p className="text-[#9CA3AF] text-sm sm:text-base italic text-center leading-relaxed">
                    &ldquo;{selectedMember.quote}&rdquo;
                  </p>
                </div>
              )}

              {selectedMember.description && (
                <div className="mb-6">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <IconInfo className="w-4 h-4 text-[#E8CA5E]" />
                    About
                  </h3>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed">
                    {selectedMember.description}
                  </p>
                </div>
              )}

              {Array.isArray(selectedMember.expertise) &&
                selectedMember.expertise.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <IconAward className="w-4 h-4 text-[#E8CA5E]" />
                      Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedMember.expertise
                        .filter((e) => e && e.trim())
                        .map((exp, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-[#E8CA5E]/10 text-[#E8CA5E] text-xs font-semibold rounded-full border border-[#E8CA5E]/30"
                          >
                            {exp}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

              {(selectedMember.email || selectedMember.linkedin) && (
                <div className="border-t border-white/10 pt-6 mt-6">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 text-center">
                    Get in Touch
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                    {selectedMember.email && (
                      <a
                        href={`mailto:${selectedMember.email}`}
                        className="w-12 h-12 rounded-full bg-[#E8CA5E]/10 border border-[#E8CA5E]/30 flex items-center justify-center text-[#E8CA5E] hover:bg-[#E8CA5E] hover:text-[#0B0F19] transition-all duration-300 hover:scale-110 cursor-pointer"
                        aria-label="Email"
                      >
                        <IconMail className="w-5 h-5" />
                      </a>
                    )}
                    {selectedMember.linkedin && (
                      <a
                        href={selectedMember.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-[#E8CA5E]/10 border border-[#E8CA5E]/30 flex items-center justify-center text-[#E8CA5E] hover:bg-[#E8CA5E] hover:text-[#0B0F19] transition-all duration-300 hover:scale-110 cursor-pointer"
                        aria-label="LinkedIn"
                      >
                        <IconLinkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}