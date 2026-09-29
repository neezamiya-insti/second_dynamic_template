/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { X } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface Student {
  id: number;
  name: string;
  tag: string;
  quote: string;
  image: string;
  year: string;
  since: string;
  club: string;
}

interface TestimonialsData {
  badgeText: string;
  heading: string;
  description: string;
  hintText: string;
  students: Student[];
}

const DEFAULT_DATA: TestimonialsData = {
  badgeText: "Testimonials",
  heading: "What our students say",
  description: "Tap on any student card to read their full story and feedback.",
  hintText: "Tap on card to read full feedback",
  students: [
    {
      id: 1,
      name: "Maya K.",
      tag: "BSCS · ID 2309",
      image: "/s2.jpg",
      quote: "The library used to be my least favourite place. Now I go there just to think.",
      year: "BSCS",
      since: "Since 2023",
      club: "Library Club",
    },
    {
      id: 2,
      name: "Daniyal O.",
      tag: "BBA · ID 2147",
      image: "/s3.jpg",
      quote: "I joined the business society to network, if I'm honest.",
      year: "BBA",
      since: "Since 2021",
      club: "Business Society",
    },
    {
      id: 3,
      name: "Sana R.",
      tag: "BA · ID 2461",
      image: "/s4.jpg",
      quote: "My professor noticed I'd gone quiet before I did.",
      year: "BA",
      since: "Since 2024",
      club: "Art Studio",
    },
  ],
};

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: TestimonialsData;
  expiresAt: number;
}

const testimonialsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): TestimonialsData | null {
  const entry = testimonialsCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    testimonialsCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: TestimonialsData): void {
  testimonialsCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = testimonialsCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) testimonialsCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Flip icon
