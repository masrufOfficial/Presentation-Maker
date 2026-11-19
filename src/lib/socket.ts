"use client";

import { io, Socket } from "socket.io-client";

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "waiting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "expired"
  | "error";

export interface SessionState {
  sessionId: string;
  pairingCode: string;
  currentSlide: number;
  totalSlides: number;
  isBlackout: boolean;
  timerRunning: boolean;
  timerElapsedSec: number;
  remoteCount: number;
  presenterConnected: boolean;
  expiresAt: number;
}

export interface LaserState {
  active: boolean;
  x: number;
  y: number;
  color: "blue" | "red";
  timestamp: number;
}

export function getSocketServerUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    // Fallback for local LAN development when NEXT_PUBLIC_SOCKET_URL is unset
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${window.location.hostname}:4001`;
  }
  return "";
}

export function createPresentationSocket(): Socket {
  const url = getSocketServerUrl();
  return io(url, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    autoConnect: true,
  });
}
