import express from "express";
import http from "http";
import cors from "cors";
import crypto from "crypto";
import { Server } from "socket.io";

const PORT = Number(process.env.PORT || 4001);
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 2 * 60 * 60 * 1000); // 2 hours
const MAX_SESSIONS = Number(process.env.MAX_SESSIONS || 500);

const allowedOriginsRaw = process.env.ALLOWED_ORIGINS || "*";
const allowedOrigins =
  allowedOriginsRaw === "*"
    ? "*"
    : allowedOriginsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

const app = express();
app.use(
  cors({
    origin: allowedOrigins === "*" ? true : allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

/**
 * In-memory session store:
 * sessionId -> {
 *   sessionId: string,
 *   tokenHash: string,
 *   pairingCode: string,
 *   presenterSocketId: string | null,
 *   remoteSocketIds: Set<string>,
 *   currentSlide: number,
 *   totalSlides: number,
 *   isBlackout: boolean,
 *   timerRunning: boolean,
 *   timerElapsedSec: number,
 *   createdAt: number,
 *   expiresAt: number,
 *   lastActivityAt: number,
 * }
 */
const sessions = new Map();
const pairingCodeIndex = new Map(); // pairingCode -> sessionId

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function generateSessionId() {
  return crypto.randomBytes(9).toString("base64url");
}

function generateToken() {
  return crypto.randomBytes(24).toString("base64url");
}

function generatePairingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[crypto.randomInt(0, chars.length)];
  }
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}

function constantTimeEqualHex(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

function cleanupExpiredSessions(io) {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      io.to(`session:${sessionId}`).emit("session:expired", {
        sessionId,
        reason: "Session expired due to inactivity or TTL limit.",
      });
      pairingCodeIndex.delete(session.pairingCode);
      sessions.delete(sessionId);
    }
  }
}

function touchSession(session) {
  const now = Date.now();
  session.lastActivityAt = now;
  session.expiresAt = now + SESSION_TTL_MS;
}

function getPublicSessionState(session) {
  return {
    sessionId: session.sessionId,
    pairingCode: session.pairingCode,
    currentSlide: session.currentSlide,
    totalSlides: session.totalSlides,
    isBlackout: session.isBlackout,
    timerRunning: session.timerRunning,
    timerElapsedSec: session.timerElapsedSec,
    remoteCount: session.remoteSocketIds.size,
    presenterConnected: Boolean(session.presenterSocketId),
    expiresAt: session.expiresAt,
  };
}

// Health check endpoint (for Railway, Render, uptime checks)
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ethical-ai-presentation-socket",
    activeSessions: sessions.size,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// Resolve a 6-char pairing code to sessionId (still requires token or pairing verification)
