/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  ArrowRight,
  ChevronRight,
  Clock,
  Globe,
 
  MessageCircle,
  Home,
  Calendar,
  Users
} from "lucide-react";
import { useEffect, useRef } from "react";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

const contactInfo = [
  {
    id: 1,
    icon: MapPin,
    title: "Visit Us",
    detail: "123 Education Street, Lahore, Pakistan",
    subDetail: "Located in the heart of the city",
    fullDescription: "Come visit our beautiful campus and see the Greenfield difference in person. Our friendly staff will give you a personalized tour of our facilities.",
    color: "text-[#E8871E]",
    bgColor: "bg-[#E8871E]",
    borderColor: "border-[#E8871E]",
    bgLight: "bg-[#E8871E]/10",
    action: "Get Directions",
    link: "https://maps.google.com",
    hours: "Mon - Fri: 8:00 AM - 4:00 PM",
    email: "visit@greenfieldschool.edu.pk",
    phone: "+92 300 1234567",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217618.56816650718!2d74.258163!3d31.52037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000",
  },
  {
    id: 2,
    icon: Phone,
    title: "Call Us",
    detail: "+92 300 1234567",
    subDetail: "Mon - Fri: 8:00 AM - 4:00 PM",
    fullDescription: "Our friendly admissions team is ready to answer all your questions about admissions, programs, and school life. Call us during business hours.",
    color: "text-[#2E9B5C]",
    bgColor: "bg-[#2E9B5C]",
    borderColor: "border-[#2E9B5C]",
    bgLight: "bg-[#2E9B5C]/10",
    action: "Call Now",
    link: "tel:+923001234567",
    hours: "Mon - Fri: 8:00 AM - 4:00 PM",
    email: "call@greenfieldschool.edu.pk",
    phone: "+92 300 1234567",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217618.56816650718!2d74.258163!3d31.52037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000",
  },
  {
    id: 3,
    icon: Mail,
    title: "Email Us",
    detail: "admissions@greenfieldschool.edu.pk",
    subDetail: "We respond within 24 hours",
    fullDescription: "Send us an email and we'll get back to you as soon as possible. For urgent matters, please call us directly.",
    color: "text-[#0B2340]",
    bgColor: "bg-[#0B2340]",
    borderColor: "border-[#0B2340]",
    bgLight: "bg-[#0B2340]/10",
    action: "Send Email",
    link: "mailto:admissions@greenfieldschool.edu.pk",
    hours: "24/7 Email Support",
    email: "admissions@greenfieldschool.edu.pk",
    phone: "+92 300 1234567",
    mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217618.56816650718!2d74.258163!3d31.52037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000",
  },
];

