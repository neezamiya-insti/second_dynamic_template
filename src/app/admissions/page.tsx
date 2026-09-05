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
  weight: ["400", "500", "600", "700", "800"] 
});

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

const PROCESS_STEPS: ProcessStep[] = [
  { id: 1, icon: ClipboardList, title: "Choose Program", desc: "Select the program you want to apply for" },
  { id: 2, icon: FileText, title: "Fill Application", desc: "Complete the online application form" },
  { id: 3, icon: UploadCloud, title: "Upload Documents", desc: "Upload required documents digitally" },
  { id: 4, icon: CreditCard, title: "Pay Application Fee", desc: "Pay the application fee securely online" },
  { id: 5, icon: CheckCircle2, title: "Submit Application", desc: "Review and submit your application form" },
];

const FORM_STEPS: FormStep[] = [
  {
    id: 1,
    icon: User,
    title: "Personal Details",
    desc: "Basic information about applicant",
    heading: "Personal Details",
    helper: "Please provide basic information about the applicant.",
  },
  {
    id: 2,
    icon: GraduationCap,
    title: "Academic Details",
    desc: "Previous academic information",
    heading: "Academic Details",
    helper: "Tell us about the applicant's previous academic background.",
  },
  {
    id: 3,
    icon: Users,
    title: "Guardian Details",
    desc: "Information about guardian/parents",
    heading: "Guardian Details",
    helper: "Provide information about the guardian or parents.",
  },
  {
    id: 4,
    icon: FileUp,
    title: "Document Upload",
    desc: "Upload required documents",
    heading: "Document Upload",
    helper: "Upload the required documents digitally.",
  },
  {
    id: 5,
    icon: Eye,
    title: "Preview & Submit",
    desc: "Review and submit your application",
    heading: "Preview & Submit",
    helper: "Review your details carefully before submitting your application.",
  },
];

const TOTAL_STEPS = FORM_STEPS.length;

