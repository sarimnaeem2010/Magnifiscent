import React, { useState } from "react";
import { useAdmin } from "../AdminContext";
import type { AdminProduct } from "../AdminContext";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type ProductForm = {
  name: string;
  category: "men" | "women";
  price: string;
  originalPrice: string;
  stock: string;
  desc: string;
  notes: string;
  active: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  category: "women",
  price: "",
  originalPrice: "",
  stock: "",
  desc: "",
  notes: "",
  active: true,
};

function Modal({ title, onClose, onSave, form, setForm }: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Product Name *</label>
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. NOIR"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as "men" | "women" }))}
              >
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Stock</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Price ($)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="89.00"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Original Price ($)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.originalPrice}
                onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                placeholder="110.00"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Description</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                value={form.desc}
                onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                placeholder="Product description..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Scent Notes (comma-separated)</label>
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Rose, Jasmine, Musk"
              />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Active (visible on store)</label>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer"
                style={{ background: form.active ? "#111827" : "#d1d5db" }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  style={{ transform: form.active ? "translateX(22px)" : "translateX(2px)" }}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-transparent border border-gray-200 rounded-lg cursor-pointer">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!form.name.trim()}
            className="px-4 py-2 text-sm font-bold text-white rounded-lg disabled:opacity-50 border-none cursor-pointer"
            style={{ background: "#111827" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminProducts() {
  const { products, setProducts } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.priceNum),
      originalPrice: String(p.originalPriceNum),
      stock: String(p.stock),
      desc: p.desc,
      notes: p.notes.join(", "),
      active: p.active,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    const priceNum = parseFloat(form.price) || 0;
    const origNum = parseFloat(form.originalPrice) || 0;
    const stock = parseInt(form.stock) || 0;
    const notes = form.notes.split(",").map((n) => n.trim()).filter(Boolean);

    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: form.name,
                category: form.category,
                priceNum,
                price: `$${priceNum.toFixed(2)}`,
                originalPriceNum: origNum,
                originalPrice: `$${origNum.toFixed(2)}`,
                stock,
                desc: form.desc,
                notes,
                active: form.active,
              }
            : p
        )
      );
    } else {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts((prev) => [
        ...prev,
        {
          id: newId,
          name: form.name,
          slug: form.name.toLowerCase().replace(/\s+/g, "-"),
          img: "/women-split.png",
          img2: "/women-split.png",
          category: form.category,
          priceNum,
          price: `$${priceNum.toFixed(2)}`,
          originalPriceNum: origNum,
          originalPrice: `$${origNum.toFixed(2)}`,
          stock,
          desc: form.desc,
          notes,
          active: form.active,
          reviews: 0,
          rating: 5,
          size: "100ml / 3.4 Fl.oz",
        },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const toggleActive = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <input
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-64"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg border-none cursor-pointer"
          style={{ background: "#111827" }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Stock</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.img} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{p.desc.slice(0, 50)}…</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize"
                      style={{ background: p.category === "women" ? "#fce7f3" : "#dbeafe", color: p.category === "women" ? "#9d174d" : "#1e40af" }}>
                      {p.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">{p.price}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={p.stock < 5 ? "text-red-600 font-bold" : "text-gray-700"}>{p.stock}</span>
                    {p.stock < 5 && <span className="ml-1 text-xs text-red-500">Low</span>}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggleActive(p.id)}
                      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors border-none cursor-pointer"
                      style={{ background: p.active ? "#111827" : "#d1d5db" }}
                    >
                      <span
                        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                        style={{ transform: p.active ? "translateX(18px)" : "translateX(2px)" }}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-900">
                        <Pencil size={15} />
                      </button>
                      {deleteId === p.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg border-none cursor-pointer text-red-600"><Check size={15} /></button>
                          <button onClick={() => setDeleteId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer text-gray-500"><X size={15} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-600">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal
          title={editingId !== null ? "Edit Product" : "Add Product"}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          form={form}
          setForm={setForm}
        />
      )}
    </div>
  );
}
