// app/events/EventsGrid.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { Calendar, MapPin, Clock, ChevronRight, X } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: "news" | "event";
  featured?: boolean;
}

// 5 News + 5 Events = Total 10
const events: Event[] = [
  // ===== NEWS (5) =====
  {
    id: 1,
    title: "Al Noor College Ranked Top 10 in Pakistan",
    date: "December 10, 2025",
    time: "All Day",
    location: "Al Noor College Main Campus",
    description: "Al Noor College has been ranked among the top 10 educational institutions in Pakistan for academic excellence and student satisfaction. This achievement reflects our commitment to quality education and continuous improvement.",
    image: "/events/ev1.png",
    category: "news",
  },
  {
    id: 2,
    title: "New Research Lab Inaugurated",
    date: "November 25, 2025",
    time: "10:00 AM",
    location: "Science Building",
    description: "State-of-the-art research laboratory inaugurated to support advanced research in AI, robotics, and data science. The lab features cutting-edge equipment and collaborative spaces for students and faculty.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop&q=80",
    category: "news",
  },
  {
    id: 3,
    title: "Al Noor College Wins National Debate Championship",
    date: "November 15, 2025",
    time: "All Day",
    location: "Islamabad",
    description: "Our debate team emerged victorious at the National Inter-College Debate Championship 2025, bringing pride to the institution. The team showcased exceptional critical thinking and communication skills.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80",
    category: "news",
  },
  {
    id: 4,
    title: "Faculty Development Program Launched",
    date: "October 30, 2025",
    time: "9:00 AM",
    location: "Conference Hall",
    description: "A comprehensive faculty development program launched to enhance teaching methodologies and research capabilities. The program includes workshops, seminars, and international collaborations.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&q=80",
    category: "news",
  },
  {
    id: 5,
    title: "International Student Exchange Program",
    date: "October 10, 2025",
    time: "All Day",
    location: "Global Campus",
    description: "Al Noor College partners with international universities for student exchange programs, opening doors for global exposure and cross-cultural learning experiences.",
    image: "/events/ev2.png",
    category: "news",
  },

  // ===== EVENTS (5) =====
  {
    id: 6,
    title: "Annual College Festival 2025",
    date: "December 15, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Al Noor College Main Campus",
    description: "Join us for a day of celebration, talent showcase, and community bonding. Students, faculty, and families are all invited to this grand annual event featuring performances, exhibitions, and fun activities.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop&q=80",
    category: "event",
    featured: true,
  },
  {
    id: 7,
    title: "Science & Technology Expo",
    date: "February 20, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Science Building",
    description: "Explore the latest innovations and research projects by our students and faculty members. The expo features interactive displays, demonstrations, and competitions.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop&q=80",
    category: "event",
  },
  {
    id: 8,
    title: "Sports Week 2026",
    date: "April 10-14, 2026",
    time: "8:00 AM - 5:00 PM",
    location: "Sports Complex",
    description: "A week-long celebration of sports featuring competitions, friendly matches, and awards ceremony. Students compete in cricket, football, basketball, athletics, and more.",
    image: "/events/ev3.png",
    category: "event",
  },
  {
    id: 9,
    title: "Cultural Night 2026",
    date: "August 30, 2026",
    time: "7:00 PM - 11:00 PM",
    location: "College Lawn",
    description: "Experience the vibrant cultural diversity of our college through performances, food, and festivities. A night of music, dance, and cultural celebration.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&q=80",
    category: "event",
  },
  {
    id: 10,
    title: "Alumni Meetup 2026",
    date: "June 15, 2026",
    time: "5:00 PM - 9:00 PM",
    location: "Al Noor College Auditorium",
    description: "Connect with fellow alumni, share experiences, and build lasting professional relationships. A networking event designed to strengthen the alumni community.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80",
    category: "event",
  },
];

const categoryColors = {
  news: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  event: "bg-[#E8CA5E]/20 text-[#E8CA5E] border-[#E8CA5E]/30",
};

const categoryLabels = {
  news: "News",
  event: "Event",
};

