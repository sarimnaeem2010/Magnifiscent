import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import { useAdmin } from "../AdminContext";
import { ShoppingBag, DollarSign, Clock, Package } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color }}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function ChartContainer({ chartData }: { chartData: { date: string; revenue: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useLayoutEffect(() => {
    if (ref.current) setWidth(ref.current.offsetWidth);
  }, []);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Revenue — Last 7 Days</h2>
      <div ref={ref} style={{ width: "100%", overflowX: "auto" }}>
        <AreaChart width={width} height={200} data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#111827" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} contentStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={2} fill="url(#revGrad)" />
        </AreaChart>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { orders, products } = useAdmin();

  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.total, 0);
    const pending = orders.filter((o) => o.status === "Pending").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    return { total, pending, delivered };
  }, [orders]);

  const chartData = useMemo(() => {
    const days: { date: string; revenue: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const revenue = orders
        .filter((o) => o.date === key && o.status !== "Cancelled")
        .reduce((s, o) => s + o.total, 0);
      days.push({ date: label, revenue });
    }
    return days;
  }, [orders]);

  const recentOrders = orders.slice(0, 6);

  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`$${stats.total.toLocaleString()}`} sub="All time" icon={DollarSign} color="#10b981" />
        <StatCard label="Total Orders" value={String(orders.length)} sub={`${stats.delivered} delivered`} icon={ShoppingBag} color="#3b82f6" />
        <StatCard label="Pending Orders" value={String(stats.pending)} sub="Awaiting action" icon={Clock} color="#f59e0b" />
        <StatCard label="Products" value={String(products.length)} sub={`${products.filter((p) => p.active).length} active`} icon={Package} color="#8b5cf6" />
      </div>

      {/* Chart */}
      <ChartContainer chartData={chartData} />

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Order</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{o.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{o.customer.name}</td>
                  <td className="px-5 py-3 text-gray-400">{o.date}</td>
                  <td className="px-5 py-3 text-right font-semibold">${o.total.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
