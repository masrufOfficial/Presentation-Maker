"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "@/data/slides";
import { ConnectionStatus, LaserState } from "@/lib/socket";
import { createPresenterTransport, PresenterTransport } from "@/lib/realtime";
import { LandingView } from "./LandingView";
import { SlideRenderer } from "./SlideRenderer";
import { SlideNavigation } from "./SlideNavigation";
import { SlideProgress } from "./SlideProgress";
import { SlideOverview } from "./SlideOverview";
import { ReferencesPanel } from "./ReferencesPanel";
import { LaserPointer } from "./LaserPointer";
import { BlackoutScreen } from "./BlackoutScreen";
import { QRConnectionModal } from "@/components/remote/QRConnectionModal";

interface PresentationShellProps {
  initialView?: "landing" | "presenting";
}

export function PresentationShell({ initialView = "landing" }: PresentationShellProps) {
  const transportRef = useRef<PresenterTransport | null>(null);
  const toolbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const laserHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [viewMode, setViewMode] = useState<"landing" | "presenting">(initialView);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);

  const [overviewOpen, setOverviewOpen] = useState(false);
  const [referencesOpen, setReferencesOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Presentation Timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerElapsedSec, setTimerElapsedSec] = useState(0);

  // Realtime Remote Session State
  const [remoteStatus, setRemoteStatus] = useState<ConnectionStatus>("connecting");
  const [remoteCount, setRemoteCount] = useState(0);
  const [pairingCode, setPairingCode] = useState("");
  const [remoteUrl, setRemoteUrl] = useState("");
  const [socketError, setSocketError] = useState<string | null>(null);

  // Laser pointer state
  const [laser, setLaser] = useState<LaserState>({
    active: false,
    x: 0.5,
    y: 0.5,
    color: "blue",
    timestamp: 0,
  });

  // Live state ref for transport callbacks
  const stateRef = useRef({
    currentSlide: 0,
    isBlackout: false,
    timerRunning: false,
    timerElapsedSec: 0,
  });
  useEffect(() => {
    stateRef.current = {
      currentSlide: currentIndex,
      isBlackout,
      timerRunning,
      timerElapsedSec,
    };
  }, [currentIndex, isBlackout, timerRunning, timerElapsedSec]);

  // Timer tick
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerElapsedSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  // Core navigation function
  const navigateTo = useCallback((nextIdx: number, emitToRemote = true) => {
    const clamped = Math.min(Math.max(nextIdx, 0), SLIDES.length - 1);
    const prevIdx = stateRef.current.currentSlide;
    setViewMode("presenting");
    if (clamped === prevIdx) return;

    setDirection(clamped > prevIdx ? 1 : -1);
    setCurrentIndex(clamped);

    if (emitToRemote) {
      transportRef.current?.sendSlide(clamped);
    }
  }, []);

  const handleNext = useCallback(
    () => navigateTo(stateRef.current.currentSlide + 1),
    [navigateTo]
  );
  const handlePrev = useCallback(
    () => navigateTo(stateRef.current.currentSlide - 1),
    [navigateTo]
  );

  // Initialize unified real-time transport (Socket.IO locally or with env URL; PeerJS WebRTC automatically on Vercel!)
  useEffect(() => {
    const transport = createPresenterTransport({
      totalSlides: SLIDES.length,
      getState: () => stateRef.current,
      onStatus: setRemoteStatus,
      onSessionReady: ({ pairingCode: code, remoteUrl: url }) => {
        setPairingCode(code);
        setRemoteUrl(url);
      },
      onRemoteCount: setRemoteCount,
      onSlideFromRemote: (idx) => navigateTo(idx, false),
      onBlackoutFromRemote: (flag) => setIsBlackout(flag),
      onTimerFromRemote: (running, elapsed) => {
        setTimerRunning(running);
        setTimerElapsedSec(elapsed);
      },
      onLaserFromRemote: (payload) => {
        setLaser(payload);
        if (laserHideTimerRef.current) clearTimeout(laserHideTimerRef.current);
        if (payload.active) {
          laserHideTimerRef.current = setTimeout(() => {
            setLaser((prev) => ({ ...prev, active: false }));
          }, 1600);
        }
      },
      onError: setSocketError,
    });

    transportRef.current = transport;

    return () => {
      if (laserHideTimerRef.current) clearTimeout(laserHideTimerRef.current);
      transport.destroy();
      transportRef.current = null;
    };
  }, [navigateTo]);

  // Fullscreen management
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen denial
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleBlackout = useCallback(() => {
    setIsBlackout((prev) => {
      const next = !prev;
      transportRef.current?.sendBlackout(next);
      return next;
    });
  }, []);

  const toggleTimer = useCallback(() => {
    setTimerRunning((prev) => {
      const next = !prev;
      transportRef.current?.sendTimer(next, stateRef.current.timerElapsedSec);
      return next;
    });
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerElapsedSec(0);
    transportRef.current?.sendTimer(false, 0);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "Escape") {
        if (overviewOpen) setOverviewOpen(false);
        else if (referencesOpen) setReferencesOpen(false);
        else if (qrModalOpen) setQrModalOpen(false);
        else if (isBlackout) toggleBlackout();
        return;
      }

      if (viewMode === "landing" || overviewOpen || referencesOpen || qrModalOpen) return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          handleNext();
          break;
        case "ArrowLeft":
        case "Backspace":
        case "PageUp":
          e.preventDefault();
          handlePrev();
          break;
        case "Home":
          e.preventDefault();
          navigateTo(0);
          break;
        case "End":
          e.preventDefault();
          navigateTo(SLIDES.length - 1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "b":
        case "B":
          e.preventDefault();
          toggleBlackout();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    viewMode,
    handleNext,
    handlePrev,
    navigateTo,
    toggleFullscreen,
    toggleBlackout,
    overviewOpen,
    referencesOpen,
    qrModalOpen,
    isBlackout,
  ]);

  // Auto-hide toolbar in presenting mode
  useEffect(() => {
    if (viewMode !== "presenting") return;
    const showToolbar = () => {
      setToolbarVisible(true);
      if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);
      toolbarTimerRef.current = setTimeout(() => {
        if (!overviewOpen && !referencesOpen && !qrModalOpen) {
          setToolbarVisible(false);
        }
      }, 3400);
    };

    showToolbar();
    window.addEventListener("mousemove", showToolbar);
    window.addEventListener("touchstart", showToolbar);
    return () => {
      window.removeEventListener("mousemove", showToolbar);
      window.removeEventListener("touchstart", showToolbar);
      if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);
    };
  }, [viewMode, overviewOpen, referencesOpen, qrModalOpen]);

  const handleDisconnectRemotes = () => {
    transportRef.current?.disconnectRemotes();
  };

  const handleRegenerateSession = () => {
    transportRef.current?.regenerateSession();
  };

  const handleStartPresentation = () => {
    setViewMode("presenting");
    setCurrentIndex(0);
    setTimerRunning(true);
    transportRef.current?.sendSlide(0);
    transportRef.current?.sendTimer(true, timerElapsedSec);
  };

  return (
    <div className="relative w-screen min-h-screen bg-white">
      {viewMode === "landing" ? (
        <LandingView
          remoteStatus={remoteStatus}
          remoteCount={remoteCount}
          pairingCode={pairingCode}
          remoteUrl={remoteUrl}
          socketError={socketError}
          onStartPresentation={handleStartPresentation}
          onOpenOverview={() => setOverviewOpen(true)}
          onDisconnectRemotes={handleDisconnectRemotes}
          onRegenerateSession={handleRegenerateSession}
        />
      ) : (
        <div className="relative w-screen h-screen overflow-hidden bg-white">
          <SlideProgress currentIndex={currentIndex} totalSlides={SLIDES.length} />
          <SlideRenderer currentIndex={currentIndex} direction={direction} />
          <SlideNavigation
            visible={toolbarVisible || overviewOpen || referencesOpen || qrModalOpen}
            currentIndex={currentIndex}
            totalSlides={SLIDES.length}
            isFullscreen={isFullscreen}
            remoteStatus={remoteStatus}
            remoteCount={remoteCount}
            timerElapsedSec={timerElapsedSec}
            timerRunning={timerRunning}
            onPrev={handlePrev}
            onNext={handleNext}
            onGoHome={() => setViewMode("landing")}
            onOpenOverview={() => setOverviewOpen(true)}
            onOpenQRModal={() => setQrModalOpen(true)}
            onOpenReferences={() => setReferencesOpen(true)}
            onToggleFullscreen={toggleFullscreen}
            onToggleBlackout={toggleBlackout}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
          />
          <LaserPointer laser={laser} />
          <BlackoutScreen active={isBlackout} onExit={toggleBlackout} />
        </div>
      )}

      <SlideOverview
        open={overviewOpen}
        currentIndex={currentIndex}
        onSelect={(idx) => navigateTo(idx)}
        onClose={() => setOverviewOpen(false)}
      />

      <ReferencesPanel
        open={referencesOpen}
        currentSlideId={SLIDES[currentIndex]?.id ?? 1}
        onClose={() => setReferencesOpen(false)}
      />

      <QRConnectionModal
        open={qrModalOpen}
        status={remoteStatus}
        remoteCount={remoteCount}
        pairingCode={pairingCode}
        remoteUrl={remoteUrl}
        errorMessage={socketError}
        onClose={() => setQrModalOpen(false)}
        onDisconnectRemotes={handleDisconnectRemotes}
        onRegenerateSession={handleRegenerateSession}
      />
    </div>
  );
}
