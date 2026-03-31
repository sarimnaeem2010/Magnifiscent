import React, { useState, useRef } from "react";
import { Plus, Trash2, ImageIcon, Link, Save, CheckCircle2, Instagram } from "lucide-react";
import { getInstagramReels, saveInstagramReels, type InstagramReel } from "@/data/liveData";

function compressImage(file: File, maxW: number, maxH: number, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxW / width, maxH / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const EMPTY_FORM = { url: "", label: "", likes: "", img: "" };

export function AdminInstagram() {
  const [reels, setReels] = useState<InstagramReel[]>(() => getInstagramReels());
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [compressing, setCompressing] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  const persist = (next: InstagramReel[]) => {
    setReels(next);
    saveInstagramReels(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Remove this reel card?")) return;
    persist(reels.filter((r) => r.id !== id));
  };

  const handleImageFile = async (file: File) => {
    setCompressing(true);
    const b64 = await compressImage(file, 400, 600, 0.82);
    setForm((f) => ({ ...f, img: b64 }));
    setCompressing(false);
  };

  const handleAdd = () => {
    const label = form.label.trim();
    const url = form.url.trim();
    if (!label || !url) return;
    const reel: InstagramReel = {
      id: Date.now().toString(),
      url,
      label,
      likes: parseInt(form.likes) || 0,
      img: form.img,
    };
    persist([...reels, reel]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleUpdateLikes = (id: string, val: string) => {
    setReels((prev) => prev.map((r) => r.id === id ? { ...r, likes: parseInt(val) || 0 } : r));
  };

  const handleUpdateUrl = (id: string, val: string) => {
    setReels((prev) => prev.map((r) => r.id === id ? { ...r, url: val } : r));
  };

  const handleSaveEdits = () => {
    saveInstagramReels(reels);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header bar */}
      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
        <Instagram size={18} className="text-pink-500" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Instagram Reels</p>
          <p className="text-xs text-gray-400">{reels.length} reel card{reels.length !== 1 ? "s" : ""} on homepage</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {reels.length > 0 && (
            <button
              onClick={handleSaveEdits}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-all"
              style={{ background: saved ? "#16a34a" : "#111827", color: "#fff" }}
            >
              {saved ? <><CheckCircle2 size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
            </button>
          )}
          <button
            onClick={() => { setShowForm(true); setForm(EMPTY_FORM); }}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-pink-500 text-white border-none cursor-pointer hover:bg-pink-600 transition-colors"
          >
            <Plus size={13} /> Add Reel
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">New Reel Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-5">
            {/* Thumbnail upload */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Thumbnail</p>
              <div
                className="relative w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer group"
                style={{ aspectRatio: "9/16", minHeight: 100 }}
                onClick={() => imgRef.current?.click()}
              >
                {form.img ? (
                  <>
                    <img src={form.img} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Change</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400 py-6">
                    {compressing ? <span className="text-xs">Compressing…</span> : <><ImageIcon size={22} /><span className="text-xs font-medium">Upload</span></>}
                  </div>
                )}
                <input
                  ref={imgRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleImageFile(file);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Label <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="e.g. NEW LAUNCH"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Instagram Reel Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="https://www.instagram.com/reel/..."
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Likes Count</label>
                <input
                  type="number"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="e.g. 241"
                  value={form.likes}
                  onChange={(e) => setForm((f) => ({ ...f, likes: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAdd}
                  disabled={!form.label.trim() || !form.url.trim()}
                  className="flex-1 py-2.5 text-sm font-bold text-white rounded-lg border-none cursor-pointer transition-colors"
                  style={{ background: form.label.trim() && form.url.trim() ? "#111827" : "#d1d5db" }}
                >
                  Add Reel Card
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg bg-transparent cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reels list */}
      {reels.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
          <Instagram size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400 font-medium">No reel cards yet</p>
          <p className="text-xs text-gray-300 mt-1">Click "Add Reel" to create your first card</p>
          <p className="text-xs text-gray-300 mt-1">When empty, the homepage shows default product images</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Thumbnail</th>
                  <th className="px-5 py-3 text-left">Label</th>
                  <th className="px-5 py-3 text-left">Reel Link</th>
                  <th className="px-5 py-3 text-center">Likes</th>
                  <th className="px-5 py-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reels.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-10 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {r.img ? (
                          <img src={r.img} alt={r.label} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Instagram size={14} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900">{r.label}</td>
                    <td className="px-5 py-3">
                      <input
                        type="url"
                        className="w-full max-w-xs px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                        value={r.url}
                        onChange={(e) => handleUpdateUrl(r.id, e.target.value)}
                      />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <input
                        type="number"
                        className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-gray-900"
                        value={r.likes}
                        onChange={(e) => handleUpdateLikes(r.id, e.target.value)}
                      />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg bg-transparent border-none cursor-pointer text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 px-1">
        Tip: If no reel cards are added, the homepage will show default product images in the Instagram section.
        Uploaded reel thumbnails link directly to the Instagram URL you set.
      </p>
    </div>
  );
}
