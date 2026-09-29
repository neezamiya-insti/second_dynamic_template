/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Poppins } from "next/font/google";
import {
  ClipboardList,
  FileText,
  UploadCloud,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  User,
  GraduationCap,
  Users,
  FileUp,
  Eye,
  Check,
  File as FileIcon,
} from "lucide-react";
import FAQSection from "../components/FAQSection";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
type ProcessStep = {
  id: number;
  icon: React.ElementType;
  title: string;
  desc: string;
};

type FormStep = {
  id: number;
  icon: React.ElementType;
  title: string;
  desc: string;
  heading: string;
  helper: string;
};

interface HeroData {
  badgeText: string;
  headingLine1: string;
  headingLine2: string;
  headingHighlight: string;
  description: string;
  buttonText: string;
  image: string;
}

interface FormFieldFromAPI {
  id: number;
  field_key: string;
  field_label: string;
  field_type: string;
  field_placeholder: string | null;
  field_options: string[] | null;
  is_required: boolean;
  is_active: boolean;
  section: string;
  sort_order: number;
}

interface AdmissionAppData {
  hero: HeroData;
  processSteps: { title: string; desc: string }[];
  formFields: FormFieldFromAPI[];
}

// ----------------------------------------------------------------------------
// In-memory cache — 60s TTL
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: AdmissionAppData;
  expiresAt: number;
}

const appCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

function cacheGet(key: string): AdmissionAppData | null {
  const entry = appCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    appCache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key: string, data: AdmissionAppData): void {
  appCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  setTimeout(() => {
    const cur = appCache.get(key);
    if (cur && cur.expiresAt <= Date.now()) appCache.delete(key);
  }, CACHE_TTL_MS + 50);
}

const PROCESS_ICONS: React.ElementType[] = [
  ClipboardList,
  FileText,
  UploadCloud,
  CreditCard,
  CheckCircle2,
];

const SECTION_ICONS: Record<string, React.ElementType> = {
  personal_info: User,
  academic_info: GraduationCap,
  course_selection: GraduationCap,
  guardian_info: Users,
  documents: FileUp,
  preview: Eye,
};

