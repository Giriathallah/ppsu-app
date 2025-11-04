// src/app/(user)/profil/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { USERS, LAPORAN } from "@/lib/mock";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CURRENT_USER_ID = "p2";

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function UserProfilPage() {
  const me0 = useMemo(() => USERS.find((p) => p.id === CURRENT_USER_ID), []);
  const [me, setMe] = useState(me0);
  const myReportsToday = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();
    return (LAPORAN || []).filter(
      (l: any) =>
        l.pelaporUserId === CURRENT_USER_ID &&
        (() => {
          const t = l.performedOn
            ? new Date(l.performedOn)
            : new Date(l.createdAt);
          return (
            t.getFullYear() === y && t.getMonth() === m && t.getDate() === d
          );
        })()
    ).length;
  }, []);

  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  const [editNama, setEditNama] = useState(me?.nama ?? "");
  const [editTelp, setEditTelp] = useState(me?.noTelp ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [newPwd2, setNewPwd2] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const onLogout = () => {
    alert("Keluar (simulasi). Nanti arahkan ke halaman login.");
  };

  const saveProfile = async () => {
    if (!editNama.trim()) return;
    setSavingProfile(true);
    try {
      setMe((prev: any) => ({
        ...prev,
        nama: editNama.trim(),
        noTelp: editTelp.trim() || undefined,
      }));
      setEditOpen(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    if (!curPwd || !newPwd || newPwd !== newPwd2 || newPwd.length < 6) return;
    setSavingPwd(true);
    try {
      setPwdOpen(false);
      setCurPwd("");
      setNewPwd("");
      setNewPwd2("");
      alert("Kata sandi diperbarui (simulasi).");
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-screen-sm px-3 py-3 md:max-w-screen-md md:px-6 md:py-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Profil
        </h1>
        <p className="text-sm text-muted-foreground">
          Informasi dan pengaturan akun petugas.
        </p>
      </div>

      <Card className="border-border/60 bg-card">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <Avatar className="size-12 rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-primary/10 text-primary">
              {getInitials(me?.nama)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base leading-tight">
              {me?.nama ?? "Petugas"}
            </CardTitle>
            <CardDescription className="text-xs">
              ID: {me?.petugasId ?? "-"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Link href="/buat-laporan" className="w-full">
              <Button className="w-full rounded-xl">Buat Laporan</Button>
            </Link>
            <Link href="/riwayat" className="w-full">
              <Button variant="outline" className="w-full rounded-xl">
                Riwayat
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-2xl border p-3 md:grid-cols-3">
            <div className="flex items-center justify-between md:block">
              <span className="text-sm text-muted-foreground">Status</span>
              <div className="md:mt-1.5">
                <Badge variant={me?.aktif ? "default" : "secondary"}>
                  {me?.aktif ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between md:block">
              <span className="text-sm text-muted-foreground">No. Telepon</span>
              <div className="md:mt-1.5 text-sm font-medium">
                {me?.noTelp ?? "-"}
              </div>
            </div>
            <div className="flex items-center justify-between md:block">
              <span className="text-sm text-muted-foreground">
                Laporan Hari Ini
              </span>
              <div className="md:mt-1.5 text-sm font-medium">
                {myReportsToday}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setEditOpen(true)}
            >
              Ubah Data Diri
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setPwdOpen(true)}
            >
              Ubah Kata Sandi
            </Button>
            <Button onClick={onLogout} className="col-span-2 rounded-xl">
              Keluar
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Akun dibuat oleh admin. Kamu dapat memperbarui data diri dan kata sandi
        kapan saja.
      </p>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Data Diri</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
                placeholder="Nama lengkap"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="telp">No. Telepon</Label>
              <Input
                id="telp"
                value={editTelp}
                onChange={(e) => setEditTelp(e.target.value)}
                placeholder="08xxxxxxxxxx"
                inputMode="tel"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={saveProfile}
              disabled={savingProfile || !editNama.trim()}
              className="rounded-xl"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Kata Sandi</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="current">Kata sandi saat ini</Label>
              <Input
                id="current"
                type="password"
                value={curPwd}
                onChange={(e) => setCurPwd(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="new">Kata sandi baru</Label>
              <Input
                id="new"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="new2">Ulangi kata sandi baru</Label>
              <Input
                id="new2"
                type="password"
                value={newPwd2}
                onChange={(e) => setNewPwd2(e.target.value)}
                placeholder="Sama dengan di atas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={savePassword}
              disabled={
                savingPwd ||
                !curPwd ||
                !newPwd ||
                newPwd.length < 6 ||
                newPwd !== newPwd2
              }
              className="rounded-xl"
            >
              Perbarui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