// ----------------------------------------------------------------------------
const FLIP_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[15px] w-[15px]">
    <path d="M4 4v6h6M20 20v-6h-6" />
    <path d="M4 10a8 8 0 0114-4.7M20 14a8 8 0 01-14 4.7" />
  </svg>
);

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function TestimonialsSection() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<TestimonialsData>(DEFAULT_DATA);

  // ✅ Hardcoded college ID
  const collegeId = "10";
  const CACHE_KEY = `testimonials_${collegeId}`;

  // UI state
  const [current, setCurrentState] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; sx: number; sy: number } | null>(null);
  const [spot, setSpot] = useState({ mx: 50, my: 10 });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const stackWrapRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, isDown: false, moved: false });

  const students = data.students || [];
  const total = students.length || 1;

  // ✅ Mounted flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch data
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      setData(cached);
      return;
    }

    async function fetchTestimonials() {
      try {
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=Testimonials`
        );
        const result = await res.json();

        let fetched: TestimonialsData = DEFAULT_DATA;

        if (result.success && result.content) {
          const c = result.content;
          fetched = {
            badgeText: c.badgeText || DEFAULT_DATA.badgeText,
            heading: c.heading || DEFAULT_DATA.heading,
            description: c.description || DEFAULT_DATA.description,
            hintText: c.hintText || DEFAULT_DATA.hintText,
            students:
              Array.isArray(c.students) && c.students.length > 0
                ? c.students.map((s: any, idx: number) => ({
                    id: s.id ?? idx + 1,
                    name: s.name || "Student",
                    tag: s.tag || "",
                    quote: s.quote || "",
                    image: s.image || "/s2.jpg",
                    year: s.year || "",
                    since: s.since || "",
                    club: s.club || "",
                  }))
                : DEFAULT_DATA.students,
          };
        }

        cacheSet(CACHE_KEY, fetched);
        setData(fetched);
      } catch (err) {
        console.error("❌ [Testimonials] Error:", err);
        setData(DEFAULT_DATA);
      }
    }

    fetchTestimonials();
  }, [mounted]);

  // Mobile check
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection observer
  useEffect(() => {
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
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setFlipped(false);
      setCurrentState(((index % total) + total) % total);
    },
    [total]
  );

  // Drag handlers
  useEffect(() => {
    const wrap = stackWrapRef.current;
    if (!wrap) return;

    const onPointerDown = (e: PointerEvent) => {
      dragState.current = { startX: e.clientX, isDown: true, moved: false };
      setDragging(true);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragState.current.isDown) return;
      if (Math.abs(e.clientX - dragState.current.startX) > 6) {
        dragState.current.moved = true;
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragState.current.isDown) return;
      dragState.current.isDown = false;
      setDragging(false);
      const dx = e.clientX - dragState.current.startX;
      if (dragState.current.moved && Math.abs(dx) > 50) {
        goTo(current + (dx < 0 ? 1 : -1));
      }
    };

    wrap.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      wrap.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [current, goTo]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section) return;
    const r = section.getBoundingClientRect();
    setSpot({
      mx: ((e.clientX - r.left) / r.width) * 100,
      my: ((e.clientY - r.top) / r.height) * 100,
    });

    const front = frontCardRef.current;
    if (!front || flipped) return;
    const cr = front.getBoundingClientRect();
    const px = (e.clientX - cr.left) / cr.width;
    const py = (e.clientY - cr.top) / cr.height;
    if (px < -0.4 || px > 1.4 || py < -0.4 || py > 1.4) return;
    setTilt({
      rx: (0.5 - py) * 10,
      ry: (px - 0.5) * 10,
      sx: px * 100,
      sy: py * 100,
    });
  };
  const handleMouseLeave = () => setTilt(null);

  const openModal = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    document.body.style.overflow = "auto";
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = (index - current + total) % total;
    if (diff === 0) {
      const t = tilt;
      const transform = t
        ? `translateX(0) translateZ(0) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(1.02)`
        : "translateX(0) translateZ(0) rotateY(0deg) scale(1)";
      return { transform, zIndex: 10, opacity: 1 };
    }
    if (diff === 1) {
      return {
        transform: "translateX(150px) translateZ(-120px) rotateY(-22deg) scale(.86)",
        zIndex: 6,
        opacity: 0.65,
      };
    }
    if (diff === total - 1) {
      return {
        transform: "translateX(-150px) translateZ(-120px) rotateY(22deg) scale(.86)",
        zIndex: 6,
        opacity: 0.65,
      };
    }
    return {
      transform: "translateX(0) translateZ(-260px) scale(.7)",
      zIndex: 1,
      opacity: 0,
    };
  };

  // Guard — kuch data nahi
  if (students.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${poppins.className} relative overflow-hidden bg-[#0B0F19] px-4 sm:px-6 pb-[60px] sm:pb-[90px] pt-[50px] sm:pt-[76px]`}
      style={{ "--mx": `${spot.mx}%`, "--my": `${spot.my}%` } as React.CSSProperties}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-100 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at var(--mx) var(--my), rgba(232,202,94,0.06), transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-[1180px]">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[300px]"
            }`}
          >
            <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E8CA5E] flex items-center gap-2 sm:gap-2.5">
              <span className="block h-px w-[18px] sm:w-[26px] bg-[#E8CA5E]" />
              {data.badgeText}
            </p>
          </div>

          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[400px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              {data.heading}
            </h2>
          </div>

          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[#9CA3AF] mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base">
              {data.description}
            </p>
          </div>
        </div>

        {/* Counter */}
        <div
          className={`flex justify-end pb-1.5 font-mono text-xs sm:text-sm tracking-[0.08em] text-[#9CA3AF] transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <b className="inline-block min-w-[18px] sm:min-w-[22px] font-bold text-[#E8CA5E]">
            {String(current + 1).padStart(2, "0")}
          </b>
          /<span>{String(total).padStart(2, "0")}</span>
        </div>

        {/* Hint */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          <p className="mb-[30px] sm:mb-[46px] flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-wide text-[#9CA3AF] cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[12px] sm:h-[14px] w-[12px] sm:w-[14px]">
              <path d="M9 12h6M12 9v6" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            {data.hintText}
          </p>
        </div>

        {/* Card stack */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[80px]"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div
            ref={stackWrapRef}
            className={`perspective-1400 flex touch-pan-y justify-center py-4 sm:py-5 pb-8 sm:pb-11 ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div className="preserve-3d relative h-[340px] w-[260px] sm:h-[380px] sm:w-[280px] md:h-[400px] md:w-[300px]">
              {students.map((student, i) => {
                const isFront = (i - current + total) % total === 0;
                const cardStyle = getCardStyle(i);
                if (isMobile) {
                  const diff = (i - current + total) % total;
                  if (diff === 1) {
                    cardStyle.transform = "translateX(100px) translateZ(-100px) rotateY(-20deg) scale(.8)";
                  } else if (diff === total - 1) {
                    cardStyle.transform = "translateX(-100px) translateZ(-100px) rotateY(20deg) scale(.8)";
                  } else if (diff !== 0) {
                    cardStyle.transform = "translateX(0) translateZ(-200px) scale(.65)";
                  }
                }
                return (
                  <div
                    key={student.id || student.name}
                    ref={isFront ? frontCardRef : undefined}
                    onClick={() => {
                      if (isFront) {
                        openModal(student);
                      } else {
                        goTo(i);
                      }
                    }}
                    className="preserve-3d absolute left-0 top-0 h-[340px] w-[260px] sm:h-[380px] sm:w-[280px] md:h-[400px] md:w-[300px] transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(.2,.8,.2,1)] cursor-pointer"
                    style={cardStyle}
                  >
                    <div
                      className="preserve-3d relative h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(.3,.9,.2,1)]"
                      style={{ transform: isFront && flipped ? "rotateY(180deg)" : undefined }}
                    >
                      {/* Front face */}
                      <div className="backface-hidden absolute inset-0 flex flex-col overflow-hidden rounded-[16px] sm:rounded-[20px] bg-[#111722] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] border border-white/5">
                        {isFront && (
                          <span
                            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300 hidden md:block"
                            style={{
                              background:
                                "linear-gradient(115deg, transparent 30%, rgba(232,202,94,0.15) 45%, transparent 60%)",
                              backgroundSize: "220% 220%",
                              backgroundPosition: tilt ? `${tilt.sx}% ${tilt.sy}%` : "120% 0%",
                              opacity: tilt ? 1 : 0,
                            }}
                          />
                        )}
                        <span className="absolute right-2.5 sm:right-3.5 top-2.5 sm:top-3.5 z-[2] rounded-full bg-[#E8CA5E] px-1.5 sm:px-2 py-0.5 sm:py-1 font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wide text-[#0B0F19]">
                          Verified
                        </span>
                        <div className="relative flex-1">
                          <Image
                            src={student.image}
                            alt={`Portrait of ${student.name}, ${student.tag}`}
                            fill
                            sizes="(max-width: 640px) 260px, (max-width: 768px) 280px, 300px"
                            className="object-cover"
                            placeholder="empty"
                            priority={i === 0}
                            unoptimized
                          />
                        </div>
                        <button
                          type="button"
                          aria-label="Flip to read quote"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isFront) setFlipped((f) => !f);
                          }}
                          className="absolute bottom-2.5 sm:bottom-3.5 right-2.5 sm:right-3.5 flex h-[30px] sm:h-[34px] w-[30px] sm:w-[34px] items-center justify-center rounded-full bg-[#0B0F19]/85 text-white backdrop-blur-[2px] transition-[background,transform] duration-200 hover:scale-105 hover:bg-[#E8CA5E] hover:text-[#0B0F19]"
                        >
                          {FLIP_ICON}
                        </button>
                        <div className="border-t border-white/5 px-[14px] sm:px-[18px] pb-3 sm:pb-4 pt-2.5 sm:pt-3.5">
                          <div className="mb-0.5 text-[15px] sm:text-[17px] font-bold text-white">
                            {student.name}
                          </div>
                          <div className="font-mono text-[9px] sm:text-[10px] tracking-wide text-[#9CA3AF]">
                            {student.tag}
                          </div>
                        </div>
                      </div>

                      {/* Back face */}
                      <div className="backface-hidden absolute inset-0 flex flex-col justify-center overflow-hidden rounded-[16px] sm:rounded-[20px] bg-[#0B0F19] p-[20px_18px] sm:p-[26px_22px] text-white [transform:rotateY(180deg)] border border-white/5">
                        <button
                          type="button"
                          aria-label="Flip back to photo"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlipped(false);
                          }}
                          className="absolute right-3 sm:right-4 top-3 sm:top-4 flex h-[26px] sm:h-[30px] w-[26px] sm:w-[30px] items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:border-[#E8CA5E] hover:bg-[#E8CA5E] hover:text-[#0B0F19]"
                        >
                          {FLIP_ICON}
                        </button>
                        <p className="mb-1 text-[48px] sm:text-[64px] leading-none text-[#E8CA5E]/70">&rdquo;</p>
                        <p className="mb-[14px] sm:mb-[18px] text-[14px] sm:text-[16.5px] italic leading-[1.4] sm:leading-[1.5] text-[#9CA3AF] line-clamp-[6] sm:line-clamp-none">
                          {student.quote}
                        </p>
                        <div className="text-[9px] sm:text-[10.5px] uppercase tracking-wide text-[#E8CA5E]">
                          — {student.name}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          className={`flex flex-col items-center gap-4 sm:gap-5 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[60px]"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex gap-3 sm:gap-3.5">
            <button
              type="button"
              aria-label="Previous student"
              onClick={() => goTo(current - 1)}
              className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border-[1.5px] border-white/15 bg-[#111722] text-white transition-all hover:-translate-y-0.5 hover:border-[#E8CA5E] hover:bg-[#E8CA5E] hover:text-[#0B0F19] cursor-pointer text-sm sm:text-base"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next student"
              onClick={() => goTo(current + 1)}
              className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border-[1.5px] border-white/15 bg-[#111722] text-white transition-all hover:-translate-y-0.5 hover:border-[#E8CA5E] hover:bg-[#E8CA5E] hover:text-[#0B0F19] cursor-pointer text-sm sm:text-base"
            >
              →
            </button>
          </div>
          <div className="flex gap-2 sm:gap-2.5">
            {students.map((student, i) => (
              <button
                key={student.id || student.name}
                type="button"
                aria-label={`Go to student ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1 rounded-[3px] transition-all duration-200 cursor-pointer ${
                  i === current ? "w-6 sm:w-10 bg-[#E8CA5E]" : "w-[18px] sm:w-[26px] bg-white/10 hover:bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedStudent && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="relative max-w-2xl w-full animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-10 sm:-top-12 right-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:text-[#E8CA5E] transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2} />
            </button>

            <div className="text-center px-2 sm:px-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-4 sm:mb-6 border-2 border-[#E8CA5E]/30">
                <img
                  src={selectedStudent.image}
                  alt={selectedStudent.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedStudent.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#E8CA5E] mb-2 sm:mb-3">
                {selectedStudent.tag}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                {selectedStudent.year && (
                  <span className="text-[10px] sm:text-xs font-medium text-[#E8CA5E] bg-[rgba(232,202,94,0.15)] px-2.5 sm:px-3 py-1 rounded-full">
                    {selectedStudent.year}
                  </span>
                )}
                {selectedStudent.since && (
                  <span className="text-[10px] sm:text-xs font-medium text-white/70 bg-white/10 px-2.5 sm:px-3 py-1 rounded-full">
                    {selectedStudent.since}
                  </span>
                )}
                {selectedStudent.club && (
                  <span className="text-[10px] sm:text-xs font-medium text-[#E8CA5E] bg-[rgba(232,202,94,0.15)] px-2.5 sm:px-3 py-1 rounded-full">
                    {selectedStudent.club}
                  </span>
                )}
              </div>

              <div className="w-10 sm:w-12 h-[2px] bg-[#E8CA5E] mx-auto mb-4 sm:mb-6" />

              <p className="text-white/90 text-base sm:text-lg leading-relaxed px-2 sm:px-0">
                "{selectedStudent.quote}"
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}