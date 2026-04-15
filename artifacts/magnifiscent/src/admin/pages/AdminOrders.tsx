import React, { useState, useMemo } from "react";
import { useAdmin } from "../AdminContext";
import type { Order, OrderStatus } from "../AdminContext";
import { X, ChevronRight, Trash2, AlertTriangle } from "lucide-react";

const STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColor: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function DeleteConfirmModal({ orderId, onConfirm, onCancel, deleting }: {
  orderId: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">Delete Order?</p>
            <p className="text-sm text-gray-500 mt-1">
              Order <span className="font-mono font-semibold text-gray-700">{orderId}</span> will be permanently removed from the database. This cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border-none cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors border-none cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailPanel({ order, onClose, onStatusChange, onDelete, cur }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
  cur: string;
}) {
  const itemsSubtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const isLegacy = (order.subtotal ?? 0) === 0 && itemsSubtotal > 0;
  const subtotal = itemsSubtotal;
  const discountAmount = order.discountAmount ?? 0;
  const shippingAmount = order.shippingAmount ?? 0;
  const couponCode = order.couponCode ?? null;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(order.id);
    setDeleting(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div className="flex-1 bg-black/40" onClick={onClose} />
        <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <p className="font-bold text-gray-900">{order.id}</p>
              <p className="text-xs text-gray-400">{order.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg bg-transparent border-none cursor-pointer transition-colors"
                title="Delete order"
              >
                <Trash2 size={17} />
              </button>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg bg-transparent border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>
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
            <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Order Summary</p>

              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{cur} {subtotal.toFixed(2)}</span>
              </div>

              {!isLegacy && discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1.5">
                    Coupon
                    {couponCode && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded">
                        {couponCode}
                      </span>
                    )}
                  </span>
                  <span>− {cur} {discountAmount.toFixed(2)}</span>
                </div>
              )}

              {!isLegacy && discountAmount === 0 && (
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Coupon</span>
                  <span>None applied</span>
                </div>
              )}

              {isLegacy && (
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Coupon</span>
                  <span className="italic">—</span>
                </div>
              )}

              {!isLegacy && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  {shippingAmount === 0
                    ? <span className="text-green-600 font-medium">Free</span>
                    : <span>{cur} {shippingAmount.toFixed(2)}</span>
                  }
                </div>
              )}

              {isLegacy && (
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span className="italic">—</span>
                </div>
              )}

              {isLegacy && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-1">
                  Coupon & shipping breakdown was not captured for this order. Total paid is accurate.
                </p>
              )}

              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-1">
                <span>Total</span>
                <span>{cur} {order.total.toFixed(2)}</span>
              </div>

              <p className="text-xs text-gray-400 pt-1">Payment: {order.paymentMethod}</p>
            </div>

            {/* Delete zone */}
            <div className="pt-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Trash2 size={15} />
                Delete This Order
              </button>
              <p className="text-xs text-center text-gray-400 mt-1.5">Permanently removes from database</p>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          orderId={order.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          deleting={deleting}
        />
      )}
    </>
  );
}

export function AdminOrders() {
  const { orders, setOrders, deleteOrder, settings } = useAdmin();
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

  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    setSelected(null);
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
                  <td className="px-5 py-3 text-right font-semibold">PKR {o.total.toFixed(2)}</td>
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
          onDelete={handleDelete}
          cur={cur}
        />
      )}
    </div>
  );
}
