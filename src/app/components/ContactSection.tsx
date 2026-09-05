/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Poppins } from "next/font/google";
import { Send } from "lucide-react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  return (
    <section
      ref={sectionRef}
      className={`${poppins.className} w-full bg-[#FAF9F6] pt-8 pb-20 px-6 overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header - Left Aligned */}
        <div className="mb-10">
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[100px]"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8CA5E] mb-2">
              Get In Touch
            </p>
          </div>
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[150px]"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[#0B2340]">
              Contact Us
            </h2>
          </div>
          <div
            className={`transition-all duration-[1000ms] ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[120px]"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <p className="text-[#5B6472] mt-3 max-w-2xl text-base">
              Have questions? We'd love to hear from you. Reach out to us and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        {/* Contact Card - Image Left + Form Right */}
        <div
          className={`bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(11,35,64,0.06)] hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] transition-all duration-300 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[50px]"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Image */}
            <div
              className={`relative min-h-[300px] md:min-h-[500px] overflow-hidden transition-all duration-[1200ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-[100px]"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <img
                src="/contact.png"
                alt="Contact us"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340]/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white mb-1">Get in Touch</h3>
                <p className="text-white/70 text-sm">We're here to help you</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div
              className={`p-6 md:p-8 transition-all duration-[1200ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-[100px]"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
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
    </section>
  );
}