import React, { useState, useRef, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import type { DealAdmin } from "../AdminContext";
import { Pencil, X, Check, ImageIcon, Trash2, Plus } from "lucide-react";
import { api } from "@/lib/api";

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
  dealId, slot, currentImg, label, allImages, onUpdate,
}: {
  dealId: string; slot: "img1" | "img2"; currentImg: string; label: string;
  allImages: Record<string, { img1?: string; img2?: string }>; onUpdate: (imgs: Record<string, { img1?: string; img2?: string }>) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState(currentImg);
  useEffect(() => { setSrc(currentImg); }, [currentImg]);

  const handleUpload = async (file: File) => {
    const b64 = await compressImage(file, 400, 400, 0.75);
    const updated = { ...allImages, [dealId]: { ...allImages[dealId], [slot]: b64 } };
    await api.content.dealImages.put(updated).catch(() => {});
    onUpdate(updated);
    setSrc(b64);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...allImages };
    if (updated[dealId]) {
      const entry = { ...updated[dealId] };
      delete (entry as Record<string, string | undefined>)[slot];
      if (!entry.img1 && !entry.img2) delete updated[dealId];
      else updated[dealId] = entry;
    }
    await api.content.dealImages.put(updated).catch(() => {});
    onUpdate(updated);
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
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={async (e) => { const file = e.target.files?.[0]; if (file) await handleUpload(file); e.target.value = ""; }}
        />
      </div>
    </div>
  );
}

type DealForm = { name: string; contains: string; price: string; originalPrice: string; active: boolean };
const emptyForm: DealForm = { name: "", contains: "", price: "", originalPrice: "", active: true };

function AddDealModal({ onClose, onSave }: { onClose: () => void; onSave: (f: DealForm) => void }) {
  const [form, setForm] = useState<DealForm>(emptyForm);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Add Deal</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Deal Name *</label>
            <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. CHIC + QUEST Bundle" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Products Included (comma-separated)</label>
            <input className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={form.contains} onChange={(e) => setForm((f) => ({ ...f, contains: e.target.value }))}
              placeholder="CHIC, QUEST" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Deal Price *</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="3500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Original Price *</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} placeholder="4500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Active on storefront</label>
            <button type="button" onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer"
              style={{ background: form.active ? "#111827" : "#d1d5db" }}>
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow"
                style={{ transform: form.active ? "translateX(24px)" : "translateX(3px)" }} />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-transparent border border-gray-200 rounded-lg cursor-pointer">Cancel</button>
          <button onClick={() => onSave(form)} disabled={!form.name.trim() || !form.price || !form.originalPrice}
            className="px-4 py-2 text-sm font-bold text-white rounded-lg disabled:opacity-50 border-none cursor-pointer"
            style={{ background: "#111827" }}>
            Add Deal
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminDeals() {
  const { deals, setDeals, settings } = useAdmin();
  const cur = settings.currency || "Rs.";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editOriginal, setEditOriginal] = useState("");
  const [dealImgs, setDealImgs] = useState<Record<string, { img1?: string; img2?: string }>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    api.content.dealImages.get().then((res) => {
      if (res.success) setDealImgs(res.dealImages);
    }).catch(() => {});
  }, []);

  const startEdit = (d: DealAdmin) => {
    setEditingId(d.id);
    setEditPrice(String(d.price));
    setEditOriginal(String(d.originalPrice));
  };

  const saveEdit = (id: string) => {
    const price = parseFloat(editPrice);
    const original = parseFloat(editOriginal);
    if (!isNaN(price) && !isNaN(original) && original > 0) {
      setDeals((prev) => prev.map((d) =>
        d.id === id ? { ...d, price, originalPrice: original, discount: Math.round(((original - price) / original) * 100) } : d
      ));
    }
    setEditingId(null);
  };

  const toggleActive = (id: string) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));
  };

  const handleDelete = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    setDeleteId(null);
  };

  const handleAddDeal = (form: DealForm) => {
    const price = parseFloat(form.price) || 0;
    const original = parseFloat(form.originalPrice) || 0;
    const contains = form.contains.split(",").map((c) => c.trim()).filter(Boolean);
    const id = `deal-${Date.now()}`;
    const discount = original > 0 ? Math.round(((original - price) / original) * 100) : 0;
    setDeals((prev) => [
      ...prev,
      { id, name: form.name, contains, price, originalPrice: original, discount, active: form.active },
    ]);
    setShowAddModal(false);
  };

  const activeCount = deals.filter((d) => d.active).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
        <span className="text-2xl font-bold text-gray-900">{activeCount}</span>
        <span className="text-sm text-gray-400">of {deals.length} deals are currently active on the storefront.</span>
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg border-none cursor-pointer"
          style={{ background: "#111827" }}
        >
          <Plus size={15} /> Add Deal
        </button>
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
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deals.map((d) => {
                const isEditing = editingId === d.id;
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-end gap-2">
                        <DealImageSlot dealId={d.id} slot="img1" currentImg={dealImgs[d.id]?.img1 || ""} label="Static" allImages={dealImgs} onUpdate={setDealImgs} />
                        <DealImageSlot dealId={d.id} slot="img2" currentImg={dealImgs[d.id]?.img2 || ""} label="Hover" allImages={dealImgs} onUpdate={setDealImgs} />
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
                        <span className="font-semibold">{cur} {d.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input type="number" className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-xs text-right focus:outline-none focus:ring-2 focus:ring-gray-900"
                          value={editOriginal} onChange={(e) => setEditOriginal(e.target.value)} />
                      ) : (
                        <span className="text-gray-400 line-through">{cur} {d.originalPrice.toFixed(2)}</span>
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
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(d.id)} className="p-1.5 bg-green-50 hover:bg-green-100 rounded-lg border-none cursor-pointer text-green-600"><Check size={14} /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer text-gray-400"><X size={14} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(d)} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-700">
                              <Pencil size={15} />
                            </button>
                            {deleteId === d.id ? (
                              <>
                                <button onClick={() => handleDelete(d.id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg border-none cursor-pointer text-red-600"><Check size={14} /></button>
                                <button onClick={() => setDeleteId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer text-gray-500"><X size={14} /></button>
                              </>
                            ) : (
                              <button onClick={() => setDeleteId(d.id)} className="p-1.5 hover:bg-red-50 rounded-lg bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-600">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400 text-sm">No deals yet. Click Add Deal to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddDealModal onClose={() => setShowAddModal(false)} onSave={handleAddDeal} />
      )}
    </div>
  );
}