const quickInfo = [
  { icon: Clock, label: "Office Hours", value: "Mon-Fri 8AM-4PM" },
  { icon: Calendar, label: "Academic Year", value: "2026-2027" },
  { icon: Users, label: "Total Students", value: "1500+" },
  { icon: Home, label: "Campus Area", value: "10 Acres" },
];


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
  const [selectedContact, setSelectedContact] = useState(contactInfo[0]);
  const sectionRef = useRef<HTMLElement>(null);

  // Hero Section Animation
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

  const handleSelectContact = (contact: typeof contactInfo[0]) => {
    setSelectedContact(contact);
  };

  const SelectedIcon = selectedContact.icon;

  return (
    <section ref={sectionRef} className={`${poppins.className} w-full bg-[#FAF9F6] overflow-hidden`}>
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[85vh] overflow-hidden">
        <div
          className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
            isVisible ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Contact us"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-b from-[#0B2340]/60 via-[#0B2340]/70 to-[#0B2340]/80 transition-all duration-[1000ms] ease-out ${
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
              <p className="inline-block text-sm font-bold uppercase tracking-[0.25em] text-[#E8871E] mb-4 px-4 py-1.5 border border-[#E8871E]/30 rounded-full bg-[#E8871E]/10 backdrop-blur-sm">
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
                Contact <span className="text-[#E8871E]">Us</span>
              </h1>
            </div>

            <div
              className={`flex justify-center transition-all duration-[800ms] ease-out ${
                isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <div className="h-[3px] w-20 bg-gradient-to-r from-transparent via-[#E8871E] to-transparent rounded-full my-4" />
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

      {/* 2. MAIN CONTENT - Sidebar + Details */}
      <div className="max-w-6xl mx-auto px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT SIDEBAR - Contact List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,35,64,0.06)] p-4 md:p-6 sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#5B6472] mb-4 px-2">
                Contact Options
              </h3>
              
              <div className="space-y-2">
                {contactInfo.map((contact) => {
                  const Icon = contact.icon;
                  const isActive = selectedContact.id === contact.id;
                  return (
                    <button
                      key={contact.id}
                      onClick={() => handleSelectContact(contact)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                        isActive
                          ? `${contact.bgLight} ${contact.color} border ${contact.borderColor}`
                          : "hover:bg-[#F2F4F7] text-[#5B6472]"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full ${isActive ? contact.bgLight : 'bg-[#F2F4F7]'} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${isActive ? contact.color : 'text-[#5B6472]'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isActive ? 'text-[#0B2340]' : 'text-[#5B6472]'}`}>
                          {contact.title}
                        </p>
                        <p className="text-xs text-[#5B6472] truncate">
                          {contact.detail}
                        </p>
                      </div>
                      {isActive && (
                        <div className={`w-1.5 h-8 rounded-full ${contact.bgColor}`} />
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
                      <div key={index} className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#F2F4F7] transition-colors">
                        <div className="w-8 h-8 rounded-full bg-[#F2F4F7] flex items-center justify-center">
                          <InfoIcon className="w-4 h-4 text-[#5B6472]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#5B6472]">{info.label}</p>
                          <p className="text-sm font-semibold text-[#0B2340]">{info.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            
            </div>
          </div>

          {/* RIGHT DETAILS PANEL */}
          <div className="lg:col-span-3">
            {/* Selected Contact Details */}
            <div
              className={`transition-all duration-[700ms] ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,35,64,0.06)] p-6 md:p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${selectedContact.bgLight} flex items-center justify-center flex-shrink-0`}>
                    <SelectedIcon className={`w-8 h-8 ${selectedContact.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#0B2340]">
                      {selectedContact.title}
                    </h2>
                    <p className={`text-sm font-medium ${selectedContact.color}`}>
                      {selectedContact.subDetail}
                    </p>
                  </div>
                </div>

                <p className="text-[#5B6472] text-base leading-relaxed mb-6">
                  {selectedContact.fullDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#FAF9F6] rounded-xl p-4">
                    <p className="text-xs text-[#5B6472] font-medium uppercase tracking-[0.1em]">Phone</p>
                    <a href={`tel:${selectedContact.phone}`} className={`text-sm font-semibold ${selectedContact.color} hover:underline`}>
                      {selectedContact.phone}
                    </a>
                  </div>
                  <div className="bg-[#FAF9F6] rounded-xl p-4">
                    <p className="text-xs text-[#5B6472] font-medium uppercase tracking-[0.1em]">Email</p>
                    <a href={`mailto:${selectedContact.email}`} className={`text-sm font-semibold ${selectedContact.color} hover:underline`}>
                      {selectedContact.email}
                    </a>
                  </div>
                  <div className="bg-[#FAF9F6] rounded-xl p-4 sm:col-span-2">
                    <p className="text-xs text-[#5B6472] font-medium uppercase tracking-[0.1em]">Business Hours</p>
                    <p className="text-sm font-semibold text-[#0B2340]">{selectedContact.hours}</p>
                  </div>
                </div>

                <a
                  href={selectedContact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold ${selectedContact.bgColor} transition-all hover:scale-105 hover:shadow-lg`}
                >
                  {selectedContact.action}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Google Map */}
            <div
              className={`transition-all duration-[700ms] ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(11,35,64,0.06)] p-4 md:p-6">
                <h3 className="text-lg font-bold text-[#0B2340] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#E8871E]" />
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
          </div>
        </div>

        {/* 3. CONTACT FORM WITH IMAGE */}
        <div className="mt-20">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#E8871E] mb-2">
              Send a Message
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B2340]">
              We'd Love to Hear From You
            </h2>
            <p className="text-[#5B6472] mt-3 max-w-2xl mx-auto text-base">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {/* Left Side - Image */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-xl min-h-[300px] lg:min-h-[500px]">
              <Image
                src="/contact.jpg"
                alt="Contact us"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2340]/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white mb-1">Get in Touch</h3>
                <p className="text-white/70 text-sm">We're here to help you</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(11,35,64,0.06)] hover:shadow-[0_8px_30px_rgba(11,35,64,0.12)] transition-all duration-300">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-[#0B2340] mb-2">
                        Your Name <span className="text-[#E8871E]">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] text-[#0B2340] placeholder:text-[#5B6472]/60 focus:outline-none focus:border-[#E8871E] focus:ring-2 focus:ring-[#E8871E]/20 transition-all duration-300 text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#0B2340] mb-2">
                        Email Address <span className="text-[#E8871E]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] text-[#0B2340] placeholder:text-[#5B6472]/60 focus:outline-none focus:border-[#E8871E] focus:ring-2 focus:ring-[#E8871E]/20 transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-[#0B2340] mb-2">
                      Subject <span className="text-[#E8871E]">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Enter subject"
                      className="w-full px-4 py-3 rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] text-[#0B2340] placeholder:text-[#5B6472]/60 focus:outline-none focus:border-[#E8871E] focus:ring-2 focus:ring-[#E8871E]/20 transition-all duration-300 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#0B2340] mb-2">
                      Message <span className="text-[#E8871E]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 rounded-xl border border-[#F2F4F7] bg-[#FAF9F6] text-[#0B2340] placeholder:text-[#5B6472]/60 focus:outline-none focus:border-[#E8871E] focus:ring-2 focus:ring-[#E8871E]/20 transition-all duration-300 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#2E9B5C] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#2E9B5C]/30 transition-all hover:-translate-y-0.5 hover:bg-[#278a51] hover:shadow-xl hover:shadow-[#2E9B5C]/40 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
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
                    <div className="text-center text-[#2E9B5C] text-sm font-semibold animate-in fade-in duration-300">
                      ✓ Your message has been sent successfully. We'll get back to you soon!
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}