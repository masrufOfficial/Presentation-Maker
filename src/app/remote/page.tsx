"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { BUBTLogo } from "@/components/branding/BUBTLogo";
import { getSocketServerUrl } from "@/lib/socket";
import { PRESENTER_INFO } from "@/data/slides";

export default function ManualPairingPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cleaned.length !== 6) {
      setError("Please enter the 6-character pairing code shown on the laptop screen.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const serverUrl = getSocketServerUrl();
      const res = await fetch(`${serverUrl}/api/sessions/resolve-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pairingCode: cleaned }),
      });
      const data = await res.json();
      if (!res.ok || !data?.sessionId) {
        setError(data?.error || "Pairing code not found or expired.");
        setLoading(false);
        return;
      }
      router.push(
        `/remote/${encodeURIComponent(data.sessionId)}?code=${encodeURIComponent(cleaned)}`
      );
    } catch {
      setError("Could not reach the real-time presentation server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-5">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-keynote-lg p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <BUBTLogo size="md" />
          <div>
            <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-brand-primary">
              Wireless Presentation Remote
            </span>
            <h1 className="font-display text-xl font-bold text-brand-navy mt-1">
              Enter Pairing Code
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              {PRESENTER_INFO.presentationTitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label
              htmlFor="pairing-code"
              className="block text-xs font-display font-semibold text-slate-600 mb-1.5"
            >
              6-Character Code (e.g. ABC-123)
            </label>
            <input
              id="pairing-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC-123"
              maxLength={7}
              autoComplete="off"
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 text-center font-mono text-xl font-bold tracking-[0.25em] text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-primary hover:bg-blue-700 disabled:opacity-60 text-white font-display font-bold text-sm inline-flex items-center justify-center gap-2 shadow-glow-blue transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
            <span>{loading ? "Connecting..." : "Connect Remote"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
