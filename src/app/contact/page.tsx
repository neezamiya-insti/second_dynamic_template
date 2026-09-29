/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  Clock,
  Globe,
  Home,
  Calendar,
  Users,
} from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
interface ContactPageData {
  email: string;
  phone: string;
  address: string;
  website: string;
  mapLink: string;
  appointmentLink: string;
  contactImage: string;
  contactMobileImage: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  contactNumbers: {
    phone: string;
    whatsapp: string;
    office: string;
  };
}

// ----------------------------------------------------------------------------
// Safe defaults
// ----------------------------------------------------------------------------
const DEFAULT_DATA: ContactPageData = {
  email: "",
  phone: "",
  address: "",
  website: "",
  mapLink: "",
  appointmentLink: "",
  contactImage: "",
  contactMobileImage: "",
  socialMedia: { facebook: "", twitter: "", linkedin: "", instagram: "" },
  workingHours: {
    weekdays: "",
    saturday: "",
    sunday: "",
  },
  contactNumbers: {
    phone: "",
    whatsapp: "",
    office: "",
  },
};

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: ContactPageData;
  expiresAt: number;
}

const pageCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): ContactPageData | null {
  const entry = pageCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    pageCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: ContactPageData): void {
  pageCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = pageCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) pageCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

// ----------------------------------------------------------------------------
// Shimmer Skeleton
// ----------------------------------------------------------------------------
function ContactSkeleton() {
  return (
    <section className={`${poppins.className} w-full bg-[#FAF9F6]`}>
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

      <div className="relative w-full h-[85vh] bg-[#0B0F19]/80">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-4">
          <div className="shimmer h-6 w-40 rounded-full" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
          <div className="shimmer h-14 w-96 max-w-full rounded-lg" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
          <div className="shimmer h-4 w-80 max-w-full rounded" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="shimmer h-4 w-32 rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer h-16 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="shimmer h-16 w-16 rounded-2xl mb-4" />
              <div className="shimmer h-8 w-64 rounded mb-4" />
              <div className="shimmer h-4 w-full rounded mb-2" />
              <div className="shimmer h-4 w-5/6 rounded mb-6" />
              <div className="grid grid-cols-2 gap-4">
                <div className="shimmer h-20 rounded-xl" />
                <div className="shimmer h-20 rounded-xl" />
              </div>
            </div>
            <div className="shimmer h-[300px] rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ContactPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const collegeId = "10";
  const CACHE_KEY = `contact_page_${collegeId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch data
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      console.log("📦 [ContactPage] Loading from memory cache");
      setData(cached);
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        console.log("🔄 [ContactPage] Fetching for college:", collegeId);
        setIsLoading(true);

        const res = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=Contact`
        );
        const result = await res.json();
        console.log("📦 [ContactPage] API Response:", result);

        const c = result?.success ? result.content || {} : {};

        // ✅ Safe extraction — har field pe `?.` aur `||` fallback
        const fetched: ContactPageData = {
          email: c?.email || DEFAULT_DATA.email,
          phone: c?.phone || DEFAULT_DATA.phone,
          address: c?.address || DEFAULT_DATA.address,
          website: c?.website || DEFAULT_DATA.website,
          mapLink: c?.mapLink || DEFAULT_DATA.mapLink,
          appointmentLink: c?.appointmentLink || DEFAULT_DATA.appointmentLink,
          contactImage: c?.contactImage || DEFAULT_DATA.contactImage,
          contactMobileImage: c?.contactMobileImage || DEFAULT_DATA.contactMobileImage,
          socialMedia: {
            facebook: c?.socialMedia?.facebook || "",
            twitter: c?.socialMedia?.twitter || "",
            linkedin: c?.socialMedia?.linkedin || "",
            instagram: c?.socialMedia?.instagram || "",
          },
          workingHours: {
            weekdays: c?.workingHours?.weekdays || DEFAULT_DATA.workingHours.weekdays,
            saturday: c?.workingHours?.saturday || DEFAULT_DATA.workingHours.saturday,
            sunday: c?.workingHours?.sunday || DEFAULT_DATA.workingHours.sunday,
          },
          contactNumbers: {
            phone: c?.contactNumbers?.phone || c?.phone || DEFAULT_DATA.contactNumbers.phone,
            whatsapp: c?.contactNumbers?.whatsapp || DEFAULT_DATA.contactNumbers.whatsapp,
            office: c?.contactNumbers?.office || DEFAULT_DATA.contactNumbers.office,
          },
        };

        cacheSet(CACHE_KEY, fetched);
        setData(fetched);
      } catch (err) {
        console.error("❌ [ContactPage] Error:", err);
        // ✅ Error pe bhi safe default
        setData(DEFAULT_DATA);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [mounted]);

  // Intersection observer
  useEffect(() => {
    if (!data) return;

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
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  // ✅ Loading
  if (!mounted || isLoading || !data) {
    return <ContactSkeleton />;
  }

  // ✅ Ab data.workingHours aur data.contactNumbers guaranteed objects hain
  const workingHours = data.workingHours || DEFAULT_DATA.workingHours;
  const contactNumbers = data.contactNumbers || DEFAULT_DATA.contactNumbers;

  const mainPhone = contactNumbers.phone || data.phone || "";
  const mainEmail = data.email || "";
  const mainAddress = data.address || "";
  const mainHours = workingHours.weekdays || "";
  const mainMapLink = data.mapLink || "";

  // ✅ Contact options — safe access
  const contactOptions = [
    {
      id: 1,
      icon: MapPin,
      title: "Visit Us",
      detail: mainAddress || "Address not provided",
      subDetail: "Located in the heart of the city",
      fullDescription:
        "Come visit our beautiful campus and see the difference in person. Our friendly staff will give you a personalized tour of our facilities.",
      action: "Get Directions",
      link: mainMapLink || "https://maps.google.com",
      hours: mainHours || "Not available",
      email: mainEmail || "",
      phone: mainPhone || "",
      mapLink: mainMapLink || "",
    },
    {
      id: 2,
      icon: Phone,
      title: "Call Us",
      detail: mainPhone || "Phone not provided",
      subDetail: mainHours || "",
      fullDescription:
        "Our friendly admissions team is ready to answer all your questions about admissions, programs, and college life. Call us during business hours.",
      action: "Call Now",
      link: mainPhone ? `tel:${mainPhone.replace(/\s+/g, "")}` : "#",
      hours: mainHours || "Not available",
      email: mainEmail || "",
      phone: mainPhone || "",
      mapLink: mainMapLink || "",
    },
    {
      id: 3,
      icon: Mail,
      title: "Email Us",
      detail: mainEmail || "Email not provided",
      subDetail: "We respond within 24 hours",
      fullDescription:
        "Send us an email and we'll get back to you as soon as possible. For urgent matters, please call us directly.",
      action: "Send Email",
      link: mainEmail ? `mailto:${mainEmail}` : "#",
      hours: "24/7 Email Support",
      email: mainEmail || "",
      phone: mainPhone || "",
      mapLink: mainMapLink || "",
    },
  ];

  // ✅ Quick Info — safe access
  const quickInfo = [
    {
      icon: Clock,
      label: "Office Hours",
      value: workingHours.weekdays || "Not available",
    },
    {
      icon: Calendar,
      label: "Saturday",
      value: workingHours.saturday || "Closed",
    },
    {
      icon: Users,
      label: "WhatsApp",
      value: contactNumbers.whatsapp || "Not available",
    },
    {
      icon: Home,
      label: "Office",
      value: contactNumbers.office || "Not available",
    },
  ];

  const selectedContact = contactOptions[selectedIndex] || contactOptions[0];
  const SelectedIcon = selectedContact.icon;

  const heroImage = data.contactImage || "";
  const formImage = data.contactMobileImage || data.contactImage || "";

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#FAF9F6] overflow-hidden`}
    >
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[85vh] overflow-hidden">
        {heroImage && (
          <div
            className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
              isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
          >
            <Image
              src={heroImage}
              alt="Contact"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-b from-[#0B0F19]/60 via-[#0B0F19]/70 to-[#0B0F19]/80 transition-all duration-[1000ms] ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="overflow-hidden">
            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[200px]"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <p className="inline-block text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-4 px-4 py-1.5 border border-[#E8CA5E]/30 rounded-full bg-[#E8CA5E]/10 backdrop-blur-sm">
                ✦ Get In Touch ✦
              </p>
            </div>

            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[300px]"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-2xl">
                Contact <span className="text-[#E8CA5E]">Us</span>
              </h1>
            </div>

            <div
              className={`flex justify-center transition-all duration-[800ms] ease-out ${
                isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <div className="h-[3px] w-20 bg-gradient-to-r from-transparent via-[#E8CA5E] to-transparent rounded-full my-4" />
            </div>

            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[80px]"
              }`}
              style={{ transitionDelay: "750ms" }}
            >
              <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                We'd love to hear from you. Reach out to us and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 w-full transition-all duration-[1200ms] ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[20px]"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <svg viewBox="0 0 1440 60" className="w-full h-12 md:h-16" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,60 L0,60 Z" fill="#FAF9F6" />
          </svg>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,35,64,0.06)] p-4 md:p-6 sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#5B6472] mb-4 px-2">
                Contact Options
              </h3>

              <div className="space-y-2">
                {contactOptions.map((contact, idx) => {
                  const Icon = contact.icon;
                  const isActive = selectedIndex === idx;
                  return (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                        isActive
                          ? "bg-[#E8CA5E]/10 text-[#E8CA5E] border border-[#E8CA5E]"
                          : "hover:bg-[#F2F4F7] text-[#5B6472]"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full ${
                          isActive ? "bg-[#E8CA5E]/10" : "bg-[#F2F4F7]"
                        } flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? "text-[#E8CA5E]" : "text-[#5B6472]"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold ${
                            isActive ? "text-[#0B2340]" : "text-[#5B6472]"
                          }`}
                        >
                          {contact.title}
                        </p>
                        <p className="text-xs text-[#5B6472] truncate">
                          {contact.detail || "—"}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-8 rounded-full bg-[#E8CA5E]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-[#F2F4F7]">
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5B6472] mb-3 px-2">
                  Quick Info
                </h4>
                <div className="space-y-2">
                  {quickInfo.map((info, index) => {
                    const InfoIcon = info.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#F2F4F7] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#F2F4F7] flex items-center justify-center">
                          <InfoIcon className="w-4 h-4 text-[#5B6472]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#5B6472]">{info.label}</p>
                          <p className="text-sm font-semibold text-[#0B2340]">
                            {info.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="lg:col-span-3">
            <div
              className={`transition-all duration-[700ms] ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,35,64,0.06)] p-6 md:p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8CA5E]/10 flex items-center justify-center flex-shrink-0">
                    <SelectedIcon className="w-8 h-8 text-[#E8CA5E]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#0B2340]">
                      {selectedContact.title}
                    </h2>
                    <p className="text-sm font-medium text-[#E8CA5E]">
                      {selectedContact.subDetail || "—"}
                    </p>
                  </div>
                </div>

                <p className="text-[#5B6472] text-base leading-relaxed mb-6">
                  {selectedContact.fullDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {selectedContact.phone && (
                    <div className="bg-[#FAF9F6] rounded-xl p-4">
                      <p className="text-xs text-[#5B6472] font-medium uppercase tracking-[0.1em]">
                        Phone
                      </p>
                      <a
                        href={`tel:${selectedContact.phone.replace(/\s+/g, "")}`}
                        className="text-sm font-semibold text-[#E8CA5E] hover:underline"
                      >
                        {selectedContact.phone}
                      </a>
                    </div>
                  )}
                  {selectedContact.email && (
                    <div className="bg-[#FAF9F6] rounded-xl p-4">
                      <p className="text-xs text-[#5B6472] font-medium uppercase tracking-[0.1em]">
                        Email
                      </p>
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="text-sm font-semibold text-[#E8CA5E] hover:underline break-all"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                  )}
                  {selectedContact.hours && (
                    <div className="bg-[#FAF9F6] rounded-xl p-4 sm:col-span-2">
                      <p className="text-xs text-[#5B6472] font-medium uppercase tracking-[0.1em]">
                        Business Hours
                      </p>
                      <p className="text-sm font-semibold text-[#0B2340]">
                        {selectedContact.hours}
                      </p>
                    </div>
                  )}
                </div>

                {selectedContact.link && selectedContact.action && (
                  <a
                    href={selectedContact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[#0B0F19] font-semibold bg-[#E8CA5E] transition-all hover:scale-105 hover:shadow-lg"
                  >
                    {selectedContact.action}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {selectedContact.mapLink && (
              <div
                className={`transition-all duration-[700ms] ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,35,64,0.06)] p-4 md:p-6">
                  <h3 className="text-lg font-bold text-[#0B2340] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#E8CA5E]" />
                    Find Us Here
                  </h3>
                  <div className="relative w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden">
                    <iframe
                      src={selectedContact.mapLink}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. CONTACT FORM */}
        <div className="mt-20">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-2">
              Send a Message
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#0B2340]">
              We'd Love to Hear From You
            </h2>
            <p className="text-[#5B6472] mt-3 max-w-2xl mx-auto text-base">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {formImage && (
              <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-xl min-h-[300px] lg:min-h-[500px] cursor-pointer group">
                <Image
                  src={formImage}
                  alt="Contact us"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340]/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-white mb-1">Get in Touch</h3>
                  <p className="text-white/70 text-sm">We're here to help you</p>
                </div>
              </div>
            )}

            <div className={formImage ? "lg:col-span-3" : "lg:col-span-5"}>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(11,35,64,0.06)] hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] transition-all duration-300">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-[#0B2340] mb-2">
                        Your Name <span className="text-[#E8CA5E]">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] text-[#0B2340] placeholder:text-[#5B6472]/60 focus:outline-none focus:border-[#E8CA5E] focus:ring-2 focus:ring-[#E8CA5E]/20 transition-all duration-300 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#0B2340] mb-2">
                        Email Address <span className="text-[#E8CA5E]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] text-[#0B2340] placeholder:text-[#5B6472]/60 focus:outline-none focus:border-[#E8CA5E] focus:ring-2 focus:ring-[#E8CA5E]/20 transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-[#0B2340] mb-2">
                      Subject <span className="text-[#E8CA5E]">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Enter subject"
                      className="w-full px-4 py-3 rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] text-[#0B2340] placeholder:text-[#5B6472]/60 focus:outline-none focus:border-[#E8CA5E] focus:ring-2 focus:ring-[#E8CA5E]/20 transition-all duration-300 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#0B2340] mb-2">
                      Message <span className="text-[#E8CA5E]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] text-[#0B2340] placeholder:text-[#5B6472]/60 focus:outline-none focus:border-[#E8CA5E] focus:ring-2 focus:ring-[#E8CA5E]/20 transition-all duration-300 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#E8CA5E] px-8 py-3.5 text-base font-semibold text-[#0B0F19] shadow-lg shadow-[#E8CA5E]/30 transition-all hover:-translate-y-0.5 hover:bg-[#d4b84a] hover:shadow-xl hover:shadow-[#E8CA5E]/40 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-[#0B0F19] border-t-transparent" />
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <span>✓</span>
                        Message Sent!
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {isSubmitted && (
                    <div className="text-center text-[#E8CA5E] text-sm font-semibold animate-in fade-in duration-300">
                      ✓ Your message has been sent successfully. We'll get back to you soon!
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Now Floating */}
      <Link
        href="/admissions"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-[#E8CA5E] px-6 py-3.5 text-sm font-bold text-[#0B0F19] shadow-lg shadow-[#E8CA5E]/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#E8CA5E]/50 cursor-pointer md:px-8 md:py-4 md:text-base"
      >
        Apply Now
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}