import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
import App from "./App";
import "./index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 600, margin: "60px auto" }}>
          <h2 style={{ color: "#ef4444", marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: "#374151", marginBottom: 8 }}>{err.message}</p>
          <pre style={{ background: "#f3f4f6", padding: 16, borderRadius: 8, fontSize: 12, overflowX: "auto", color: "#6b7280" }}>
            {err.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 20, padding: "8px 20px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
