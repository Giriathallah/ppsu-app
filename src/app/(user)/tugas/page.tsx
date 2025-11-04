"use client";

import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Upload,
  CheckCircle2,
  Clock,
  ClipboardList,
  X,
} from "lucide-react";

type Prioritas = "RENDAH" | "SEDANG" | "TINGGI";
type TugasStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "DONE" | "REJECTED";

type Tugas = {
  id: string;
  sumber: "LAPORAN" | "ADMIN_MANUAL";
  laporanId?: string | null;
  judul: string;
  deskripsi: string;
  prioritas: Prioritas;
  status: TugasStatus;
  createdAt: string;
  updatedAt: string;
  selesaiAt?: string | null;
  assignees: string[];
  lat?: number;
  lng?: number;
  fotoSesudah?: string[];
};

const TUGAS_INITIAL: Tugas[] = [
  {
    id: "t1",
    sumber: "LAPORAN",
    laporanId: "l2",
    judul: "Perbaiki tutup got Jl. Melati 3",
    deskripsi: "Angkat tutup lama, pasang penutup baru, cek aliran air",
    prioritas: "TINGGI",
    status: "ASSIGNED",
    createdAt: "2025-10-27T02:32:00.000Z",
    updatedAt: "2025-10-27T05:00:00.000Z",
    selesaiAt: null,
    assignees: ["p1", "p2"],
    lat: -6.2,
    lng: 106.83,
  },
  {
    id: "t2",
    sumber: "ADMIN_MANUAL",
    laporanId: null,
    judul: "Bersihkan taman RW 05",
    deskripsi: "Sapu daun kering, kumpulkan sampah, semprot area bermain",
    prioritas: "SEDANG",
    status: "IN_PROGRESS",
    createdAt: "2025-10-28T07:40:00.000Z",
    updatedAt: "2025-10-28T08:10:00.000Z",
    assignees: ["p2"],
    lat: -6.197,
    lng: 106.84,
  },
  {
    id: "t3",
    sumber: "ADMIN_MANUAL",
    laporanId: null,
    judul: "Cat ulang marka jalan depan SDN 04",
    deskripsi: "Bersihkan permukaan lalu cat ulang marka zebra cross",
    prioritas: "RENDAH",
    status: "DONE",
    createdAt: "2025-10-20T03:00:00.000Z",
    updatedAt: "2025-10-26T14:22:00.000Z",
    selesaiAt: "2025-10-26T14:22:00.000Z",
    assignees: ["p2"],
    fotoSesudah: ["/mock-after.jpg"],
  },
];

