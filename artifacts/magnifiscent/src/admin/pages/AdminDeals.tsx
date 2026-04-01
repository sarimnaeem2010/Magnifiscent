import React, { useState, useRef, useEffect } from "react";
import { useAdmin } from "../AdminContext";
import type { DealAdmin } from "../AdminContext";
import { Pencil, X, Check, ImageIcon, Trash2, Plus, Package } from "lucide-react";
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

function ModalImageSlot({
  slot, src, onChange, label,
}: { slot: "img1" | "img2"; src: string; onChange: (slot: "img1" | "img2", val: string) => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      <div
        className="relative w-full h-28 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer group"
        onClick={() => ref.current?.click()}
      >
        {src ? (
          <>
            <img src={src} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white text-xs font-bold">Change</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(slot, ""); }}
                className="bg-red-500 rounded-full p-1 border-none cursor-pointer"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <ImageIcon size={22} />
            <span className="text-xs font-medium">Click to upload</span>
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) onChange(slot, await compressImage(file, 600, 600, 0.8));
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

type DealImages = { img1: string; img2: string };
type DealForm = {
  name: string;
  selectedProductIds: number[];
  price: string;
  originalPrice: string;
  active: boolean;
  images: DealImages;
};

const emptyForm = (): DealForm => ({
  name: "", selectedProductIds: [], price: "", originalPrice: "", active: true,
  images: { img1: "", img2: "" },
});

function DealModal({
  title, form, setForm, onClose, onSave, products,
}: {
  title: string;
  form: DealForm;
  setForm: React.Dispatch<React.SetStateAction<DealForm>>;
  onClose: () => void;
  onSave: () => void;
  products: { id: number; name: string; img: string }[];
}) {
  const toggle = (id: number) =>
    setForm((f) => ({
      ...f,
      selectedProductIds: f.selectedProductIds.includes(id)
        ? f.selectedProductIds.filter((x) => x !== id)
        : [...f.selectedProductIds, id],
    }));

  const valid = form.name.trim() && form.price && form.originalPrice && form.selectedProductIds.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Deal Name *</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. CHIC + QUEST Bundle"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              <Package size={12} className="inline mr-1" />
              Select Products for Bundle *
              <span className="ml-2 text-gray-400 font-normal normal-case">(pick 2–4)</span>
            </label>
            {products.length === 0 ? (
              <p className="text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg px-4 py-3">
                No products yet. Add products first in the Products tab.
              </p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                {products.map((p) => {
                  const selected = form.selectedProductIds.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggle(p.id)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      <img src={p.img} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{p.name}</span>
                      {selected && (
                        <span className="ml-auto text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                          In Bundle
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Deal Price *</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="3500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Original Price *</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.originalPrice}
                onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                placeholder="4500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Deal Images</label>
            <div className="grid grid-cols-2 gap-3">
              <ModalImageSlot
                slot="img1"
                src={form.images.img1}
                label="Main Image"
                onChange={(s, v) => setForm((f) => ({ ...f, images: { ...f.images, [s]: v } }))}
              />
              <ModalImageSlot
                slot="img2"
                src={form.images.img2}
                label="Hover Image"
                onChange={(s, v) => setForm((f) => ({ ...f, images: { ...f.images, [s]: v } }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Active on storefront</label>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer"
              style={{ background: form.active ? "#111827" : "#d1d5db" }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow"
                style={{ transform: form.active ? "translateX(24px)" : "translateX(3px)" }}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-transparent border border-gray-200 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!valid}
            className="px-4 py-2 text-sm font-bold text-white rounded-lg disabled:opacity-50 border-none cursor-pointer"
            style={{ background: "#111827" }}
          >
            Save Deal
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminDeals() {
  const { deals, setDeals, products, settings } = useAdmin();
  const cur = settings.currency || "Rs.";
  const [dealImgs, setDealImgs] = useState<Record<string, { img1?: string; img2?: string }>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<DealForm>(emptyForm);

  const [editDeal, setEditDeal] = useState<DealAdmin | null>(null);
  const [editForm, setEditForm] = useState<DealForm>(emptyForm);

  useEffect(() => {
    api.content.dealImages.get().then((res) => {
      if (res.success) setDealImgs(res.dealImages);
    }).catch(() => {});
  }, []);

  const saveImages = async (dealId: string, images: DealImages, prev: Record<string, { img1?: string; img2?: string }>) => {
    const entry: { img1?: string; img2?: string } = {};
    if (images.img1) entry.img1 = images.img1;
    if (images.img2) entry.img2 = images.img2;
    const updated = { ...prev, [dealId]: entry };
    await api.content.dealImages.put(updated).catch(() => {});
    setDealImgs(updated);
    return updated;
  };

  const handleAdd = async () => {
    const price = parseFloat(addForm.price) || 0;
    const original = parseFloat(addForm.originalPrice) || 0;
    const selectedProducts = products.filter((p) => addForm.selectedProductIds.includes(p.id));
    const contains = selectedProducts.map((p) => p.name);
    const id = `deal-${Date.now()}`;
    const discount = original > 0 ? Math.round(((original - price) / original) * 100) : 0;
    const newDeal = { id, name: addForm.name, contains, price, originalPrice: original, discount, active: addForm.active };
    setDeals((prev) => [...prev, newDeal]);
    await saveImages(id, addForm.images, dealImgs);
    setShowAddModal(false);
    setAddForm(emptyForm());
  };

  const openEdit = (d: DealAdmin) => {
    const productNameSet = new Set(d.contains);
    const selectedProductIds = products.filter((p) => productNameSet.has(p.name)).map((p) => p.id);
    setEditDeal(d);
    setEditForm({
      name: d.name,
      selectedProductIds,
      price: String(d.price),
      originalPrice: String(d.originalPrice),
      active: d.active,
      images: { img1: dealImgs[d.id]?.img1 || "", img2: dealImgs[d.id]?.img2 || "" },
    });
  };

  const handleEditSave = async () => {
    if (!editDeal) return;
    const price = parseFloat(editForm.price) || 0;
    const original = parseFloat(editForm.originalPrice) || 0;
    const selectedProducts = products.filter((p) => editForm.selectedProductIds.includes(p.id));
    const contains = selectedProducts.length > 0 ? selectedProducts.map((p) => p.name) : editDeal.contains;
    const discount = original > 0 ? Math.round(((original - price) / original) * 100) : 0;
    setDeals((prev) =>
      prev.map((d) =>
        d.id === editDeal.id ? { ...d, name: editForm.name, contains, price, originalPrice: original, discount, active: editForm.active } : d
      )
    );
    await saveImages(editDeal.id, editForm.images, dealImgs);
    setEditDeal(null);
  };

  const toggleActive = (id: string) =>
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));

  const handleDelete = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    setDeleteId(null);
  };

  const activeCount = deals.filter((d) => d.active).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
        <span className="text-2xl font-bold text-gray-900">{activeCount}</span>
        <span className="text-sm text-gray-400">of {deals.length} deals are currently active on the storefront.</span>
        <button
          onClick={() => { setAddForm(emptyForm()); setShowAddModal(true); }}
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
                <th className="px-4 py-3 text-left">Products in Bundle</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Original</th>
                <th className="px-4 py-3 text-center">Discount</th>
                <th className="px-4 py-3 text-center">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {deals.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-end gap-2">
                      {(["img1", "img2"] as const).map((slot, i) => {
                        const src = dealImgs[d.id]?.[slot] || "";
                        return (
                          <div key={slot} className="flex flex-col items-center gap-0.5">
                            <span className="text-[9px] text-gray-400 uppercase font-semibold">{i === 0 ? "Main" : "Hover"}</span>
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                              {src ? (
                                <img src={src} alt={slot} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={14} className="text-gray-300" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{d.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {d.contains.map((c) => (
                        <span key={c} className="text-[10px] border border-gray-200 px-2 py-0.5 text-gray-500 font-medium rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{cur} {d.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-400 line-through">{cur} {d.originalPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {d.discount}% OFF
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(d.id)}
                      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors border-none cursor-pointer"
                      style={{ background: d.active ? "#111827" : "#d1d5db" }}
                    >
                      <span
                        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                        style={{ transform: d.active ? "translateX(18px)" : "translateX(2px)" }}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(d)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-700"
                      >
                        <Pencil size={15} />
                      </button>
                      {deleteId === d.id ? (
                        <>
                          <button onClick={() => handleDelete(d.id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg border-none cursor-pointer text-red-600">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setDeleteId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer text-gray-500">
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteId(d.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No deals yet. Click Add Deal to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <DealModal
          title="Add Deal"
          form={addForm}
          setForm={setAddForm}
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
          products={products}
        />
      )}

      {editDeal && (
        <DealModal
          title={`Edit — ${editDeal.name}`}
          form={editForm}
          setForm={setEditForm}
          onClose={() => setEditDeal(null)}
          onSave={handleEditSave}
          products={products}
        />
      )}
    </div>
  );
}
