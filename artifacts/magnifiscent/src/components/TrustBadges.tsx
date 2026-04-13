import { ShieldCheck, Truck, CreditCard, Lock } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "100% Authentic", sub: "Genuine fragrances" },
  { icon: Truck, label: "Cash on Delivery", sub: "Pay at your door" },
  { icon: CreditCard, label: "Free Delivery", sub: "On qualifying orders" },
  { icon: Lock, label: "Secure Checkout", sub: "SSL encrypted" },
];

export function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      {BADGES.map(({ icon: Icon, label, sub }) => (
        <div
          key={label}
          className="flex flex-col items-center text-center gap-1.5 py-3 px-2 bg-gray-50 border border-gray-100 rounded"
        >
          <Icon size={20} className="text-gray-700 flex-shrink-0" />
          <p className="text-xs font-bold text-gray-800 leading-tight">{label}</p>
          <p className="text-[11px] text-gray-400 leading-tight">{sub}</p>
        </div>
      ))}
    </div>
  );
}
