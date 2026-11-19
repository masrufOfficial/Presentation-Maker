"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Database, Layers, Sparkles, Bot } from "lucide-react";

const STAGES = [
  {
    step: "01",
    era: "1950s – 1980s",
    title: "Rule-Based AI",
    desc: "Computers followed fixed if-then rules written by humans.",
    icon: Cpu,
    color: "from-slate-600 to-slate-700",
  },
  {
    step: "02",
    era: "1990s – 2000s",
    title: "Machine Learning",
    desc: "Systems started learning patterns directly from real data.",
    icon: Database,
    color: "from-blue-500 to-blue-600",
  },
  {
    step: "03",
    era: "2012 – 2017",
    title: "Deep Learning",
    desc: "Neural networks mastered image, speech, and language tasks.",
    icon: Layers,
    color: "from-indigo-500 to-blue-600",
  },
  {
    step: "04",
    era: "2020 – 2024",
    title: "Generative AI",
    desc: "AI began writing text, coding, and creating realistic images.",
    icon: Sparkles,
    color: "from-cyan-500 to-blue-600",
  },
  {
    step: "05",
    era: "Today & Next",
    title: "AI Agents",
    desc: "Smart assistants that plan, use tools, and complete tasks.",
    icon: Bot,
    color: "from-violet-500 to-brand-primary",
  },
];

export function Slide02Revolution() {
  return (
    <div className="w-full h-full flex flex-col justify-center pt-20 pb-24 px-6 sm:px-10 md:px-14 bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="max-w-3xl">
          <div className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brand-primary mb-2">
            Section 01 — Introduction
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-brand-navy">
            How AI Evolved
          </h2>
          <p className="mt-2 text-base md:text-lg text-brand-muted">
            In just a few decades, AI moved from simple rules to systems that learn, create, and act on their own.
          </p>
        </div>

        {/* Clean 5-Card Responsive Grid (zero overlap) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                className="keynote-card rounded-2xl p-5 flex flex-col justify-between bg-white hover:border-brand-primary transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stage.color} text-white flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-display text-xs font-bold text-slate-300">
                      {stage.step}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-primary">
                    {stage.era}
                  </div>
                  <h3 className="font-display text-lg font-bold text-brand-navy mt-1">
                    {stage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-sm text-brand-navy text-center font-medium">
          As AI becomes faster and more independent, <strong className="text-brand-primary">ethical guidelines</strong> become essential.
        </div>
      </div>
    </div>
  );
}
