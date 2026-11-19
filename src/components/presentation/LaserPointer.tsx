"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LaserState } from "@/lib/socket";

interface LaserPointerProps {
  laser: LaserState;
}

/**
 * Renders the synchronized projector laser pointer driven by the presenter's smartphone touchpad.
 */
export function LaserPointer({ laser }: LaserPointerProps) {
  const isRed = laser.color === "red";

  return (
    <AnimatePresence>
      {laser.active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.14 }}
          style={{
            left: `${laser.x * 100}%`,
            top: `${laser.y * 100}%`,
          }}
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          {/* Outer halo */}
          <div
            className={`w-10 h-10 rounded-full blur-md opacity-55 ${
              isRed ? "bg-rose-500" : "bg-blue-500"
            }`}
          />
          {/* Crisp core dot */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-lg ${
              isRed ? "bg-rose-600" : "bg-brand-primary"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