app.post("/api/sessions/resolve-code", (req, res) => {
  const rawCode = String(req.body?.pairingCode || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  if (rawCode.length !== 6) {
    return res.status(400).json({ error: "Invalid pairing code format." });
  }
  const formatted = `${rawCode.slice(0, 3)}-${rawCode.slice(3)}`;
  const sessionId = pairingCodeIndex.get(formatted);
  if (!sessionId) {
    return res.status(404).json({ error: "Pairing code not found or expired." });
  }
  const session = sessions.get(sessionId);
  if (!session || Date.now() > session.expiresAt) {
    pairingCodeIndex.delete(formatted);
    return res.status(410).json({ error: "Session has expired." });
  }
  return res.json({
    sessionId: session.sessionId,
    pairingCode: session.pairingCode,
  });
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins === "*" ? true : allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingInterval: 15000,
  pingTimeout: 10000,
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  // 1. Presenter creates a new secure session
  socket.on("presenter:create-session", (payload, ack) => {
    const totalSlides = Math.min(Math.max(Number(payload?.totalSlides) || 20, 1), 100);
    const initialSlide = Math.min(Math.max(Number(payload?.currentSlide) || 0, 0), totalSlides - 1);

    if (sessions.size >= MAX_SESSIONS) {
      cleanupExpiredSessions(io);
    }

    const sessionId = generateSessionId();
    const token = generateToken();
    let pairingCode = generatePairingCode();
    while (pairingCodeIndex.has(pairingCode)) {
      pairingCode = generatePairingCode();
    }

    const now = Date.now();
    const session = {
      sessionId,
      tokenHash: hashToken(token),
      pairingCode,
      presenterSocketId: socket.id,
      remoteSocketIds: new Set(),
      currentSlide: initialSlide,
      totalSlides,
      isBlackout: false,
      timerRunning: false,
      timerElapsedSec: 0,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
      lastActivityAt: now,
    };

    sessions.set(sessionId, session);
    pairingCodeIndex.set(pairingCode, sessionId);

    socket.data.role = "presenter";
    socket.data.sessionId = sessionId;
    socket.join(`session:${sessionId}`);

    if (typeof ack === "function") {
      ack({
        ok: true,
        sessionId,
        token,
        pairingCode,
        state: getPublicSessionState(session),
      });
    }
  });

  // 2. Presenter reconnects to an existing session using sessionId + token
  socket.on("presenter:rejoin-session", (payload, ack) => {
    const { sessionId, token } = payload || {};
    const session = sessions.get(sessionId);
    if (!session) {
      return typeof ack === "function" && ack({ ok: false, code: "NOT_FOUND", error: "Session not found." });
    }
    if (Date.now() > session.expiresAt) {
      pairingCodeIndex.delete(session.pairingCode);
      sessions.delete(sessionId);
      return typeof ack === "function" && ack({ ok: false, code: "EXPIRED", error: "Session expired." });
    }
    if (!token || !constantTimeEqualHex(hashToken(token), session.tokenHash)) {
      return typeof ack === "function" && ack({ ok: false, code: "UNAUTHORIZED", error: "Invalid session credentials." });
    }

    session.presenterSocketId = socket.id;
    touchSession(session);
    socket.data.role = "presenter";
    socket.data.sessionId = sessionId;
    socket.join(`session:${sessionId}`);

    const state = getPublicSessionState(session);
    io.to(`session:${sessionId}`).emit("session:state", state);

    if (typeof ack === "function") {
      ack({ ok: true, state });
    }
  });

  // 3. Smartphone remote joins session via QR token OR verified pairing code
  socket.on("remote:join-session", (payload, ack) => {
    const { sessionId, token, pairingCode } = payload || {};
    let resolvedSessionId = sessionId;

    if (!resolvedSessionId && pairingCode) {
      const clean = String(pairingCode).toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (clean.length === 6) {
        resolvedSessionId = pairingCodeIndex.get(`${clean.slice(0, 3)}-${clean.slice(3)}`);
      }
    }

    const session = sessions.get(resolvedSessionId);
    if (!session) {
      return typeof ack === "function" && ack({ ok: false, code: "NOT_FOUND", error: "Presentation session not found." });
    }
    if (Date.now() > session.expiresAt) {
      pairingCodeIndex.delete(session.pairingCode);
      sessions.delete(resolvedSessionId);
      return typeof ack === "function" && ack({ ok: false, code: "EXPIRED", error: "Presentation session expired." });
    }

    const tokenValid = Boolean(token && constantTimeEqualHex(hashToken(token), session.tokenHash));
    const codeNormalized = String(pairingCode || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
    const expectedCode = session.pairingCode.replace("-", "");
    const codeValid = codeNormalized.length === 6 && codeNormalized === expectedCode;

    if (!tokenValid && !codeValid) {
      return typeof ack === "function" && ack({ ok: false, code: "UNAUTHORIZED", error: "Invalid session token or pairing code." });
    }

    session.remoteSocketIds.add(socket.id);
    touchSession(session);

    socket.data.role = "remote";
    socket.data.sessionId = session.sessionId;
    socket.join(`session:${session.sessionId}`);

    const state = getPublicSessionState(session);
    io.to(`session:${session.sessionId}`).emit("remote:connected", {
      remoteCount: session.remoteSocketIds.size,
      state,
    });
    io.to(`session:${session.sessionId}`).emit("session:state", state);

    if (typeof ack === "function") {
      ack({ ok: true, state });
    }
  });

  // 4. Bidirectional slide change (Laptop <-> Phone)
  socket.on("slide:change", (payload) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;
    const session = sessions.get(sessionId);
    if (!session || Date.now() > session.expiresAt) return;

    const index = Number(payload?.index);
    if (!Number.isInteger(index) || index < 0 || index >= session.totalSlides) return;

    session.currentSlide = index;
    touchSession(session);

    io.to(`session:${sessionId}`).emit("slide:changed", {
      index,
      source: socket.data.role,
      timestamp: Date.now(),
    });
  });

  // 5. Bidirectional blackout toggle
  socket.on("blackout:toggle", (payload) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;
    const session = sessions.get(sessionId);
    if (!session || Date.now() > session.expiresAt) return;

    const nextState =
      typeof payload?.isBlackout === "boolean" ? payload.isBlackout : !session.isBlackout;
    session.isBlackout = nextState;
    touchSession(session);

    io.to(`session:${sessionId}`).emit("blackout:changed", {
      isBlackout: nextState,
      source: socket.data.role,
    });
  });

  // 6. Real-time laser pointer (Phone -> Laptop)
  socket.on("laser:move", (payload) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId || socket.data.role !== "remote") return;
    const session = sessions.get(sessionId);
    if (!session || !session.presenterSocketId) return;

    const x = Math.min(Math.max(Number(payload?.x), 0), 1);
    const y = Math.min(Math.max(Number(payload?.y), 0), 1);
    const color = payload?.color === "red" ? "red" : "blue";
    if (Number.isNaN(x) || Number.isNaN(y)) return;

    touchSession(session);
    io.to(session.presenterSocketId).emit("laser:update", {
      active: true,
      x,
      y,
      color,
      timestamp: Date.now(),
    });
  });

  socket.on("laser:end", () => {
    const sessionId = socket.data.sessionId;
    if (!sessionId || socket.data.role !== "remote") return;
    const session = sessions.get(sessionId);
    if (!session || !session.presenterSocketId) return;

    io.to(session.presenterSocketId).emit("laser:update", {
      active: false,
      x: 0.5,
      y: 0.5,
      color: "blue",
      timestamp: Date.now(),
    });
  });

  // 7. Timer sync (start / pause / reset)
  socket.on("timer:sync", (payload) => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;
    const session = sessions.get(sessionId);
    if (!session) return;

    if (typeof payload?.timerRunning === "boolean") {
      session.timerRunning = payload.timerRunning;
    }
    if (typeof payload?.timerElapsedSec === "number" && payload.timerElapsedSec >= 0) {
      session.timerElapsedSec = Math.floor(payload.timerElapsedSec);
    }
    touchSession(session);

    io.to(`session:${sessionId}`).emit("timer:updated", {
      timerRunning: session.timerRunning,
      timerElapsedSec: session.timerElapsedSec,
      source: socket.data.role,
    });
  });

  // 8. Presenter disconnects all remotes
  socket.on("presenter:disconnect-remotes", () => {
    const sessionId = socket.data.sessionId;
    if (!sessionId || socket.data.role !== "presenter") return;
    const session = sessions.get(sessionId);
    if (!session) return;

    for (const remoteId of session.remoteSocketIds) {
      const remoteSocket = io.sockets.sockets.get(remoteId);
      if (remoteSocket) {
        remoteSocket.emit("remote:kicked", {
          reason: "Disconnected by presenter.",
        });
        remoteSocket.leave(`session:${sessionId}`);
        remoteSocket.data.sessionId = null;
      }
    }
    session.remoteSocketIds.clear();

    const state = getPublicSessionState(session);
    io.to(`session:${sessionId}`).emit("remote:disconnected", {
      remoteCount: 0,
      state,
    });
    io.to(`session:${sessionId}`).emit("session:state", state);
  });

  // 9. Remote voluntarily disconnects
  socket.on("remote:leave", () => {
    const sessionId = socket.data.sessionId;
    if (!sessionId || socket.data.role !== "remote") return;
    const session = sessions.get(sessionId);
    if (session) {
      session.remoteSocketIds.delete(socket.id);
      const state = getPublicSessionState(session);
      io.to(`session:${sessionId}`).emit("remote:disconnected", {
        remoteCount: session.remoteSocketIds.size,
        state,
      });
      io.to(`session:${sessionId}`).emit("session:state", state);
    }
    socket.leave(`session:${sessionId}`);
    socket.data.sessionId = null;
  });

  // 10. Handle socket disconnect
  socket.on("disconnect", () => {
    const sessionId = socket.data.sessionId;
    if (!sessionId) return;
    const session = sessions.get(sessionId);
    if (!session) return;

    if (socket.data.role === "presenter" && session.presenterSocketId === socket.id) {
      session.presenterSocketId = null;
      io.to(`session:${sessionId}`).emit("presenter:disconnected", {
        sessionId,
      });
      io.to(`session:${sessionId}`).emit("session:state", getPublicSessionState(session));
    } else if (socket.data.role === "remote") {
      session.remoteSocketIds.delete(socket.id);
      const state = getPublicSessionState(session);
      io.to(`session:${sessionId}`).emit("remote:disconnected", {
        remoteCount: session.remoteSocketIds.size,
        state,
      });
      io.to(`session:${sessionId}`).emit("session:state", state);
    }
  });
});

// Periodic session expiration sweep
setInterval(() => cleanupExpiredSessions(io), 60_000);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`[Socket Server] Listening on port ${PORT}`);
});
