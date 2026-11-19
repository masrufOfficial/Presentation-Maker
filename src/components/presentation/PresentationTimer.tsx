"use client";

import React from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { formatTime } from "@/lib/session";

interface PresentationTimerProps {
  elapsedSec: number;
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
  compact?: boolean;
}

export function PresentationTimer({
  elapsedSec,
  running,
  onToggle,
  onReset,
  compact = false,
}: PresentationTimerProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 text-brand-navy">
      <Clock className={`w-3.5 h-3.5 ${running ? "text-brand-primary animate-pulse" : "text-slate-400"}`} />
      <span className="font-mono text-xs font-semibold tabular-nums min-w-[42px] text-center">
        {formatTime(elapsedSec)}
      </span>
      {!compact && (
        <>
          <button
            type="button"
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-blue-50 text-slate-600 hover:text-brand-primary transition-colors"
            title={running ? "Pause timer" : "Start timer"}
            aria-label={running ? "Pause presentation timer" : "Start presentation timer"}
          >
            {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="p-1 rounded-md hover:bg-slate-200/70 text-slate-500 hover:text-brand-navy transition-colors"
            title="Reset timer"
            aria-label="Reset presentation timer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </>
      )}
    </div>
  );
}
