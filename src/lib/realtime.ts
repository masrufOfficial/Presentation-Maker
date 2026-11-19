"use client";

import type { DataConnection, Peer as PeerType } from "peerjs";
import type { Socket } from "socket.io-client";
import {
  ConnectionStatus,
  createPresentationSocket,
  LaserState,
  SessionState,
} from "./socket";
import {
  buildRemoteUrl,
  clearPresenterSession,
  loadPresenterSession,
  savePresenterSession,
} from "./session";

export type TransportMode = "socket" | "p2p";

/**
 * Automatically chooses PeerJS WebRTC P2P when deployed on Vercel (or any HTTPS host)
 * without a separate NEXT_PUBLIC_SOCKET_URL backend, so QR phone remote works with zero config!
 */
export function detectTransportMode(forcedMode?: string | null): TransportMode {
  if (forcedMode === "p2p") return "p2p";
  if (forcedMode === "socket") return "socket";

  const envUrl = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (envUrl) return "socket";

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.startsWith("172.");
    if (isLocal) return "socket";
  }

  return "p2p";
}

function randomCode(len = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const arr = new Uint8Array(len);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
  } else {
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function randomToken(): string {
  const arr = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function p2pPeerIdFromCode(cleanCode: string): string {
  return `bubt-ai-${cleanCode.toUpperCase().replace(/[^A-Z0-9]/g, "")}`;
}

export interface PresenterTransportCallbacks {
  totalSlides: number;
  getState: () => {
    currentSlide: number;
    isBlackout: boolean;
    timerRunning: boolean;
    timerElapsedSec: number;
  };
  onStatus: (status: ConnectionStatus) => void;
  onSessionReady: (info: { pairingCode: string; remoteUrl: string }) => void;
  onRemoteCount: (count: number) => void;
  onSlideFromRemote: (index: number) => void;
  onBlackoutFromRemote: (isBlackout: boolean) => void;
  onTimerFromRemote: (running: boolean, elapsedSec: number) => void;
  onLaserFromRemote: (laser: LaserState) => void;
  onError: (msg: string | null) => void;
}

export interface PresenterTransport {
  mode: TransportMode;
  sendSlide: (index: number) => void;
  sendBlackout: (isBlackout: boolean) => void;
  sendTimer: (timerRunning: boolean, timerElapsedSec: number) => void;
  disconnectRemotes: () => void;
  regenerateSession: () => void;
  destroy: () => void;
}

export function createPresenterTransport(
  cb: PresenterTransportCallbacks
): PresenterTransport {
  const mode = detectTransportMode();

  if (mode === "socket") {
    let socket: Socket | null = createPresentationSocket();

    const createFresh = () => {
      if (!socket) return;
      cb.onStatus("connecting");
      cb.onError(null);
      const st = cb.getState();
      socket.emit(
        "presenter:create-session",
        { totalSlides: cb.totalSlides, currentSlide: st.currentSlide },
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
            cb.onSessionReady({
              pairingCode: res.pairingCode,
              remoteUrl: buildRemoteUrl(res.sessionId, res.token, "socket"),
            });
            cb.onRemoteCount(res.state.remoteCount);
            cb.onStatus(res.state.remoteCount > 0 ? "connected" : "waiting");
          } else {
            cb.onStatus("error");
            cb.onError("Failed to create presentation session.");
          }
        }
      );
    };

    const initOrRestore = () => {
      if (!socket) return;
      const saved = loadPresenterSession();
      if (saved) {
        cb.onStatus("connecting");
        socket.emit(
          "presenter:rejoin-session",
          { sessionId: saved.sessionId, token: saved.token },
          (res: { ok: boolean; state?: SessionState }) => {
            if (res?.ok && res.state && res.state.totalSlides === cb.totalSlides) {
              cb.onSessionReady({
                pairingCode: saved.pairingCode,
                remoteUrl: buildRemoteUrl(saved.sessionId, saved.token, "socket"),
              });
              cb.onRemoteCount(res.state.remoteCount);
              cb.onStatus(res.state.remoteCount > 0 ? "connected" : "waiting");
              return;
            }
            clearPresenterSession();
            createFresh();
          }
        );
      } else {
        createFresh();
      }
    };

    socket.on("connect", () => {
      cb.onError(null);
      initOrRestore();
    });
    socket.on("disconnect", () => cb.onStatus("reconnecting"));
    socket.on("connect_error", () => {
      cb.onStatus("disconnected");
      cb.onError("Real-time server unreachable. Check Socket.IO server.");
    });
    socket.on("remote:connected", (p: { remoteCount: number }) => {
      cb.onRemoteCount(p.remoteCount);
      cb.onStatus(p.remoteCount > 0 ? "connected" : "waiting");
    });
    socket.on("remote:disconnected", (p: { remoteCount: number }) => {
      cb.onRemoteCount(p.remoteCount);
      cb.onStatus(p.remoteCount > 0 ? "connected" : "waiting");
    });
    socket.on("slide:changed", (p: { index: number; source?: string }) => {
      if (p?.source === "remote" && typeof p.index === "number") {
        cb.onSlideFromRemote(p.index);
      }
    });
    socket.on("blackout:changed", (p: { isBlackout: boolean; source?: string }) => {
      if (p?.source === "remote") cb.onBlackoutFromRemote(Boolean(p.isBlackout));
    });
    socket.on(
      "timer:updated",
      (p: { timerRunning: boolean; timerElapsedSec: number; source?: string }) => {
        if (p?.source === "remote") {
          cb.onTimerFromRemote(Boolean(p.timerRunning), Number(p.timerElapsedSec) || 0);
        }
      }
    );
    socket.on("laser:update", (p: LaserState) => cb.onLaserFromRemote(p));
    socket.on("session:expired", () => {
      clearPresenterSession();
      cb.onStatus("expired");
      cb.onRemoteCount(0);
    });

    return {
      mode: "socket",
      sendSlide: (index) => socket?.emit("slide:change", { index }),
      sendBlackout: (isBlackout) => socket?.emit("blackout:toggle", { isBlackout }),
      sendTimer: (timerRunning, timerElapsedSec) =>
        socket?.emit("timer:sync", { timerRunning, timerElapsedSec }),
      disconnectRemotes: () => socket?.emit("presenter:disconnect-remotes"),
      regenerateSession: () => {
        clearPresenterSession();
        if (socket?.connected) createFresh();
        else socket?.connect();
      },
      destroy: () => {
        socket?.disconnect();
        socket = null;
      },
    };
  }

  // ---- P2P WebRTC Mode (Zero-Config for Vercel) ----
  let peer: PeerType | null = null;
  const connections = new Set<DataConnection>();
  let destroyed = false;
  let activeToken = "";
  let activeCleanCode = "";

  const broadcast = (msg: Record<string, unknown>) => {
    for (const conn of connections) {
      if (conn.open) {
        try {
          conn.send(msg);
        } catch {
          // Ignore send errors on closing channel
        }
      }
    }
  };

  const syncCount = () => {
    const count = connections.size;
    cb.onRemoteCount(count);
    cb.onStatus(count > 0 ? "connected" : "waiting");
  };

  const startPeer = async () => {
    if (destroyed) return;
    cb.onStatus("connecting");
    cb.onError(null);

    if (peer) {
      try {
        peer.destroy();
      } catch {
        // Ignore
      }
      peer = null;
    }
    connections.clear();

    try {
      const { Peer } = await import("peerjs");
      if (destroyed) return;

      activeCleanCode = randomCode(6);
      const formattedCode = `${activeCleanCode.slice(0, 3)}-${activeCleanCode.slice(3)}`;
      activeToken = randomToken();
      const peerId = p2pPeerIdFromCode(activeCleanCode);

      const p = new Peer(peerId, {
        secure: true,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      });
      peer = p;

      p.on("open", (id: string) => {
        if (destroyed) return;
        cb.onError(null);
        cb.onSessionReady({
          pairingCode: formattedCode,
          remoteUrl: buildRemoteUrl(id, activeToken, "p2p"),
        });
        cb.onRemoteCount(0);
        cb.onStatus("waiting");
      });

      p.on("connection", (conn: DataConnection) => {
        const meta = (conn.metadata || {}) as { token?: string; pairingCode?: string };
        const cleanMetaCode = String(meta.pairingCode || "")
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "");
        const authorized =
          (Boolean(meta.token) && meta.token === activeToken) ||
          (cleanMetaCode.length === 6 && cleanMetaCode === activeCleanCode);

        conn.on("open", () => {
          if (!authorized) {
            try {
              conn.send({ type: "auth:error", error: "Invalid pairing token or code." });
            } catch {
              // Ignore
            }
            setTimeout(() => conn.close(), 150);
            return;
          }

          connections.add(conn);
          syncCount();

          const st = cb.getState();
          conn.send({
            type: "session:state",
            state: {
              sessionId: peerId,
              pairingCode: formattedCode,
              currentSlide: st.currentSlide,
              totalSlides: cb.totalSlides,
              isBlackout: st.isBlackout,
              timerRunning: st.timerRunning,
              timerElapsedSec: st.timerElapsedSec,
              remoteCount: connections.size,
              presenterConnected: true,
              expiresAt: Date.now() + 7200_000,
            } satisfies SessionState,
          });
        });

        conn.on("data", (raw: unknown) => {
          if (!authorized || typeof raw !== "object" || !raw) return;
          const msg = raw as Record<string, unknown>;
          switch (msg.type) {
            case "slide:change":
              if (typeof msg.index === "number") {
                cb.onSlideFromRemote(msg.index);
                broadcast({ type: "slide:changed", index: msg.index });
              }
              break;
            case "blackout:toggle":
              if (typeof msg.isBlackout === "boolean") {
                cb.onBlackoutFromRemote(msg.isBlackout);
                broadcast({ type: "blackout:changed", isBlackout: msg.isBlackout });
              }
              break;
            case "timer:sync":
              cb.onTimerFromRemote(
                Boolean(msg.timerRunning),
                Number(msg.timerElapsedSec) || 0
              );
              broadcast({
                type: "timer:updated",
                timerRunning: Boolean(msg.timerRunning),
                timerElapsedSec: Number(msg.timerElapsedSec) || 0,
              });
              break;
            case "laser:move":
              cb.onLaserFromRemote({
                active: true,
                x: Math.min(Math.max(Number(msg.x) || 0.5, 0), 1),
                y: Math.min(Math.max(Number(msg.y) || 0.5, 0), 1),
                color: msg.color === "red" ? "red" : "blue",
                timestamp: Date.now(),
              });
              break;
            case "laser:end":
              cb.onLaserFromRemote({
                active: false,
                x: 0.5,
                y: 0.5,
                color: "blue",
                timestamp: Date.now(),
              });
              break;
            case "remote:leave":
              connections.delete(conn);
              conn.close();
              syncCount();
              break;
          }
        });

        conn.on("close", () => {
          connections.delete(conn);
          syncCount();
        });

        conn.on("error", () => {
          connections.delete(conn);
          syncCount();
        });
      });

      p.on("disconnected", () => {
        if (!destroyed) {
          cb.onStatus("reconnecting");
          try {
            p.reconnect();
          } catch {
            // Ignore
          }
        }
      });

      p.on("error", () => {
        if (!destroyed) {
          cb.onStatus("disconnected");
          cb.onError("Could not connect to pairing cloud. Click Refresh to retry.");
        }
      });
    } catch {
      cb.onStatus("error");
      cb.onError("WebRTC pairing is not supported in this browser.");
    }
  };

  void startPeer();

  return {
    mode: "p2p",
    sendSlide: (index) => broadcast({ type: "slide:changed", index }),
    sendBlackout: (isBlackout) => broadcast({ type: "blackout:changed", isBlackout }),
    sendTimer: (timerRunning, timerElapsedSec) =>
      broadcast({ type: "timer:updated", timerRunning, timerElapsedSec }),
    disconnectRemotes: () => {
      for (const conn of connections) {
        try {
          conn.send({ type: "remote:kicked", reason: "Disconnected by presenter." });
          setTimeout(() => conn.close(), 120);
        } catch {
          // Ignore
        }
      }
      connections.clear();
      syncCount();
    },
    regenerateSession: () => {
      void startPeer();
    },
    destroy: () => {
      destroyed = true;
      for (const conn of connections) {
        try {
          conn.close();
        } catch {
          // Ignore
        }
      }
      connections.clear();
      try {
        peer?.destroy();
      } catch {
        // Ignore
      }
      peer = null;
    },
  };
}

