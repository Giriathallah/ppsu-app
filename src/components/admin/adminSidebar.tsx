"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  Users2,
  KanbanSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/laporan-admin", label: "Laporan", icon: ClipboardList },
  { href: "/petugas", label: "Petugas", icon: Users2 },
  { href: "/tugas-admin", label: "Tugas", icon: KanbanSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // restore persist
  useEffect(() => {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_sidebar_collapsed")
        : null;
    if (raw) setCollapsed(raw === "1");
  }, []);
  // persist
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_sidebar_collapsed", collapsed ? "1" : "0");
    }
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh border-r border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 md:flex md:flex-col",
        collapsed ? "w-[72px]" : "w-64"
      )}
      aria-label="Sidebar admin"
    >
      {/* Brand + Toggle */}
      <div className="flex h-14 items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <span className="text-xs font-bold">PPSU</span>
          </div>
          {!collapsed && (
            <span className="truncate text-sm font-semibold">
              Kelurahan • Admin
            </span>
          )}
        </div>
        <button
          aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          onClick={() => setCollapsed((v) => !v)}
          className="inline-flex size-8 items-center justify-center rounded-md border border-border/60 hover:bg-muted/50"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-2 grid gap-1 px-2" role="navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
              title={label}
            >
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-muted/40">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-3 text-[11px] text-muted-foreground">
        {!collapsed && <p>© {new Date().getFullYear()} PPSU Kelurahan</p>}
      </div>
    </aside>
  );
}
