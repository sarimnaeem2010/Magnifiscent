import React, { useState, useMemo } from "react";
import { useAdmin } from "../AdminContext";
import type { Order, OrderStatus } from "../AdminContext";
import { X, ChevronRight } from "lucide-react";

const STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColor: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function OrderDetailPanel({ order, onClose, onStatusChange, cur }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  cur: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <p className="font-bold text-gray-900">{order.id}</p>
            <p className="text-xs text-gray-400">{order.date}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          {/* Status update */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(order.id, s)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border-none cursor-pointer transition-colors"
                  style={{
                    background: order.status === s ? "#111827" : "#f3f4f6",
                    color: order.status === s ? "#fff" : "#6b7280",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer</p>
            <p className="font-semibold text-gray-900">{order.customer.name}</p>
            <p className="text-sm text-gray-500">{order.customer.email}</p>
            <p className="text-sm text-gray-500">{order.customer.phone}</p>
            <p className="text-sm text-gray-400 mt-1">{order.customer.address}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold">{cur} {(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Subtotal</span>
              <span>{cur} {order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Shipping</span>
              <span className="text-green-600">{order.total >= 100 ? "Free" : `${cur} 9.99`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>{cur} {(order.total + (order.total >= 100 ? 0 : 9.99)).toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Payment: {order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminOrders() {
  const { orders, setOrders, settings } = useAdmin();
  const cur = settings.currency || "Rs.";
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = filter === "All" || o.status === filter;
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, filter, search]);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const counts: Record<string, number> = {
    All: orders.length,
    ...Object.fromEntries(STATUSES.map((s) => [s, orders.filter((o) => o.status === s).length])),
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 flex-wrap">
        {(["All", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as OrderStatus | "All")}
            className="px-3 py-1.5 text-xs font-semibold rounded-full border-none cursor-pointer transition-colors"
            style={{
              background: filter === s ? "#111827" : "#f3f4f6",
              color: filter === s ? "#fff" : "#6b7280",
            }}
          >
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <input
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-64"
        placeholder="Search by ID or customer…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Items</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelected(o)}
                >
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{o.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{o.customer.name}</p>
                    <p className="text-xs text-gray-400">{o.customer.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {o.items.map((i) => i.productName).join(", ").slice(0, 30)}{o.items.length > 1 ? "…" : ""}
                  </td>
                  <td className="px-5 py-3 text-gray-400">{o.date}</td>
                  <td className="px-5 py-3 text-right font-semibold">${o.total.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <ChevronRight size={16} className="text-gray-300" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-sm">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <OrderDetailPanel
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
          cur={cur}
        />
      )}
    </div>
  );
}
