"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, UserCheck, Database } from "lucide-react";
import { AnimatedPhotoCard } from "@/components/animations/AnimatedPhotoCard";

const PRIVACY_POINTS = [
  {
    icon: Database,
    title: "Massive Data Collection",
    desc: "AI models train on huge amounts of personal text, photos, and online behavior.",
  },
  {
    icon: UserCheck,
    title: "Consent & Ownership",
    desc: "People should know how their data is used and have the right to say no.",
  },
  {
    icon: Lock,
    title: "Privacy-Safe AI Tools",
    desc: "Differential Privacy and Federated Learning let AI learn without exposing raw personal data.",
  },
];

export function Slide05Privacy() {
  return (
    <div className="w-full h-full flex flex-col justify-center pt-20 pb-24 px-6 sm:px-10 md:px-14 bg-white overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Animated Real Digital Privacy Photo */}
        <div className="lg:col-span-5 space-y-4">
          <AnimatedPhotoCard
            src="/images/real-privacy-security.jpg"
            alt="Person securely using a smartphone and laptop in a bright office"
            caption="Protecting Personal Identity & Consent"
            aspectClass="aspect-[4/3]"
          />

          <div className="flex flex-wrap justify-center gap-2">
            {["Explicit Consent", "Differential Privacy", "Federated Learning"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-display font-semibold text-brand-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Simple Clear Points */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brand-primary mb-2">
              Section 02 — Ethical Challenges
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-brand-navy">
              Privacy and Data Protection
            </h2>
            <p className="mt-2 text-base text-brand-muted">
              As facial recognition and data tracking grow, protecting personal privacy is a top priority.
            </p>
          </div>

          <div className="space-y-3.5">
            {PRIVACY_POINTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-brand-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-navy">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
