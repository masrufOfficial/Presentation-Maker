"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedPhotoCardProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClass?: string;
}

/**
 * Displays a real editorial photograph with a smooth, subtle Ken Burns
 * motion animation (slow zoom & drift) cleanly contained inside a rounded frame.
 */
export function AnimatedPhotoCard({
  src,
  alt,
  caption,
  className = "",
  aspectClass = "aspect-[4/3]",
}: AnimatedPhotoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-keynote-md bg-slate-100 ${aspectClass} ${className}`}
    >
      {/* Continuous slow Ken Burns zoom + gentle pan */}
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        animate={{
          scale: [1, 1.07, 1],
          x: ["0%", "-1.5%", "0%"],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full object-cover"
      />

      {/* Subtle bottom gradient & caption */}
      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 via-slate-900/25 to-transparent px-4 py-3">
          <span className="text-xs font-display font-medium text-white tracking-wide">
            {caption}
          </span>
        </div>
      )}
    </motion.div>
  );
}
