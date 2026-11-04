// Logo ke rights confirm hone tak brand ka initial (PDF: logo/media rights note).
export default function BrandMark({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const cls = size === "lg" ? "h-16 w-16 rounded-2xl text-2xl" : "h-11 w-11 rounded-xl text-base";
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-accent/20 to-accent-2/20 font-bold text-accent ring-1 ring-inset ring-accent/20 ${cls}`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
