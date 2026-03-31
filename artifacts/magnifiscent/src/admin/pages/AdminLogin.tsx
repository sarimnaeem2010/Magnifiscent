import React, { useState } from "react";
import { Crown, Lock } from "lucide-react";
import { useAdmin } from "../AdminContext";

export function AdminLogin() {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const ok = login(password);
      if (!ok) setError("Incorrect password. Please try again.");
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f172a" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: "rgba(251,191,36,0.15)" }}>
            <Crown size={32} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">MagnifiScent</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Sign In</h2>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest text-white transition-colors"
            style={{ background: loading ? "#6b7280" : "#111827" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Default password: <span className="font-mono font-semibold text-gray-600">admin123</span>
          </p>
        </form>
      </div>
    </div>
  );
}
