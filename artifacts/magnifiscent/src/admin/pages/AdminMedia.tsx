import React, { useState, useRef } from "react";
import { Upload, Trash2, Plus, ImageIcon, ChevronUp, ChevronDown } from "lucide-react";
import {
  getHeroSlides, saveHeroSlides,
  getGenderBanners, saveGenderBanners,
  getNotesImages, saveNotesImages,
  type HeroSlide,
} from "@/data/liveData";

const NOTE_LABELS = ["FLORAL", "FRESH", "WOODY", "MUSKY", "ORIENTAL", "AQUATIC"];

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = (e) => resolve(e.target?.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function UploadBox({
  label, src, onUpload, onRemove, aspect = "16/5",
}: {
  label: string; src: string; onUpload: (b64: string) => void;
  onRemove?: () => void; aspect?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div
        className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer group hover:border-gray-400 transition-colors"
        style={{ aspectRatio: aspect }}
        onClick={() => ref.current?.click()}
      >
        {src ? (
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
            <p className="text-[10px]">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
      <input
        ref={ref} type="file" accept="image/*" className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) { const b64 = await readFile(file); onUpload(b64); }
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ─── Hero Slides Manager ─── */
function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>(() => getHeroSlides());
  const [saved, setSaved] = useState(false);

  const save = (updated: HeroSlide[]) => {
    setSlides(updated);
    saveHeroSlides(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const addSlide = () => {
    save([...slides, { id: Date.now().toString(), src: "", alt: "Hero Banner" }]);
  };

  const removeSlide = (id: string) => save(slides.filter((s) => s.id !== id));

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const arr = [...slides];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    save(arr);
  };

  const updateSlide = (id: string, src: string) => {
    save(slides.map((s) => (s.id === id ? { ...s, src } : s)));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Hero Banner / Slider</h2>
          <p className="text-xs text-gray-400 mt-0.5">One image = static banner. Multiple images = auto-rotating slider.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-green-600 font-medium">Saved!</span>}
          <button
            onClick={addSlide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg border-none cursor-pointer"
            style={{ background: "#111827" }}
          >
            <Plus size={14} /> Add Slide
          </button>
        </div>
      </div>

      {slides.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No slides yet. Click "Add Slide" to upload your first banner.</p>
          <p className="text-xs mt-1 text-gray-400">If no slides are added, the default static banner will show.</p>
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
  const [banners, setBanners] = useState(() => getGenderBanners());
  const [saved, setSaved] = useState(false);

  const update = (key: "men" | "women", src: string) => {
    const updated = { ...banners, [key]: src };
    setBanners(updated);
    saveGenderBanners(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Shop By Gender Banners</h2>
          <p className="text-xs text-gray-400 mt-0.5">Upload banner images for Men and Women sections on the homepage.</p>
        </div>
        {saved && <span className="text-xs text-green-600 font-medium">Saved!</span>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadBox
          label="Men's Banner"
          src={banners.men}
          aspect="4/3"
          onUpload={(b64) => update("men", b64)}
          onRemove={() => update("men", "")}
        />
        <UploadBox
          label="Women's Banner"
          src={banners.women}
          aspect="4/3"
          onUpload={(b64) => update("women", b64)}
          onRemove={() => update("women", "")}
        />
      </div>
    </div>
  );
}

/* ─── Notes Images Manager ─── */
function NotesImagesManager() {
  const [imgs, setImgs] = useState(() => getNotesImages());
  const [saved, setSaved] = useState(false);

  const update = (label: string, src: string) => {
    const updated = { ...imgs, [label]: src };
    setImgs(updated);
    saveNotesImages(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Shop By Notes Images</h2>
          <p className="text-xs text-gray-400 mt-0.5">Upload images for each scent note category. Falls back to color gradient if no image.</p>
        </div>
        {saved && <span className="text-xs text-green-600 font-medium">Saved!</span>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {NOTE_LABELS.map((label) => (
          <UploadBox
            key={label}
            label={label}
            src={imgs[label] || ""}
            aspect="1/1"
            onUpload={(b64) => update(label, b64)}
            onRemove={() => update(label, "")}
          />
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
    </div>
  );
}
