import { AlertCircle } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { loginAction } from "../actions";
import { EmailInput, PasswordInput, SubmitButton } from "@/components/admin/LoginFields";

export const metadata = { title: "Login" };

type Props = { searchParams: Promise<{ error?: string; expired?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error, expired } = await searchParams;
  const message = error ?? (expired ? "Session expired, please sign in again." : undefined);

  return (
    // Login hamesha light theme me (reference design jaisa).
    <main className="flex flex-1 items-center justify-center bg-[#eef0f5] px-4 py-10 [color-scheme:light]">
      <div className="grid w-full max-w-[920px] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-20px_rgb(15_23_42/0.25)] md:grid-cols-2">
        {/* Left brand panel */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#1e2a44] to-[#131a2c] px-10 py-14 text-center md:flex md:flex-col md:items-center md:justify-center">
          <span aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.04]" />
          <span aria-hidden className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-white/[0.04]" />
          <div className="relative">
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-3xl font-bold text-[#7c8cff]">
              T
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Toolora<span className="text-[#7c8cff]">.ai</span>
            </h1>
            <p className="mx-auto mt-3 max-w-[260px] text-sm leading-relaxed text-slate-300">
              Editorial dashboard for AI tool reviews, comparisons and product data
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-xs text-slate-400">
              <span className="h-px w-12 bg-slate-500/60" />
              Admin Panel
              <span className="h-px w-12 bg-slate-500/60" />
            </div>
          </div>
        </section>

        {/* Right form */}
        <section className="px-7 py-12 sm:px-12 md:py-16">
          <div className="mb-8 flex items-center justify-center gap-2 md:hidden">
            <LogoMark className="h-9 w-9" />
            <span className="text-lg font-bold text-slate-900">
              Toolora<span className="text-blue-600">.ai</span>
            </span>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to your Toolora.ai admin account</p>
          </div>

          {message && (
            <p role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {message}
            </p>
          )}

          <form action={loginAction} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-800">
                Email address
              </label>
              <EmailInput />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-800">
                Password
              </label>
              <PasswordInput />
            </div>
            <div className="pt-1">
              <SubmitButton />
            </div>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500">Contact your administrator for account access</p>
        </section>
      </div>
    </main>
  );
}
