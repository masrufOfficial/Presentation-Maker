"use client";

import React from "react";

interface BUBTLogoProps {
  /** Visual size preset */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Show institutional text label beside the crest */
  showLabel?: boolean;
  /** Compact pill container with subtle white backdrop for high legibility over animations */
  withBackdrop?: boolean;
  className?: string;
}

const SIZE_MAP = {
  xs: { img: "h-7 w-7", title: "text-[10px]", sub: "text-[9px]" },
  sm: { img: "h-9 w-9", title: "text-xs", sub: "text-[10px]" },
  md: { img: "h-11 w-11", title: "text-xs", sub: "text-[10px]" },
  lg: { img: "h-14 w-14", title: "text-sm", sub: "text-xs" },
  xl: { img: "h-20 w-20", title: "text-base", sub: "text-xs" },
};

/**
 * Official BUBT institutional logo component.
 * Uses the unmodified original asset at /images/BUBT-Logo.png with object-contain
 * to preserve exact proportions, colors, and transparency.
 */
export function BUBTLogo({
  size = "md",
  showLabel = false,
  withBackdrop = false,
  className = "",
}: BUBTLogoProps) {
  const s = SIZE_MAP[size];

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        withBackdrop
          ? "bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-keynote-sm"
          : ""
      } ${className}`}
      aria-label="Bangladesh University of Business and Technology (BUBT)"
    >
      <div className={`relative shrink-0 flex items-center justify-center ${s.img}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/BUBT-Logo.png"
          alt="Official BUBT University Logo"
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>
      {showLabel && (
        <div className="flex flex-col leading-tight text-left">
          <span className={`font-display font-bold tracking-tight text-brand-navy ${s.title}`}>
            BUBT
          </span>
          <span className={`font-medium text-brand-muted ${s.sub}`}>
            MSc in CSE
          </span>
        </div>
      )}
    </div>
  );
}
