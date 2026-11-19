"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface BlackoutScreenProps {
  active: boolean;
  onExit: () => void;
}

export function BlackoutScreen({ active, onExit }: BlackoutScreenProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onExit}
          className="fixed inset-0 z-50 bg-slate-950 flex items-end justify-center pb-8 cursor-pointer group"
          role="dialog"
          aria-label="Black screen mode active"
        >
          <span className="text-xs font-display tracking-widest uppercase text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Blackout Mode • Press B or click to resume
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