const PriorityBadge = ({ level }: { level: Prioritas }) => {
  const styles = {
    RENDAH: "bg-muted text-muted-foreground",
    SEDANG: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    TINGGI: "bg-destructive/10 text-destructive",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[level]}`}
    >
      {level}
    </span>
  );
};

const StatusBadge = ({ status }: { status: TugasStatus }) => {
  const styles = {
    OPEN: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    ASSIGNED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    IN_PROGRESS: "bg-primary/10 text-primary",
    DONE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    REJECTED: "bg-destructive/10 text-destructive",
  };

  const labels = {
    OPEN: "Terbuka",
    ASSIGNED: "Ditugaskan",
    IN_PROGRESS: "Dalam Proses",
    DONE: "Selesai",
    REJECTED: "Ditolak",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

export default function UserTugas() {
  const [tugas, setTugas] = useState(TUGAS_INITIAL);
  const [activeTab, setActiveTab] = useState<
    "ASSIGNED" | "IN_PROGRESS" | "DONE"
  >("ASSIGNED");
  const [selectedTask, setSelectedTask] = useState<Tugas | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const currentUser = "p2";
  const myTugas = tugas.filter((t) => t.assignees.includes(currentUser));

  const filteredTugas = myTugas.filter((t) => {
    if (activeTab === "ASSIGNED") return t.status === "ASSIGNED";
    if (activeTab === "IN_PROGRESS") return t.status === "IN_PROGRESS";
    if (activeTab === "DONE") return t.status === "DONE";
    return false;
  });

  const handleStartTask = (taskId: string) => {
    setTugas((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "IN_PROGRESS" as TugasStatus,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    setSelectedTask(null);
  };

  const handleCompleteTask = () => {
    if (selectedTask) {
      setTugas((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id
            ? {
                ...t,
                status: "DONE" as TugasStatus,
                updatedAt: new Date().toISOString(),
                selesaiAt: new Date().toISOString(),
                fotoSesudah: uploadedFiles,
              }
            : t
        )
      );
      setShowCompleteDialog(false);
      setSelectedTask(null);
      setUploadedFiles([]);
      setNotes("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map((f) => URL.createObjectURL(f));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button className="sm:hidden w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Tugas Saya
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Kelola tugas harian Anda
              </p>
            </div>
          </div>

          {/* Tabs - Mobile Optimized */}
          <div className="flex gap-1 sm:gap-2 bg-muted/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("ASSIGNED")}
              className={`flex-1 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === "ASSIGNED"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="hidden sm:inline">Ditugaskan</span>
              <span className="sm:hidden">Baru</span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-semibold">
                {myTugas.filter((t) => t.status === "ASSIGNED").length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("IN_PROGRESS")}
              className={`flex-1 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === "IN_PROGRESS"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="hidden sm:inline">Dalam Proses</span>
              <span className="sm:hidden">Proses</span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold">
                {myTugas.filter((t) => t.status === "IN_PROGRESS").length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("DONE")}
              className={`flex-1 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === "DONE"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Selesai
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-semibold">
                {myTugas.filter((t) => t.status === "DONE").length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          {filteredTugas.length === 0 ? (
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
              <ClipboardList className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Tidak ada tugas
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === "ASSIGNED" && "Belum ada tugas yang ditugaskan"}
                {activeTab === "IN_PROGRESS" && "Tidak ada tugas dalam proses"}
                {activeTab === "DONE" && "Belum ada tugas yang diselesaikan"}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTugas.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <PriorityBadge level={task.prioritas} />
                    <StatusBadge status={task.status} />
                  </div>

                  <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2 line-clamp-2">
                    {task.judul}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                    {task.deskripsi}
                  </p>

                  {task.lat && task.lng && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">
                        {task.lat.toFixed(4)}, {task.lng.toFixed(4)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(task.updatedAt)}
                    </span>

                    {task.status === "ASSIGNED" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTask(task.id);
                        }}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90"
                      >
                        Mulai
                      </button>
                    )}

                    {task.status === "IN_PROGRESS" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTask(task);
                          setShowCompleteDialog(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700"
                      >
                        Selesai
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedTask && !showCompleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-card w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Detail Tugas
              </h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <PriorityBadge level={selectedTask.prioritas} />
                  <StatusBadge status={selectedTask.status} />
                </div>

                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2">
                    {selectedTask.judul}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTask.deskripsi}
                  </p>
                </div>

                {selectedTask.lat && selectedTask.lng && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-1">
                          Lokasi
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedTask.lat.toFixed(6)},{" "}
                          {selectedTask.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                  </div>
                )}

                {selectedTask.fotoSesudah &&
                  selectedTask.fotoSesudah.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        Foto Setelah Pengerjaan
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTask.fotoSesudah.map((foto, idx) => (
                          <div
                            key={idx}
                            className="aspect-video bg-muted rounded-lg flex items-center justify-center"
                          >
                            <span className="text-xs text-muted-foreground">
                              Foto {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Dibuat</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(selectedTask.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Diperbarui
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(selectedTask.updatedAt)}
                    </p>
                  </div>
                </div>

                {selectedTask.selesaiAt && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Diselesaikan
                    </p>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {formatDate(selectedTask.selesaiAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-border flex-shrink-0">
              {selectedTask.status === "ASSIGNED" && (
                <button
                  onClick={() => {
                    handleStartTask(selectedTask.id);
                  }}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5" />
                  Mulai Tugas
                </button>
              )}

              {selectedTask.status === "IN_PROGRESS" && (
                <button
                  onClick={() => setShowCompleteDialog(true)}
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Tandai Selesai
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Complete Task Dialog */}
      {showCompleteDialog && selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-card w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Selesaikan Tugas
              </h2>
              <button
                onClick={() => {
                  setShowCompleteDialog(false);
                  setUploadedFiles([]);
                  setNotes("");
                }}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload Foto Hasil{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Pilih foto
                    </span>
                  </label>

                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video bg-muted rounded-lg overflow-hidden"
                        >
                          <img
                            src={file}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() =>
                              setUploadedFiles((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Catatan (opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Tambahkan catatan tentang pengerjaan tugas..."
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-border flex gap-3 flex-shrink-0">
              <button
                onClick={() => {
                  setShowCompleteDialog(false);
                  setUploadedFiles([]);
                  setNotes("");
                }}
                className="flex-1 py-3 border border-border rounded-lg font-medium hover:bg-muted"
              >
                Batal
              </button>
              <button
                onClick={handleCompleteTask}
                disabled={uploadedFiles.length === 0}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
