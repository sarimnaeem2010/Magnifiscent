import React, { useState, useRef } from "react";
import { Download, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export function AdminExport() {
  const [exportStatus, setExportStatus] = useState<Status>("idle");
  const [importStatus, setImportStatus] = useState<Status>("idle");
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setExportStatus("loading");
    try {
      const token = sessionStorage.getItem("adminToken") || "";
      const res = await fetch("/api/admin/export", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `magnifiscent-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportStatus("success");
      setTimeout(() => setExportStatus("idle"), 3000);
    } catch {
      setExportStatus("error");
      setTimeout(() => setExportStatus("idle"), 4000);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus("loading");
    setImportMessage("");
    setImportError("");
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const token = sessionStorage.getItem("adminToken") || "";
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Import failed");

      const counts = Object.entries(json.imported as Record<string, number>)
        .map(([k, v]) => `${v} ${k}`)
        .join(", ");
      setImportMessage(`Successfully imported: ${counts}`);
      setImportStatus("success");
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed. Make sure the file is a valid export.");
      setImportStatus("error");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Export / Import</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sync your store data between Replit and Hostinger (or any other instance).
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>How to sync Replit → Hostinger:</strong>
        <ol className="mt-2 space-y-1 list-decimal list-inside">
          <li>Click <strong>Export</strong> on Replit to download a JSON file</li>
          <li>Log into your Hostinger admin panel</li>
          <li>Click <strong>Import</strong> and upload the JSON file</li>
          <li>All your products, images, settings and deals will be copied over</li>
        </ol>
      </div>

      <div className="grid gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">Export Store Data</h2>
              <p className="text-sm text-gray-500 mt-1">
                Downloads all products, images, deals, settings, and content as a JSON file.
              </p>
              <button
                onClick={handleExport}
                disabled={exportStatus === "loading"}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: exportStatus === "error" ? "#dc2626" : "#111827" }}
              >
                {exportStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {exportStatus === "success" && <CheckCircle className="w-4 h-4" />}
                {exportStatus === "error" && <AlertCircle className="w-4 h-4" />}
                {exportStatus === "idle" && <Download className="w-4 h-4" />}
                {exportStatus === "loading" ? "Exporting..." :
                 exportStatus === "success" ? "Downloaded!" :
                 exportStatus === "error" ? "Export Failed" : "Export"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Upload className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">Import Store Data</h2>
              <p className="text-sm text-gray-500 mt-1">
                Upload a previously exported JSON file to overwrite this store's data. Existing records will be updated.
              </p>

              <input
                ref={fileRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className={`mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors border ${
                  importStatus === "loading"
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-800 border-gray-300 hover:border-gray-900"
                }`}
              >
                {importStatus === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {importStatus === "success" && <CheckCircle className="w-4 h-4 text-green-600" />}
                {importStatus === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}
                {importStatus === "idle" && <Upload className="w-4 h-4" />}
                {importStatus === "loading" ? "Importing..." :
                 importStatus === "success" ? "Import Complete" :
                 importStatus === "error" ? "Try Again" : "Choose JSON File"}
              </label>

              {importStatus === "success" && importMessage && (
                <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  {importMessage}
                </div>
              )}
              {importStatus === "error" && importError && (
                <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {importError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Note: Orders and customer data are not included in exports to protect customer privacy.
      </p>
    </div>
  );
}
