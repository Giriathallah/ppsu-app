// src/app/(admin)/petugas/page.tsx
"use client";

import { useMemo, useState } from "react";
import { USERS, LAPORAN } from "@/lib/mock";
import type { User, ReviewStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/emptyState";

const statusBadgeVariant = (s: ReviewStatus) =>
  s === "PENDING" ? "secondary" : s === "DITERIMA" ? "default" : "destructive";

export default function AdminPetugas() {
  const [q, setQ] = useState("");
  const [aktif, setAktif] = useState<"ALL" | "true" | "false">("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  const PETUGAS = useMemo(() => USERS.filter((u) => u.role === "PETUGAS"), []);

  const data = useMemo(() => {
    return PETUGAS.filter((p) =>
      aktif === "ALL" ? true : String(p.aktif) === aktif
    ).filter((p) =>
      q
        ? p.nama.toLowerCase().includes(q.toLowerCase()) ||
          p.petugasId.toLowerCase().includes(q.toLowerCase())
        : true
    );
  }, [q, aktif, PETUGAS]);

  const statsByPetugas = (id: string) => {
    const reports = LAPORAN.filter((l) => l.pelaporUserId === id);
    const counts = {
      PENDING: 0,
      DITERIMA: 0,
      DITOLAK: 0,
      TOTAL: reports.length,
    } as Record<string, number>;
    reports.forEach(
      (r) => (counts[r.statusReview] = (counts[r.statusReview] ?? 0) + 1)
    );

    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    const todayReports = reports.filter((r) => {
      const d = new Date(r.createdAt);
      return d >= start && d <= end;
    });

    const lastReports = [...reports]
      .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
      .slice(0, 5);

    return { counts, todayCount: todayReports.length, lastReports };
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Petugas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama atau ID petugas..."
          />
          <Select value={aktif} onValueChange={(v) => setAktif(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Status aktif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua</SelectItem>
              <SelectItem value="true">Aktif</SelectItem>
              <SelectItem value="false">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {data.length === 0 ? (
        <EmptyState
          title="Tidak ada petugas"
          description="Ubah filter atau kata kunci."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((p) => {
            const s = statsByPetugas(p.id);
            const belumHariIni = s.todayCount === 0;
            return (
              <button
                key={p.id}
                onClick={() => setOpenId(p.id)}
                className="text-left transition hover:-translate-y-0.5"
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{p.nama}</CardTitle>
                      <Badge variant={p.aktif ? "default" : "secondary"}>
                        {p.aktif ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {p.petugasId}
                    </p>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p className="text-muted-foreground">
                      Telp: {p.noTelp ?? "-"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">Total: {s.counts.TOTAL}</Badge>
                      <Badge variant="default">
                        Diterima: {s.counts.DITERIMA ?? 0}
                      </Badge>
                      <Badge variant="secondary">
                        Pending: {s.counts.PENDING ?? 0}
                      </Badge>
                      <Badge variant="destructive">
                        Ditolak: {s.counts.DITOLAK ?? 0}
                      </Badge>
                    </div>
                    {belumHariIni ? (
                      <div className="rounded-md border border-dashed px-2 py-1 text-xs text-amber-700 bg-amber-50">
                        Belum ada laporan hari ini
                      </div>
                    ) : (
                      <div className="rounded-md border px-2 py-1 text-xs text-emerald-700 bg-emerald-50">
                        Laporan hari ini: {s.todayCount}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      )}

      <Sheet open={!!openId} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Ringkasan Petugas</SheetTitle>
          </SheetHeader>
          {openId &&
            (() => {
              const me = PETUGAS.find((x: User) => x.id === openId)!;
              const st = statsByPetugas(openId);
              return (
                <div className="mt-4 space-y-6">
                  <div>
                    <p className="text-sm font-semibold">{me.nama}</p>
                    <p className="text-xs text-muted-foreground">
                      {me.petugasId} • {me.aktif ? "Aktif" : "Nonaktif"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border p-2">
                      <p className="text-[11px] text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">{st.counts.TOTAL}</p>
                    </div>
                    <div className="rounded-lg border p-2">
                      <p className="text-[11px] text-muted-foreground">
                        Diterima
                      </p>
                      <p className="text-lg font-bold">
                        {st.counts.DITERIMA ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg border p-2">
                      <p className="text-[11px] text-muted-foreground">
                        Pending
                      </p>
                      <p className="text-lg font-bold">
                        {st.counts.PENDING ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg border p-2">
                      <p className="text-[11px] text-muted-foreground">
                        Ditolak
                      </p>
                      <p className="text-lg font-bold">
                        {st.counts.DITOLAK ?? 0}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold">
                      5 Laporan Terakhir
                    </p>
                    <div className="space-y-2">
                      {st.lastReports.map((l) => (
                        <div key={l.id} className="rounded-lg border p-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">
                              {l.judul}
                            </span>
                            <Badge variant={statusBadgeVariant(l.statusReview)}>
                              {l.statusReview}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {l.bidang}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => console.log("Kirim notifikasi ke", me.nama)}
                    className="w-full rounded-xl"
                  >
                    Kirim Notifikasi
                  </Button>
                </div>
              );
            })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