export interface RemoteTransportCallbacks {
  sessionId: string;
  token?: string;
  pairingCode?: string;
  forcedMode?: string | null;
  onStatus: (status: ConnectionStatus) => void;
  onState: (state: SessionState) => void;
  onSlideChanged: (index: number) => void;
  onBlackoutChanged: (isBlackout: boolean) => void;
  onTimerUpdated: (running: boolean, elapsedSec: number) => void;
  onError: (msg: string | null) => void;
}

export interface RemoteTransport {
  mode: TransportMode;
  sendSlide: (index: number) => void;
  sendBlackout: (isBlackout: boolean) => void;
  sendTimer: (timerRunning: boolean, timerElapsedSec: number) => void;
  sendLaserMove: (x: number, y: number, color: "blue" | "red") => void;
  sendLaserEnd: () => void;
  leave: () => void;
  destroy: () => void;
}

export function createRemoteTransport(
  cb: RemoteTransportCallbacks
): RemoteTransport {
  const mode = detectTransportMode(cb.forcedMode);

  if (mode === "socket") {
    let socket: Socket | null = createPresentationSocket();

    const join = () => {
      socket?.emit(
        "remote:join-session",
        { sessionId: cb.sessionId, token: cb.token, pairingCode: cb.pairingCode },
        (res: { ok: boolean; code?: string; error?: string; state?: SessionState }) => {
          if (res?.ok && res.state) {
            cb.onStatus("connected");
            cb.onError(null);
            cb.onState(res.state);
          } else {
            cb.onStatus(res?.code === "EXPIRED" ? "expired" : "error");
            cb.onError(res?.error || "Unable to pair with presentation session.");
          }
        }
      );
    };

    socket.on("connect", join);
    socket.on("reconnect", join);
    socket.on("disconnect", () => cb.onStatus("reconnecting"));
    socket.on("connect_error", () => cb.onStatus("reconnecting"));
    socket.on("session:state", (st: SessionState) => cb.onState(st));
    socket.on("slide:changed", (p: { index: number }) => {
      if (typeof p?.index === "number") cb.onSlideChanged(p.index);
    });
    socket.on("blackout:changed", (p: { isBlackout: boolean }) =>
      cb.onBlackoutChanged(Boolean(p?.isBlackout))
    );
    socket.on("timer:updated", (p: { timerRunning: boolean; timerElapsedSec: number }) =>
      cb.onTimerUpdated(Boolean(p?.timerRunning), Number(p?.timerElapsedSec) || 0)
    );
    socket.on("remote:kicked", (p: { reason?: string }) => {
      cb.onStatus("disconnected");
      cb.onError(p?.reason || "Disconnected by presenter.");
      socket?.disconnect();
    });
    socket.on("session:expired", () => {
      cb.onStatus("expired");
      cb.onError("Presentation session expired. Scan a new QR code on the laptop.");
    });

    return {
      mode: "socket",
      sendSlide: (index) => socket?.emit("slide:change", { index }),
      sendBlackout: (isBlackout) => socket?.emit("blackout:toggle", { isBlackout }),
      sendTimer: (timerRunning, timerElapsedSec) =>
        socket?.emit("timer:sync", { timerRunning, timerElapsedSec }),
      sendLaserMove: (x, y, color) => socket?.emit("laser:move", { x, y, color }),
      sendLaserEnd: () => socket?.emit("laser:end"),
      leave: () => {
        socket?.emit("remote:leave");
        socket?.disconnect();
      },
      destroy: () => {
        socket?.emit("remote:leave");
        socket?.disconnect();
        socket = null;
      },
    };
  }

  // ---- P2P WebRTC Remote (Zero-Config for Vercel) ----
  let peer: PeerType | null = null;
  let conn: DataConnection | null = null;
  let destroyed = false;

  const send = (msg: Record<string, unknown>) => {
    if (conn?.open) {
      try {
        conn.send(msg);
      } catch {
        // Ignore
      }
    }
  };

  const connectP2P = async () => {
    if (destroyed) return;
    cb.onStatus("connecting");
    cb.onError(null);

    try {
      const { Peer } = await import("peerjs");
      if (destroyed) return;

      const p = new Peer({
        secure: true,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      });
      peer = p;

      p.on("open", () => {
        if (destroyed) return;
        const c = p.connect(cb.sessionId, {
          reliable: true,
          metadata: {
            token: cb.token,
            pairingCode: cb.pairingCode,
          },
        });
        conn = c;

        c.on("open", () => {
          if (destroyed) return;
          cb.onStatus("connected");
          cb.onError(null);
        });

        c.on("data", (raw: unknown) => {
          if (typeof raw !== "object" || !raw) return;
          const msg = raw as Record<string, unknown>;
          switch (msg.type) {
            case "session:state":
              if (msg.state) cb.onState(msg.state as SessionState);
              break;
            case "slide:changed":
              if (typeof msg.index === "number") cb.onSlideChanged(msg.index);
              break;
            case "blackout:changed":
              cb.onBlackoutChanged(Boolean(msg.isBlackout));
              break;
            case "timer:updated":
              cb.onTimerUpdated(
                Boolean(msg.timerRunning),
                Number(msg.timerElapsedSec) || 0
              );
              break;
            case "auth:error":
              cb.onStatus("error");
              cb.onError(String(msg.error || "Invalid session credentials."));
              break;
            case "remote:kicked":
              cb.onStatus("disconnected");
              cb.onError(String(msg.reason || "Disconnected by presenter."));
              c.close();
              break;
          }
        });

        c.on("close", () => {
          if (!destroyed) {
            cb.onStatus("disconnected");
          }
        });

        c.on("error", () => {
          if (!destroyed) {
            cb.onStatus("error");
            cb.onError("Could not reach laptop presentation. Make sure the laptop page is open.");
          }
        });
      });

      p.on("error", () => {
        if (!destroyed) {
          cb.onStatus("error");
          cb.onError("Presentation session not found or closed. Scan the QR code again.");
        }
      });
    } catch {
      cb.onStatus("error");
      cb.onError("WebRTC is not supported in this mobile browser.");
    }
  };

  void connectP2P();

  return {
    mode: "p2p",
    sendSlide: (index) => send({ type: "slide:change", index }),
    sendBlackout: (isBlackout) => send({ type: "blackout:toggle", isBlackout }),
    sendTimer: (timerRunning, timerElapsedSec) =>
      send({ type: "timer:sync", timerRunning, timerElapsedSec }),
    sendLaserMove: (x, y, color) => send({ type: "laser:move", x, y, color }),
    sendLaserEnd: () => send({ type: "laser:end" }),
    leave: () => {
      send({ type: "remote:leave" });
      try {
        conn?.close();
        peer?.destroy();
      } catch {
        // Ignore
      }
    },
    destroy: () => {
      destroyed = true;
      send({ type: "remote:leave" });
      try {
        conn?.close();
        peer?.destroy();
      } catch {
        // Ignore
      }
      conn = null;
      peer = null;
    },
  };
}