export default function EventsGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Intersection Observer for individual cards
  useEffect(() => {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = Number(entry.target.getAttribute("data-id"));
          if (entry.isIntersecting && id) {
            setVisibleCards((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) cardObserver.observe(ref);
    });

    return () => {
      cardObserver.disconnect();
    };
  }, [filter]);

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter((event) => event.category === filter);

  const featuredEvent = events.find((e) => e.featured);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div ref={sectionRef} className={`${poppins.className} w-full bg-[#FAF9F6] py-16 sm:py-20 px-4 sm:px-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Filter Bar */}
        <div
          className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[30px]"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <button
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              filter === "all"
                ? "bg-[#E8CA5E] text-[#0B0F19]"
                : "bg-white text-[#5B6472] hover:bg-[#E8CA5E]/10 hover:text-[#0B0F19]"
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilter("event")}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              filter === "event"
                ? "bg-[#E8CA5E] text-[#0B0F19]"
                : "bg-white text-[#5B6472] hover:bg-[#E8CA5E]/10 hover:text-[#0B0F19]"
            }`}
          >
            Events ({events.filter(e => e.category === "event").length})
          </button>
          <button
            onClick={() => setFilter("news")}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              filter === "news"
                ? "bg-[#E8CA5E] text-[#0B0F19]"
                : "bg-white text-[#5B6472] hover:bg-[#E8CA5E]/10 hover:text-[#0B0F19]"
            }`}
          >
            News ({events.filter(e => e.category === "news").length})
          </button>
        </div>

        {/* Featured Event */}
        {featuredEvent && (filter === "all" || filter === "event") && (
          <div
            className={`mb-12 transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[50px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="bg-[#0B0F19] rounded-2xl overflow-hidden border border-white/5 hover:border-[#E8CA5E]/30 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[200px] md:h-[300px] overflow-hidden cursor-pointer group">
                  <Image
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border ${categoryColors[featuredEvent.category]}`}>
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-block w-fit mb-3 ${categoryColors[featuredEvent.category]}`}>
                    {categoryLabels[featuredEvent.category]}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                    {featuredEvent.title}
                  </h3>
                  <div className="space-y-2 text-[#9CA3AF] text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#E8CA5E]" />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#E8CA5E]" />
                      <span>{featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E8CA5E]" />
                      <span>{featuredEvent.location}</span>
                    </div>
                  </div>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4 line-clamp-3">
                    {featuredEvent.description}
                  </p>
                  <button
                    onClick={() => openModal(featuredEvent)}
                    className="inline-flex items-center gap-2 text-[#E8CA5E] font-semibold hover:text-white transition-colors cursor-pointer text-sm w-fit"
                  >
                    Read More <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="space-y-8">
          {filteredEvents
            .filter((e) => !e.featured)
            .map((event, index) => {
              const isEven = index % 2 === 0;
              const isCardVisible = visibleCards.has(event.id);

              return (
                <div
                  key={event.id}
                  ref={(el) => {
                    if (el) {
                      cardRefs.current.set(event.id, el);
                    } else {
                      cardRefs.current.delete(event.id);
                    }
                  }}
                  data-id={event.id}
                  className={`transition-all duration-700 ease-out ${
                    isCardVisible
                      ? "opacity-100 translate-x-0"
                      : isEven
                      ? "opacity-0 -translate-x-[80px]"
                      : "opacity-0 translate-x-[80px]"
                  }`}
                >
                  <div className="bg-[#0B0F19] rounded-2xl overflow-hidden border border-white/5 hover:border-[#E8CA5E]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#E8CA5E]/5">
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${isEven ? '' : 'md:grid-flow-col'}`}>
                      {/* Image */}
                      <div className={`relative h-[200px] md:h-[260px] overflow-hidden cursor-pointer group order-1 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border ${categoryColors[event.category]}`}>
                            {categoryLabels[event.category]}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`p-6 md:p-8 flex flex-col justify-center order-2 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                        <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2">
                          {event.title}
                        </h3>
                        <div className="space-y-1.5 text-[#9CA3AF] text-xs sm:text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#E8CA5E]" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#E8CA5E]" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#E8CA5E]" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4 line-clamp-3">
                          {event.description}
                        </p>
                        <button
                          onClick={() => openModal(event)}
                          className="inline-flex items-center gap-2 text-[#E8CA5E] font-semibold hover:text-white transition-colors cursor-pointer text-sm w-fit"
                        >
                          Read More <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* No Results */}
        {filteredEvents.filter((e) => !e.featured).length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#9CA3AF] text-lg">No items found in this category.</p>
          </div>
        )}
      </div>

      {/* ===== MODAL - Clean Black Overlay, No Card, Image Left ===== */}
      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-[#E8CA5E] transition-colors flex items-center justify-center cursor-pointer border border-white/20 hover:border-[#E8CA5E]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white hover:text-[#0B0F19] transition-colors" />
            </button>

            {/* Content - Image Left, Text Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Left - Image */}
              <div className="relative h-[250px] sm:h-[350px] md:h-[550px] overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${categoryColors[selectedEvent.category]}`}>
                    {categoryLabels[selectedEvent.category]}
                  </span>
                  {selectedEvent.featured && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#E8CA5E]/20 text-[#E8CA5E] border-[#E8CA5E]/30">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Right - Text Content */}
              <div className="bg-black p-6 sm:p-8 md:p-10 flex flex-col justify-center rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                  {selectedEvent.title}
                </h2>
                <div className="space-y-2 text-[#9CA3AF] text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#E8CA5E]" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#E8CA5E]" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E8CA5E]" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                <div className="h-[2px] w-12 bg-[#E8CA5E] mb-6" />
                <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}