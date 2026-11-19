"use client";

import React from "react";
import { motion } from "framer-motion";
import { BUBTLogo } from "@/components/branding/BUBTLogo";
import { PRESENTER_INFO } from "@/data/slides";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 1650);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center space-y-5"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute -inset-4 rounded-full bg-blue-200/60 blur-xl"
          />
          <BUBTLogo size="xl" withBackdrop className="relative px-4 py-3 rounded-2xl" />
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] font-display font-semibold uppercase tracking-[0.22em] text-brand-primary">
            {PRESENTER_INFO.institutionShort} • {PRESENTER_INFO.program}
          </div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-brand-navy max-w-md">
            {PRESENTER_INFO.presentationTitle}
          </h1>
          <p className="text-xs text-brand-muted">
            Preparing interactive slides &amp; real-time remote engine...
          </p>
        </div>

        <div className="w-52 h-1 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full bg-gradient-to-r from-brand-primary via-brand-cyan to-brand-violet rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
