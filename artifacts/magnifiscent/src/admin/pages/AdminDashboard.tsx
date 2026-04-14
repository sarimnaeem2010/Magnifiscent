import React, { useMemo, useState } from "react";
import { useAdmin } from "../AdminContext";
import { ShoppingBag, DollarSign, Clock, Package, Loader } from "lucide-react";

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

function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; revenue: number } | null>(null);

  const W = 680;
  const H = 180;
  const padL = 48;
  const padR = 12;
  const padT = 12;
  const padB = 28;

  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const maxRev = Math.max(...data.map((d) => d.revenue), 1);
  const step = innerW / (data.length - 1 || 1);

  const points = data.map((d, i) => ({
    x: padL + i * step,
    y: padT + innerH - (d.revenue / maxRev) * innerH,
    ...d,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const fillPath =
    `M ${points[0].x},${padT + innerH} ` +
    points.map((p) => `L ${p.x},${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x},${padT + innerH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    val: Math.round(maxRev * f),
    y: padT + innerH - f * innerH,
  }));

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", minWidth: 320 }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111827" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#111827" stopOpacity={0} />
          </linearGradient>
        </defs>

        {yTicks.map((t) => (
          <g key={t.y}>
            <line x1={padL} y1={t.y} x2={W - padR} y2={t.y} stroke="#f1f5f9" strokeWidth={1} />
            <text x={padL - 6} y={t.y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
              ${t.val}
            </text>
          </g>
        ))}

        <path d={fillPath} fill="url(#areaGrad)" />

        <polyline
          points={polyline}
          fill="none"
          stroke="#111827"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((p, i) => (
          <g key={i}>
            <text x={p.x} y={H - 6} textAnchor="middle" fontSize={10} fill="#9ca3af">
              {p.date}
            </text>
            <circle
              cx={p.x}
              cy={p.y}
              r={14}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setTooltip({ x: p.x, y: p.y, date: p.date, revenue: p.revenue })}
            />
            {tooltip && tooltip.date === p.date && (
              <circle cx={p.x} cy={p.y} r={4} fill="#111827" />
            )}
          </g>
        ))}
      </svg>

      {tooltip && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white text-xs rounded px-2.5 py-1.5 shadow-lg"
          style={{
            left: `calc(${(tooltip.x / W) * 100}% - 40px)`,
            top: `calc(${(tooltip.y / H) * 100}% - 40px)`,
            whiteSpace: "nowrap",
          }}
        >
          <div className="font-semibold">{tooltip.date}</div>
          <div>PKR {tooltip.revenue.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const { orders, products } = useAdmin();

  const stats = useMemo(() => {
    const deliveredOrders = orders.filter((o) => o.status === "Delivered");
    const processingOrders = orders.filter((o) => o.status === "Processing");
    const deliveredTotal = deliveredOrders.reduce((s, o) => s + o.total, 0);
    const processingTotal = processingOrders.reduce((s, o) => s + o.total, 0);
    const pending = orders.filter((o) => o.status === "Pending").length;
    const delivered = deliveredOrders.length;
    return { deliveredTotal, processingTotal, pending, delivered };
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Delivered Revenue" value={`PKR ${stats.deliveredTotal.toLocaleString()}`} sub={`${stats.delivered} delivered orders`} icon={DollarSign} color="#10b981" />
        <StatCard label="Processing Revenue" value={`PKR ${stats.processingTotal.toLocaleString()}`} sub="Orders in processing" icon={Loader} color="#3b82f6" />
        <StatCard label="Total Orders" value={String(orders.length)} sub={`${stats.delivered} delivered`} icon={ShoppingBag} color="#6366f1" />
        <StatCard label="Pending Orders" value={String(stats.pending)} sub="Awaiting action" icon={Clock} color="#f59e0b" />
        <StatCard label="Products" value={String(products.length)} sub={`${products.filter((p) => p.active).length} active`} icon={Package} color="#8b5cf6" />
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Revenue — Last 7 Days</h2>
        <RevenueChart data={chartData} />
      </div>

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
