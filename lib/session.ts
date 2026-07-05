export interface Session {
  role: "user" | "admin";
  email: string;
  name: string;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("dv_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session) {
  localStorage.setItem("dv_session", JSON.stringify(session));
  // Set cookie so middleware can protect routes
  document.cookie = `dv_auth=1; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export async function clearSession() {
  localStorage.removeItem("dv_session");
  // Clear via server API to ensure cookie is fully removed
  await fetch("/api/clear-session");
}
