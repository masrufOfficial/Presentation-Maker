"use client";

import React from "react";
import { motion } from "framer-motion";

interface SlideProgressProps {
  currentIndex: number;
  totalSlides: number;
}

export function SlideProgress({ currentIndex, totalSlides }: SlideProgressProps) {
  const pct = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-30 h-[3px] bg-slate-100/80 pointer-events-none"
      role="progressbar"
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={totalSlides}
      aria-label="Presentation progress"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-brand-primary via-brand-cyan to-brand-violet"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
