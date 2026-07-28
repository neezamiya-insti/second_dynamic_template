/* eslint-disable react-hooks/immutability */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { X } from "lucide-react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

interface Student {
  name: string;
  tag: string;
  quote: string;
  image: string;
  year: string;
  since: string;
  club: string;
}

const students: Student[] = [
  {
    name: "Maya K.",
    tag: "YEAR 9 · ID 2309",
    image: "/s2.jpg",
    quote: "The library used to be my least favourite place. Now I go there just to think — no one's ever told me I was reading the wrong kind of book.",
    year: "Year 9",
    since: "Since 2023",
    club: "Library Club",
  },
  {
    name: "Daniyal O.",
    tag: "YEAR 11 · ID 2147",
    image: "/s3.jpg",
    quote: "I joined robotics to skip PE, if I'm honest. Stayed three years — it's the first thing I've built that actually worked on the first try. Once.",
    year: "Year 11",
    since: "Since 2021",
    club: "Robotics Lead",
  },
  {
    name: "Sana R.",
    tag: "YEAR 8 · ID 2461",
    image: "/s4.jpg",
    quote: "My teacher noticed I'd gone quiet before I did. She didn't make a thing of it — just left space for me to talk when I was ready.",
    year: "Year 8",
    since: "Since 2024",
    club: "Art Studio",
  },
  {
    name: "Hamza F.",
    tag: "YEAR 10 · ID 2065",
    image: "/s5.jpg",
    quote: "I arrived speaking almost no English. Two years later I was co-writing the school play. Every teacher here corrects your grammar like they believe you'll use it.",
    year: "Year 10",
    since: "Since 2022",
    club: "Drama Club",
  },
  {
    name: "Aleena T.",
    tag: "YEAR 7 · ID 2588",
    image: "/s6.jpg",
    quote: "I was the new kid in the middle of the term, which is the worst time to be new. Three people asked me to sit with them on day one. I still sit with two of them.",
    year: "Year 7",
    since: "Since 2024",
    club: "Art Studio",
  },
  {
    name: "Zain A.",
    tag: "YEAR 12 · ID 1994",
    image: "/s7.jpg",
    quote: "University applications terrified me. My form tutor read four drafts of my personal statement and never once made me feel like a burden for asking.",
    year: "Year 12",
    since: "Since 2022",
    club: "Robotics Lead",
  },
];

const FLIP_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[15px] w-[15px]">
    <path d="M4 4v6h6M20 20v-6h-6" />
    <path d="M4 10a8 8 0 0114-4.7M20 14a8 8 0 01-14 4.7" />
  </svg>
);

