"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BUBTLogo } from "@/components/branding/BUBTLogo";

interface CountdownOverlayProps {
  active: boolean;
  onFinish: () => void;
  onCancel: () => void;
}

export function CountdownOverlay({ active, onFinish, onCancel }: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!active) {
      setCount(3);
      return;
    }
    if (count <= 0) {
      onFinish();
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 950);
    return () => clearTimeout(timer);
  }, [active, count, onFinish]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="absolute top-6 right-8">
            <BUBTLogo size="sm" showLabel withBackdrop />
          </div>
          <div className="text-xs font-display font-semibold uppercase tracking-[0.22em] text-brand-primary mb-4">
            Presentation Starting
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ scale: 0.65, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.35, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-8xl md:text-9xl font-bold text-gradient-ai"
            >
              {count > 0 ? count : "GO"}
            </motion.div>
          </AnimatePresence>
          <p className="mt-6 text-xs text-brand-muted">Click anywhere to skip</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
