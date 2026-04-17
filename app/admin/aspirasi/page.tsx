'use client'

import { useEffect, useState } from 'react'
import { Search, Edit2, Trash2, Printer, Download, X, Save, Eye, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/admin-layout'
import type { Aspiration } from '@/lib/schema'
import { generateAspirationPDF, printAspirationData } from '@/lib/pdf-utils'

const statusOptions = [
  { value: 'baru', label: 'Baru', color: 'bg-amber-100 text-amber-700' },
  { value: 'diproses', label: 'Diproses', color: 'bg-blue-100 text-blue-700' },
  { value: 'selesai', label: 'Selesai', color: 'bg-green-100 text-green-700' },
]

export default function AspirasiAdminPage() {
  const [aspirations, setAspirations] = useState<Aspiration[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingAspiration, setEditingAspiration] = useState<Aspiration | null>(null)
  const [viewingAspiration, setViewingAspiration] = useState<Aspiration | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    loadAspirations()
  }, [])

  const loadAspirations = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/aspirations')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAspirations(data.aspirations || [])
    } catch (error) {
      console.error('Error fetching aspirations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAspirations = aspirations.filter((a) => {
    const matchSearch =
      (a.nama || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.judul || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.kategori || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleUpdate = async () => {
    if (!editingAspiration) return
    try {
      const res = await fetch(`/api/aspirations/${editingAspiration.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAspiration),
      })
      if (!res.ok) throw new Error('Failed to update')
      loadAspirations()
      setEditingAspiration(null)
    } catch (error) {
      console.error('Error updating aspiration:', error)
      alert('Gagal memperbarui aspirasi')
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/aspirations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to check status')
      loadAspirations()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Gagal memperbarui status')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/aspirations/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete')
      loadAspirations()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting aspiration:', error)
      alert('Gagal menghapus aspirasi')
    }
  }

  const handleDownloadPDF = () => {
    generateAspirationPDF(filteredAspirations)
  }

  const handlePrint = () => {
    printAspirationData(filteredAspirations)
  }

  if (!mounted) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Data Aspirasi</h1>
            <p className="text-muted-foreground">Kelola aspirasi masyarakat</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, judul, atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Judul</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden lg:table-cell">Kategori</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden sm:table-cell">Tanggal</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAspirations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      {search || filterStatus !== 'all' ? 'Tidak ada data yang cocok' : 'Belum ada aspirasi'}
                    </td>
                  </tr>
                ) : (
                  filteredAspirations.map((asp) => (
                    <tr key={asp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{asp.judul}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[250px] md:hidden">{asp.nama}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground hidden md:table-cell">{asp.nama}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          {asp.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={asp.status}
                          onChange={(e) => handleStatusChange(asp.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${
                            statusOptions.find((s) => s.value === asp.status)?.color
                          }`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground hidden sm:table-cell">{asp.tanggal}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingAspiration(asp)}
                            className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
                            title="Lihat"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingAspiration(asp)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(asp.id)}
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
          Menampilkan {filteredAspirations.length} dari {aspirations.length} data
        </p>
      </div>

      {/* View Modal */}
      {viewingAspiration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Detail Aspirasi</h2>
              <button
                onClick={() => setViewingAspiration(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Judul</p>
                <p className="font-medium text-foreground">{viewingAspiration.judul}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="text-foreground">{viewingAspiration.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground">{viewingAspiration.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                  <p className="text-foreground">{viewingAspiration.kategori}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal</p>
                  <p className="text-foreground">{viewingAspiration.tanggal}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Isi Aspirasi</p>
                <p className="text-foreground whitespace-pre-wrap">{viewingAspiration.isi}</p>
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setViewingAspiration(null)}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingAspiration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Edit Aspirasi</h2>
              <button
                onClick={() => setEditingAspiration(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Judul</label>
                <input
                  type="text"
                  value={editingAspiration.judul}
                  onChange={(e) => setEditingAspiration({ ...editingAspiration, judul: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nama</label>
                  <input
                    type="text"
                    value={editingAspiration.nama}
                    onChange={(e) => setEditingAspiration({ ...editingAspiration, nama: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={editingAspiration.email}
                    onChange={(e) => setEditingAspiration({ ...editingAspiration, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                <select
                  value={editingAspiration.status}
                  onChange={(e) => setEditingAspiration({ ...editingAspiration, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Isi Aspirasi</label>
                <textarea
                  rows={4}
                  value={editingAspiration.isi}
                  onChange={(e) => setEditingAspiration({ ...editingAspiration, isi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 p-4 border-t border-border">
              <button
                onClick={() => setEditingAspiration(null)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
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
            <h2 className="text-lg font-semibold text-foreground mb-2">Hapus Aspirasi?</h2>
            <p className="text-muted-foreground mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
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
  )
}
