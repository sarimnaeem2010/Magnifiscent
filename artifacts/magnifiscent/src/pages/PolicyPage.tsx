import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DEFAULT_POLICY_PAGES } from "@/data/liveData";
import type { PolicyPages } from "@/data/liveData";
import { api } from "@/lib/api";

type PolicyKey = keyof PolicyPages;

interface Props {
  pageKey: PolicyKey;
}

export default function PolicyPage({ pageKey }: Props) {
  const [page, setPage] = useState(DEFAULT_POLICY_PAGES[pageKey]);

  useEffect(() => {
    api.content.policyPages.getOne(pageKey).then((res) => {
      if (res.success && res.page) {
        setPage({ title: res.page.title, content: res.page.content });
      }
    }).catch(() => {});
  }, [pageKey]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

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
