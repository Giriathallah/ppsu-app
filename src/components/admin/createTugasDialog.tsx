"use client";

import { useState } from "react";
import { PETUGAS } from "@/lib/mock";
import type { Prioritas, Tugas } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type CreateTaskDialogProps = {
  onCreate: (t: Tugas) => void;
  defaultFromReport?: { laporanId: string; deskripsi: string } | null;
};

export function CreateTaskDialog({
  onCreate,
  defaultFromReport = null,
}: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [judul, setJudul] = useState(
    defaultFromReport?.deskripsi?.slice(0, 60) ?? ""
  );
  const [desc, setDesc] = useState(defaultFromReport?.deskripsi ?? "");
  const [prio, setPrio] = useState<Prioritas>("SEDANG");
  const [assignees, setAssignees] = useState<string[]>([]);

  const isFromReport = Boolean(defaultFromReport?.laporanId);

  function addAssignee(id: string) {
    setAssignees((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }
  function removeAssignee(id: string) {
    setAssignees((prev) => prev.filter((x) => x !== id));
  }

  function handleSave() {
    const now = new Date().toISOString();
    const status = assignees.length > 0 ? "ASSIGNED" : "OPEN";
    const payload: Tugas = {
      id: `t${Math.random().toString(36).slice(2, 8)}`,
      sumber: isFromReport ? "LAPORAN" : "ADMIN_MANUAL",
      laporanId: defaultFromReport?.laporanId ?? null,
      judul,
      deskripsi: desc,
      prioritas: prio,
      status,
      assignees,
      createdAt: now,
      updatedAt: now,
      selesaiAt: null,
      lat: undefined,
      lng: undefined,
      fotoSesudah: [],
    };
    onCreate(payload);
    setOpen(false);
    setJudul("");
    setDesc("");
    setPrio("SEDANG");
    setAssignees([]);
  }

  const disabled = !judul.trim() || !desc.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl">
          {isFromReport ? "Terima → Buat Tugas" : "Buat Tugas"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isFromReport ? "Buat Tugas dari Laporan" : "Buat Tugas Baru"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <Input
            placeholder="Judul"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />
          <Textarea
            placeholder="Deskripsi"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Select value={prio} onValueChange={(v) => setPrio(v as Prioritas)}>
              <SelectTrigger>
                <SelectValue placeholder="Prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RENDAH">Rendah</SelectItem>
                <SelectItem value="SEDANG">Sedang</SelectItem>
                <SelectItem value="TINGGI">Tinggi</SelectItem>
              </SelectContent>
            </Select>

            {/* Multi-select sederhana: tambah satu per satu */}
            <Select onValueChange={addAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Tambah assignee" />
              </SelectTrigger>
              <SelectContent>
                {PETUGAS.filter((p) => p.aktif).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {assignees.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {assignees.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-2 rounded-full border px-2 py-1"
                >
                  {id}
                  <button
                    onClick={() => removeAssignee(id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={disabled}
            className="rounded-xl"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
