"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertCircle, Camera, FilePlus2, History, MapPin } from "lucide-react";

// ==== Types (selaras schema baru) ====
type ReviewStatus = "PENDING" | "DITERIMA" | "DITOLAK";
type Bidang = "KERUSAKAN" | "KEBERSIHAN" | "HAMBATAN" | "LAINNYA";

type User = {
  id: string;
  petugasId?: string | null;
  nama: string;
  noTelp?: string | null;
  aktif: boolean;
  role: "ADMIN" | "PETUGAS";
};

type Laporan = {
  id: string;
  pelaporUserId: string;
  judul: string;
  deskripsi: string;
  bidang: Bidang;
  statusReview: ReviewStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  performedAt?: string | null;
  lat?: number;
  lng?: number;
  fotoSesudah: string[]; // URL[]
};

import { LAPORAN, USERS } from "@/lib/mock";

// ==== Utils ====
const isSameLocalDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toIDDateTime = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

// ==== Badge kecil ====
const ReviewBadge = ({ status }: { status: ReviewStatus }) => {
  const cls =
    status === "PENDING"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      : status === "DITERIMA"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "bg-destructive/10 text-destructive";
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-2xs sm:text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
};

export default function UserBeranda() {
  // Contoh: user aktif adalah petugas p2 (silakan ganti ke session user)
  const currentUser: User = (USERS?.find((p: any) => p.id === "p2") as any) ?? {
    id: "p2",
    petugasId: "JKT-PP02",
    nama: "Siti Rahma",
    aktif: true,
    role: "PETUGAS",
  };

  const now = new Date();

  // Laporan saya
  const myReports: Laporan[] = useMemo(
    () =>
      (LAPORAN as Laporan[]).filter((r) => r.pelaporUserId === currentUser.id),
    [currentUser.id]
  );

  // Apakah sudah lapor hari ini?
  const hasReportedToday = useMemo(() => {
    return myReports.some((r) => {
      const basis = r.performedAt
        ? new Date(r.performedAt)
        : new Date(r.createdAt);
      return isSameLocalDay(basis, now);
    });
  }, [myReports, now]);

  // Ringkasan
  const todayReports = useMemo(() => {
    return myReports.filter((r) => {
      const basis = r.performedAt
        ? new Date(r.performedAt)
        : new Date(r.createdAt);
      return isSameLocalDay(basis, now);
    });
  }, [myReports, now]);

  const pendingCount = myReports.filter(
    (r) => r.statusReview === "PENDING"
  ).length;
  const approvedCount = myReports.filter(
    (r) => r.statusReview === "DITERIMA"
  ).length;
  const declinedCount = myReports.filter(
    (r) => r.statusReview === "DITOLAK"
  ).length;

  // Tiga laporan terbaru
  const latestMine = [...myReports]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 3);

  // Avatar initials
  const initials = currentUser.nama
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header gradient (mobile-first) */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent px-4 py-6 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-primary-foreground sm:text-3xl">
                Selamat{" "}
                {now.getHours() < 12
                  ? "Pagi"
                  : now.getHours() < 18
                  ? "Siang"
                  : "Malam"}{" "}
                👋
              </h1>
              <p className="text-sm text-primary-foreground/90 sm:text-base">
                {currentUser.nama}
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 text-lg font-semibold text-primary-foreground sm:h-14 sm:w-14">
              {initials}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 backdrop-blur-sm">
            <div
              className={`h-2 w-2 rounded-full ${
                currentUser.aktif
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-muted-foreground/60"
              }`}
            />
            <span className="text-xs font-medium text-primary-foreground sm:text-sm">
              {currentUser.petugasId ?? "PETUGAS"} •{" "}
              {currentUser.aktif ? "Aktif" : "Nonaktif"}
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="-mt-4 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="rounded-xl border border-border bg-card p-3 shadow-sm sm:rounded-2xl sm:p-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 sm:h-12 sm:w-12">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 sm:h-6 sm:w-6" />
                </div>
                <p className="mb-0.5 text-xl font-bold text-foreground sm:text-3xl">
                  {pendingCount}
                </p>
                <p className="text-2xs leading-tight text-muted-foreground sm:text-xs">
                  Pending
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-3 shadow-sm sm:rounded-2xl sm:p-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 sm:h-12 sm:w-12">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-emerald-600 dark:text-emerald-400 sm:h-6 sm:w-6"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.2l-3.5-3.5l1.4-1.4L9 13.4l7.1-7.1l1.4 1.42z"
                    />
                  </svg>
                </div>
                <p className="mb-0.5 text-xl font-bold text-foreground sm:text-3xl">
                  {approvedCount}
                </p>
                <p className="text-2xs leading-tight text-muted-foreground sm:text-xs">
                  Disetujui
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-3 shadow-sm sm:rounded-2xl sm:p-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 sm:h-12 sm:w-12">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-destructive sm:h-6 sm:w-6"
                  >
                    <path
                      fill="currentColor"
                      d="M12 10.586l4.95-4.95l1.414 1.414L13.414 12l4.95 4.95l-1.414 1.414L12 13.414l-4.95 4.95L5.636 16.95L10.586 12l-4.95-4.95L7.05 5.636z"
                    />
                  </svg>
                </div>
                <p className="mb-0.5 text-xl font-bold text-foreground sm:text-3xl">
                  {declinedCount}
                </p>
                <p className="text-2xs leading-tight text-muted-foreground sm:text-xs">
                  Ditolak
                </p>
              </div>
            </div>
          </div>

          {/* Callout: sudah/belum lapor hari ini */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            {!hasReportedToday ? (
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Belum ada laporan hari ini.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Segera buat laporan pekerjaan yang sudah kamu kerjakan.
                  </p>
                </div>
                <Link
                  href="/user/laporan-baru"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <FilePlus2 className="h-4 w-4" />
                  Buat Laporan
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-foreground">
                  Kamu sudah mengirim{" "}
                  <span className="font-semibold">{todayReports.length}</span>{" "}
                  laporan hari ini. Terima kasih!
                </p>
                <div className="hidden sm:block">
                  <Link
                    href="/user/riwayat"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted/40"
                  >
                    <History className="h-4 w-4" />
                    Lihat Riwayat
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Laporan Hari Ini */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:rounded-2xl">
            <div className="border-b border-border px-4 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-foreground sm:text-lg">
                Laporan Hari Ini
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {todayReports.length} laporan pada hari ini
              </p>
            </div>

            <div className="divide-y divide-border">
              {todayReports.length === 0 ? (
                <div className="px-4 py-12 text-center sm:px-6">
                  <Camera className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40 sm:h-16 sm:w-16" />
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Belum ada laporan hari ini
                  </p>
                </div>
              ) : (
                todayReports.map((r) => (
                  <div
                    key={r.id}
                    className="px-4 py-4 transition-colors hover:bg-muted/30 sm:px-6"
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-2xs font-medium text-primary sm:text-xs">
                            {r.bidang}
                          </span>
                          <ReviewBadge status={r.statusReview} />
                        </div>
                        <p className="text-sm font-semibold leading-snug text-foreground sm:text-base">
                          {r.judul}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                          {r.deskripsi}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            {toIDDateTime(r.performedAt ?? r.createdAt)}
                          </span>
                          {typeof r.lat === "number" &&
                            typeof r.lng === "number" && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {r.lat.toFixed(3)}, {r.lng.toFixed(3)}
                              </span>
                            )}
                          {r.fotoSesudah?.length ? (
                            <span>{r.fotoSesudah.length} foto</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Laporan Terbaru Saya */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-foreground sm:text-lg">
                  Laporan Terbaru Saya
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {latestMine.length} laporan terakhir
                </p>
              </div>
              <Link
                href="/user/riwayat"
                className="hidden items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted/40 sm:inline-flex"
              >
                <History className="h-4 w-4" />
                Lihat Semua
              </Link>
            </div>

            <div className="divide-y divide-border">
              {latestMine.length === 0 ? (
                <div className="px-4 py-12 text-center sm:px-6">
                  <AlertCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40 sm:h-16 sm:w-16" />
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Belum ada laporan
                  </p>
                </div>
              ) : (
                latestMine.map((r) => (
                  <div
                    key={r.id}
                    className="px-4 py-4 transition-colors hover:bg-muted/30 sm:px-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-2xs font-medium text-primary sm:text-xs">
                            {r.bidang}
                          </span>
                          <ReviewBadge status={r.statusReview} />
                        </div>
                        <p className="text-sm text-foreground sm:text-base">
                          {r.judul}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                          {r.deskripsi}
                        </p>
                        <p className="mt-1 text-2xs text-muted-foreground sm:text-xs">
                          {toIDDateTime(r.createdAt)}
                        </p>
                      </div>
                      {/* (opsional) link detail jika ada halaman detail */}
                      {/* <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" /> */}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* mobile link */}
            <div className="px-4 pb-4 pt-2 sm:hidden">
              <Link
                href="/user/riwayat"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted/40"
              >
                <History className="h-4 w-4" />
                Lihat Semua Riwayat
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-card px-4 py-3 sm:hidden border-t border-border">
        <div className="mx-auto flex max-w-md items-center justify-around">
          <Link
            href="/user/beranda"
            className="flex flex-col items-center gap-1 text-primary"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">Beranda</span>
          </Link>

          <Link
            href="/user/laporan-baru"
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <FilePlus2 className="h-6 w-6" />
            <span className="text-[10px]">Buat</span>
          </Link>

          <Link
            href="/user/riwayat"
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <History className="h-6 w-6" />
            <span className="text-[10px]">Riwayat</span>
          </Link>

          <Link
            href="/user/profil"
            className="flex flex-col items-center gap-1 text-muted-foreground"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-[10px]">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
