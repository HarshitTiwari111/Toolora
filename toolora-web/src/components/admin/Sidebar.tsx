"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, ExternalLink, FileText, LayoutDashboard, ListTodo, LogOut, Menu, Package,
} from "lucide-react";
import { LogoMark } from "../Logo";
import { SIDEBAR_COOKIE } from "@/lib/admin-constants";

const nav = [
  { href: "/admin/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles/", label: "Articles", icon: FileText },
  { href: "/admin/products/", label: "Products", icon: Package },
  { href: "/admin/topics/", label: "Topic queue", icon: ListTodo },
  { href: "/admin/logs/", label: "Workflow logs", icon: Activity },
];

// Cookie me save hota hai taaki server pehli render se hi sahi width bheje (reload par flash nahi).

export default function Sidebar({ logout, initialCollapsed = false }: { logout: () => Promise<void>; initialCollapsed?: boolean }) {
  const pathname = usePathname();
  // Desktop: collapse (sirf icons). Mobile: menu open/close.
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Animation sirf user ke toggle par, page load par nahi.
  const [animate, setAnimate] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  function toggle() {
    if (window.matchMedia("(min-width: 768px)").matches) {
      const next = !collapsed;
      setAnimate(true);
      setCollapsed(next);
      document.cookie = `${SIDEBAR_COOKIE}=${next ? "1" : "0"}; path=/admin; max-age=31536000; samesite=lax`;
    } else {
      setMobileOpen((o) => !o);
    }
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href || pathname === href.slice(0, -1) : pathname.startsWith(href.slice(0, -1));

  const item = `flex items-center gap-3 whitespace-nowrap rounded-lg py-2.5 text-sm font-medium transition ${
    collapsed ? "md:justify-center md:px-0" : ""
  } px-3`;
  const label = collapsed ? "md:sr-only" : "";

  return (
    <aside
      className={`border-b border-line bg-surface ${animate ? "transition-[width] duration-200" : ""} md:sticky md:top-0 md:flex md:h-screen md:shrink-0 md:flex-col md:border-b-0 md:border-r ${
        collapsed ? "md:w-[76px]" : "md:w-72"
      }`}
    >
      <div className={`flex items-center gap-2.5 px-5 py-4 md:py-5 ${collapsed ? "md:flex-col md:px-0" : ""}`}>
        <LogoMark className="h-9 w-9 text-sm" />
        <div className={`min-w-0 flex-1 leading-tight ${collapsed ? "md:hidden" : ""}`}>
          <p className="font-bold">
            Toolora<span className="text-accent">.ai</span>
          </p>
          <p className="text-xs text-muted">Admin panel</p>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="rounded-lg p-2 text-muted transition hover:bg-surface-2 hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className={`${mobileOpen ? "flex" : "hidden"} flex-col md:flex md:flex-1 md:flex-col`}>
        <nav className="flex flex-col gap-1 px-3 pb-3 md:flex-1 md:pb-0">
          <p className={`px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted ${collapsed ? "md:hidden" : ""}`}>
            Manage
          </p>
          {nav.map((n) => {
            const active = isActive(n.href, n.exact);
            return (
              <Link
                key={n.href}
                href={n.href}
                title={collapsed ? n.label : undefined}
                aria-current={active ? "page" : undefined}
                className={`${item} ${active ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-foreground"}`}
              >
                <n.icon className="h-[18px] w-[18px] shrink-0" />
                <span className={label}>{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <Link
            href="/"
            target="_blank"
            title={collapsed ? "View site" : undefined}
            className={`${item} text-muted hover:bg-surface-2 hover:text-foreground`}
          >
            <ExternalLink className="h-[18px] w-[18px] shrink-0" />
            <span className={label}>View site</span>
          </Link>
          <form action={logout}>
            <button
              title={collapsed ? "Log out" : undefined}
              className={`${item} w-full text-muted hover:bg-red-500/10 hover:text-red-600`}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              <span className={label}>Log out</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
