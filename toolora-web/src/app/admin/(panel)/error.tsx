"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-xl border border-red-500/40 p-6">
      <h1 className="font-semibold text-red-600">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <p className="mt-1 text-sm text-muted">Check that toolora-api is running on API_URL.</p>
      <button onClick={reset} className="mt-4 rounded-lg border border-line px-4 py-2 text-sm">
        Try again
      </button>
    </div>
  );
}
