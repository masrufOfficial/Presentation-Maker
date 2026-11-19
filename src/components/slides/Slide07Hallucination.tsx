"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScanFace, Briefcase, UserCheck } from "lucide-react";

const CARDS = [
  {
    icon: ScanFace,
    tag: "Information Trust",
    title: "Deepfakes & Fake Media",
    points: [
      "AI can copy real voices and faces in seconds.",
      "Raises risks of online scams and fake news.",
      "Solution: Digital watermarks & media verification.",
    ],
    accent: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    icon: Briefcase,
    tag: "Work & Economy",
    title: "Changing Jobs & Inequality",
    points: [
      "AI automates routine tasks and boosts speed.",
      "Creates new roles, but requires worker reskilling.",
      "Solution: Fair access to education & AI tools.",
    ],
    accent: "text-brand-primary bg-blue-50 border-blue-200",
  },
  {
    icon: UserCheck,
    tag: "Safety Boundaries",
    title: "Keeping Humans in Control",
    points: [
      "Autonomous AI agents can take real actions.",
      "High-risk decisions need human approval (HITL).",
      "Solution: Clear limits and emergency overrides.",
    ],
    accent: "text-violet-700 bg-violet-50 border-violet-200",
  },
];

export function Slide07Hallucination() {
  return (
    <div className="w-full h-full flex flex-col justify-center pt-20 pb-24 px-6 sm:px-10 md:px-14 bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <div className="max-w-3xl">
          <div className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brand-primary mb-2">
            Section 02 — Ethical Challenges
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-brand-navy">
            Deepfakes, Jobs &amp; Human Control
          </h2>
          <p className="mt-2 text-base md:text-lg text-brand-muted">
            Three major real-world impacts that affect society, careers, and everyday safety.
          </p>
        </div>

        {/* Clean 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1, duration: 0.45 }}
                className="keynote-card rounded-3xl p-6 flex flex-col justify-between bg-white hover:border-brand-primary transition-colors space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${card.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-display font-semibold uppercase tracking-wider text-slate-400">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-navy">
                    {card.title}
                  </h3>
                  <ul className="space-y-2.5 text-sm text-slate-600 leading-relaxed">
                    {card.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
