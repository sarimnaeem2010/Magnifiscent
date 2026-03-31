import React, { useMemo, useState } from "react";
import { useAdmin } from "../AdminContext";
import { Mail, Phone } from "lucide-react";

export function AdminCustomers() {
  const { orders } = useAdmin();
  const [search, setSearch] = useState("");

  const customers = useMemo(() => {
    const map = new Map<string, {
      name: string; email: string; phone: string;
      orderCount: number; totalSpent: number; lastOrder: string;
    }>();
    for (const order of orders) {
      if (order.status === "Cancelled") continue;
      const key = order.customer.email;
      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.total;
        if (order.date > existing.lastOrder) existing.lastOrder = order.date;
      } else {
        map.set(key, {
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          orderCount: 1,
          totalSpent: order.total,
          lastOrder: order.date,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const nonCancelledCount = orders.filter((o) => o.status !== "Cancelled").length;
  const avgOrderValue = nonCancelledCount > 0 ? totalRevenue / nonCancelledCount : 0;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: customers.length },
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(0)}` },
          { label: "Avg. Order Value", value: `$${avgOrderValue.toFixed(0)}` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <input
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-64"
        placeholder="Search customers…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Contact</th>
                <th className="px-5 py-3 text-center">Orders</th>
                <th className="px-5 py-3 text-right">Total Spent</th>
                <th className="px-5 py-3 text-left">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c, i) => (
                <tr key={c.email} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: i < 3 ? "#111827" : "#d1d5db" }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <p className="font-semibold text-gray-900">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 text-xs text-gray-500"><Mail size={11} />{c.email}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={11} />{c.phone}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {c.orderCount}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900">${c.totalSpent.toFixed(2)}</td>
                  <td className="px-5 py-3 text-gray-400">{c.lastOrder}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
