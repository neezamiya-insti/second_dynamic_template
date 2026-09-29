/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { Calendar, MapPin, Clock, ChevronRight, X } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: Event[];
  expiresAt: number;
}

const gridCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): Event[] | null {
  const entry = gridCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    gridCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: Event[]): void {
  gridCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = gridCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) gridCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Skeleton
// ----------------------------------------------------------------------------
function GridSkeleton() {
  return (
    <div className={`${poppins.className} w-full bg-[#FAF9F6] py-16 sm:py-20 px-4 sm:px-6`}>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(11, 35, 64, 0.04) 0%,
            rgba(11, 35, 64, 0.08) 50%,
            rgba(11, 35, 64, 0.04) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Filter skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-10 w-32 rounded-full" />
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="shimmer h-[200px] md:h-[260px]" />
                <div className="p-8">
                  <div className="shimmer h-6 w-3/4 rounded mb-4" />
                  <div className="shimmer h-4 w-1/2 rounded mb-2" />
                  <div className="shimmer h-4 w-2/3 rounded mb-4" />
                  <div className="shimmer h-4 w-full rounded mb-2" />
                  <div className="shimmer h-4 w-5/6 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Category styles
// ----------------------------------------------------------------------------
const categoryColors = {
  news: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  event: "bg-[#E8CA5E]/20 text-[#E8CA5E] border-[#E8CA5E]/30",
};

const categoryLabels = {
  news: "News",
  event: "Event",
};

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function EventsGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<Event[] | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const collegeId = "10";
  const CACHE_KEY = `events_grid_${collegeId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached && cached.length > 0) {
      console.log("📦 [EventsGrid] Loading from memory cache");
      setEvents(cached);
      return;
    }

    async function fetchData() {
      try {
        console.log("🔄 [EventsGrid] Fetching for college:", collegeId);
        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=Events`
        );
        const result = await res.json();
        console.log("📦 [EventsGrid] API Response:", result);

        if (
          result.success &&
          result.content &&
          Array.isArray(result.content.events) &&
          result.content.events.length > 0
        ) {
          const fetched: Event[] = result.content.events.map((e: any, idx: number) => ({
            id: e.id ?? idx + 1,
            title: e.title || "",
            date: e.date || "",
            time: e.time || "",
            location: e.location || "",
            description: e.description || "",
            image: e.image || e.featuredImage || "",
            category: e.category === "news" ? "news" : "event",
            featured: !!e.featured,
          }));
          cacheSet(CACHE_KEY, fetched);
          setEvents(fetched);
        } else {
          console.log("⚠️ [EventsGrid] No data from API");
          setEvents(null);
        }
      } catch (err) {
        console.error("❌ [EventsGrid] Error:", err);
        setEvents(null);
      }
    }

    fetchData();
  }, [mounted]);

  // Intersection observer
  useEffect(() => {
    if (!events || events.length === 0) return;

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
  }, [events]);

  // Card observer
  useEffect(() => {
    if (!events) return;

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
  }, [filter, events]);

  // Loading
  if (!mounted || !events) {
    return <GridSkeleton />;
  }

  if (events.length === 0) return null;

  const filteredEvents =
    filter === "all" ? events : events.filter((event) => event.category === filter);

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
    <div
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#FAF9F6] py-16 sm:py-20 px-4 sm:px-6`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Filter Bar */}
        <div
          className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 transition-all duration-[1000ms] ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
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
            Events ({events.filter((e) => e.category === "event").length})
          </button>
          <button
            onClick={() => setFilter("news")}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
              filter === "news"
                ? "bg-[#E8CA5E] text-[#0B0F19]"
                : "bg-white text-[#5B6472] hover:bg-[#E8CA5E]/10 hover:text-[#0B0F19]"
            }`}
          >
            News ({events.filter((e) => e.category === "news").length})
          </button>
        </div>

        {/* Featured Event */}
        {featuredEvent && (filter === "all" || filter === featuredEvent.category) && (
          <div
            className={`mb-12 transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="bg-[#0B0F19] rounded-2xl overflow-hidden border border-white/5 hover:border-[#E8CA5E]/30 transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[200px] md:h-[300px] overflow-hidden cursor-pointer group">
                  {featuredEvent.image && (
                    <Image
                      src={featuredEvent.image}
                      alt={featuredEvent.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border ${categoryColors[featuredEvent.category]}`}
                    >
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border inline-block w-fit mb-3 ${categoryColors[featuredEvent.category]}`}
                  >
                    {categoryLabels[featuredEvent.category]}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                    {featuredEvent.title}
                  </h3>
                  <div className="space-y-2 text-[#9CA3AF] text-sm mb-4">
                    {featuredEvent.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#E8CA5E]" />
                        <span>{featuredEvent.date}</span>
                      </div>
                    )}
                    {featuredEvent.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#E8CA5E]" />
                        <span>{featuredEvent.time}</span>
                      </div>
                    )}
                    {featuredEvent.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#E8CA5E]" />
                        <span>{featuredEvent.location}</span>
                      </div>
                    )}
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
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${isEven ? "" : "md:grid-flow-col"}`}>
                      {/* Image */}
                      <div
                        className={`relative h-[200px] md:h-[260px] overflow-hidden cursor-pointer group order-1 ${
                          isEven ? "md:order-1" : "md:order-2"
                        }`}
                      >
                        {event.image ? (
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-[#111722] flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-[#E8CA5E]/30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border ${categoryColors[event.category]}`}
                          >
                            {categoryLabels[event.category]}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className={`p-6 md:p-8 flex flex-col justify-center order-2 ${
                          isEven ? "md:order-2" : "md:order-1"
                        }`}
                      >
                        <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2">
                          {event.title}
                        </h3>
                        <div className="space-y-1.5 text-[#9CA3AF] text-xs sm:text-sm mb-3">
                          {event.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-[#E8CA5E]" />
                              <span>{event.date}</span>
                            </div>
                          )}
                          {event.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-[#E8CA5E]" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#E8CA5E]" />
                              <span>{event.location}</span>
                            </div>
                          )}
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

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-[#E8CA5E] transition-colors flex items-center justify-center cursor-pointer border border-white/20 hover:border-[#E8CA5E]"
            >
              <X className="w-5 h-5 text-white hover:text-[#0B0F19] transition-colors" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Left Image */}
              <div className="relative h-[250px] sm:h-[350px] md:h-[550px] overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                {selectedEvent.image ? (
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#111722] flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-[#E8CA5E]/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${categoryColors[selectedEvent.category]}`}
                  >
                    {categoryLabels[selectedEvent.category]}
                  </span>
                  {selectedEvent.featured && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#E8CA5E]/20 text-[#E8CA5E] border-[#E8CA5E]/30">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Right Content */}
              <div className="bg-black p-6 sm:p-8 md:p-10 flex flex-col justify-center rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                  {selectedEvent.title}
                </h2>
                <div className="space-y-2 text-[#9CA3AF] text-sm mb-6">
                  {selectedEvent.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#E8CA5E]" />
                      <span>{selectedEvent.date}</span>
                    </div>
                  )}
                  {selectedEvent.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#E8CA5E]" />
                      <span>{selectedEvent.time}</span>
                    </div>
                  )}
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E8CA5E]" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
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