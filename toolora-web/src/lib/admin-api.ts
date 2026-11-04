import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Admin panel → toolora-api. Browser kabhi API se seedha baat nahi karta;
// JWT httpOnly cookie me rehta hai aur sirf Next.js server use karta hai.

export const ADMIN_COOKIE = "toolora_admin";

export type AdminResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string; details?: unknown };

function apiBase() {
  const url = process.env.API_URL;
  if (!url) throw new Error("API_URL is not set in .env.local");
  return url.replace(/\/+$/, "");
}

export async function adminToken() {
  return (await cookies()).get(ADMIN_COOKIE)?.value ?? null;
}

export async function adminApi<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<AdminResult<T>> {
  const token = await adminToken();
  if (!token) redirect("/admin/login");

  const res = await fetch(`${apiBase()}/api/admin${path}`, {
    method: init.method ?? "GET",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  if (res.status === 401) redirect("/admin/login?expired=1");
  if (res.status === 204) return { ok: true, status: 204, data: null as T };

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return { ok: false, status: res.status, error: data?.error ?? `HTTP ${res.status}`, details: data?.details };
  }
  return { ok: true, status: res.status, data: data as T };
}

// Page render ke liye: error par seedha throw (error boundary dikhayega).
export async function adminGet<T>(path: string): Promise<T> {
  const r = await adminApi<T>(path);
  if (!r.ok) throw new Error(`${r.error}`);
  return r.data;
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${apiBase()}/api/admin/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  return res.ok ? { ok: true as const, token: data.token as string } : { ok: false as const, error: data?.error ?? "Login failed" };
}
