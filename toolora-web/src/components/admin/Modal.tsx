"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";

// Native <dialog> modal: ESC, focus trap aur backdrop browser khud sambhalta hai.
// `?new=1` URL me ho (jaise validation error ke baad) to modal khula hi aata hai.
export default function Modal({
  triggerLabel,
  title,
  description,
  children,
}: {
  triggerLabel: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const openFromUrl = params.get("new") === "1";

  useEffect(() => {
    if (openFromUrl && ref.current && !ref.current.open) ref.current.showModal();
  }, [openFromUrl]);

  function onClose() {
    // Error / new=1 URL se hata do taaki refresh par dobara na khule.
    if (params.get("new") || params.get("error")) router.replace(pathname, { scroll: false });
  }

  function open() {
    ref.current?.showModal();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
      >
        <Plus className="h-4 w-4" /> {triggerLabel}
      </button>

      <dialog
        ref={ref}
        onClose={onClose}
        onClick={(e) => {
          if (e.target === ref.current) ref.current.close(); // backdrop click
        }}
        className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[min(88vh,900px)] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => ref.current?.close()}
              className="rounded-lg p-1.5 text-muted transition hover:bg-surface-2 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </header>
          <div className="no-scrollbar overflow-y-auto overscroll-contain px-6 py-5">{children}</div>
        </div>
      </dialog>
    </>
  );
}
