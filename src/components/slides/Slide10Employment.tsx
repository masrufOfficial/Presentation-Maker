"use client";

import React from "react";
import { motion } from "framer-motion";
import { BUBTLogo } from "@/components/branding/BUBTLogo";
import { PRESENTER_INFO } from "@/data/slides";
import { CheckCircle2, Mail, Hash, GraduationCap, MessageCircleQuestion } from "lucide-react";

const TAKEAWAYS = [
  "Smart AI must always come with strong ethics and responsibility.",
  "Fairness, privacy, and clear explanations build real public trust.",
  "Humans must stay in control of important AI decisions.",
  "Global cooperation keeps AI safe and fair for everyone.",
];

export function Slide10Employment() {
  return (
    <div className="w-full h-full flex flex-col justify-center pt-20 pb-24 px-6 sm:px-10 md:px-14 bg-white overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-7">
        {/* Core Quote */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-primary font-display text-xs font-semibold uppercase tracking-[0.2em]">
            Section 04 — Conclusion
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-brand-navy leading-snug max-w-4xl mx-auto">
            “The real measure of advanced AI is not how{" "}
            <span className="text-gradient-ai">smart</span> it becomes, but how{" "}
            <span className="text-gradient-blue">responsibly</span> we build and use it.”
          </h2>
        </motion.div>

        {/* 4 Simple Key Takeaways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {TAKEAWAYS.map((point, idx) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.08 }}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-brand-navy leading-snug">
                {point}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Thank You & Presenter Footer Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="keynote-card rounded-3xl p-6 bg-gradient-to-r from-blue-50/70 via-white to-slate-50 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <BUBTLogo size="lg" />
            <div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-brand-navy">
                THANK YOU!
              </div>
              <div className="text-sm text-brand-muted">
                Let&apos;s Build an Intelligent Future, Responsibly.
              </div>
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-primary text-xs font-display font-semibold">
                <MessageCircleQuestion className="w-3.5 h-3.5" />
                Questions &amp; Discussion
              </div>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1 text-xs text-slate-600">
            <div className="font-display text-base font-bold text-brand-navy">
              {PRESENTER_INFO.fullName}
            </div>
            <div className="inline-flex items-center gap-1 font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-brand-primary" />
              {PRESENTER_INFO.program}, {PRESENTER_INFO.institutionShort}
            </div>
            <div className="flex items-center justify-center md:justify-end gap-3 pt-0.5">
              <span className="inline-flex items-center gap-1">
                <Hash className="w-3 h-3 text-brand-cyan" />
                {PRESENTER_INFO.studentId}
              </span>
              <span className="inline-flex items-center gap-1 text-brand-primary font-medium">
                <Mail className="w-3 h-3" />
                {PRESENTER_INFO.email}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
