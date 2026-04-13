import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { api, type ApiBlogPost } from "@/lib/api";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function BlogList() {
  const [, navigate] = useLocation();
  const [posts, setPosts] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useSeoMeta({
    title: "Perfume Blog — Tips, Guides & Fragrance News | MagnifiScent Pakistan",
    description: "Explore the MagnifiScent blog for perfume guides, fragrance tips, top picks for Pakistan, and expert advice on finding your perfect scent.",
    ogType: "website",
  });

  useEffect(() => {
    api.blog.list()
      .then((res) => { if (res.success) setPosts(res.posts); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>

      {/* Hero strip */}
      <section className="bg-gradient-to-br from-amber-50 to-stone-100 border-b border-stone-200 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-3">
            <BookOpen size={32} className="text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Fragrance Guides & Perfume Tips
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Expert advice on choosing, wearing, and enjoying perfume in Pakistan — from the team at MagnifiScent.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 p-6 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-1/3 mb-3" />
                <div className="h-6 bg-stone-200 rounded w-4/5 mb-2" />
                <div className="h-4 bg-stone-100 rounded w-full mb-1" />
                <div className="h-4 bg-stone-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No articles yet</p>
            <p className="text-sm">Check back soon for fragrance guides and tips.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group bg-white rounded-xl border border-stone-200 p-6 cursor-pointer hover:shadow-md hover:border-amber-300 transition-all duration-200"
              >
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    loading="lazy"
                  />
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar size={12} />
                  <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
                  Read more <ArrowRight size={12} />
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
