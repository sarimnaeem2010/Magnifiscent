import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { useSeoMeta } from "@/hooks/useSeoMeta";

export default function Contact() {
  useSeoMeta({
    title: "Contact MagnifiScent – Perfume Store Pakistan",
    description:
      "Get in touch with MagnifiScent. Questions about orders, perfumes, or Cash on Delivery? We're here to help. Contact us via email, phone, or social media.",
  });

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Banner */}
      <div className="bg-gray-50 border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Get in Touch</p>
          <h1 className="font-bold text-3xl md:text-4xl uppercase tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
            Contact Us
          </h1>
          <p className="text-gray-500 text-sm mt-3">We'd love to hear from you. We're here to help.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">

          {/* Contact Info */}
          <div>
            <h2 className="section-title mb-6">Let's Connect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Whether you have a question about our fragrances, an order, or just want to talk scents —
              our team is always happy to help.
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: Mail, label: "Email", value: "hello@magnifiscent.com" },
                { icon: Phone, label: "Phone", value: "+1 (800) 123-4567" },
                { icon: MapPin, label: "Address", value: "123 Fragrance Ave, New York, NY 10001" },
                { icon: Clock, label: "Hours", value: "Mon–Sat: 9am – 6pm EST" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm text-gray-800 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white text-gray-600 transition-all">
                  <Instagram size={16} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white text-gray-600 transition-all">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:bg-black hover:border-black hover:text-white text-gray-600 transition-all text-xs font-bold">
                  TK
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="font-bold text-xl uppercase tracking-wide mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  Message Sent!
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black underline underline-offset-2 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="section-title mb-6">Send a Message</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
                      placeholder="john@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300"
                    placeholder="Order enquiry, product question…"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-300 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold uppercase tracking-widest text-xs py-4 hover:bg-gray-800 transition-colors border-none cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
