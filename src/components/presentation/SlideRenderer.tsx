"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SLIDE_COMPONENTS } from "@/components/slides";
import { SLIDES } from "@/data/slides";
import { BUBTLogo } from "@/components/branding/BUBTLogo";

interface SlideRendererProps {
  currentIndex: number;
  direction: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 48 : -48,
    opacity: 0,
    scale: 0.99,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? -48 : 48,
    opacity: 0,
    scale: 0.99,
  }),
};

/**
 * Renders the active slide with smooth cinematic transitions while keeping the official
 * BUBT institutional logo consistently anchored and visible across all 20 slides.
 */
export function SlideRenderer({ currentIndex, direction }: SlideRendererProps) {
  const SlideComponent = SLIDE_COMPONENTS[currentIndex] || SLIDE_COMPONENTS[0];
  const meta = SLIDES[currentIndex] || SLIDES[0];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-white select-none">
      {/* Persistent Top-Right Institutional BUBT Branding — stays above all slide animations & transitions */}
      <div className="fixed top-4 right-5 md:top-5 md:right-7 z-30 pointer-events-none">
        <BUBTLogo size="sm" showLabel withBackdrop />
      </div>

      {/* Subtle Top-Left Slide Number / Section Indicator (hidden on Opening Slide 01 for pure hero aesthetic) */}
      {currentIndex > 0 && currentIndex < SLIDES.length - 1 && (
        <div className="fixed top-5 left-6 md:left-8 z-30 pointer-events-none hidden sm:flex items-center gap-2.5 text-[11px] font-display font-semibold tracking-wider uppercase text-slate-400">
          <span className="text-brand-primary">{meta.number}</span>
          <span>/</span>
          <span>{String(SLIDES.length).padStart(2, "0")}</span>
          <span className="text-slate-300">•</span>
          <span>{meta.sectionTitle}</span>
        </div>
      )}

      {/* Animated Slide Viewport */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full overflow-y-auto"
        >
          <SlideComponent />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
