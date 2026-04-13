import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLocation } from "wouter";
import { useSeoMeta } from "@/hooks/useSeoMeta";

export default function About() {
  const [, navigate] = useLocation();

  useSeoMeta({
    title: "About MagnifiScent – Premium Perfume Brand Pakistan",
    description:
      "Learn the story behind MagnifiScent — Pakistan's premium Eau de Parfum brand. Crafted for lasting impressions, loved across Karachi, Lahore & Islamabad.",
  });

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Banner */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <img src="/story-bg.png" alt="About MagnifiScent" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3 opacity-80">Our Story</p>
          <h1 className="font-bold text-3xl md:text-5xl uppercase tracking-widest" style={{ fontFamily: "Georgia, serif" }}>
            About Us
          </h1>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Born from Passion. Crafted for You.</h2>
          <p className="text-gray-600 text-base leading-relaxed mt-4 max-w-2xl mx-auto">
            MagnifiScent was founded with a single belief: everyone deserves a fragrance that tells their story.
            Our perfumes are crafted with the finest ingredients sourced from around the world — from the rose fields
            of Morocco to the oud forests of the Middle East.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <img
              src="/hero-bg.png"
              alt="Our craft"
              className="w-full h-[350px] object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-xl uppercase tracking-wide mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Our Mission
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We believe fragrance is the most personal luxury. It speaks before you do, and lingers after you leave.
              That's why every MagnifiScent creation undergoes months of refinement before it reaches you.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Our team of master perfumers brings decades of experience, blending Eastern and Western olfactory
              traditions into a collection that is uniquely modern yet timelessly classic.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              From bold masculine statements to delicate feminine florals — every bottle is a journey.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-gray-100">
          {[
            { icon: "🌹", title: "Finest Ingredients", text: "Ethically sourced from the world's best regions" },
            { icon: "🧪", title: "Artisan Craft", text: "Each fragrance developed by expert perfumers" },
            { icon: "🌍", title: "Global Vision", text: "Inspired by cultures from around the world" },
            { icon: "💎", title: "Premium Quality", text: "Long-lasting Eau de Parfum concentration" },
          ].map((v) => (
            <div key={v.title} className="flex flex-col items-center text-center gap-3">
              <span className="text-4xl">{v.icon}</span>
              <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900">{v.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="font-bold text-xl uppercase tracking-wide mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Discover Your Signature Scent
          </h3>
          <p className="text-gray-600 text-sm mb-6">Explore our full collection of premium perfumes for Men and Women.</p>
          <button
            onClick={() => navigate("/products")}
            className="inline-block bg-black text-white font-bold uppercase tracking-widest text-xs px-10 py-3 hover:bg-gray-800 transition-colors border-none cursor-pointer"
          >
            Shop Collection
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
