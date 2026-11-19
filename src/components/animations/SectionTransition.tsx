"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BUBTLogo } from "@/components/branding/BUBTLogo";

interface SectionTransitionProps {
  visible: boolean;
  sectionId: string;
  sectionTitle: string;
}

export function SectionTransition({
  visible,
  sectionId,
  sectionTitle,
}: SectionTransitionProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl"
        >
          <div className="absolute top-6 right-8">
            <BUBTLogo size="sm" showLabel withBackdrop />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-center px-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-brand-primary font-display text-xs font-semibold tracking-[0.22em] uppercase mb-4">
              Section {sectionId}
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-brand-navy">
              {sectionTitle}
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 h-1 w-28 mx-auto rounded-full bg-gradient-to-r from-brand-primary via-brand-cyan to-brand-violet origin-center"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
