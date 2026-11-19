"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, BookOpen } from "lucide-react";
import { REFERENCES } from "@/data/references";
import { BUBTLogo } from "@/components/branding/BUBTLogo";

interface ReferencesPanelProps {
  open: boolean;
  currentSlideId: number;
  onClose: () => void;
}

export function ReferencesPanel({
  open,
  currentSlideId,
  onClose,
}: ReferencesPanelProps) {
  const [filterMode, setFilterMode] = useState<"slide" | "all">("all");

  const list =
    filterMode === "slide"
      ? REFERENCES.filter((r) => r.relevantSlides.includes(currentSlideId))
      : REFERENCES;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-sm flex justify-end"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col"
            role="dialog"
            aria-label="Academic references"
          >
            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BUBTLogo size="xs" />
                <div>
                  <h2 className="font-display text-lg font-bold text-brand-navy flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-primary" />
                    Academic References
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Verified peer-reviewed papers &amp; international governance frameworks
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-600"
                aria-label="Close references"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold ${
                  filterMode === "all"
                    ? "bg-brand-primary text-white"
                    : "bg-white border border-slate-200 text-slate-600"
                }`}
              >
                All Sources ({REFERENCES.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("slide")}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold ${
                  filterMode === "slide"
                    ? "bg-brand-primary text-white"
                    : "bg-white border border-slate-200 text-slate-600"
                }`}
              >
                Relevant to Slide {String(currentSlideId).padStart(2, "0")}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {list.length === 0 ? (
                <div className="text-center py-10 text-sm text-brand-muted">
                  No specific citations tagged for this slide. Switch to &ldquo;All Sources&rdquo; to browse the full bibliography.
                </div>
              ) : (
                list.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-brand-primary text-[10px] font-display font-bold uppercase tracking-wider">
                        {ref.category}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {ref.organization} • {ref.year}
                      </span>
                    </div>
                    <p className="text-xs text-brand-navy leading-relaxed font-medium">
                      {ref.citation}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">
                        Slides: {ref.relevantSlides.map((n) => String(n).padStart(2, "0")).join(", ")}
                      </span>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-display font-semibold text-brand-primary hover:underline"
                      >
                        View Source <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
