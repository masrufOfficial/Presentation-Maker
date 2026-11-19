"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, Lock, Eye, ClipboardCheck, HeartHandshake } from "lucide-react";

const PILLARS = [
  { icon: Scale, title: "1. Fairness", desc: "Treat all users equally and test for hidden bias." },
  { icon: ShieldCheck, title: "2. Safety", desc: "Prevent harmful actions and set strict safety limits." },
  { icon: Lock, title: "3. Privacy", desc: "Protect personal data and respect user consent." },
  { icon: Eye, title: "4. Transparency", desc: "Explain how AI works and when AI is being used." },
  { icon: ClipboardCheck, title: "5. Accountability", desc: "Clear human ownership when something goes wrong." },
  { icon: HeartHandshake, title: "6. Human-First", desc: "Build AI to support people, not replace human dignity." },
];

export function Slide08Autonomy() {
  return (
    <div className="w-full h-full flex flex-col justify-center pt-20 pb-24 px-6 sm:px-10 md:px-14 bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="max-w-3xl">
          <div className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brand-primary mb-2">
            Section 03 — Future Directions
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-brand-navy">
            Six Pillars of Responsible AI
          </h2>
          <p className="mt-2 text-base md:text-lg text-brand-muted">
            Simple, practical principles that guide engineers from the first line of code to real-world launch.
          </p>
        </div>

        {/* Clean 3x2 Grid — zero overlap on any screen size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + idx * 0.07, duration: 0.4 }}
                className="keynote-card rounded-2xl p-5 flex items-start gap-4 bg-white hover:border-brand-primary transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-brand-navy">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
