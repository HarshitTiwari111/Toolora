"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CategoryIcon from "../CategoryIcon";
import { tone } from "@/lib/theme";

export type Goal = {
  key: string;
  label: string;
  category: string;
  summary: string;
  hub: { href: string; label: string };
  guides: { href: string; title: string; meta: string }[];
  tools: { href: string; name: string; meta: string }[];
};

// "What are you trying to do?" — goal chuno, us goal ke guides + tools + category dikhte hain.
// Saara content server se aata hai; JS band ho to bhi pehla goal dikhta hai.
export default function GoalPicker({ goals }: { goals: Goal[] }) {
  const [active, setActive] = useState(goals[0]?.key);
  const g = goals.find((x) => x.key === active) ?? goals[0];
  if (!g) return null;

  return (
    <div>
      <div role="tablist" aria-label="Choose a goal" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {goals.map((x) => {
          const on = x.key === g.key;
          const t = tone(x.category);
          return (
            <button
              key={x.key}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="goal-panel"
              onClick={() => setActive(x.key)}
              className={`group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm font-semibold transition ${
                on ? "border-ink bg-ink text-white shadow-card" : "border-line bg-surface hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-card"
              }`}
            >
              <span
                aria-hidden
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition"
                style={on ? { background: `linear-gradient(135deg, ${t.from}, ${t.to})`, color: "#fff" } : { background: t.soft, color: t.ink }}
              >
                <CategoryIcon slug={x.category} className="h-[18px] w-[18px]" />
              </span>
              {x.label}
            </button>
          );
        })}
      </div>

      <div id="goal-panel" role="tabpanel" className="mt-5 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <p className="text-lg">{g.summary}</p>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-accent">Read these guides</h3>
            {g.guides.length ? (
              <ul className="space-y-2.5">
                {g.guides.map((x) => (
                  <li key={x.href}>
                    <Link href={x.href} className="block rounded-xl border border-line bg-background p-3.5 transition hover:border-accent/50">
                      <span className="block text-sm font-semibold leading-snug">{x.title}</span>
                      <span className="mt-1 block text-xs text-muted">{x.meta}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">Guides for this goal are being researched.</p>
            )}
          </div>
          <div>
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-accent">Compare these tools</h3>
            {g.tools.length ? (
              <ul className="space-y-2.5">
                {g.tools.map((x) => (
                  <li key={x.href}>
                    <Link href={x.href} className="block rounded-xl border border-line bg-background p-3.5 transition hover:border-accent/50">
                      <span className="block text-sm font-semibold">{x.name}</span>
                      <span className="mt-1 block text-xs text-muted">{x.meta}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">Tools are added after editorial verification.</p>
            )}
          </div>
          <div>
            <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-accent">Explore the category</h3>
            <Link
              href={g.hub.href}
              className="group flex items-center justify-between rounded-xl bg-ink p-4 text-white transition hover:bg-ink-2"
            >
              <span className="font-semibold">{g.hub.label}</span>
              <ArrowRight className="h-4 w-4 text-label transition group-hover:translate-x-0.5" />
            </Link>
            <Link href="/blog/" className="mt-2.5 flex items-center justify-between rounded-xl border border-line p-4 text-sm font-semibold transition hover:border-accent/50">
              All guides & reviews <ArrowRight className="h-4 w-4 text-accent" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
