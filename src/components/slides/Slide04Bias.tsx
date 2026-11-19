"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

export function Slide04Bias() {
  return (
    <div className="w-full h-full flex flex-col justify-center pt-20 pb-24 px-6 sm:px-10 md:px-14 bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brand-primary mb-2">
              Section 02 — Ethical Challenges
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-brand-navy">
              Bias and Fairness
            </h2>
            <p className="mt-2 text-base md:text-lg text-brand-muted">
              AI learns from past human data. If the data is unbalanced, the AI repeats unfair decisions.
            </p>
          </div>

          {/* 3D Ethics Balance Scale Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-keynote-sm shrink-0 p-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ai-3d-ethics-balance.jpg"
              alt="3D Balanced Fairness Scale"
              className="w-full h-full object-contain rounded-xl"
              draggable={false}
            />
          </motion.div>
        </div>

        {/* Clean Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 space-y-4"
          >
            <div className="flex items-center gap-2.5 text-rose-700 font-display text-lg font-bold">
              <AlertTriangle className="w-5 h-5" />
              When Data Is Biased
            </div>
            <div className="space-y-2.5 text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-white border border-rose-100">
                <strong>1. Missing Groups:</strong> Some people are underrepresented in training data.
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-rose-100">
                <strong>2. Learned Bias:</strong> AI copies old unfair patterns in hiring, loans, or face recognition.
              </div>
              <div className="p-3.5 rounded-xl bg-rose-600 text-white font-medium flex items-center gap-2">
                <ArrowRight className="w-4 h-4 shrink-0" />
                Result: Unfair treatment &amp; lower accuracy for minorities.
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-3xl border border-blue-200 bg-blue-50/50 p-6 space-y-4"
          >
            <div className="flex items-center gap-2.5 text-brand-primary font-display text-lg font-bold">
              <CheckCircle2 className="w-5 h-5" />
              How We Make AI Fair
            </div>
            <div className="space-y-2.5 text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-white border border-blue-100">
                <strong>1. Balanced Data:</strong> Include diverse, representative examples from all groups.
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-blue-100">
                <strong>2. Regular Fairness Tests:</strong> Measure accuracy across gender, age, and region before launch.
              </div>
              <div className="p-3.5 rounded-xl bg-brand-primary text-white font-medium flex items-center gap-2">
                <ArrowRight className="w-4 h-4 shrink-0" />
                Result: Fair, inclusive decisions everyone can trust.
              </div>
            </div>
          </motion.div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 text-center">
          <strong>Real-World Study:</strong> The <em>Gender Shades</em> study (MIT, 2018) showed commercial facial recognition had much higher error rates on darker-skinned women until datasets were improved.
        </div>
      </div>
    </div>
  );
}
