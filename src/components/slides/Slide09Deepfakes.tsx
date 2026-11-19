"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Heart, Sparkles, Globe, Scale, ShieldCheck, Landmark } from "lucide-react";

const TECH_DIRECTIONS = [
  {
    icon: Bot,
    title: "Helpful AI Agents",
    desc: "Specialized assistants collaborating on research, coding, and workflows under human guidance.",
  },
  {
    icon: Heart,
    title: "Human Value Alignment",
    desc: "Training AI with human feedback (RLHF) and clear ethical principles.",
  },
  {
    icon: Sparkles,
    title: "Careful AGI Research",
    desc: "Advancing general reasoning step-by-step while keeping safety ahead of capability.",
  },
];

const GLOBAL_RULES = [
  { icon: Scale, name: "EU AI Act", desc: "Risk-based legal rules for high-impact AI." },
  { icon: Globe, name: "UNESCO AI Ethics", desc: "Global human-rights standard for 193 nations." },
  { icon: ShieldCheck, name: "NIST AI RMF", desc: "Practical guide to manage AI risks safely." },
  { icon: Landmark, name: "OECD AI Principles", desc: "Shared international norms for trustworthy AI." },
];

export function Slide09Deepfakes() {
  return (
    <div className="w-full h-full flex flex-col justify-center pt-20 pb-24 px-6 sm:px-10 md:px-14 bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brand-primary mb-2">
              Section 03 — Future Directions
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-brand-navy">
              Future of AI &amp; Global Rules
            </h2>
            <p className="mt-2 text-base md:text-lg text-brand-muted">
              Building the next generation of AI requires both smarter engineering and global cooperation.
            </p>
          </div>

          {/* 3D Futuristic Crystal Globe */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-keynote-sm shrink-0 p-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ai-3d-future-globe.jpg"
              alt="3D Translucent Global AI Governance Globe"
              className="w-full h-full object-contain rounded-xl"
              draggable={false}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-display font-bold uppercase tracking-widest text-brand-primary">
              Where AI Technology Is Going
            </div>
            {TECH_DIRECTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08 }}
                  className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-navy">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-display font-bold uppercase tracking-widest text-brand-primary">
              Global Governance Frameworks
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {GLOBAL_RULES.map((rule, idx) => {
                const Icon = rule.icon;
                return (
                  <motion.div
                    key={rule.name}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.08 }}
                    className="keynote-card rounded-2xl p-4 bg-white space-y-2"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-brand-primary flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-display text-base font-bold text-brand-navy">
                      {rule.name}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
