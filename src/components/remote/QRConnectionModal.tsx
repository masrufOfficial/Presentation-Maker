"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  X,
  Smartphone,
  Wifi,
  WifiOff,
  RefreshCw,
  Copy,
  Check,
  Unplug,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ConnectionStatus } from "@/lib/socket";
import { BUBTLogo } from "@/components/branding/BUBTLogo";

interface QRConnectionModalProps {
  open: boolean;
  status: ConnectionStatus;
  remoteCount: number;
  pairingCode: string;
  remoteUrl: string;
  errorMessage?: string | null;
  onClose: () => void;
  onDisconnectRemotes: () => void;
  onRegenerateSession: () => void;
}

export function QRConnectionModal({
  open,
  status,
  remoteCount,
  pairingCode,
  remoteUrl,
  errorMessage,
  onClose,
  onDisconnectRemotes,
  onRegenerateSession,
}: QRConnectionModalProps) {
  const [copied, setCopied] = useState(false);

  const isPaired = status === "connected" && remoteCount > 0;

  const handleCopy = async () => {
    if (!remoteUrl) return;
    try {
      await navigator.clipboard.writeText(remoteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  const renderStatusBadge = () => {
    if (isPaired) {
      return (
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-display text-xs font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          REMOTE CONNECTED ({remoteCount})
        </span>
      );
    }
    switch (status) {
      case "waiting":
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-primary font-display text-xs font-semibold">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            Waiting for connection...
          </span>
        );
      case "connecting":
      case "reconnecting":
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-display text-xs font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {status === "reconnecting" ? "Reconnecting..." : "Creating secure session..."}
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-display text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            Session expired
          </span>
        );
      case "disconnected":
      case "error":
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-display text-xs font-semibold">
            <WifiOff className="w-3.5 h-3.5" />
            Disconnected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 font-display text-xs font-semibold">
            Initializing...
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BUBTLogo size="xs" />
                <div>
                  <h2
                    id="qr-modal-title"
                    className="font-display text-base font-bold tracking-tight text-brand-navy"
                  >
                    CONNECT YOUR DEVICE
                  </h2>
                  <p className="text-[11px] text-brand-muted">
                    Scan the QR code to control this presentation from your smartphone.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center text-center space-y-5">
              {renderStatusBadge()}

              {/* QR Code Container */}
              <div className="relative p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-keynote-sm">
                {remoteUrl ? (
                  <QRCodeSVG
                    value={remoteUrl}
                    size={208}
                    level="M"
                    bgColor="#FFFFFF"
                    fgColor="#0F172A"
                    includeMargin={false}
                  />
                ) : (
                  <div className="w-[208px] h-[208px] flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="w-7 h-7 animate-spin text-brand-primary" />
                    <span className="text-xs">Connecting to real-time server...</span>
                  </div>
                )}
              </div>

              {/* Pairing Code & Copyable URL */}
              {pairingCode && (
                <div className="w-full space-y-2.5">
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-medium text-brand-muted flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-brand-primary" />
                      Pairing Code
                    </span>
                    <span className="font-mono text-base font-bold tracking-[0.2em] text-brand-navy">
                      {pairingCode}
                    </span>
                  </div>

                  {remoteUrl && (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={remoteUrl}
                        aria-label="Mobile remote URL"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 truncate focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-brand-primary border border-blue-200 text-xs font-display font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="w-full p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 text-left">
                  {errorMessage}
                </div>
              )}

              {/* Controls */}
              <div className="w-full flex items-center gap-2.5 pt-1">
                {isPaired ? (
                  <button
                    type="button"
                    onClick={onDisconnectRemotes}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-display text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <Unplug className="w-4 h-4" />
                    Disconnect Device
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onRegenerateSession}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy font-display text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New Session
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl bg-brand-primary hover:bg-blue-700 text-white font-display text-xs font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
