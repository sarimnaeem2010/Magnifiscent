import React, { useState } from "react";
import { useAdmin } from "../AdminContext";
import { AlertTriangle, Check, Pencil } from "lucide-react";

export function AdminInventory() {
  const { products, setProducts } = useAdmin();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const lowStock = products.filter((p) => p.stock < 5);

  const startEdit = (id: number, current: number) => {
    setEditingId(id);
    setEditValue(String(current));
  };

  const saveEdit = (id: number) => {
    const newStock = parseInt(editValue);
    if (!isNaN(newStock) && newStock >= 0) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
      );
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Low Stock Alert</p>
            <p className="text-xs text-amber-600 mt-0.5">
              {lowStock.map((p) => p.name).join(", ")} {lowStock.length === 1 ? "is" : "are"} running low.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-400">{products.length} products — click stock to edit</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Stock Level</th>
                <th className="px-5 py-3 text-center">Stock Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => {
                const isLow = p.stock < 5;
                const isEditing = editingId === p.id;
                const maxStock = 50;
                const pct = Math.min(100, (p.stock / maxStock) * 100);
                const barColor = isLow ? "#ef4444" : p.stock < 15 ? "#f59e0b" : "#10b981";

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.img} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        <p className="font-semibold text-gray-900">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize text-gray-500">{p.category}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}>
                        {isLow ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-gray-900"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit(p.id)}
                            autoFocus
                          />
                          <button onClick={() => saveEdit(p.id)} className="p-1 bg-green-50 hover:bg-green-100 rounded-lg border-none cursor-pointer text-green-600">
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(p.id, p.stock)}
                          className="flex items-center justify-center gap-1 mx-auto text-sm font-bold bg-transparent border-none cursor-pointer group"
                          style={{ color: isLow ? "#ef4444" : "#111827" }}
                        >
                          {p.stock}
                          <Pencil size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="w-32 mx-auto bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
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
