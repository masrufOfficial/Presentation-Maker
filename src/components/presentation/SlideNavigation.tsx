"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  LayoutGrid,
  Maximize2,
  Minimize2,
  BookOpen,
  Moon,
  Home,
  FileDown,
} from "lucide-react";
import { PresentationTimer } from "./PresentationTimer";
import { ConnectionStatus } from "@/lib/socket";
import { exportPresentationPdf } from "@/lib/exportPdf";

interface SlideNavigationProps {
  visible: boolean;
  currentIndex: number;
  totalSlides: number;
  isFullscreen: boolean;
  remoteStatus: ConnectionStatus;
  remoteCount: number;
  timerElapsedSec: number;
  timerRunning: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoHome: () => void;
  onOpenOverview: () => void;
  onOpenQRModal: () => void;
  onOpenReferences: () => void;
  onToggleFullscreen: () => void;
  onToggleBlackout: () => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

export function SlideNavigation({
  visible,
  currentIndex,
  totalSlides,
  isFullscreen,
  remoteStatus,
  remoteCount,
  timerElapsedSec,
  timerRunning,
  onPrev,
  onNext,
  onGoHome,
  onOpenOverview,
  onOpenQRModal,
  onOpenReferences,
  onToggleFullscreen,
  onToggleBlackout,
  onToggleTimer,
  onResetTimer,
}: SlideNavigationProps) {
  const isRemotePaired = remoteStatus === "connected" && remoteCount > 0;

  return (
    <motion.nav
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 18,
      }}
      transition={{ duration: 0.22 }}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-[96vw] ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-label="Presentation controls"
    >
      <div className="glass-panel rounded-2xl px-2.5 py-2 shadow-keynote-lg flex items-center gap-1.5 sm:gap-2">
        {/* Home (Landing Page) */}
        <button
          type="button"
          onClick={onGoHome}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-brand-navy transition-colors"
          title="Back to Start / Phone Connection Page"
          aria-label="Back to landing page"
        >
          <Home className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-200" />

        {/* Prev / Counter / Next */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl hover:bg-blue-50 text-brand-navy disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Previous slide (Left Arrow)"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenOverview}
            className="px-2.5 py-1 rounded-lg hover:bg-slate-100 font-display text-xs font-bold tabular-nums text-brand-navy transition-colors"
            title="Open slide overview"
          >
            {String(currentIndex + 1).padStart(2, "0")}{" "}
            <span className="text-slate-400 font-normal">/ {String(totalSlides).padStart(2, "0")}</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={currentIndex === totalSlides - 1}
            className="p-2 rounded-xl hover:bg-blue-50 text-brand-navy disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Next slide (Right Arrow / Space)"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* Timer */}
        <div className="hidden md:block">
          <PresentationTimer
            elapsedSec={timerElapsedSec}
            running={timerRunning}
            onToggle={onToggleTimer}
            onReset={onResetTimer}
          />
        </div>

        <div className="h-5 w-px bg-slate-200 hidden md:block" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenQRModal}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-display font-semibold transition-all ${
              isRemotePaired
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-blue-50 text-brand-primary border border-blue-200 hover:bg-blue-100"
            }`}
            title="Connect Smartphone Remote via QR Code"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isRemotePaired ? "Phone Connected" : "Phone"}
            </span>
            {isRemotePaired && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenOverview}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-brand-navy transition-colors"
            title="Slide overview grid"
            aria-label="Slide overview"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => void exportPresentationPdf()}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-brand-primary transition-colors"
            title="Download presentation as PDF"
            aria-label="Export PDF"
          >
            <FileDown className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenReferences}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-brand-navy transition-colors"
            title="Academic references"
            aria-label="Academic references"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleBlackout}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-brand-navy transition-colors"
            title="Black screen mode (B)"
            aria-label="Toggle black screen mode"
          >
            <Moon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-brand-navy transition-colors"
            title="Toggle fullscreen (F)"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
