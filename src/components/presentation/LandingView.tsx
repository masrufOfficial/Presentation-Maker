"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Play,
  Smartphone,
  Wifi,
  WifiOff,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Unplug,
  LayoutGrid,
  GraduationCap,
  Hash,
  Mail,
  FileDown,
} from "lucide-react";
import { BUBTLogo } from "@/components/branding/BUBTLogo";
import { PRESENTER_INFO, SLIDES } from "@/data/slides";
import { ConnectionStatus } from "@/lib/socket";
import { exportPresentationPdf } from "@/lib/exportPdf";

interface LandingViewProps {
  remoteStatus: ConnectionStatus;
  remoteCount: number;
  pairingCode: string;
  remoteUrl: string;
  socketError?: string | null;
  onStartPresentation: () => void;
  onOpenOverview: () => void;
  onDisconnectRemotes: () => void;
  onRegenerateSession: () => void;
}

export function LandingView({
  remoteStatus,
  remoteCount,
  pairingCode,
  remoteUrl,
  socketError,
  onStartPresentation,
  onOpenOverview,
  onDisconnectRemotes,
  onRegenerateSession,
}: LandingViewProps) {
  const [copied, setCopied] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const isPaired = remoteStatus === "connected" && remoteCount > 0;

  const handleExportPdf = async () => {
    if (exportingPdf) return;
    setExportingPdf(true);
    try {
      await exportPresentationPdf();
    } finally {
      setExportingPdf(false);
    }
  };

  const handleCopy = async () => {
    if (!remoteUrl) return;
    try {
      await navigator.clipboard.writeText(remoteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard restriction
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-brand-navy flex flex-col justify-between overflow-y-auto">
      {/* Subtle architectural dot backdrop */}
      <div className="fixed inset-0 bg-editorial-dots bg-dots-24 opacity-40 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 pt-6 pb-4 flex items-center justify-between gap-4">
        <BUBTLogo size="md" showLabel />
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold border ${
            isPaired
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : remoteStatus === "waiting"
              ? "bg-blue-50 border-blue-200 text-brand-primary"
              : "bg-slate-100 border-slate-200 text-slate-600"
          }`}
        >
          {isPaired ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Phone Connected ({remoteCount})
            </>
          ) : remoteStatus === "waiting" ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              Ready for Phone Pairing
            </>
          ) : remoteStatus === "connecting" || remoteStatus === "reconnecting" ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Connecting Server...
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              Server Offline
            </>
          )}
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="relative z-10 flex-1 flex items-center w-full max-w-6xl mx-auto px-6 sm:px-10 py-6">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Get Started Hero */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-primary font-display text-xs font-semibold uppercase tracking-widest">
              {SLIDES.length} Simple Slides • Academic Keynote
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-brand-navy">
                Ethical Challenges &amp;{" "}
                <span className="text-gradient-ai">Future Directions</span> in
                Advanced AI
              </h1>
              <p className="text-base sm:text-lg text-brand-muted max-w-xl leading-relaxed">
                {PRESENTER_INFO.presentationSubtitle}. Connect your smartphone
                remote on the right, then click{" "}
                <strong className="text-brand-navy">Get Started</strong> to begin
                the presentation.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartPresentation}
                className="px-7 py-4 rounded-2xl bg-brand-primary hover:bg-blue-700 active:scale-[0.99] text-white font-display font-bold text-base inline-flex items-center gap-2.5 shadow-glow-blue transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                Get Started
              </button>

              <button
                type="button"
                onClick={onOpenOverview}
                className="px-5 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-brand-navy font-display font-semibold text-sm inline-flex items-center gap-2 transition-colors"
              >
                <LayoutGrid className="w-4 h-4" />
                Preview All {SLIDES.length} Slides
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className="px-5 py-4 rounded-2xl bg-blue-50 hover:bg-blue-100 disabled:opacity-60 text-brand-primary border border-blue-200 font-display font-semibold text-sm inline-flex items-center gap-2 transition-colors"
              >
                {exportingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                {exportingPdf ? "Creating PDF..." : "Export PDF"}
              </button>
            </div>

            {/* Presenter Identity Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-1.5 max-w-xl">
              <div className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-primary">
                Presenter
              </div>
              <div className="font-display text-lg font-bold text-brand-navy">
                {PRESENTER_INFO.fullName}
              </div>
              <div className="text-xs sm:text-sm text-slate-700 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1 font-medium">
                  <GraduationCap className="w-4 h-4 text-brand-primary" />
                  {PRESENTER_INFO.program}
                </span>
                <span className="text-slate-300">•</span>
                <span>{PRESENTER_INFO.institution}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted pt-0.5">
                <span className="inline-flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-brand-cyan" />
                  ID: {PRESENTER_INFO.studentId}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-brand-violet" />
                  {PRESENTER_INFO.email}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Direct Phone Remote Connection Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="keynote-card rounded-3xl p-6 bg-white border border-slate-200 shadow-keynote-lg space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-brand-navy">
                    Connect Phone Remote
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Scan the QR code to control slides from your phone
                  </p>
                </div>
              </div>

              {/* QR Code Box */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-200/90">
                {remoteUrl ? (
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <QRCodeSVG
                      value={remoteUrl}
                      size={180}
                      level="M"
                      bgColor="#FFFFFF"
                      fgColor="#0F172A"
                    />
                  </div>
                ) : (
                  <div className="w-[180px] h-[180px] flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                    <span className="text-xs text-center">
                      Generating session QR...
                    </span>
                  </div>
                )}

                {pairingCode && (
                  <div className="mt-4 w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-xs text-brand-muted font-medium">
                      Pairing Code
                    </span>
                    <span className="font-mono text-sm font-bold tracking-[0.2em] text-brand-navy">
                      {pairingCode}
                    </span>
                  </div>
                )}
              </div>

              {socketError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {socketError}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                {remoteUrl && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-brand-primary border border-blue-200 font-display text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Link Copied" : "Copy Remote Link"}
                  </button>
                )}

                {isPaired ? (
                  <button
                    type="button"
                    onClick={onDisconnectRemotes}
                    className="py-2.5 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-display text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Unplug className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onRegenerateSession}
                    className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy font-display text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                    title="Generate new QR code"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Shortcut Hints */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>Keyboard: ← / → Navigate • F Fullscreen • B Black Screen</span>
        <span>Phone Remote supports Swipe, Speaker Notes &amp; Laser Pointer</span>
      </footer>
    </div>
  );
}
