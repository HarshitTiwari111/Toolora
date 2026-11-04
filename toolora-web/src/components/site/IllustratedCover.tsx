import CategoryIcon from "../CategoryIcon";
import { tone } from "@/lib/theme";

// Photo na ho to category ke rang ka illustrated cover (gradient + pattern + icon).
// Decorative hai, isliye aria-hidden.
export default function IllustratedCover({
  category,
  label,
  className = "",
  big = false,
}: {
  category?: string;
  label?: string;
  className?: string;
  big?: boolean;
}) {
  const t = tone(category);
  const id = `p-${category ?? "x"}`;
  return (
    <div
      aria-hidden
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)` }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-25" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 225">
        <defs>
          <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="#fff" />
          </pattern>
        </defs>
        <rect width="400" height="225" fill={`url(#${id})`} />
        <circle cx="340" cy="40" r="90" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="340" cy="40" r="140" fill="none" stroke="#fff" strokeWidth="1" />
        <circle cx="60" cy="210" r="70" fill="#fff" fillOpacity="0.15" />
      </svg>
      <div className="absolute -bottom-6 -right-4 text-white/20">
        <CategoryIcon slug={category ?? ""} className={big ? "h-52 w-52" : "h-36 w-36"} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-white ring-1 ring-white/30 backdrop-blur-sm">
          <CategoryIcon slug={category ?? ""} className={big ? "h-8 w-8" : "h-6 w-6"} />
          {label && <span className={`font-serif font-semibold ${big ? "text-xl" : "text-base"}`}>{label}</span>}
        </span>
      </div>
    </div>
  );
}
