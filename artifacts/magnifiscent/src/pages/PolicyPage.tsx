import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPolicyPages } from "@/data/liveData";
import type { PolicyPages } from "@/data/liveData";

type PolicyKey = keyof PolicyPages;

interface Props {
  pageKey: PolicyKey;
}

export default function PolicyPage({ pageKey }: Props) {
  const pages = getPolicyPages();
  const page = pages[pageKey];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* Banner */}
      <div className="bg-gray-50 border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Legal & Info</p>
          <h1
            className="font-bold text-3xl md:text-4xl uppercase tracking-wide"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {page.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <div
          className="prose-policy text-gray-700 text-sm leading-relaxed"
          style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: "1.9" }}
        >
          {page.content}
        </div>
      </section>

      <Footer />
    </div>
  );
}
