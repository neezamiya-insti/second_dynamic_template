"use client";

import React from "react";
import { Poppins } from "next/font/google";
import { 
  Heart, 
  Users, 
  Lightbulb,
  Shield,
  Sparkles,
  GraduationCap
} from "lucide-react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

const coreValues = [
  {
    icon: Heart,
    title: "Integrity",
    description: "We uphold honesty, transparency, and ethical behavior in all our actions.",
    color: "text-[#E8871E]",
    bgColor: "bg-[#E8871E]/10",
  },
  {
    icon: Users,
    title: "Respect",
    description: "We value every individual and foster a culture of mutual respect and dignity.",
    color: "text-[#2E9B5C]",
    bgColor: "bg-[#2E9B5C]/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We encourage creativity, critical thinking, and embracing new ideas.",
    color: "text-[#E8871E]",
    bgColor: "bg-[#E8871E]/10",
  },
  {
    icon: Shield,
    title: "Excellence",
    description: "We strive for the highest standards in academics, character, and achievement.",
    color: "text-[#0B2340]",
    bgColor: "bg-[#0B2340]/10",
  },
  {
    icon: Sparkles,
    title: "Compassion",
    description: "We nurture kindness, empathy, and a sense of social responsibility.",
    color: "text-[#2E9B5C]",
    bgColor: "bg-[#2E9B5C]/10",
  },
  {
    icon: GraduationCap,
    title: "Lifelong Learning",
    description: "We inspire curiosity and a passion for learning that lasts a lifetime.",
    color: "text-[#E8871E]",
    bgColor: "bg-[#E8871E]/10",
  },
];

export default function CoreValues() {
  return (
    <section className={`${poppins.className} w-full`}>
      <div className="text-center mb-14">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8871E] mb-2">
          What We Stand For
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B2340]">
          Our Core Values
        </h2>
        <p className="text-[#5B6472] mt-3 max-w-2xl mx-auto text-base">
          These values guide everything we do at Greenfield School, shaping our 
          culture and defining our commitment to every student.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coreValues.map((value, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
          >
            <div className={`${value.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <value.icon className={`w-7 h-7 ${value.color}`} />
            </div>
            <h3 className="text-xl font-bold text-[#0B2340] mb-2">
              {value.title}
            </h3>
            <p className="text-[#5B6472] text-sm leading-relaxed">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}