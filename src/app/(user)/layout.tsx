import type { ReactNode } from "react";
import { UserTopNav } from "@/components/topNav";
import { UserBottomNav } from "@/components/bottomNav";

// Optional: kalau pakai shadcn ThemeProvider, bungkus di sini.

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Top nav untuk tablet/desktop */}
      <UserTopNav />

      {/* Konten */}
      <main className="mx-auto w-full max-w-screen-lg">{children}</main>

      {/* Bottom nav khusus mobile */}
      <UserBottomNav />
    </div>
  );
}
