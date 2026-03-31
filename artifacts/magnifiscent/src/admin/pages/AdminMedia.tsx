import React, { useState, useRef } from "react";
import { Trash2, Plus, ImageIcon, ChevronUp, ChevronDown, Save, CheckCircle2, Type } from "lucide-react";
import {
  getHeroSlides, saveHeroSlides,
  getGenderBanners, saveGenderBanners,
  getNotesImages, saveNotesImages,
  getHomeHeadings, saveHomeHeadings,
  DEFAULT_HOME_HEADINGS,
  type HeroSlide, type GenderBanners, type NotesImages, type HomeHeadings,
} from "@/data/liveData";

const NOTE_LABELS = ["FLORAL", "FRESH", "WOODY", "MUSKY", "ORIENTAL", "AQUATIC"];

function compressImage(file: File, maxW: number, maxH: number, quality = 0.75): Promise<string> {
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
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/* ─── Shared Save Button ─── */
function SaveButton({ dirty, saved, onSave }: { dirty: boolean; saved: boolean; onSave: () => void }) {
  return (
    <button
      onClick={onSave}
      disabled={!dirty && !saved}
      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-all"
      style={{
        background: saved ? "#16a34a" : dirty ? "#111827" : "#e5e7eb",
        color: saved || dirty ? "#fff" : "#9ca3af",
        cursor: dirty ? "pointer" : "default",
      }}
    >
      {saved ? (
        <><CheckCircle2 size={13} /> Saved!</>
      ) : (
        <><Save size={13} /> Save Changes</>
      )}
    </button>
  );
}

/* ─── Upload Box ─── */
function UploadBox({
  label, src, onUpload, onRemove, aspect = "16/5",
  maxW = 1200, maxH = 800, quality = 0.75,
}: {
  label: string; src: string; onUpload: (b64: string) => void;
  onRemove?: () => void; aspect?: string;
  maxW?: number; maxH?: number; quality?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div
        className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer group hover:border-gray-400 transition-colors"
        style={{ aspectRatio: aspect }}
        onClick={() => !uploading && ref.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-gray-400 p-4">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            <p className="text-xs font-medium">Compressing…</p>
          </div>
        ) : src ? (
          <>
            <img src={src} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-lg">
                Change Image
              </span>
              {onRemove && (
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  className="bg-red-600 text-white rounded-lg px-2 py-1.5 border-none cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 p-4">
            <ImageIcon size={28} />
            <p className="text-xs font-medium">Click to upload image</p>
            <p className="text-[10px]">PNG, JPG, WEBP — auto-compressed</p>
          </div>
        )}
      </div>
      <input
        ref={ref} type="file" accept="image/*" className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            setUploading(true);
            try {
              const b64 = await compressImage(file, maxW, maxH, quality);
              onUpload(b64);
            } finally {
              setUploading(false);
            }
          }
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ─── Hero Slides Manager ─── */
function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>(() => getHeroSlides());
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const mutate = (updated: HeroSlide[]) => {
    setSlides(updated);
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    saveHeroSlides(slides);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSlide = () => mutate([...slides, { id: Date.now().toString(), src: "", alt: "Hero Banner" }]);
  const removeSlide = (id: string) => mutate(slides.filter((s) => s.id !== id));

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const arr = [...slides];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    mutate(arr);
  };

  const updateSlide = (id: string, src: string) =>
    mutate(slides.map((s) => (s.id === id ? { ...s, src } : s)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Hero Banner / Slider</h2>
          <p className="text-xs text-gray-400 mt-0.5">One image = static banner. Multiple images = auto-rotating slider.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addSlide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg border-none cursor-pointer"
            style={{ background: "#6b7280" }}
          >
            <Plus size={14} /> Add Slide
          </button>
          <SaveButton dirty={dirty} saved={saved} onSave={handleSave} />
        </div>
      </div>

      {slides.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No slides yet. Click "Add Slide" to upload your first banner.</p>
          <p className="text-xs mt-1">If no slides are added, the default static banner will show.</p>
        </div>
      )}

      <div className="space-y-4">
        {slides.map((slide, idx) => (
          <div key={slide.id} className="flex gap-3 items-start p-3 border border-gray-100 rounded-xl">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveSlide(idx, -1)}
                disabled={idx === 0}
                className="p-1 hover:bg-gray-100 rounded bg-transparent border-none cursor-pointer text-gray-400 disabled:opacity-30"
              >
                <ChevronUp size={14} />
              </button>
              <span className="text-xs text-gray-300 text-center font-bold">{idx + 1}</span>
              <button
                onClick={() => moveSlide(idx, 1)}
                disabled={idx === slides.length - 1}
                className="p-1 hover:bg-gray-100 rounded bg-transparent border-none cursor-pointer text-gray-400 disabled:opacity-30"
              >
                <ChevronDown size={14} />
              </button>
            </div>
            <div className="flex-1">
              <UploadBox
                label={`Slide ${idx + 1}`}
                src={slide.src}
                aspect="16/5"
                maxW={1920} maxH={700} quality={0.82}
                onUpload={(b64) => updateSlide(slide.id, b64)}
                onRemove={() => removeSlide(slide.id)}
              />
            </div>
            <button
              onClick={() => removeSlide(slide.id)}
              className="p-1.5 hover:bg-red-50 rounded-lg bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-500 mt-5"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Gender Banners Manager ─── */
function GenderBannersManager() {
  const [banners, setBanners] = useState<GenderBanners>(() => getGenderBanners());
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: "men" | "women", src: string) => {
    setBanners((prev) => ({ ...prev, [key]: src }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    saveGenderBanners(banners);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Shop By Gender Banners</h2>
          <p className="text-xs text-gray-400 mt-0.5">Upload banner images for Men and Women sections on the homepage.</p>
        </div>
        <SaveButton dirty={dirty} saved={saved} onSave={handleSave} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadBox
          label="Men's Banner"
          src={banners.men}
          aspect="4/3"
          maxW={900} maxH={700} quality={0.78}
          onUpload={(b64) => update("men", b64)}
          onRemove={() => update("men", "")}
        />
        <UploadBox
          label="Women's Banner"
          src={banners.women}
          aspect="4/3"
          maxW={900} maxH={700} quality={0.78}
          onUpload={(b64) => update("women", b64)}
          onRemove={() => update("women", "")}
        />
      </div>
    </div>
  );
}

/* ─── Notes Images Manager ─── */
function NotesImagesManager() {
  const [imgs, setImgs] = useState<NotesImages>(() => getNotesImages());
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (label: string, src: string) => {
    setImgs((prev) => ({ ...prev, [label]: src }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    saveNotesImages(imgs);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Shop By Notes Images</h2>
          <p className="text-xs text-gray-400 mt-0.5">Upload images for each scent note category. Falls back to color gradient if no image.</p>
        </div>
        <SaveButton dirty={dirty} saved={saved} onSave={handleSave} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {NOTE_LABELS.map((label) => (
          <UploadBox
            key={label}
            label={label}
            src={imgs[label] || ""}
            aspect="1/1"
            maxW={400} maxH={400} quality={0.72}
            onUpload={(b64) => update(label, b64)}
            onRemove={() => update(label, "")}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Headings Manager ─── */
const HEADING_FIELDS: { key: keyof HomeHeadings; label: string; hint: string }[] = [
  { key: "deals", label: "Deals & Combo section", hint: "Main heading for the deals section" },
  { key: "shopByGender", label: "Shop By Gender section", hint: "Heading above the men/women banners" },
  { key: "allProducts", label: "All Products section", hint: "Heading for the product grid" },
  { key: "shopByNotes", label: "Shop By Notes section", hint: "Heading for the scent notes" },
  { key: "instagramTitle", label: "Instagram section title", hint: "Bold heading above the reel cards" },
  { key: "instagramSubtitle", label: "Instagram section subtitle", hint: "Smaller text below the title" },
  { key: "reviews", label: "Reviews section", hint: "Heading for buyer reviews" },
  { key: "whyChoose", label: "Why Choose section", hint: "Feature highlights heading" },
];

function HeadingsManager() {
  const [headings, setHeadings] = useState<HomeHeadings>(() => getHomeHeadings());
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof HomeHeadings, val: string) => {
    setHeadings((prev) => ({ ...prev, [key]: val }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    saveHomeHeadings(headings);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setHeadings({ ...DEFAULT_HOME_HEADINGS });
    setDirty(true);
    setSaved(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Homepage Section Headings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Edit the headings and subtitles for each section on the homepage.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg bg-transparent cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
          <SaveButton dirty={dirty} saved={saved} onSave={handleSave} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HEADING_FIELDS.map(({ key, label, hint }) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={headings[key]}
              onChange={(e) => update(key, e.target.value)}
              placeholder={DEFAULT_HOME_HEADINGS[key]}
            />
            <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export function AdminMedia() {
  return (
    <div className="space-y-6">
      <HeroSlidesManager />
      <GenderBannersManager />
      <NotesImagesManager />
      <HeadingsManager />
    </div>
  );
}
