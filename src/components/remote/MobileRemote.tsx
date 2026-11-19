"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Crosshair,
  FileText,
  LayoutGrid,
  Moon,
  Sun,
  Unplug,
  Wifi,
  WifiOff,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { ConnectionStatus, SessionState } from "@/lib/socket";
import { createRemoteTransport, RemoteTransport } from "@/lib/realtime";
import { SLIDES, PRESENTER_INFO } from "@/data/slides";
import { SPEAKER_NOTES } from "@/data/speaker-notes";
import { formatTime } from "@/lib/session";
import { BUBTLogo } from "@/components/branding/BUBTLogo";

interface MobileRemoteProps {
  sessionId: string;
  token?: string;
  pairingCode?: string;
  mode?: string;
}

type BottomTab = "notes" | "laser" | "slides";

export function MobileRemote({ sessionId, token, pairingCode, mode }: MobileRemoteProps) {
  const transportRef = useRef<RemoteTransport | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const laserPadRef = useRef<HTMLDivElement | null>(null);
  const lastLaserEmitRef = useRef<number>(0);

  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isBlackout, setIsBlackout] = useState<boolean>(false);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerElapsedSec, setTimerElapsedSec] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<BottomTab>("notes");
  const [laserColor, setLaserColor] = useState<"blue" | "red">("blue");
  const [laserPos, setLaserPos] = useState<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 0.5,
    y: 0.5,
  });

  const vibrate = useCallback((pattern: number | number[] = 18) => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore on unsupported browsers
      }
    }
  }, []);

  // Local timer tick synced with server state
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerElapsedSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  // Connect via Socket.IO or WebRTC P2P automatically
  useEffect(() => {
    const transport = createRemoteTransport({
      sessionId,
      token,
      pairingCode,
      forcedMode: mode,
      onStatus: (st) => {
        setStatus(st);
        if (st === "connected") vibrate([20, 30, 20]);
      },
      onState: (state: SessionState) => {
        setCurrentSlide(state.currentSlide);
        setIsBlackout(state.isBlackout);
        setTimerRunning(state.timerRunning);
        setTimerElapsedSec(state.timerElapsedSec);
      },
      onSlideChanged: (idx) => setCurrentSlide(idx),
      onBlackoutChanged: (flag) => setIsBlackout(flag),
      onTimerUpdated: (running, elapsed) => {
        setTimerRunning(running);
        setTimerElapsedSec(elapsed);
      },
      onError: setErrorMsg,
    });

    transportRef.current = transport;
    return () => {
      transport.destroy();
      transportRef.current = null;
    };
  }, [sessionId, token, pairingCode, mode, vibrate]);

  const goToSlide = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), SLIDES.length - 1);
      if (clamped === currentSlide) return;
      setCurrentSlide(clamped);
      vibrate(18);
      transportRef.current?.sendSlide(clamped);
    },
    [currentSlide, vibrate]
  );

  const handleNext = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const handlePrev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  const handleToggleBlackout = () => {
    const next = !isBlackout;
    setIsBlackout(next);
    vibrate(25);
    transportRef.current?.sendBlackout(next);
  };

  const handleToggleTimer = () => {
    const next = !timerRunning;
    setTimerRunning(next);
    vibrate(15);
    transportRef.current?.sendTimer(next, timerElapsedSec);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerElapsedSec(0);
    vibrate(15);
    transportRef.current?.sendTimer(false, 0);
  };

  const handleDisconnect = () => {
    vibrate([30, 20, 30]);
    transportRef.current?.leave();
    setStatus("disconnected");
    setErrorMsg("You disconnected from the presentation.");
  };

  // Swipe gestures on the main control area
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipeStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - swipeStartRef.current.x;
    const dy = t.clientY - swipeStartRef.current.y;
    swipeStartRef.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
  };

  // Laser pointer touchpad handling (throttled ~45fps for smooth low-latency sync)
  const updateLaserFromClientPoint = (clientX: number, clientY: number) => {
    const pad = laserPadRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const x = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
    setLaserPos({ active: true, x, y });

    const now = performance.now();
    if (now - lastLaserEmitRef.current >= 22) {
      lastLaserEmitRef.current = now;
      transportRef.current?.sendLaserMove(x, y, laserColor);
    }
  };

  const endLaser = () => {
    setLaserPos((p) => ({ ...p, active: false }));
    transportRef.current?.sendLaserEnd();
  };

  const slide = SLIDES[currentSlide] || SLIDES[0];
  const nextSlide = SLIDES[currentSlide + 1] || null;
  const note = SPEAKER_NOTES[slide.id];
  const progressPct = ((currentSlide + 1) / SLIDES.length) * 100;

  return (
    <div className="min-h-dvh bg-slate-50 text-brand-navy flex flex-col max-w-lg mx-auto border-x border-slate-200/80 shadow-sm">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <BUBTLogo size="xs" />
          <div className="min-w-0">
            <div className="font-display text-xs font-bold text-brand-navy truncate">
              {PRESENTER_INFO.presentationTitle}
            </div>
            <div className="text-[10px] text-brand-muted truncate">
              {PRESENTER_INFO.fullName} • BUBT
            </div>
          </div>
        </div>

        {/* Connection Indicator */}
        <div
          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-display font-semibold border ${
            status === "connected"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : status === "connecting" || status === "reconnecting"
              ? "bg-amber-50 border-amber-200 text-amber-700"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {status === "connected" ? (
            <Wifi className="w-3 h-3" />
          ) : status === "connecting" || status === "reconnecting" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          <span className="capitalize">
            {status === "connected" ? "Live" : status}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-200 w-full">
        <div
          className="h-full bg-gradient-to-r from-brand-primary via-brand-cyan to-brand-violet transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Error / Disconnected Banner */}
      {errorMsg && (
        <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      {/* CENTER: Slide Info + Large Touch-Friendly Controls (Swipe Enabled) */}
      <section
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="p-4 space-y-4 bg-white border-b border-slate-200"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-display font-bold uppercase tracking-widest text-brand-primary">
              Section {slide.sectionId} • {slide.sectionTitle}
            </span>
            <h1 className="font-display text-lg font-bold text-brand-navy leading-snug mt-0.5">
              {slide.title}
            </h1>
          </div>
          <div className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <div className="font-display text-lg font-bold leading-none text-brand-primary tabular-nums">
              {slide.number}
            </div>
            <div className="text-[9px] font-semibold text-slate-500 mt-0.5">
              of {SLIDES.length}
            </div>
          </div>
        </div>

        {/* Large Previous & Next Touch Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentSlide === 0 || status !== "connected"}
            className="h-20 rounded-2xl bg-slate-100 active:scale-[0.98] active:bg-slate-200 disabled:opacity-40 border border-slate-200 flex flex-col items-center justify-center gap-1 text-brand-navy font-display font-bold transition-all"
          >
            <ChevronLeft className="w-7 h-7" />
            <span className="text-xs uppercase tracking-wider">Previous</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentSlide === SLIDES.length - 1 || status !== "connected"}
            className="h-20 rounded-2xl bg-brand-primary active:scale-[0.98] active:bg-blue-700 disabled:opacity-40 text-white shadow-glow-blue flex flex-col items-center justify-center gap-1 font-display font-bold transition-all"
          >
            <ChevronRight className="w-7 h-7" />
            <span className="text-xs uppercase tracking-wider">Next Slide</span>
          </button>
        </div>

        {/* Quick Utility Strip: Timer, Black Screen, Disconnect */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Timer */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
            <Clock className={`w-3.5 h-3.5 ${timerRunning ? "text-brand-primary animate-pulse" : "text-slate-400"}`} />
            <span className="font-mono text-xs font-bold tabular-nums">{formatTime(timerElapsedSec)}</span>
            <button
              type="button"
              onClick={handleToggleTimer}
              className="p-1 rounded-lg bg-white border border-slate-200 text-brand-navy"
              aria-label={timerRunning ? "Pause timer" : "Start timer"}
            >
              {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleBlackout}
              disabled={status !== "connected"}
              className={`px-3 py-2 rounded-xl text-xs font-display font-semibold inline-flex items-center gap-1.5 border transition-colors ${
                isBlackout
                  ? "bg-brand-navy text-white border-brand-navy"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              {isBlackout ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {isBlackout ? "Resume" : "Black"}
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200"
              title="Disconnect remote"
              aria-label="Disconnect remote"
            >
              <Unplug className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* BOTTOM TABS CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === "notes" && (
          <div className="space-y-4">
            {/* Next Slide Preview */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-display font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Next Slide Preview
                </div>
                <div className="font-display text-sm font-bold text-brand-navy truncate mt-0.5">
                  {nextSlide ? `${nextSlide.number}. ${nextSlide.title}` : "End of Presentation"}
                </div>
              </div>
              {note?.estimatedDuration && (
                <span className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[10px] font-display font-bold text-brand-primary">
                  ~{note.estimatedDuration}
                </span>
              )}
            </div>

            {/* Speaker Notes */}
            {note && (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-keynote-sm">
                <div>
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400">
                    Key Message
                  </div>
                  <p className="text-sm font-semibold text-brand-navy mt-0.5 leading-snug">
                    {note.keyMessage}
                  </p>
                </div>

                <div className="h-px bg-slate-100" />

                <div>
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Suggested Talking Points
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    {note.talkingPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-50 text-brand-primary font-display text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                  <span className="font-display font-bold text-brand-primary">Transition: </span>
                  {note.transitionCue}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "laser" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-sm font-bold text-brand-navy">
                  Live Projector Laser Pointer
                </div>
                <div className="text-xs text-brand-muted">
                  Touch &amp; drag below to project a live pointer on the screen.
                </div>
              </div>
              <div className="inline-flex p-1 rounded-xl bg-white border border-slate-200">
                {(["blue", "red"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setLaserColor(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-display font-semibold capitalize ${
                      laserColor === c
                        ? c === "blue"
                          ? "bg-brand-primary text-white"
                          : "bg-rose-600 text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div
              ref={laserPadRef}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                updateLaserFromClientPoint(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (e.buttons > 0 || e.pressure > 0) {
                  updateLaserFromClientPoint(e.clientX, e.clientY);
                }
              }}
              onPointerUp={endLaser}
              onPointerCancel={endLaser}
              className="relative h-64 w-full rounded-3xl bg-white border-2 border-dashed border-blue-300 shadow-inner touch-none select-none overflow-hidden flex items-center justify-center"
            >
              <div className="text-center pointer-events-none select-none">
                <Crosshair className="w-8 h-8 text-blue-300 mx-auto mb-1" />
                <div className="font-display text-xs font-semibold text-slate-400">
                  16:9 Screen Touchpad
                </div>
              </div>
              {laserPos.active && (
                <div
                  style={{
                    left: `${laserPos.x * 100}%`,
                    top: `${laserPos.y * 100}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full pointer-events-none ring-4 ${
                    laserColor === "red"
                      ? "bg-rose-600 ring-rose-300/60"
                      : "bg-brand-primary ring-blue-300/60"
                  }`}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "slides" && (
          <div className="grid grid-cols-2 gap-2.5">
            {SLIDES.map((s) => {
              const idx = s.id - 1;
              const isCurrent = idx === currentSlide;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`text-left p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? "bg-blue-50 border-brand-primary ring-2 ring-blue-200"
                      : "bg-white border-slate-200 active:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`px-1.5 py-0.5 rounded font-display text-[10px] font-bold ${
                        isCurrent ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s.number}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase">
                      Sec {s.sectionId}
                    </span>
                  </div>
                  <div className="font-display text-xs font-bold text-brand-navy line-clamp-2 leading-snug">
                    {s.shortTitle}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 grid grid-cols-3 gap-2 z-30">
        {[
          { id: "notes" as const, label: "Notes", icon: FileText },
          { id: "laser" as const, label: "Laser", icon: Crosshair },
          { id: "slides" as const, label: "Overview", icon: LayoutGrid },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                vibrate(10);
              }}
              className={`py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[11px] font-display font-semibold transition-colors ${
                active
                  ? "bg-blue-50 text-brand-primary"
                  : "text-slate-500 hover:text-brand-navy"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
