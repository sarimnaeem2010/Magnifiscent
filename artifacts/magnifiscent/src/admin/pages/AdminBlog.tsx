import React, { useState, useEffect } from "react";
import { api, type ApiBlogPost } from "@/lib/api";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2 } from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  published: false,
};

export function AdminBlog() {
  const [posts, setPosts] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApiBlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await api.adminBlog.list();
      if (res.success) setPosts(res.posts);
    } catch {
      setError("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ ...EMPTY_FORM });
    setEditing(null);
    setCreating(true);
    setError("");
  }

  function openEdit(post: ApiBlogPost) {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      published: post.published,
    });
    setEditing(post);
    setCreating(false);
    setError("");
  }

  function closeForm() {
    setEditing(null);
    setCreating(false);
    setForm({ ...EMPTY_FORM });
    setError("");
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: f.slug === "" || f.slug === slugify(f.title) ? slugify(title) : f.slug,
    }));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        const res = await api.adminBlog.update(editing.id, form);
        if (res.success) {
          setPosts((prev) => prev.map((p) => (p.id === editing.id ? res.post : p)));
          setSuccessMsg("Post updated.");
          closeForm();
        }
      } else {
        const res = await api.adminBlog.create(form);
        if (res.success) {
          setPosts((prev) => [res.post, ...prev]);
          setSuccessMsg("Post created.");
          closeForm();
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this blog post? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await api.adminBlog.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSuccessMsg("Post deleted.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Failed to delete post.");
    } finally {
      setDeleting(null);
    }
  }

  async function togglePublished(post: ApiBlogPost) {
    try {
      const res = await api.adminBlog.update(post.id, { published: !post.published });
      if (res.success) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? res.post : p)));
      }
    } catch {
      setError("Failed to update post.");
    }
  }

  const isFormOpen = creating || !!editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors border-none cursor-pointer"
          >
            <Plus size={16} />
            New Post
          </button>
        )}
      </div>

      {/* Success / Error banners */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2.5 rounded-lg">
          {successMsg}
        </div>
      )}
      {error && !isFormOpen && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
          {error}
        </div>
      )}

      {/* Edit / Create form */}
      {isFormOpen && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">
              {editing ? "Edit Post" : "New Post"}
            </h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0">
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article title"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="url-friendly-slug"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short summary (used in listings and meta descriptions)"
              rows={2}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Cover Image URL</label>
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
              placeholder="https://..."
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Content <span className="font-normal text-gray-400">(Markdown supported)</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write your article in Markdown..."
              rows={18}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y font-mono"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="w-4 h-4 accent-amber-600"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
            <span className="text-xs text-gray-400">(Only published posts appear on the site)</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors border-none cursor-pointer"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Saving…" : "Save Post"}
            </button>
            <button
              onClick={closeForm}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border-none cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Posts list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-xl p-4 animate-pulse flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-stone-200 rounded w-2/3" />
                <div className="h-4 bg-stone-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-xl p-12 text-center text-gray-400">
          <p className="font-medium mb-1">No blog posts yet</p>
          <p className="text-sm">Create your first article to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-stone-200 rounded-xl p-4 flex items-start gap-4 hover:border-stone-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">{post.title}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      post.published
                        ? "bg-green-100 text-green-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {post.published ? <Eye size={10} /> : <EyeOff size={10} />}
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  /blog/{post.slug} · {formatDate(post.createdAt)}
                </p>
                {post.excerpt && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{post.excerpt}</p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => togglePublished(post)}
                  title={post.published ? "Unpublish" : "Publish"}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer transition-colors"
                >
                  {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  title="Edit"
                  className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-700 bg-transparent border-none cursor-pointer transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  title="Delete"
                  disabled={deleting === post.id}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 bg-transparent border-none cursor-pointer transition-colors disabled:opacity-50"
                >
                  {deleting === post.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
