"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Building2, Landmark, Globe } from "lucide-react";

const IMPACTS = [
  {
    icon: User,
    title: "People & Daily Life",
    desc: "AI influences job applications, bank loans, healthcare scans, and what we see online.",
  },
  {
    icon: Building2,
    title: "Businesses",
    desc: "Companies automate customer service, hiring, and risk checks using AI models.",
  },
  {
    icon: Landmark,
    title: "Governments & Law",
    desc: "Public services, security, and policy decisions increasingly rely on data systems.",
  },
  {
    icon: Globe,
    title: "Global Society",
    desc: "One mistake in a popular AI model can affect millions of people at the same time.",
  },
];

export function Slide03WhyEthics() {
  return (
    <div className="w-full h-full flex flex-col justify-center pt-20 pb-24 px-6 sm:px-10 md:px-14 bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="max-w-3xl">
          <div className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brand-primary mb-2">
            Section 01 — Introduction
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-brand-navy">
            Why AI Ethics Matters
          </h2>
          <p className="mt-2 text-base md:text-lg text-brand-muted">
            AI is no longer just a research tool—it makes real decisions that directly impact human lives.
          </p>
        </div>

        {/* Clean 2x2 Grid — zero absolute positioning, zero overlap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {IMPACTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                className="keynote-card rounded-2xl p-6 flex items-start gap-4 bg-white hover:border-brand-primary transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-brand-navy">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {[
            "High Autonomy → Acts with less supervision",
            "Massive Scale → Mistakes spread instantly",
            "Shared Responsibility → Ethics must guide code",
          ].map((pill) => (
            <div
              key={pill}
              className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-display font-semibold text-brand-navy"
            >
              {pill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
