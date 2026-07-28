"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import { Award, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import JourneyTimeline from "./JourneyTimeline";
import ContactSection from "../components/ContactSection";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

const PROUD_MOMENTS = [
  {
    id: 1,
    title: "Academic Excellence 2024",
    description: [
      "Recognized for outstanding academic performance",
      "Students achieved top positions in board examinations",
      "Multiple subject distinctions and awards"
    ],
    image: "https://images.unsplash.com/photo-1607013407627-6ee814329547?q=80&w=964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "🏆",
  },
  {
    id: 2,
    title: "Sports Champions",
    description: [
      "Won inter-school football and cricket tournaments",
      "Athletes achieved gold medals in district level competitions",
      "Sportsmanship and team spirit recognized"
    ],
    image: "https://images.unsplash.com/photo-1563299796-b729d0af54a5?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "⚽",
  },
  {
    id: 3,
    title: "Cultural Achievements",
    description: [
      "Students excelled in arts, music and drama competitions",
      "Won multiple awards in cultural festivals",
      "Creative expression and talent nurtured"
    ],
    image: "https://images.unsplash.com/photo-1717131553948-13c2c59c7293?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "🎭",
  },
  {
    id: 4,
    title: "Community Impact",
    description: [
      "Active participation in community service projects",
      "Environmental awareness and sustainability initiatives",
      "Building responsible and compassionate citizens"
    ],
    image:"https://images.unsplash.com/photo-1758599667717-27c61bcdd14b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    icon: "🌱",
  },
];

export default function MilestonesSection() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Hero Animation
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

  // Proud Moments Cards Scroll Animations
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

  return (
    <main className={`${poppins.className} bg-[#FAF9F6] text-[#0B2340] overflow-hidden`}>
      
      {/* ============================================================ HERO - 100vh Full Screen */}
      <section
        ref={heroRef}
        className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-[#0B2340] text-center w-full"
      >
        <div className="absolute inset-0 z-0">
          <div
            className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
              isHeroVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Students learning together"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        <div
          className={`absolute inset-0 z-10 bg-[#0B2340]/60 transition-all duration-[1000ms] ease-out ${
            isHeroVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        />

        {/* Decorative Elements */}
        <div className="absolute left-[22px] top-[22px] z-20 h-[50px] w-[70px]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.35) 1.5px, transparent 1.5px)", backgroundSize: "12px 12px" }} />
        <svg className="absolute left-[18px] top-20 z-20" width="60" height="40" viewBox="0 0 60 40">
          <path d="M2 5 Q15 2 15 15 Q15 28 28 25 Q40 22 40 35" stroke="rgba(255,255,255,.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <div className="absolute left-[90px] top-[110px] z-20 h-[90px] w-[90px] rounded-full border-[1.5px] border-white/20" />
        <div className="absolute bottom-4 right-4 z-20 h-[60px] w-20 opacity-90" style={{ backgroundImage: "radial-gradient(circle, #E8871E 1.5px, transparent 1.5px)", backgroundSize: "11px 11px" }} />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-12 max-w-4xl mx-auto">
          <div className={`transition-all duration-[1000ms] ease-out ${isHeroVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[200px]"}`} style={{ transitionDelay: "300ms" }}>
            <p className="inline-block text-sm font-bold uppercase tracking-[0.25em] text-[#E8871E] mb-4 px-4 py-1.5 border border-[#E8871E]/30 rounded-full bg-[#E8871E]/10 backdrop-blur-sm">
              ✦ Our Achievements ✦
            </p>
          </div>

          <div className={`transition-all duration-[1000ms] ease-out ${isHeroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[300px]"}`} style={{ transitionDelay: "450ms" }}>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-2xl">
              Milestones <br />
              <span className="text-[#E8871E]">That Inspire</span>
            </h1>
          </div>

          <div className={`flex justify-center transition-all duration-[800ms] ease-out ${isHeroVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} style={{ transitionDelay: "600ms" }}>
            <div className="h-[3px] w-20 bg-gradient-to-r from-transparent via-[#E8871E] to-transparent rounded-full my-4" />
          </div>

          <div className={`transition-all duration-[1000ms] ease-out ${isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[80px]"}`} style={{ transitionDelay: "750ms" }}>
            <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Each achievement is a step forward in our journey of excellence,
              commitment and impact in education.
            </p>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className={`absolute bottom-0 left-0 w-full z-20 transition-all duration-[1200ms] ease-out ${isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"}`} style={{ transitionDelay: "1000ms" }}>
          <svg viewBox="0 0 1440 60" className="w-full h-12 md:h-16" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,60 L0,60 Z" fill="#FAF9F6" />
          </svg>
        </div>
      </section>

      {/* ============================================================ JOURNEY TIMELINE */}
      <div className="max-w-5xl mx-auto px-5">
        <JourneyTimeline />
      </div>

      {/* ============================================================ CELEBRATING OUR SUCCESS */}
      <section className="max-w-5xl mx-auto px-5 pt-16 pb-20">
        <div className="text-center mb-14">
          <div className="mb-2.5 flex items-center justify-center gap-2 text-[12.5px] font-extrabold tracking-wider text-[#E8871E]">
            <span className="h-px w-[18px] bg-[#E8871E]" />
            OUR PROUD MOMENTS
            <span className="h-px w-[18px] bg-[#E8871E]" />
          </div>
          <h2 className="mb-2 text-2xl font-extrabold text-[#0B2340]">Celebrating Our Success</h2>
          <p className="mb-9 text-[13.5px] text-[#5B6472]">
            Glimpses of our proudest achievements and memorable moments.
          </p>
        </div>

        <div className="space-y-10">
          {PROUD_MOMENTS.map((item, index) => {
            const isEven = index % 2 === 0;
            const isVisible = visibleCards.includes(index);
            const slideDirection = isEven ? '-translate-x-[80px]' : 'translate-x-[80px]';
            
            return (
              <div
                key={item.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                data-card-id={index}
                className={`group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,35,64,0.06)] hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] transition-all duration-700 ease-out hover:-translate-y-1 cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : `opacity-0 ${slideDirection}`
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image */}
                  <div className={`relative h-[260px] md:h-[300px] overflow-hidden ${isEven ? '' : 'md:order-2'}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 text-3xl">{item.icon}</div>
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col justify-center p-8 md:p-10 ${isEven ? '' : 'md:order-1'}`}>
                    <h3 className="text-xl md:text-2xl font-extrabold text-[#0B2340] mb-4">
                      {item.title}
                    </h3>
                    <ul className="space-y-3">
                      {item.description.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-[#5B6472] text-sm md:text-base leading-relaxed">
                          <CheckCircle2 className="w-5 h-5 text-[#E8871E] flex-shrink-0 mt-0.5" />
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
      <ContactSection/>

    </main>
  );
}