export default function AdmissionApplication() {
  const [activeFormStep, setActiveFormStep] = useState(1);
  const [activeProcessStep, setActiveProcessStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    setActiveProcessStep(activeFormStep);
  }, [activeFormStep]);

  const currentForm = FORM_STEPS.find((s) => s.id === activeFormStep)!;
  const progressPct = Math.round((activeFormStep / TOTAL_STEPS) * 100);

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
          {/* Left Content */}
          <div className="bg-[#FAF9F6] p-6 md:p-8 lg:p-12 rounded-3xl">
            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-[100px]"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="relative mb-2 w-fit pb-2.5 text-[11px] md:text-[13px] font-semibold tracking-wide text-[#E8CA5E] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-8 after:bg-[#E8CA5E]">
                Your Journey Begins Here
              </div>
            </div>

            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-[200px]"
              }`}
              style={{ transitionDelay: "250ms" }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-extrabold leading-tight text-[#0B2340]">
                Admission Open
              </h1>
            </div>

            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-[200px]"
              }`}
              style={{ transitionDelay: "350ms" }}
            >
              <p className="mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl font-semibold text-[#0B2340]">
                For a <span className="text-[#E8CA5E]">Brighter Future</span>
              </p>
            </div>

            <div
              className={`transition-all duration-[1000ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[50px]"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              <p className="mb-6 md:mb-7 max-w-md text-sm md:text-[15px] leading-relaxed text-[#5B6472]">
                We welcome young minds to explore, learn and grow in a nurturing and
                innovative environment.
              </p>
            </div>

            <div
              className={`transition-all duration-[800ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-[30px] scale-90"
              }`}
              style={{ transitionDelay: "550ms" }}
            >
              <button
                type="button"
                className="flex w-fit items-center gap-2 rounded-full bg-[#E8CA5E] px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-[15px] font-bold text-[#0B0F19] shadow-lg shadow-[#E8CA5E]/30 transition-all hover:-translate-y-0.5 hover:bg-[#d4b84a] hover:shadow-xl cursor-pointer"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div
            className={`relative h-[220px] sm:h-[280px] md:h-[350px] lg:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-[1200ms] ease-out cursor-pointer group ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-[200px]"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Image
              src="/events/ad1.png"
              alt="Student writing in a classroom"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340]/20 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ====== PROCESS SECTION ====== */}
      <section
        ref={processRef}
        className="px-4 md:px-6 pb-12 md:pb-16 pt-12 md:pt-20 text-center bg-[#FAF9F6] overflow-hidden w-full"
      >
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-[200px]"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p className="mb-2 text-[12px] md:text-[13px] font-bold tracking-wide text-[#E8CA5E]">
            How to Apply
          </p>
        </div>
        <div
          className={`transition-all duration-[1000ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-[300px]"
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
              width: `${((activeProcessStep - 1) / (PROCESS_STEPS.length - 1)) * 80}%`,
            }}
          />

          {PROCESS_STEPS.map((step, index) => {
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
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-[60px]"
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
                <div
                  className={`mb-0.5 md:mb-1.5 text-[11px] md:text-[13px] font-extrabold transition-colors duration-300 ${
                    isActive ? "text-[#E8CA5E]" : "text-[#E8CA5E]"
                  }`}
                >
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

      {/* ====== FORM SECTION ====== */}
      <section
        ref={formRef}
        className="w-full max-w-none px-0 pb-16 md:pb-20 overflow-hidden"
      >
        <div
          className={`flex flex-col overflow-hidden border-y border-[#F2F4F7] bg-white shadow-[0_20px_50px_rgba(11,35,64,0.08)] transition-all duration-[1000ms] ease-out md:flex-row ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[80px]"
          }`}
          style={{ transitionDelay: "1300ms" }}
        >
          {/* Sidebar */}
          <aside className="w-full shrink-0 bg-[#0B0F19] px-5 py-6 md:px-7 md:py-9 text-white md:w-72">
            <h3 className="mb-1 text-base md:text-lg font-extrabold text-white">Application Form</h3>
            <p className="mb-5 md:mb-7 text-[11px] md:text-[12.5px] text-[#9CA3AF]">
              Fill in the details step by step
            </p>

            <ul className="relative">
              <li className="absolute bottom-1.5 left-4 top-1.5 w-0.5 bg-white/10" />
              {FORM_STEPS.map((step) => {
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
                        <span className="block text-[10px] md:text-xs text-[#9CA3AF]">{step.desc}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Main Form Panel */}
          <div className="flex-1 px-4 py-6 md:px-8 md:py-10 lg:px-12">
            <p className="mb-1.5 text-[12px] md:text-[13px] font-bold text-[#E8CA5E]">
              Step {activeFormStep} of {TOTAL_STEPS}
            </p>
            <h4 className="mb-1.5 text-[18px] md:text-[22px] font-extrabold text-[#0B2340]">{currentForm.heading}</h4>
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

            {/* STEP 1 — Personal Details */}
            {activeFormStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5">
                <Field label="Full Name of Applicant" placeholder="Enter full name" />
                <Field label="Date of Birth" placeholder="DD / MM / YYYY" />
                <SelectField label="Gender" options={["Select gender", "Male", "Female", "Other"]} />
                <SelectField label="Nationality" options={["Select nationality", "Pakistani", "Other"]} />
                <SelectField label="Religion" options={["Select religion", "Islam", "Other"]} />
                <SelectField label="Category" options={["Select category", "General", "Reserved"]} />
                <Field label="Contact Number" placeholder="Enter contact number" />
                <Field label="Email Address" placeholder="Enter email address" type="email" />
                <TextareaField label="Present Address" placeholder="Enter complete address" full />
              </div>
            )}

            {/* STEP 2 — Academic Details */}
            {activeFormStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5">
                <Field label="Previous School Name" placeholder="Enter previous school name" />
                <Field label="Last Class / Grade Attended" placeholder="e.g. Grade 8" />
                <SelectField
                  label="Board / Curriculum"
                  options={["Select board", "Cambridge (O/A Level)", "Federal Board", "Matric Board", "IB"]}
                />
                <Field label="Percentage / GPA Obtained" placeholder="e.g. 88% or 3.8 GPA" />
                <Field label="Year of Passing" placeholder="e.g. 2025" />
                <SelectField
                  label="Applying for Class / Grade"
                  options={["Select class", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"]}
                />
                <SelectField
                  label="Preferred Subject / Stream"
                  options={["Select stream", "Science", "Commerce", "Arts / Humanities"]}
                />
                <TextareaField
                  label="Extra-Curricular Achievements"
                  placeholder="List any awards, sports, or activities"
                  full
                />
              </div>
            )}

            {/* STEP 3 — Guardian Details */}
            {activeFormStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5">
                <Field label="Father's Name" placeholder="Enter father's full name" />
                <Field label="Mother's Name" placeholder="Enter mother's full name" />
                <Field label="Guardian's Occupation" placeholder="Enter occupation" />
                <SelectField
                  label="Relationship with Applicant"
                  options={["Select relationship", "Father", "Mother", "Legal Guardian", "Other"]}
                />
                <Field label="Guardian Contact Number" placeholder="Enter contact number" />
                <Field label="Guardian Email Address" placeholder="Enter email address" type="email" />
                <SelectField
                  label="Annual Household Income"
                  options={["Select range", "Below 5 Lac", "5–10 Lac", "10–20 Lac", "Above 20 Lac"]}
                />
                <Field label="CNIC / National ID Number" placeholder="Enter CNIC number" />
                <TextareaField label="Guardian Address" placeholder="Enter complete address" full />
              </div>
            )}

            {/* STEP 4 — Document Upload */}
            {activeFormStep === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <UploadField label="Applicant Photograph" hint="JPG or PNG, max 2MB" />
                <UploadField label="Birth Certificate / B-Form" hint="PDF or image, max 5MB" />
                <UploadField label="Previous School Leaving Certificate" hint="PDF, max 5MB" />
                <UploadField label="Latest Report Card / Transcript" hint="PDF, max 5MB" />
                <UploadField label="Guardian CNIC (Front & Back)" hint="PDF or image, max 5MB" />
                <UploadField label="Passport-size Photographs" hint="JPG or PNG, max 2MB" />
              </div>
            )}

            {/* STEP 5 — Preview & Submit */}
            {activeFormStep === 5 && (
              <div className="flex flex-col gap-4 md:gap-5">
                <div className="rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] p-4 md:p-5">
                  <p className="mb-3 text-sm font-bold text-[#0B2340]">
                    Application summary
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-[#5B6472]">
                    <li>✓ Personal details — completed</li>
                    <li>✓ Academic details — completed</li>
                    <li>✓ Guardian details — completed</li>
                    <li>✓ Document upload — completed</li>
                  </ul>
                </div>
                <label className="flex items-start gap-3 text-xs md:text-sm text-[#0B2340] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#F2F4F7] accent-[#E8CA5E] cursor-pointer"
                  />
                  I confirm that all the information provided is accurate and I agree
                  to the school's admission terms and conditions.
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

      <FAQSection />
    </main>
  );
}

/* ====== Helper Components ====== */

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 md:gap-2">
      <label className="text-[11px] md:text-[13px] font-semibold text-[#0B2340]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] px-3 py-2.5 md:px-3.5 md:py-3 text-xs md:text-sm text-[#0B2340] outline-none focus:border-[#E8CA5E] focus:bg-white focus:ring-2 focus:ring-[#E8CA5E]/20 transition-all"
      />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5 md:gap-2">
      <label className="text-[11px] md:text-[13px] font-semibold text-[#0B2340]">{label}</label>
      <select className="rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] px-3 py-2.5 md:px-3.5 md:py-3 text-xs md:text-sm text-[#0B2340] outline-none focus:border-[#E8CA5E] focus:bg-white focus:ring-2 focus:ring-[#E8CA5E]/20 transition-all">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({
  label,
  placeholder,
  full = false,
}: {
  label: string;
  placeholder: string;
  full?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 md:gap-2 ${full ? "md:col-span-2" : ""}`}>
      <label className="text-[11px] md:text-[13px] font-semibold text-[#0B2340]">{label}</label>
      <textarea
        placeholder={placeholder}
        rows={3}
        className="rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] px-3 py-2.5 md:px-3.5 md:py-3 text-xs md:text-sm text-[#0B2340] outline-none focus:border-[#E8CA5E] focus:bg-white focus:ring-2 focus:ring-[#E8CA5E]/20 transition-all resize-none"
      />
    </div>
  );
}

function UploadField({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex flex-col gap-1.5 md:gap-2">
      <label className="text-[11px] md:text-[13px] font-semibold text-[#0B2340]">{label}</label>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 md:gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#FAF9F6] px-4 py-4 md:py-6 text-center transition-colors hover:border-[#E8CA5E] hover:bg-white">
        <UploadCloud className="h-5 w-5 md:h-6 md:w-6 text-[#E8CA5E]" />
        <span className="text-[10px] md:text-xs font-semibold text-[#0B2340]">
          Click to upload or drag &amp; drop
        </span>
        <span className="flex items-center gap-1 text-[10px] md:text-[11px] text-[#5B6472]">
          <FileIcon className="h-3 w-3" /> {hint}
        </span>
        <input type="file" className="hidden" />
      </label>
    </div>
  );
}