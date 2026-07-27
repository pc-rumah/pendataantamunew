"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Printer,
  Download,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";
import type { Guest } from "@/lib/schema";
import { generateGuestPDF, printGuestData } from "@/lib/pdf-utils";

export default function TamuAdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/guests");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGuests(data.guests || []);
    } catch (error) {
      console.error("Error fetching guests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGuests = guests.filter(
    (g) =>
      (g.nama || "").toLowerCase().includes(search.toLowerCase()) ||
      (g.tujuan || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleUpdate = async () => {
    if (!editingGuest) return;
    try {
      const res = await fetch(`/api/guests/${editingGuest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingGuest),
      });
      if (!res.ok) throw new Error("Failed to update");
      loadGuests();
      setEditingGuest(null);
    } catch (error) {
      console.error("Error updating guest:", error);
      alert("Gagal memperbarui data tamu");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/guests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      loadGuests();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting guest:", error);
      alert("Gagal menghapus data tamu");
    }
  };

  const handleDownloadPDF = () => {
    generateGuestPDF(filteredGuests);
  };

  const handlePrint = () => {
    printGuestData(filteredGuests);
  };

  if (!mounted) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Tamu</h1>
            <p className="text-muted-foreground">Kelola data kunjungan tamu</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau tujuan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                    No. Telp
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden lg:table-cell">
                    Instansi
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredGuests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      {search
                        ? "Tidak ada data yang cocok"
                        : "Belum ada data tamu"}
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {guest.nama}
                          </p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {guest.tujuan}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground hidden md:table-cell">
                        {guest.noTelp}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground hidden lg:table-cell">
                        {guest.instansi || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {guest.tanggal}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingGuest(guest)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(guest.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredGuests.length} dari {guests.length} data
        </p>
      </div>

      {/* Edit Modal */}
      {editingGuest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Edit Data Tamu
              </h2>
              <button
                onClick={() => setEditingGuest(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={editingGuest.nama}
                  onChange={(e) =>
                    setEditingGuest({ ...editingGuest, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  No. Telepon
                </label>
                <input
                  type="text"
                  value={editingGuest.noTelp}
                  onChange={(e) =>
                    setEditingGuest({ ...editingGuest, noTelp: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Instansi
                </label>
                <input
                  type="text"
                  value={editingGuest.instansi}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      instansi: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Alamat
                </label>
                <textarea
                  rows={2}
                  value={editingGuest.alamat}
                  onChange={(e) =>
                    setEditingGuest({ ...editingGuest, alamat: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tujuan
                </label>
                <textarea
                  rows={2}
                  value={editingGuest.tujuan}
                  onChange={(e) =>
                    setEditingGuest({ ...editingGuest, tujuan: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 p-4 border-t border-border">
              <button
                onClick={() => setEditingGuest(null)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Save className="w-4 h-4" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Hapus Data?
            </h2>
            <p className="text-muted-foreground mb-6">
              Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