// ----------------------------------------------------------------------------
// Shimmer Skeleton
// ----------------------------------------------------------------------------
function AdmissionSkeleton() {
  return (
    <main className={`${poppins.className} bg-[#FAF9F6] text-[#0B2340] overflow-hidden w-full`}>
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

      <section className="relative min-h-[500px] py-8 px-4 md:py-12 md:px-10 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="p-6 md:p-8 lg:p-12">
            <div className="shimmer h-4 w-40 rounded mb-3" />
            <div className="shimmer h-12 w-80 max-w-full rounded-lg mb-3" />
            <div className="shimmer h-8 w-64 max-w-full rounded-lg mb-4" />
            <div className="shimmer h-4 w-full rounded mb-2" />
            <div className="shimmer h-4 w-5/6 rounded mb-6" />
            <div className="shimmer h-12 w-36 rounded-full" />
          </div>
          <div className="shimmer h-[220px] sm:h-[280px] md:h-[350px] lg:h-[450px] rounded-2xl md:rounded-3xl" />
        </div>
      </section>

      <section className="px-4 md:px-6 pb-12 md:pb-16 pt-12 md:pt-20 text-center w-full">
        <div className="shimmer h-4 w-32 mx-auto rounded mb-3" />
        <div className="shimmer h-8 w-64 mx-auto rounded-lg mb-14" />
        <div className="grid grid-cols-2 md:flex md:justify-between gap-4 max-w-5xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="shimmer h-12 w-12 md:h-16 md:w-16 rounded-full mb-3" />
              <div className="shimmer h-3 w-8 rounded mb-2" />
              <div className="shimmer h-4 w-24 rounded mb-1" />
              <div className="shimmer h-3 w-20 rounded" />
            </div>
          ))}
        </div>
      </section>

      <section className="w-full pb-16 md:pb-20">
        <div className="flex flex-col md:flex-row bg-white shadow-[0_20px_50px_rgba(11,35,64,0.08)]">
          <aside className="w-full md:w-72 shrink-0 bg-[#0B0F19] px-5 py-6 md:px-7 md:py-9">
            <div className="shimmer h-5 w-40 rounded mb-3" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
            <div className="shimmer h-3 w-48 rounded mb-6" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 py-3">
                <div className="shimmer w-8 h-8 rounded-full" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
                <div className="flex-1">
                  <div className="shimmer h-3 w-32 rounded mb-1" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
                  <div className="shimmer h-2 w-24 rounded" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)" }} />
                </div>
              </div>
            ))}
          </aside>
          <div className="flex-1 px-4 py-6 md:px-8 md:py-10 lg:px-12">
            <div className="shimmer h-4 w-24 rounded mb-3" />
            <div className="shimmer h-7 w-64 rounded-lg mb-3" />
            <div className="shimmer h-3 w-80 rounded mb-6" />
            <div className="shimmer h-1.5 w-full rounded-full mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i}>
                  <div className="shimmer h-3 w-32 rounded mb-2" />
                  <div className="shimmer h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export default function AdmissionApplication() {
  const [activeFormStep, setActiveFormStep] = useState(1);
  const [activeProcessStep, setActiveProcessStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<AdmissionAppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);

  const collegeId = "10";
  const CACHE_KEY = `admission_app_${collegeId}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch data — Admission + College Form API
  useEffect(() => {
    if (!mounted) return;

    const cached = cacheGet(CACHE_KEY);
    if (cached) {
      console.log("📦 [AdmissionApp] Loading from memory cache");
      setData(cached);
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        console.log("🔄 [AdmissionApp] Fetching for college:", collegeId);
        setIsLoading(true);

        // ✅ 1. Admission section (hero + steps)
        const admissionRes = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/sections?college_id=${collegeId}&section_name=Admission`
        );
        const admissionJson = await admissionRes.json();
        console.log("📦 [AdmissionApp] Admission response:", admissionJson);

        // ✅ 2. Form fields — same API jo DynamicApplyPage use karta hai
        const formRes = await fetch(
          `https://dynamic-section-api.vercel.app/api/public/college/form?college_id=${collegeId}`
        );
        const formJson = await formRes.json();
        console.log("📦 [AdmissionApp] Form API response:", formJson);

        const admissionContent = admissionJson?.content || {};

        const hero: HeroData = {
          badgeText: admissionContent.heroBadge || "Your Journey Begins Here",
          headingLine1: admissionContent.heroTitle || "Admission Open",
          headingLine2: admissionContent.heroSubtitleLine1 || "For a",
          headingHighlight: admissionContent.heroSubtitleLine2 || "Brighter Future",
          description:
            admissionContent.heroDescription ||
            "We welcome young minds to explore, learn and grow in a nurturing and innovative environment.",
          buttonText: admissionContent.heroButtonText || "Apply Now",
          image: admissionContent.heroImage || "/events/ad1.png",
        };

        const processSteps =
          Array.isArray(admissionContent.steps) && admissionContent.steps.length > 0
            ? admissionContent.steps.map((s: any) => ({
                title: s.title || "",
                desc: s.subtitle || s.desc || "",
              }))
            : [];

        // ✅ formJson.data.fields se fields uthao
        const rawFields = formJson?.data?.fields;
        const formFields: FormFieldFromAPI[] =
          Array.isArray(rawFields) && rawFields.length > 0
            ? rawFields
                .filter((f: any) => f.is_active !== false)
                .map((f: any) => ({
                  id: f.id,
                  field_key: f.field_key,
                  field_label: f.field_label,
                  field_type: f.field_type,
                  field_placeholder: f.field_placeholder || null,
                  field_options: Array.isArray(f.field_options)
                    ? f.field_options
                    : typeof f.field_options === "string"
                    ? (() => {
                        try {
                          return JSON.parse(f.field_options);
                        } catch {
                          return null;
                        }
                      })()
                    : null,
                  is_required: !!f.is_required,
                  is_active: f.is_active !== false,
                  section: f.section || "personal_info",
                  sort_order: f.sort_order || 0,
                }))
                .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
            : [];

        console.log("✅ [AdmissionApp] Form fields loaded:", formFields.length);

        const fetched: AdmissionAppData = { hero, processSteps, formFields };
        cacheSet(CACHE_KEY, fetched);
        setData(fetched);
      } catch (err) {
        console.error("❌ [AdmissionApp] Error:", err);
        setData(null);
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

  useEffect(() => {
    setActiveProcessStep(activeFormStep);
  }, [activeFormStep]);

  // ✅ Loading — shimmer skeleton
  if (!mounted || isLoading || !data) {
    return <AdmissionSkeleton />;
  }

  // ✅ Agar data nahi aaya — kuch nahi
  if (data.formFields.length === 0 && data.processSteps.length === 0) {
    return null;
  }

  const uniqueSections = Array.from(
    new Set(data.formFields.map((f) => f.section || "personal_info"))
  );

  const formSteps: FormStep[] = uniqueSections.map((section, idx) => ({
    id: idx + 1,
    icon: SECTION_ICONS[section] || User,
    title: section.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    desc: "",
    heading: section.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    helper: "",
  }));

  formSteps.push({
    id: formSteps.length + 1,
    icon: Eye,
    title: "Preview & Submit",
    desc: "Review and submit your application",
    heading: "Preview & Submit",
    helper: "Review your details carefully before submitting your application.",
  });

  const TOTAL_STEPS = formSteps.length;
  const currentForm = formSteps.find((s) => s.id === activeFormStep) || formSteps[0];
  const progressPct = Math.round((activeFormStep / TOTAL_STEPS) * 100);

  const currentSectionKey = uniqueSections[activeFormStep - 1];
  const currentFields = currentSectionKey
    ? data.formFields.filter((f) => f.section === currentSectionKey)
    : [];

  const processSteps: ProcessStep[] = data.processSteps.map((s, idx) => ({
    id: idx + 1,
    icon: PROCESS_ICONS[idx % PROCESS_ICONS.length],
    title: s.title,
    desc: s.desc,
  }));

  const goToFormStep = (id: number) => setActiveFormStep(id);
  const handleNext = () => setActiveFormStep((prev) => Math.min(prev + 1, TOTAL_STEPS));

  return (
    <main
      ref={sectionRef}
      className={`${poppins.className} bg-[#FAF9F6] text-[#0B2340] overflow-hidden w-full`}
    >
      {/* ====== HERO SECTION ====== */}
      <section className="relative min-h-[500px] overflow-hidden bg-[#FAF9F6] py-8 px-4 md:py-12 md:px-10 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="bg-[#FAF9F6] p-6 md:p-8 lg:p-12 rounded-3xl">
            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[100px]"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="relative mb-2 w-fit pb-2.5 text-[11px] md:text-[13px] font-semibold tracking-wide text-[#E8CA5E] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-8 after:bg-[#E8CA5E]">
                {data.hero.badgeText}
              </div>
            </div>

            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[200px]"
              }`}
              style={{ transitionDelay: "250ms" }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-extrabold leading-tight text-[#0B2340]">
                {data.hero.headingLine1}
              </h1>
            </div>

            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[200px]"
              }`}
              style={{ transitionDelay: "350ms" }}
            >
              <p className="mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-semibold text-[#0B2340]">
                {data.hero.headingLine2}{" "}
                <span className="text-[#E8CA5E]">{data.hero.headingHighlight}</span>
              </p>
            </div>

            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              <p className="mb-6 md:mb-7 max-w-md text-sm md:text-[15px] leading-relaxed text-[#5B6472]">
                {data.hero.description}
              </p>
            </div>

            <div
              className={`transition-all duration-[800ms] ease-out ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[30px] scale-90"
              }`}
              style={{ transitionDelay: "550ms" }}
            >
              <button
                type="button"
                className="flex w-fit items-center gap-2 rounded-full bg-[#E8CA5E] px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-[15px] font-bold text-[#0B0F19] shadow-lg shadow-[#E8CA5E]/30 transition-all hover:-translate-y-0.5 hover:bg-[#d4b84a] hover:shadow-xl cursor-pointer"
              >
                {data.hero.buttonText}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {data.hero.image && (
            <div
              className={`relative h-[220px] sm:h-[280px] md:h-[350px] lg:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-[1200ms] ease-out cursor-pointer group ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[200px]"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <Image
                src={data.hero.image}
                alt="Admission"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340]/20 via-transparent to-transparent" />
            </div>
          )}
        </div>
      </section>

      {/* ====== PROCESS SECTION ====== */}
      {processSteps.length > 0 && (
        <section
          ref={processRef}
          className="px-4 md:px-6 pb-12 md:pb-16 pt-12 md:pt-20 text-center bg-[#FAF9F6] overflow-hidden w-full"
        >
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[200px]"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="mb-2 text-[12px] md:text-[13px] font-bold tracking-wide text-[#E8CA5E]">
              How to Apply
            </p>
          </div>
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[300px]"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <h2 className="mb-8 md:mb-14 text-xl md:text-2xl lg:text-[28px] font-extrabold text-[#0B2340]">
              Application Process
            </h2>
          </div>

          <div className="grid grid-cols-2 md:flex md:flex-nowrap md:justify-between gap-4 md:gap-0 relative max-w-5xl mx-auto">
            <div className="absolute left-[10%] right-[10%] top-8 h-0.5 bg-[#F2F4F7] hidden md:block" />
            <div
              className="absolute left-[10%] top-8 h-0.5 bg-gradient-to-r from-[#E8CA5E] to-[#f8d45a] transition-all duration-700 ease-out hidden md:block"
              style={{
                width: `${((activeProcessStep - 1) / Math.max(processSteps.length - 1, 1)) * 80}%`,
              }}
            />

            {processSteps.map((step, index) => {
              const isDone = step.id < activeProcessStep;
              const isActive = step.id === activeProcessStep;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setActiveProcessStep(step.id);
                    goToFormStep(step.id);
                  }}
                  className={`relative z-10 flex-1 px-1 cursor-pointer transition-all duration-[700ms] ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[60px]"
                  }`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                >
                  <div
                    className={`mx-auto mb-2 md:mb-4 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border shadow-[0_4px_14px_rgba(11,35,64,0.08)] transition-all duration-500 ${
                      isActive
                        ? "border-[#E8CA5E] bg-[#E8CA5E] text-[#0B0F19] scale-110 shadow-lg shadow-[#E8CA5E]/30"
                        : isDone
                        ? "border-[#E8CA5E] bg-[#E8CA5E] text-[#0B0F19]"
                        : "border-[#F2F4F7] bg-white text-[#0B2340]"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4 md:h-6 md:w-6" strokeWidth={2.5} />
                    ) : (
                      <Icon className="h-4 w-4 md:h-6 md:w-6" strokeWidth={2} />
                    )}
                  </div>
                  <div className="mb-0.5 md:mb-1.5 text-[11px] md:text-[13px] font-extrabold text-[#E8CA5E]">
                    0{step.id}
                  </div>
                  <div
                    className={`mb-0.5 md:mb-1 text-[11px] md:text-[15px] font-bold transition-colors duration-300 ${
                      isActive ? "text-[#E8CA5E]" : "text-[#0B2340]"
                    }`}
                  >
                    {step.title}
                  </div>
                  <p className="hidden md:block mx-auto max-w-[150px] text-[12.5px] leading-relaxed text-[#5B6472]">
                    {step.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ====== FORM SECTION ====== */}
      {data.formFields.length > 0 && (
        <section ref={formRef} className="w-full max-w-none px-0 pb-16 md:pb-20 overflow-hidden">
          <div
            className={`flex flex-col overflow-hidden border-y border-[#F2F4F7] bg-white shadow-[0_20px_50px_rgba(11,35,64,0.08)] transition-all duration-[1000ms] ease-out md:flex-row ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[80px]"
            }`}
            style={{ transitionDelay: "1300ms" }}
          >
            <aside className="w-full shrink-0 bg-[#0B0F19] px-5 py-6 md:px-7 md:py-9 text-white md:w-72">
              <h3 className="mb-1 text-base md:text-lg font-extrabold text-white">Application Form</h3>
              <p className="mb-5 md:mb-7 text-[11px] md:text-[12.5px] text-[#9CA3AF]">
                Fill in the details step by step
              </p>

              <ul className="relative">
                <li className="absolute bottom-1.5 left-4 top-1.5 w-0.5 bg-white/10" />
                {formSteps.map((step) => {
                  const isActive = step.id === activeFormStep;
                  const isCompleted = step.id < activeFormStep;
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => goToFormStep(step.id)}
                        className="relative flex w-full items-start gap-3 md:gap-4 py-2.5 md:py-3.5 text-left cursor-pointer group"
                      >
                        <span
                          className={`z-10 flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] md:text-[13px] font-bold transition-all duration-300 ${
                            isActive
                              ? "border-[#E8CA5E] bg-[#E8CA5E] text-[#0B0F19] scale-110"
                              : isCompleted
                              ? "border-[#E8CA5E] bg-[#E8CA5E] text-[#0B0F19]"
                              : "border-white/15 bg-white/10 text-[#9CA3AF] group-hover:border-white/30"
                          }`}
                        >
                          {isCompleted ? <Check className="h-3 w-3 md:h-4 md:w-4" /> : step.id}
                        </span>
                        <span>
                          <span
                            className={`block text-[12px] md:text-[14.5px] font-bold transition-colors duration-300 ${
                              isActive ? "text-[#E8CA5E]" : "text-white group-hover:text-[#E8CA5E]/80"
                            }`}
                          >
                            {step.title}
                          </span>
                          {step.desc && (
                            <span className="block text-[10px] md:text-xs text-[#9CA3AF]">{step.desc}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <div className="flex-1 px-4 py-6 md:px-8 md:py-10 lg:px-12">
              <p className="mb-1.5 text-[12px] md:text-[13px] font-bold text-[#E8CA5E]">
                Step {activeFormStep} of {TOTAL_STEPS}
              </p>
              <h4 className="mb-1.5 text-[18px] md:text-[22px] font-extrabold text-[#0B2340]">
                {currentForm.heading}
              </h4>
              <p className="mb-4 md:mb-6 text-xs md:text-sm text-[#5B6472]">{currentForm.helper}</p>

              <div className="mb-6 md:mb-8 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F2F4F7]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E8CA5E] to-[#f8d45a] transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="w-8 md:w-10 text-right text-[11px] md:text-[13px] font-bold text-[#E8CA5E]">
                  {progressPct}%
                </span>
              </div>

              {activeFormStep < TOTAL_STEPS && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5">
                  {currentFields.map((field) => (
                    <DynamicField key={field.id} field={field} />
                  ))}
                </div>
              )}

              {activeFormStep === TOTAL_STEPS && (
                <div className="flex flex-col gap-4 md:gap-5">
                  <div className="rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] p-4 md:p-5">
                    <p className="mb-3 text-sm font-bold text-[#0B2340]">Application summary</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-[#5B6472]">
                      {formSteps.slice(0, -1).map((step) => (
                        <li key={step.id}>✓ {step.title} — completed</li>
                      ))}
                    </ul>
                  </div>
                  <label className="flex items-start gap-3 text-xs md:text-sm text-[#0B2340] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[#F2F4F7] accent-[#E8CA5E] cursor-pointer"
                    />
                    I confirm that all the information provided is accurate and I agree to the school's admission terms and conditions.
                  </label>
                </div>
              )}

              <div className="mt-6 md:mt-8 flex justify-end">
                {activeFormStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 rounded-full bg-[#E8CA5E] px-6 md:px-8 py-2.5 md:py-3.5 text-[13px] md:text-[14.5px] font-bold text-[#0B0F19] shadow-lg shadow-[#E8CA5E]/30 transition-all hover:-translate-y-0.5 hover:bg-[#d4b84a] hover:shadow-xl cursor-pointer"
                  >
                    Save &amp; Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!agreed}
                    className="flex items-center gap-2 rounded-full bg-[#E8CA5E] px-6 md:px-8 py-2.5 md:py-3.5 text-[13px] md:text-[14.5px] font-bold text-[#0B0F19] shadow-lg shadow-[#E8CA5E]/30 transition-all hover:-translate-y-0.5 hover:bg-[#d4b84a] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    Submit Application
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <FAQSection />
    </main>
  );
}

/* ====== Helper Components ====== */

function DynamicField({ field }: { field: FormFieldFromAPI }) {
  const label = (
    <label className="text-[11px] md:text-[13px] font-semibold text-[#0B2340]">
      {field.field_label}
      {field.is_required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClass =
    "rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] px-3 py-2.5 md:px-3.5 md:py-3 text-xs md:text-sm text-[#0B2340] outline-none focus:border-[#E8CA5E] focus:bg-white focus:ring-2 focus:ring-[#E8CA5E]/20 transition-all";

  if (field.field_type === "textarea") {
    return (
      <div className="flex flex-col gap-1.5 md:gap-2 md:col-span-2">
        {label}
        <textarea
          placeholder={field.field_placeholder || ""}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>
    );
  }

  if (field.field_type === "select") {
    const options = Array.isArray(field.field_options) ? field.field_options : [];
    return (
      <div className="flex flex-col gap-1.5 md:gap-2">
        {label}
        <select className={inputClass}>
          <option value="">Select {field.field_label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.field_type === "radio") {
    const options = Array.isArray(field.field_options) ? field.field_options : [];
    return (
      <div className="flex flex-col gap-1.5 md:gap-2 md:col-span-2">
        {label}
        <div className="flex flex-wrap gap-4">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={field.field_key}
                value={opt}
                className="w-4 h-4 accent-[#E8CA5E] cursor-pointer"
              />
              <span className="text-xs md:text-sm text-[#0B2340]">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (field.field_type === "checkbox") {
    const options = Array.isArray(field.field_options) ? field.field_options : [];
    return (
      <div className="flex flex-col gap-1.5 md:gap-2 md:col-span-2">
        {label}
        <div className="flex flex-wrap gap-4">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                value={opt}
                className="w-4 h-4 rounded accent-[#E8CA5E] cursor-pointer"
              />
              <span className="text-xs md:text-sm text-[#0B2340]">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (field.field_type === "file") {
    return (
      <div className="flex flex-col gap-1.5 md:gap-2">
        {label}
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 md:gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#FAF9F6] px-4 py-4 md:py-6 text-center transition-colors hover:border-[#E8CA5E] hover:bg-white">
          <UploadCloud className="h-5 w-5 md:h-6 md:w-6 text-[#E8CA5E]" />
          <span className="text-[10px] md:text-xs font-semibold text-[#0B2340]">
            Click to upload
          </span>
          <span className="flex items-center gap-1 text-[10px] md:text-[11px] text-[#5B6472]">
            <FileIcon className="h-3 w-3" />
            {field.field_placeholder || "PDF, JPG, PNG"}
          </span>
          <input type="file" className="hidden" />
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 md:gap-2">
      {label}
      <input
        type={
          field.field_type === "email"
            ? "email"
            : field.field_type === "tel"
            ? "tel"
            : field.field_type === "number"
            ? "number"
            : field.field_type === "date"
            ? "date"
            : "text"
        }
        placeholder={field.field_placeholder || ""}
        className={inputClass}
      />
    </div>
  );
}