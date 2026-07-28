"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Phone, ArrowRight, CheckCircle2, Users, FlaskConical, Palette, Bot, Drama, BookOpen } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const SPORTS = [
  {
    id: 1,
    src: "https://plus.unsplash.com/premium_photo-1681842163457-26303db2ef5c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Football",
    description: [
      "Build teamwork and leadership skills",
      "Develop strategy and endurance",
      "Learn sportsmanship and discipline"
    ],
    icon: "⚽",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1706841533842-3bbfafb7fdbc?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Basketball",
    description: [
      "Improve agility and coordination",
      "Enhance team spirit and communication",
      "Focus on skill development"
    ],
    icon: "🏀",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?q=80&w=1241&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Athletics",
    description: [
      "Build strength and endurance",
      "Participate in track & field events",
      "Develop personal fitness goals"
    ],
    icon: "🏃",
  },
  {
    id: 4,
    src: "https://plus.unsplash.com/premium_photo-1664303953438-a07c44d0a8fe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Swimming",
    description: [
      "Build endurance and confidence",
      "Learn life-saving skills",
      "Promote physical and mental well-being"
    ],
    icon: "🏊",
  },
];

const CLUBS = [
  {
    id: 1,
    icon: Users,
    title: "Debate Club",
    description: [
      "Develop critical thinking and public speaking skills",
      "Participate in inter-school debates and competitions",
      "Build confidence and persuasive communication"
    ],
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    icon: FlaskConical,
    title: "Science Club",
    description: [
      "Explore scientific concepts through hands-on experiments",
      "Participate in science fairs and exhibitions",
      "Develop analytical and research skills"
    ],
    image: "https://images.unsplash.com/photo-1758685734470-a75109299497?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    icon: Palette,
    title: "Art Club",
    description: [
      "Explore various art forms - painting, sketching, sculpture",
      "Participate in art exhibitions and competitions",
      "Develop creativity and visual expression"
    ],
    image: "https://plus.unsplash.com/premium_photo-1664299577783-9358f95824f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    icon: Bot,
    title: "Robotics Club",
    description: [
      "Build and program robots using cutting-edge technology",
      "Participate in robotics competitions",
      "Develop problem-solving and engineering skills"
    ],
    image: "https://images.unsplash.com/photo-1743677077216-00a458eff9e0?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    icon: Drama,
    title: "Drama Club",
    description: [
      "Explore acting, directing, and stage production",
      "Perform in school plays and cultural events",
      "Develop confidence and creative expression"
    ],
    image: "https://images.unsplash.com/photo-1667384443065-b15c7caa4160?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
];

export default function StudentLife() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [visibleClubs, setVisibleClubs] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clubRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Hero Section Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentRef = heroRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Sports Cards Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = Number(entry.target.getAttribute('data-card-id'));
          if (entry.isIntersecting && !visibleCards.includes(cardId)) {
            setVisibleCards(prev => [...prev, cardId]);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleCards]);

  // Clubs Cards Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = Number(entry.target.getAttribute('data-club-id'));
          if (entry.isIntersecting && !visibleClubs.includes(cardId)) {
            setVisibleClubs(prev => [...prev, cardId]);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    clubRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleClubs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <main ref={sectionRef} className="bg-[#FAF9F6] text-[#0B2340] overflow-hidden">

      {/* ============================================================ HERO - Mobile Responsive */}
      <section
        ref={heroRef}
        className="relative flex min-h-[85vh] md:h-[85vh] flex-col items-center justify-center overflow-hidden bg-[#0B2340] text-center"
      >
        <div className="absolute inset-0 z-0">
          <div
            className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
              isHeroVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <div className="relative w-full h-full animate-float-scale">
              <Image
                src="/sports/sp1.jpg"
                alt="Students"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-0 z-10 bg-[#0B2340]/60 transition-all duration-[1000ms] ease-out ${
            isHeroVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        />

        {/* Decorative Elements - Hidden on small mobile */}
        <div className="absolute left-[22px] top-[22px] z-20 h-[50px] w-[70px] hidden sm:block" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.35) 1.5px, transparent 1.5px)", backgroundSize: "12px 12px" }} />
        
        <svg className="absolute left-[18px] top-20 z-20 hidden sm:block" width="60" height="40" viewBox="0 0 60 40">
          <path d="M2 5 Q15 2 15 15 Q15 28 28 25 Q40 22 40 35" stroke="rgba(255,255,255,.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>

        <div className="absolute left-[90px] top-[110px] z-20 h-[90px] w-[90px] rounded-full border-[1.5px] border-white/20 hidden md:block" />

        <div
          className="absolute bottom-4 right-4 z-20 h-[60px] w-20 opacity-90 hidden sm:block"
          style={{ backgroundImage: "radial-gradient(circle, #E8871E 1.5px, transparent 1.5px)", backgroundSize: "11px 11px" }}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto">
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isHeroVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-[200px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="inline-block text-[10px] sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#E8871E] mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 border border-[#E8871E]/30 rounded-full bg-[#E8871E]/10 backdrop-blur-sm">
              ✦ Welcome to Greenfield ✦
            </p>
          </div>

          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isHeroVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[300px]"
            }`}
            style={{ transitionDelay: "450ms" }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-2xl">
              Learn, Grow & <br />
              <span className="text-[#E8871E]">Inspire Together</span>
            </h1>
          </div>

          <div
            className={`flex justify-center transition-all duration-[800ms] ease-out ${
              isHeroVisible
                ? "opacity-100 scale-x-100"
                : "opacity-0 scale-x-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="h-[2px] sm:h-[3px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#E8871E] to-transparent rounded-full my-3 sm:my-4" />
          </div>

          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isHeroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[80px]"
            }`}
            style={{ transitionDelay: "750ms" }}
          >
            <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              Where every child discovers their potential through quality education,
              character building, and holistic development.
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full max-w-2xl transition-all duration-[1000ms] ease-out ${
              isHeroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[60px]"
            }`}
            style={{ transitionDelay: "900ms" }}
          >
            <form onSubmit={handleSearch} className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sports, activities..."
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 pl-10 sm:pl-12 rounded-full bg-white/95 backdrop-blur-sm text-[#0B2340] placeholder:text-[#5B6472]/70 focus:outline-none focus:ring-2 focus:ring-[#E8871E] focus:bg-white transition-all duration-300 shadow-lg text-xs sm:text-sm"
              />
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-[#5B6472]" />
              <button type="submit" className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#E8871E] text-white text-[10px] sm:text-sm font-semibold hover:bg-[#d47a1a] transition-all cursor-pointer">
                Search
              </button>
            </form>

            <Link href="/contact" className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-[#2E9B5C] text-white font-bold hover:bg-[#278a51] transition-all hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer text-xs sm:text-sm">
              <Phone className="w-3 sm:w-4 h-3 sm:h-4" /> Contact Us
            </Link>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 w-full z-20 transition-all duration-[1200ms] ease-out ${
            isHeroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[20px]"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <svg viewBox="0 0 1440 60" className="w-full h-8 sm:h-12 md:h-16" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,60 L0,60 Z" fill="#FAF9F6" />
          </svg>
        </div>
      </section>

      {/* ============================================================ SPORTS SECTION - Responsive */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <div className="opacity-100 translate-y-0 transition-all duration-[1000ms] ease-out">
            <p className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E8871E] mb-2">Sports &amp; Wellness</p>
          </div>
          <div className="opacity-100 translate-y-0 transition-all duration-[1000ms] ease-out">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B2340]">Stronger <span className="text-[#E8871E]">Every Day</span></h2>
          </div>
          <div className="opacity-100 translate-y-0 transition-all duration-[1000ms] ease-out">
            <p className="text-[#5B6472] mt-2 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-sm md:text-base">Discover our wide range of sports activities designed to build confidence, teamwork, and a healthy spirit.</p>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          {SPORTS.map((sport, index) => {
            const isEven = index % 2 === 0;
            const isVisible = visibleCards.includes(index);
            const slideDirection = isEven ? '-translate-x-[60px] sm:-translate-x-[80px]' : 'translate-x-[60px] sm:translate-x-[80px]';
            
            return (
              <div
                key={sport.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                data-card-id={index}
                className={`group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,35,64,0.06)] hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] transition-all duration-700 ease-out hover:-translate-y-1 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : `opacity-0 ${slideDirection}`
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className={`relative h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] overflow-hidden ${isEven ? '' : 'md:order-2'}`}>
                    <Image
                      src={sport.src}
                      alt={sport.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 text-2xl sm:text-3xl">{sport.icon}</div>
                  </div>
                  
                  <div className={`flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12 ${isEven ? '' : 'md:order-1'}`}>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0B2340] mb-2 sm:mb-3 md:mb-4">{sport.title}</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {sport.description.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3 text-[#5B6472] text-xs sm:text-sm md:text-base leading-relaxed">
                          <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-[#E8871E] flex-shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ CLUBS & SOCIETIES - Responsive */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <div className="opacity-100 translate-y-0 transition-all duration-[1000ms] ease-out">
            <p className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#E8871E] mb-2">Clubs &amp; Societies</p>
          </div>
          <div className="opacity-100 translate-y-0 transition-all duration-[1000ms] ease-out">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B2340]">Explore <span className="text-[#E8871E]">Your Passion</span></h2>
          </div>
          <div className="opacity-100 translate-y-0 transition-all duration-[1000ms] ease-out">
            <p className="text-[#5B6472] mt-2 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-sm md:text-base">Discover our diverse range of clubs and societies where students can explore their interests and develop new skills.</p>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-10 md:space-y-14">
          {CLUBS.map((club, index) => {
            const isEven = index % 2 === 0;
            const isVisible = visibleClubs.includes(index);
            const Icon = club.icon;
            const slideDirection = isEven ? '-translate-x-[60px] sm:-translate-x-[80px]' : 'translate-x-[60px] sm:translate-x-[80px]';
            
            return (
              <div
                key={club.id}
                ref={(el) => { clubRefs.current[index] = el; }}
                data-club-id={index}
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10 transition-all duration-700 ease-out ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : `opacity-0 ${slideDirection}`
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Card 1 - Description Card */}
                <div className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_4px_20px_rgba(11,35,64,0.06)] hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] transition-all duration-500 hover:-translate-y-1 cursor-pointer ${isEven ? '' : 'md:order-2'}`}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 bg-[#E8871E]/10 rounded-lg sm:rounded-xl">
                      <Icon className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-[#E8871E]" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-[#0B2340]">{club.title}</h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    {club.description.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-[#5B6472] text-xs sm:text-sm md:text-base leading-relaxed">
                        <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-[#E8871E] flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card 2 - Image Card */}
                <div className={`relative h-[180px] sm:h-[200px] md:h-[240px] lg:h-[280px] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,35,64,0.06)] hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] transition-all duration-500 hover:-translate-y-1 cursor-pointer ${isEven ? '' : 'md:order-1'}`}>
                  <Image
                    src={club.image}
                    alt={club.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340]/40 via-transparent to-transparent" />
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                    <span className="inline-block bg-white/90 backdrop-blur-sm text-[#0B2340] text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                      {club.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================ ADMISSION SECTION - Responsive */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20">
        <div className="bg-gradient-to-br from-[#0B2340] to-[#081A30] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-14 text-center shadow-2xl">
          <div className="opacity-100 translate-y-0 transition-all duration-[1000ms] ease-out">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3 sm:mb-4">
              Ready to Join <span className="text-[#E8871E]">Greenfield?</span>
            </h2>
            <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
              Give your child the gift of quality education, character building, 
              and endless opportunities. Join Greenfield School today and be 
              part of a community that nurtures excellence.
            </p>
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-[#2E9B5C] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-[#2E9B5C]/30 transition-all hover:-translate-y-0.5 hover:bg-[#278a51] hover:shadow-xl hover:shadow-[#2E9B5C]/40"
            >
              Apply Now for Admission
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-float-scale {
          animation: float-scale 20s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}