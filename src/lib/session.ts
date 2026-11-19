export interface PresenterSessionCredentials {
  sessionId: string;
  token: string;
  pairingCode: string;
}

const STORAGE_KEY = "bubt_ai_presentation_session_v1";

export function buildRemoteUrl(sessionId: string, token: string): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim()?.replace(/\/+$/, "");
  const origin =
    configuredOrigin || (typeof window !== "undefined" ? window.location.origin : "");
  const params = new URLSearchParams({ token });
  return `${origin}/remote/${encodeURIComponent(sessionId)}?${params.toString()}`;
}

export function savePresenterSession(creds: PresenterSessionCredentials): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
  } catch {
    // Ignore storage quota / private mode errors
  }
}

export function loadPresenterSession(): PresenterSessionCredentials | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PresenterSessionCredentials;
    if (parsed?.sessionId && parsed?.token && parsed?.pairingCode) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearPresenterSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