export default function TestimonialsSection() {
  const total = students.length;
  const [current, setCurrentState] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; sx: number; sy: number } | null>(null);
  const [spot, setSpot] = useState({ mx: 50, my: 10 });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // NEW: State for mobile detection

  const sectionRef = useRef<HTMLElement>(null);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const stackWrapRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, isDown: false, moved: false });

  // ---- Detect mobile screen size ----
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ---- Intersection Observer for scroll animations ----
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setFlipped(false);
      setCurrentState(((index % total) + total) % total);
    },
    [total]
  );

  // ---- pointer drag / swipe navigation ----
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

  // ---- cursor tilt + spotlight ----
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

  // ---- open modal with student details ----
  const openModal = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    document.body.style.overflow = 'auto';
  };

  // ---- per-card 3D transform ----
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

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${poppins.className} relative overflow-hidden bg-[#FAF9F6] px-4 sm:px-6 pb-[60px] sm:pb-[90px] pt-[50px] sm:pt-[76px]`}
      style={{ "--mx": `${spot.mx}%`, "--my": `${spot.my}%` } as React.CSSProperties}
    >
      {/* Spotlight Effect - Hidden on mobile for performance */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-100 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at var(--mx) var(--my), rgba(232,135,30,0.08), transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-[1180px]">
        {/* Header - Left Aligned */}
        <div className="mb-3 sm:mb-4">
          {/* Badge */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[300px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E8871E] flex items-center gap-2 sm:gap-2.5">
              <span className="block h-px w-[18px] sm:w-[26px] bg-[#E8871E]" />
              Testimonials
            </p>
          </div>

          {/* Heading */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[400px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B2340]">
              What our students say
            </h2>
          </div>

          {/* Description */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[350px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[#5B6472] mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base">
              Tap on any student card to read their full story and feedback.
            </p>
          </div>
        </div>

        {/* Counter */}
        <div
          className={`flex justify-end pb-1.5 font-mono text-xs sm:text-sm tracking-[0.08em] text-[#5B6472] transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[30px]"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <b className="inline-block min-w-[18px] sm:min-w-[22px] font-bold text-[#E8871E]">
            {String(current + 1).padStart(2, "0")}
          </b>
          /<span>{String(total).padStart(2, "0")}</span>
        </div>

        {/* Hint Text */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[30px]"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          <p className="mb-[30px] sm:mb-[46px] flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-wide text-[#5B6472] cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[12px] sm:h-[14px] w-[12px] sm:w-[14px]">
              <path d="M9 12h6M12 9v6" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Tap on card to read full feedback
          </p>
        </div>

        {/* Card Stack */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[80px]"
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
                // Responsive card transforms
                const cardStyle = getCardStyle(i);
                // FIXED: Use isMobile state instead of directly accessing window
                if (isMobile) {
                  const diff = (i - current + total) % total;
                  if (diff === 0) {
                    // Keep front card same
                  } else if (diff === 1) {
                    cardStyle.transform = "translateX(100px) translateZ(-100px) rotateY(-20deg) scale(.8)";
                  } else if (diff === total - 1) {
                    cardStyle.transform = "translateX(-100px) translateZ(-100px) rotateY(20deg) scale(.8)";
                  } else {
                    cardStyle.transform = "translateX(0) translateZ(-200px) scale(.65)";
                  }
                }
                return (
                  <div
                    key={student.name}
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
                      {/* front face — photo */}
                      <div className="backface-hidden absolute inset-0 flex flex-col overflow-hidden rounded-[16px] sm:rounded-[20px] bg-white shadow-[0_30px_60px_-24px_rgba(8,26,48,0.35)]">
                        {isFront && (
                          <span
                            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300 hidden md:block"
                            style={{
                              background:
                                "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.55) 45%, transparent 60%)",
                              backgroundSize: "220% 220%",
                              backgroundPosition: tilt ? `${tilt.sx}% ${tilt.sy}%` : "120% 0%",
                              opacity: tilt ? 1 : 0,
                            }}
                          />
                        )}
                        <span className="absolute right-2.5 sm:right-3.5 top-2.5 sm:top-3.5 z-[2] rounded-full bg-[#2E9B5C] px-1.5 sm:px-2 py-0.5 sm:py-1 font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wide text-white">
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
                          className="absolute bottom-2.5 sm:bottom-3.5 right-2.5 sm:right-3.5 flex h-[30px] sm:h-[34px] w-[30px] sm:w-[34px] items-center justify-center rounded-full bg-[#0B2340]/85 text-white backdrop-blur-[2px] transition-[background,transform] duration-200 hover:scale-105 hover:bg-[#E8871E]"
                        >
                          {FLIP_ICON}
                        </button>
                        <div className="border-t border-[#F2F4F7] px-[14px] sm:px-[18px] pb-3 sm:pb-4 pt-2.5 sm:pt-3.5">
                          <div className="mb-0.5 text-[15px] sm:text-[17px] font-bold text-[#0B2340]">
                            {student.name}
                          </div>
                          <div className="font-mono text-[9px] sm:text-[10px] tracking-wide text-[#5B6472]">
                            {student.tag}
                          </div>
                        </div>
                      </div>

                      {/* back face — quote */}
                      <div className="backface-hidden absolute inset-0 flex flex-col justify-center overflow-hidden rounded-[16px] sm:rounded-[20px] bg-[#0B2340] p-[20px_18px] sm:p-[26px_22px] text-[#FAF9F6] [transform:rotateY(180deg)]">
                        <button
                          type="button"
                          aria-label="Flip back to photo"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlipped(false);
                          }}
                          className="absolute right-3 sm:right-4 top-3 sm:top-4 flex h-[26px] sm:h-[30px] w-[26px] sm:w-[30px] items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#FAF9F6] hover:border-[#E8871E] hover:bg-[#E8871E] hover:text-[#0B2340]"
                        >
                          {FLIP_ICON}
                        </button>
                        <p className="mb-1 text-[48px] sm:text-[64px] leading-none text-[#E8871E]/70">&rdquo;</p>
                        <p className="mb-[14px] sm:mb-[18px] text-[14px] sm:text-[16.5px] italic leading-[1.4] sm:leading-[1.5] text-[#FAF9F6] line-clamp-[6] sm:line-clamp-none">
                          {student.quote}
                        </p>
                        <div className="text-[9px] sm:text-[10.5px] uppercase tracking-wide text-[#E8871E]">
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
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[60px]"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex gap-3 sm:gap-3.5">
            <button
              type="button"
              aria-label="Previous student"
              onClick={() => goTo(current - 1)}
              className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border-[1.5px] border-[#0B2340]/15 bg-white text-[#0B2340] transition-all hover:-translate-y-0.5 hover:border-[#E8871E] hover:bg-[#E8871E] hover:text-white cursor-pointer text-sm sm:text-base"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next student"
              onClick={() => goTo(current + 1)}
              className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border-[1.5px] border-[#0B2340]/15 bg-white text-[#0B2340] transition-all hover:-translate-y-0.5 hover:border-[#E8871E] hover:bg-[#E8871E] hover:text-white cursor-pointer text-sm sm:text-base"
            >
              →
            </button>
          </div>
          <div className="flex gap-2 sm:gap-2.5">
            {students.map((student, i) => (
              <button
                key={student.name}
                type="button"
                aria-label={`Go to student ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1 rounded-[3px] transition-all duration-200 cursor-pointer ${
                  i === current ? "w-6 sm:w-10 bg-[#E8871E]" : "w-[18px] sm:w-[26px] bg-[#F2F4F7] hover:bg-[#5B6472]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal - Fixed Cross Icon Issue */}
      {isModalOpen && selectedStudent && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="relative max-w-2xl w-full animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - FIXED: Now visible on all screen sizes */}
            <button
              onClick={closeModal}
              className="absolute -top-10 sm:-top-12 right-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:text-[#E8871E] transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2} />
            </button>

            {/* Content - Flat on Black Overlay */}
            <div className="text-center px-2 sm:px-0">
              {/* Image */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-4 sm:mb-6 border-2 border-white/20">
                <img
                  src={selectedStudent.image}
                  alt={selectedStudent.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name - White */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedStudent.name}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#E8871E] mb-2 sm:mb-3">
                {selectedStudent.tag}
              </p>

              {/* Meta Chips - Responsive */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-[10px] sm:text-xs font-medium text-[#E8871E] bg-[rgba(232,135,30,0.15)] px-2.5 sm:px-3 py-1 rounded-full">
                  {selectedStudent.year}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-white/70 bg-white/10 px-2.5 sm:px-3 py-1 rounded-full">
                  {selectedStudent.since}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-[#2E9B5C] bg-[rgba(46,155,92,0.15)] px-2.5 sm:px-3 py-1 rounded-full">
                  {selectedStudent.club}
                </span>
              </div>

              {/* Divider */}
              <div className="w-10 sm:w-12 h-[2px] bg-[#E8871E] mx-auto mb-4 sm:mb-6" />

              {/* Quote - White Text */}
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