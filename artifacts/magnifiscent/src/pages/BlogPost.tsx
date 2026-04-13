import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { api, type ApiBlogPost, type ApiProduct } from "@/lib/api";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { Calendar, ArrowLeft, ShoppingBag } from "lucide-react";

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

function renderMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-amber-700 underline">$1</a>')
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-amber-700 underline">$1</a>')
    .replace(/^---+$/gm, "<hr />")
    .replace(/^\|\s*(.+)\s*\|$/gm, (_: string, cells: string) => {
      const tds = cells.split("|").map((c: string) => `<td class="border border-stone-200 px-3 py-1.5 text-sm">${c.trim()}</td>`).join("");
      return `<tr>${tds}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, (m: string) => {
      const rows = m.trim().split("\n").filter((r: string) => r.includes("<tr>"));
      if (rows.length < 2) return m;
      const [header, ...body] = rows;
      const th = header.replace(/<td/g, "<th").replace(/<\/td>/g, "</th>");
      return `<table class="w-full border-collapse my-4"><thead class="bg-stone-100">${th}</thead><tbody>${body.join("")}</tbody></table>`;
    })
    .replace(/^(\d+\.\s+.+)(\n\d+\.\s+.+)*/gm, (m: string) => {
      const items = m.split("\n").filter(Boolean).map((l: string) => `<li>${l.replace(/^\d+\.\s+/, "")}</li>`).join("");
      return `<ol class="list-decimal pl-5 space-y-1 my-2">${items}</ol>`;
    })
    .replace(/^[-*✅🌸💧🚚]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (m: string) => `<ul class="list-disc pl-5 space-y-1 my-2">${m.trim()}</ul>`)
    .replace(/\n{2,}/g, "\n\n")
    .replace(/^(?!<[hoult]|<hr|<tab|<li)(.*\S.*)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}

export function BlogPost() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [post, setPost] = useState<ApiBlogPost | null>(null);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useSeoMeta({
    title: post ? `${post.title} — MagnifiScent Blog` : "Blog — MagnifiScent Pakistan",
    description: post
      ? post.excerpt || `${post.title} — read on the MagnifiScent blog.`
      : "Read perfume guides and fragrance tips on the MagnifiScent blog.",
    ogImage: post?.coverImage || "",
    ogType: "article",
  });

  useEffect(() => {
    if (!params.slug) return;
    setLoading(true);
    setNotFound(false);
    setPost(null);
    api.blog.get(params.slug)
      .then((res) => {
        if (res.success && res.post) {
          setPost(res.post);
          api.products.list()
            .then((pr) => {
              if (pr.success && pr.products) {
                const shuffled = [...pr.products].sort(() => Math.random() - 0.5);
                setRelated(shuffled.slice(0, 4));
              }
            })
            .catch(() => {});
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 bg-stone-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-stone-100 rounded w-1/3 mb-8" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 bg-stone-100 rounded w-full mb-3" />
        ))}
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-bold text-gray-800 mb-3">Article not found</p>
        <button
          onClick={() => navigate("/blog")}
          className="text-amber-700 underline text-sm font-medium"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  const htmlContent = renderMarkdown(post.content);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Back link */}
      <button
        onClick={() => navigate("/blog")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-700 mb-6 transition-colors bg-transparent border-none cursor-pointer p-0"
      >
        <ArrowLeft size={14} /> Back to Blog
      </button>

      {/* Cover image */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-52 md:h-72 object-cover rounded-xl mb-6"
        />
      )}

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <Calendar size={12} />
        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        <span className="mx-1 text-stone-300">·</span>
        <span>MagnifiScent Pakistan</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Content */}
      <article
        className="prose prose-stone prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-amber-700 prose-strong:text-gray-900 max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* CTA divider */}
      <div className="my-10 p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-base font-semibold text-gray-800 mb-1">
          Ready to find your signature scent?
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Shop MagnifiScent's premium Eau de Parfum collection — Cash on Delivery across Pakistan.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors border-none cursor-pointer"
        >
          <ShoppingBag size={15} />
          Shop Now
        </button>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {related.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="bg-white border border-stone-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md hover:border-amber-300 transition-all group"
              >
                {product.img && (
                  <img
                    src={product.img}
                    alt={`${product.name} Eau de Parfum ${product.category === "men" ? "men's" : "women's"} fragrance — MagnifiScent Pakistan`}
                    className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                )}
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                    {product.name}
                  </p>
                  <p className="text-xs text-amber-700 font-bold mt-0.5">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
