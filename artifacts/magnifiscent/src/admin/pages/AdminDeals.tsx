import React, { useState, useRef } from "react";
import { useAdmin } from "../AdminContext";
import type { DealAdmin } from "../AdminContext";
import { Pencil, X, Check, ImageIcon, Trash2 } from "lucide-react";
import { getDealCustomImages, saveDealCustomImages } from "@/data/liveData";

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
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function DealImageSlot({
  dealId,
  slot,
  currentImg,
  label,
}: {
  dealId: string;
  slot: "img1" | "img2";
  currentImg: string;
  label: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(currentImg);

  const handleUpload = async (file: File) => {
    const b64 = await compressImage(file, 400, 400, 0.75);
    const all = getDealCustomImages();
    all[dealId] = { ...all[dealId], [slot]: b64 };
    saveDealCustomImages(all);
    setSrc(b64);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    const all = getDealCustomImages();
    if (all[dealId]) {
      delete (all[dealId] as Record<string, string | undefined>)[slot];
      if (!all[dealId].img1 && !all[dealId].img2) delete all[dealId];
    }
    saveDealCustomImages(all);
    setSrc("");
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <div
        className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer group flex-shrink-0"
        onClick={() => ref.current?.click()}
      >
        {src ? (
          <>
            <img src={src} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <span className="text-white text-[8px] font-bold">Change</span>
              <button onClick={handleRemove} className="bg-red-500 rounded p-0.5 border-none cursor-pointer">
                <Trash2 size={9} className="text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-0.5 text-gray-400">
            <ImageIcon size={14} />
            <span className="text-[8px] font-medium">Add</span>
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

export function AdminDeals() {
  const { deals, setDeals } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editOriginal, setEditOriginal] = useState("");
  const dealImgs = getDealCustomImages();

  const startEdit = (d: DealAdmin) => {
    setEditingId(d.id);
    setEditPrice(String(d.price));
    setEditOriginal(String(d.originalPrice));
  };

  const saveEdit = (id: string) => {
    const price = parseFloat(editPrice);
    const original = parseFloat(editOriginal);
    if (!isNaN(price) && !isNaN(original) && original > 0) {
      setDeals((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, price, originalPrice: original, discount: Math.round(((original - price) / original) * 100) }
            : d
        )
      );
    }
    setEditingId(null);
  };

  const toggleActive = (id: string) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));
  };

  const activeCount = deals.filter((d) => d.active).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
        <span className="text-2xl font-bold text-gray-900">{activeCount}</span>
        <span className="text-sm text-gray-400">of {deals.length} deals are currently active on the storefront.</span>
        <span className="ml-auto text-xs text-gray-400">Upload a static image and a hover image for each deal.</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Images</th>
                <th className="px-4 py-3 text-left">Deal Name</th>
                <th className="px-4 py-3 text-left">Products</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Original</th>
                <th className="px-4 py-3 text-center">Discount</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deals.map((d) => {
                const isEditing = editingId === d.id;
                const custom = dealImgs[d.id] || {};
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-end gap-2">
                        <DealImageSlot dealId={d.id} slot="img1" currentImg={custom.img1 || ""} label="Static" />
                        <DealImageSlot dealId={d.id} slot="img2" currentImg={custom.img2 || ""} label="Hover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{d.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {d.contains.map((c) => (
                          <span key={c} className="text-[10px] border border-gray-200 px-2 py-0.5 text-gray-500 font-medium rounded">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input type="number" className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-xs text-right focus:outline-none focus:ring-2 focus:ring-gray-900"
                          value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                      ) : (
                        <span className="font-semibold">${d.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input type="number" className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-xs text-right focus:outline-none focus:ring-2 focus:ring-gray-900"
                          value={editOriginal} onChange={(e) => setEditOriginal(e.target.value)} />
                      ) : (
                        <span className="text-gray-400 line-through">${d.originalPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{d.discount}% OFF</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(d.id)}
                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors border-none cursor-pointer"
                        style={{ background: d.active ? "#111827" : "#d1d5db" }}>
                        <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                          style={{ transform: d.active ? "translateX(18px)" : "translateX(2px)" }} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => saveEdit(d.id)} className="p-1.5 bg-green-50 hover:bg-green-100 rounded-lg border-none cursor-pointer text-green-600"><Check size={14} /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer text-gray-400"><X size={14} /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(d)} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-700">
                          <Pencil size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
