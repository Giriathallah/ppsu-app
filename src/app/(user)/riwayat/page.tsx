// src/app/(user)/riwayat/page.tsx
"use client";

import { useMemo, useState, useCallback } from "react";
import { LAPORAN, USERS } from "@/lib/mock";
import type { Laporan, ReviewStatus, Bidang } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/emptyState";
import { Link2 } from "lucide-react";

const CURRENT_USER_ID = "p2";

function fmtDate(iso?: string | null) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso ?? "-";
  }
}

const statusBadgeVariant = (s: ReviewStatus) =>
  s === "PENDING" ? "secondary" : s === "DITERIMA" ? "default" : "destructive";

const isMapsUrl = (s: string) =>
  /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|www\.google\.[a-z.]+\/maps)/i.test(
    s
  );
const mapsHref = (location?: string) =>
  !location
    ? undefined
    : isMapsUrl(location)
    ? location
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location.replace(/^geo:/i, "")
      )}`;

export default function UserRiwayatPage() {
  const me = USERS.find((p: any) => p.id === CURRENT_USER_ID);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | ReviewStatus>("ALL");
  const [bidang, setBidang] = useState<"ALL" | Bidang>("ALL");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "performedAt" | "reviewedAt"
  >("createdAt");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const myReports = useMemo(() => {
    return (LAPORAN as Laporan[]).filter(
      (l) => l.pelaporUserId === CURRENT_USER_ID
    );
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = myReports
      .filter((l) => (status === "ALL" ? true : l.statusReview === status))
      .filter((l) => (bidang === "ALL" ? true : l.bidang === bidang))
      .filter((l) =>
        needle
          ? l.judul.toLowerCase().includes(needle) ||
            l.deskripsi.toLowerCase().includes(needle)
          : true
      );

    const key = (r: Laporan) =>
      (sortBy === "performedAt"
        ? r.performedAt
        : sortBy === "reviewedAt"
        ? r.reviewedAt
        : r.createdAt) ?? "";

    rows.sort((a, b) => {
      const va = key(a);
      const vb = key(b);
      if (va === vb) return 0;
      const cmp = va > vb ? 1 : -1;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [myReports, q, status, bidang, sortBy, sortDir]);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value),
    []
  );

  return (
    <div className="mx-auto w-full max-w-screen-sm px-3 py-3 md:max-w-screen-lg md:px-6 md:py-6 mb-10">
      <div className="sticky md:static top-0 z-10 bg-card md:bg-none md:border-0 border-b border-border px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            {/* <button
              type="button"
              onClick={() => history.back()}
              className="sm:hidden inline-flex w-10 h-10 rounded-lg hover:bg-muted items-center justify-center"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button> */}
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Riwayat Laporan
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Cari dan filter laporan kamu
              </p>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="laporan" className="w-full">
        {/* <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="laporan">Laporan</TabsTrigger>
        </TabsList> */}

        <TabsContent value="laporan" className="mt-4">
          <Card className="border-border/60 bg-card">
            {/* <CardHeader className="pb-2">
              <CardTitle className="text-base">Riwayat Laporan</CardTitle>
              <CardDescription className="text-xs">
                Cari dan filter laporan kamu
              </CardDescription>
            </CardHeader> */}
            <CardContent>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                <Input
                  inputMode="search"
                  value={q}
                  onChange={onSearchChange}
                  placeholder="Cari judul/deskripsi…"
                  aria-label="Cari laporan"
                  className="md:col-span-2"
                />
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as any)}
                >
                  <SelectTrigger aria-label="Pilih status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="DITERIMA">DITERIMA</SelectItem>
                    <SelectItem value="DITOLAK">DITOLAK</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={bidang}
                  onValueChange={(v) => setBidang(v as any)}
                >
                  <SelectTrigger aria-label="Pilih bidang">
                    <SelectValue placeholder="Bidang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Bidang</SelectItem>
                    <SelectItem value="KERUSAKAN">KERUSAKAN</SelectItem>
                    <SelectItem value="KEBERSIHAN">KEBERSIHAN</SelectItem>
                    <SelectItem value="LAINNYA">LAINNYA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 md:w-[520px]">
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as any)}
                >
                  <SelectTrigger aria-label="Urutkan berdasarkan">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Terbuat</SelectItem>
                    <SelectItem value="performedAt">Pelaksanaan</SelectItem>
                    <SelectItem value="reviewedAt">Direview</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortDir}
                  onValueChange={(v) => setSortDir(v as any)}
                >
                  <SelectTrigger aria-label="Arah urutan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Terbaru → Lama</SelectItem>
                    <SelectItem value="asc">Lama → Terbaru</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="mt-3 space-y-3 md:hidden">
            {filtered.length === 0 ? (
              <EmptyState
                title="Belum ada laporan"
                description="Ubah filter atau bersihkan pencarian."
              />
            ) : (
              filtered.map((l) => {
                const href = mapsHref(l.location as any);
                return (
                  <Card key={l.id} className="rounded-2xl border-border/60">
                    <CardHeader className="pb-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-tight">
                          {l.judul}
                        </CardTitle>
                        <Badge variant={statusBadgeVariant(l.statusReview)}>
                          {l.statusReview}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {l.bidang} • Dibuat {fmtDate(l.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {l.deskripsi}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Pelaksanaan: {fmtDate(l.performedAt) || "-"}</div>
                        <div>Direview: {fmtDate(l.reviewedAt) || "-"}</div>
                      </div>
                      {l.location ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs hover:bg-muted"
                        >
                          <Link2 className="h-4 w-4" />
                          Buka Peta
                        </a>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <div className="mt-4 hidden md:block">
            {filtered.length === 0 ? (
              <EmptyState
                title="Belum ada laporan"
                description="Ubah filter atau bersihkan pencarian."
              />
            ) : (
              <div className="w-full overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[140px]">Terbuat</TableHead>
                      <TableHead className="min-w-[200px]">Judul</TableHead>
                      <TableHead className="min-w-[120px]">Bidang</TableHead>
                      <TableHead className="min-w-[140px]">
                        Pelaksanaan
                      </TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[140px]">Direview</TableHead>
                      <TableHead className="min-w-[160px]">Lokasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((l) => {
                      const href = mapsHref(l.location as any);
                      return (
                        <TableRow key={l.id}>
                          <TableCell>{fmtDate(l.createdAt)}</TableCell>
                          <TableCell className="font-medium">
                            {l.judul}
                          </TableCell>
                          <TableCell>{l.bidang}</TableCell>
                          <TableCell>{fmtDate(l.performedAt)}</TableCell>
                          <TableCell>
                            <Badge variant={statusBadgeVariant(l.statusReview)}>
                              {l.statusReview}
                            </Badge>
                          </TableCell>
                          <TableCell>{fmtDate(l.reviewedAt)}</TableCell>
                          <TableCell>
                            {l.location ? (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                              >
                                <Link2 className="h-4 w-4" />
                                Buka Peta
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Tampilan mobile dioptimalkan; tabel otomatis menjadi kartu pada layar
        kecil.
      </p>
    </div>
  );
}
