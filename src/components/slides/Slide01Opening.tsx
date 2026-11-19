"use client";

import React from "react";
import { motion } from "framer-motion";
import { BUBTLogo } from "@/components/branding/BUBTLogo";
import { AnimatedPhotoCard } from "@/components/animations/AnimatedPhotoCard";
import { PRESENTER_INFO } from "@/data/slides";
import { Mail, GraduationCap, Hash } from "lucide-react";

export function Slide01Opening() {
  return (
    <div className="relative w-full h-full flex items-center bg-white overflow-y-auto">
      <div className="absolute inset-0 bg-editorial-dots bg-dots-24 opacity-35 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-14 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Title + Presenter Card */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-primary font-display text-xs font-semibold tracking-widest uppercase w-fit"
          >
            <span className="h-2 w-2 rounded-full bg-brand-primary" />
            MSc in CSE Presentation • BUBT
          </motion.div>

          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-brand-navy"
            >
              Ethical Challenges &amp;{" "}
              <span className="text-gradient-ai">Future Directions</span>{" "}
              in Advanced AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="text-base sm:text-xl text-brand-muted max-w-xl"
            >
              {PRESENTER_INFO.presentationSubtitle}
            </motion.p>
          </div>

          {/* Presenter Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="glass-panel rounded-2xl p-5 shadow-keynote-md flex flex-col sm:flex-row sm:items-center gap-5"
          >
            <BUBTLogo size="lg" className="shrink-0" />
            <div className="h-px sm:h-14 sm:w-px bg-slate-200 shrink-0" />
            <div className="space-y-1">
              <div className="text-[11px] font-display font-semibold uppercase tracking-[0.18em] text-brand-primary">
                Presented By
              </div>
              <div className="font-display text-xl font-bold text-brand-navy">
                {PRESENTER_INFO.fullName}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-700 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-brand-primary" />
                  {PRESENTER_INFO.program}
                </span>
                <span className="text-slate-300">•</span>
                <span>{PRESENTER_INFO.institution}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted pt-0.5">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Hash className="w-3.5 h-3.5 text-brand-cyan" />
                  ID: {PRESENTER_INFO.studentId}
                </span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <Mail className="w-3.5 h-3.5 text-brand-violet" />
                  {PRESENTER_INFO.email}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Animated Real AI Research Photo */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <AnimatedPhotoCard
            src="/images/real-ai-hero.jpg"
            alt="AI researcher working on data models in a modern lab"
            caption="Human-Centered AI Research"
            aspectClass="aspect-[4/3]"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
}
