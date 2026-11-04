import "server-only";

// toolora-api (Express + MongoDB) ka client. Sirf server par chalta hai.

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type HealthResponse = {
  status: "ok" | "degraded";
  service: string;
  time: string;
  db: { state: string; name: string; pingMs: number | null };
};

function apiBase() {
  const url = process.env.API_URL;
  return url ? url.replace(/\/+$/, "") : null;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const base = apiBase();
  if (!base) return { ok: false, error: "API_URL is not set in .env.local" };
  try {
    const res = await fetch(`${base}${path}`, init);
    const body = await res.json().catch(() => null);
    if (!res.ok && !body) return { ok: false, error: `API returned HTTP ${res.status}` };
    return { ok: true, data: body as T };
  } catch (e) {
    return { ok: false, error: `Could not reach API at ${base}: ${(e as Error).message}` };
  }
}

export function getHealth() {
  return apiGet<HealthResponse>("/api/health", { cache: "no-store" });
}
