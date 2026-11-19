"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { SLIDES } from "@/data/slides";
import {
  ConnectionStatus,
  createPresentationSocket,
  LaserState,
  SessionState,
} from "@/lib/socket";
import {
  buildRemoteUrl,
  clearPresenterSession,
  loadPresenterSession,
  savePresenterSession,
} from "@/lib/session";
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
  const socketRef = useRef<Socket | null>(null);
  const toolbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const laserHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSlideRef = useRef<number>(0);

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
  const [remoteStatus, setRemoteStatus] = useState<ConnectionStatus>("idle");
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

  useEffect(() => {
    currentSlideRef.current = currentIndex;
  }, [currentIndex]);

  // Timer tick
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerElapsedSec((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  // Core navigation function (emits to socket when initiated locally)
  const navigateTo = useCallback((nextIdx: number, emitToSocket = true) => {
    const clamped = Math.min(Math.max(nextIdx, 0), SLIDES.length - 1);
    const prevIdx = currentSlideRef.current;
    setViewMode("presenting");
    if (clamped === prevIdx) return;

    setDirection(clamped > prevIdx ? 1 : -1);
    setCurrentIndex(clamped);

    if (emitToSocket && socketRef.current?.connected) {
      socketRef.current.emit("slide:change", { index: clamped });
    }
  }, []);

  const handleNext = useCallback(() => navigateTo(currentSlideRef.current + 1), [navigateTo]);
  const handlePrev = useCallback(() => navigateTo(currentSlideRef.current - 1), [navigateTo]);

  // Initialize / Reconnect Socket.IO session
  const createFreshSession = useCallback((socket: Socket) => {
    setRemoteStatus("connecting");
    setSocketError(null);
    socket.emit(
      "presenter:create-session",
      { totalSlides: SLIDES.length, currentSlide: currentSlideRef.current },
      (res: {
        ok: boolean;
        sessionId: string;
        token: string;
        pairingCode: string;
        state: SessionState;
      }) => {
        if (res?.ok) {
          savePresenterSession({
            sessionId: res.sessionId,
            token: res.token,
            pairingCode: res.pairingCode,
          });
          setPairingCode(res.pairingCode);
          setRemoteUrl(buildRemoteUrl(res.sessionId, res.token));
          setRemoteCount(res.state.remoteCount);
          setRemoteStatus(res.state.remoteCount > 0 ? "connected" : "waiting");
        } else {
          setRemoteStatus("error");
          setSocketError("Failed to create presentation session.");
        }
      }
    );
  }, []);

  const initOrRestoreSession = useCallback(
    (socket: Socket) => {
      const saved = loadPresenterSession();
      if (saved) {
        setRemoteStatus("connecting");
        socket.emit(
          "presenter:rejoin-session",
          { sessionId: saved.sessionId, token: saved.token },
          (res: { ok: boolean; state?: SessionState }) => {
            if (res?.ok && res.state && res.state.totalSlides === SLIDES.length) {
              setPairingCode(saved.pairingCode);
              setRemoteUrl(buildRemoteUrl(saved.sessionId, saved.token));
              setRemoteCount(res.state.remoteCount);
              setRemoteStatus(res.state.remoteCount > 0 ? "connected" : "waiting");
              return;
            }
            clearPresenterSession();
            createFreshSession(socket);
          }
        );
      } else {
        createFreshSession(socket);
      }
    },
    [createFreshSession]
  );

  useEffect(() => {
    const socket = createPresentationSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketError(null);
      initOrRestoreSession(socket);
    });

    socket.on("disconnect", () => {
      setRemoteStatus("reconnecting");
    });

    socket.on("connect_error", () => {
      setRemoteStatus("disconnected");
      setSocketError(
        "Real-time remote server unreachable. Make sure the Socket.IO server is running."
      );
    });

    socket.on("remote:connected", (payload: { remoteCount: number }) => {
      setRemoteCount(payload.remoteCount);
      setRemoteStatus(payload.remoteCount > 0 ? "connected" : "waiting");
    });

    socket.on("remote:disconnected", (payload: { remoteCount: number }) => {
      setRemoteCount(payload.remoteCount);
      setRemoteStatus(payload.remoteCount > 0 ? "connected" : "waiting");
    });

    socket.on("slide:changed", (payload: { index: number; source?: string }) => {
      if (payload?.source === "remote" && typeof payload.index === "number") {
        navigateTo(payload.index, false);
      }
    });

    socket.on("blackout:changed", (payload: { isBlackout: boolean; source?: string }) => {
      if (payload?.source === "remote") {
        setIsBlackout(Boolean(payload.isBlackout));
      }
    });

    socket.on(
      "timer:updated",
      (payload: { timerRunning: boolean; timerElapsedSec: number; source?: string }) => {
        if (payload?.source === "remote") {
          setTimerRunning(Boolean(payload.timerRunning));
          if (typeof payload.timerElapsedSec === "number") {
            setTimerElapsedSec(payload.timerElapsedSec);
          }
        }
      }
    );

    socket.on("laser:update", (payload: LaserState) => {
      setLaser(payload);
      if (laserHideTimerRef.current) clearTimeout(laserHideTimerRef.current);
      if (payload.active) {
        laserHideTimerRef.current = setTimeout(() => {
          setLaser((prev) => ({ ...prev, active: false }));
        }, 1600);
      }
    });

    socket.on("session:expired", () => {
      clearPresenterSession();
      setRemoteStatus("expired");
      setRemoteCount(0);
    });

    return () => {
      if (laserHideTimerRef.current) clearTimeout(laserHideTimerRef.current);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [initOrRestoreSession, navigateTo]);

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
      socketRef.current?.emit("blackout:toggle", { isBlackout: next });
      return next;
    });
  }, []);

  const toggleTimer = useCallback(() => {
    setTimerRunning((prev) => {
      const next = !prev;
      socketRef.current?.emit("timer:sync", {
        timerRunning: next,
        timerElapsedSec,
      });
      return next;
    });
  }, [timerElapsedSec]);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerElapsedSec(0);
    socketRef.current?.emit("timer:sync", {
      timerRunning: false,
      timerElapsedSec: 0,
    });
  }, []);

  // Keyboard controls (active in presentation mode)
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

  // Automatic toolbar hiding after 3.4s of mouse inactivity
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
    socketRef.current?.emit("presenter:disconnect-remotes");
  };

  const handleRegenerateSession = () => {
    clearPresenterSession();
    if (socketRef.current?.connected) {
      createFreshSession(socketRef.current);
    } else {
      socketRef.current?.connect();
    }
  };

  const handleStartPresentation = () => {
    setViewMode("presenting");
    setCurrentIndex(0);
    setTimerRunning(true);
    socketRef.current?.emit("slide:change", { index: 0 });
    socketRef.current?.emit("timer:sync", { timerRunning: true, timerElapsedSec });
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

      {/* Shared Modals (work on both Landing Page & Slides) */}
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
