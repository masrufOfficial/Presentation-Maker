"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Box, Eye, CheckCircle2, AlertCircle } from "lucide-react";

export function Slide06Transparency() {
  const [explainable, setExplainable] = useState(true);

  return (
    <div className="w-full h-full flex flex-col justify-center pt-20 pb-24 px-6 sm:px-10 md:px-14 bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brand-primary mb-2">
              Section 02 — Ethical Challenges
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-brand-navy">
              Transparency &amp; AI Mistakes
            </h2>
            <p className="mt-2 text-base md:text-lg text-brand-muted">
              Two big trust issues: not knowing <em>why</em> AI decided, and AI giving confident but wrong answers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setExplainable((v) => !v)}
            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-brand-primary font-display text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            {explainable ? "Show Black-Box View" : "Open the Black Box (XAI)"}
          </button>
        </div>

        {/* Two Clean Side-by-Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Black Box vs Explainable AI */}
          <motion.div
            layout
            className={`rounded-3xl p-6 border transition-colors flex flex-col justify-between space-y-5 ${
              explainable
                ? "bg-blue-50/50 border-blue-200"
                : "bg-slate-900 border-slate-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-2 font-display text-base font-bold ${
                  explainable ? "text-brand-navy" : "text-white"
                }`}
              >
                {explainable ? (
                  <Eye className="w-5 h-5 text-brand-primary" />
                ) : (
                  <Box className="w-5 h-5 text-slate-400" />
                )}
                {explainable ? "Explainable AI (Clear Reasons)" : "Black-Box AI (Hidden Logic)"}
              </span>
              <span
                className={`text-[11px] font-display font-semibold px-2.5 py-1 rounded-full ${
                  explainable ? "bg-blue-100 text-brand-primary" : "bg-slate-800 text-slate-300"
                }`}
              >
                {explainable ? "Transparent" : "Opaque"}
              </span>
            </div>

            {explainable ? (
              <div className="space-y-2.5 text-sm text-slate-700">
                <div className="p-3.5 rounded-xl bg-white border border-blue-100">
                  <strong>Input:</strong> Patient medical scan + symptoms
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-blue-100">
                  <strong>AI Explanation:</strong> Highlights the exact region and confidence score (92%).
                </div>
                <div className="p-3.5 rounded-xl bg-brand-primary text-white font-medium">
                  Doctor can verify the reason and trust the recommendation.
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <Box className="w-12 h-12 text-slate-400 mx-auto" />
                <div className="font-display text-lg font-bold">Hidden Decision Process</div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Input goes in, answer comes out — nobody knows why. Hard to trust in healthcare, law, or finance.
                </p>
              </div>
            )}
          </motion.div>

          {/* Card 2: AI Hallucinations */}
          <div className="rounded-3xl p-6 border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-5">
            <div className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
              <AlertCircle className="w-5 h-5 text-brand-violet" />
              AI Hallucinations (Confident Mistakes)
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <strong>What happens:</strong> AI predicts likely words, so it can sometimes invent fake facts or citations while sounding 100% sure.
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <span>
                  <strong>How we fix it:</strong> Connect AI to real verified sources (RAG), show uncertainty, and always double-check critical facts.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
