"use client";

// Delete jaise irreversible kaam se pehle confirm.
export default function ConfirmButton({
  message,
  children,
  className = "",
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={`rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-600 ${className}`}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
