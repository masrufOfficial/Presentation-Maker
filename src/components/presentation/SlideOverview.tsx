"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SLIDES, SECTIONS } from "@/data/slides";
import { BUBTLogo } from "@/components/branding/BUBTLogo";

interface SlideOverviewProps {
  open: boolean;
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function SlideOverview({
  open,
  currentIndex,
  onSelect,
  onClose,
}: SlideOverviewProps) {
  const [sectionFilter, setSectionFilter] = useState<string>("ALL");

  const filteredSlides =
    sectionFilter === "ALL"
      ? SLIDES
      : SLIDES.filter((s) => s.sectionId === sectionFilter);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Slide overview"
        >
          {/* Header */}
          <div className="px-6 md:px-10 py-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-white/80">
            <div className="flex items-center gap-4">
              <BUBTLogo size="sm" showLabel />
              <div className="h-7 w-px bg-slate-200 hidden sm:block" />
              <div>
                <h2 className="font-display text-lg md:text-xl font-bold text-brand-navy">
                  Slide Overview ({SLIDES.length} Slides)
                </h2>
                <p className="text-xs text-brand-muted">
                  Select any slide to jump immediately
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Close slide overview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Filter Tabs */}
          <div className="px-6 md:px-10 py-3 border-b border-slate-100 flex items-center gap-2 overflow-x-auto bg-slate-50/60">
            <button
              type="button"
              onClick={() => setSectionFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-display font-semibold whitespace-nowrap transition-colors ${
                sectionFilter === "ALL"
                  ? "bg-brand-primary text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              All {SLIDES.length} Slides
            </button>
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSectionFilter(sec.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-display font-semibold whitespace-nowrap transition-colors ${
                  sectionFilter === sec.id
                    ? "bg-brand-primary text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                {sec.id}. {sec.title} ({sec.slideRange})
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredSlides.map((slide) => {
                const idx = slide.id - 1;
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => {
                      onSelect(idx);
                      onClose();
                    }}
                    className={`text-left rounded-2xl p-4 border transition-all flex flex-col justify-between min-h-[140px] ${
                      isActive
                        ? "bg-blue-50/80 border-brand-primary ring-2 ring-blue-200 shadow-keynote-md"
                        : "bg-white border-slate-200 hover:border-brand-primary hover:shadow-keynote-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-md font-display text-xs font-bold ${
                          isActive
                            ? "bg-brand-primary text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {slide.number}
                      </span>
                      <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-slate-400">
                        Sec {slide.sectionId}
                      </span>
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-brand-navy leading-snug">
                        {slide.shortTitle}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {slide.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
