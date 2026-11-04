"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const field =
  "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15";

export function EmailInput() {
  return (
    <div className="relative">
      <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="username"
        placeholder="you@toolora.ai"
        className={`${field} pr-4`}
      />
    </div>
  );
}

export function PasswordInput() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
      <input
        id="password"
        name="password"
        type={show ? "text" : "password"}
        required
        autoComplete="current-password"
        placeholder="••••••••••"
        className={`${field} pr-12`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:text-slate-600"
      >
        {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
      </button>
    </div>
  );
}

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-[15px] font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}
