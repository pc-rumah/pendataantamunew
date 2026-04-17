'use client'

import { useEffect, useState } from 'react'
import { Users, MessageSquareText, Clock, CheckCircle2, Eye, TrendingUp, Loader2 } from 'lucide-react'
import { AdminLayout } from '@/components/admin-layout'
import type { Guest, Aspiration } from '@/lib/schema'
import { getVisitorStatsAction, type VisitorStats } from '@/app/actions/statistics'

export default function DashboardPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [aspirations, setAspirations] = useState<Aspiration[]>([])
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({ totalVisits: 0, todayVisits: 0 })
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [stats, guestsRes, aspirationsRes] = await Promise.all([
        getVisitorStatsAction(),
        fetch('/api/guests'),
        fetch('/api/aspirations'),
      ])
      
      setVisitorStats(stats)

      if (guestsRes.ok) {
        const guestsData = await guestsRes.json()
        setGuests(guestsData.guests || [])
      }

      if (aspirationsRes.ok) {
        const aspirationsData = await aspirationsRes.json()
        setAspirations(aspirationsData.aspirations || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  const stats = [
    {
      label: 'Total Pengunjung',
      value: visitorStats.totalVisits,
      icon: TrendingUp,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      label: 'Pengunjung Hari Ini',
      value: visitorStats.todayVisits,
      icon: Eye,
      color: 'bg-pink-500/10 text-pink-600',
    },
    {
      label: 'Total Tamu',
      value: guests.length,
      icon: Users,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Total Aspirasi',
      value: aspirations.length,
      icon: MessageSquareText,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Aspirasi Baru',
      value: aspirations.filter((a) => a.status === 'baru').length,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      label: 'Aspirasi Selesai',
      value: aspirations.filter((a) => a.status === 'selesai').length,
      icon: CheckCircle2,
      color: 'bg-green-500/10 text-green-600',
    },
  ]

  const recentGuests = guests.slice(-5).reverse()
  const recentAspirations = aspirations.slice(-5).reverse()

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Ringkasan data pendataan tamu dan aspirasi</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Memuat data dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="bg-card rounded-lg sm:rounded-xl border border-border p-3 sm:p-4 lg:p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tabular-nums">{stat.value.toLocaleString('id-ID')}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent Data */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Guests */}
              <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Tamu Terbaru
                  </h2>
                </div>
                <div className="p-4">
                  {recentGuests.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Belum ada data tamu</p>
                  ) : (
                    <ul className="space-y-3">
                      {recentGuests.map((guest) => (
                        <li
                          key={guest.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-foreground">{guest.nama}</p>
                            <p className="text-sm text-muted-foreground">{guest.tujuan}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{guest.tanggal}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Recent Aspirations */}
              <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageSquareText className="w-5 h-5 text-accent" />
                    Aspirasi Terbaru
                  </h2>
                </div>
                <div className="p-4">
                  {recentAspirations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Belum ada aspirasi</p>
                  ) : (
                    <ul className="space-y-3">
                      {recentAspirations.map((asp) => (
                        <li
                          key={asp.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-foreground">{asp.judul}</p>
                            <p className="text-sm text-muted-foreground">{asp.nama}</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              asp.status === 'baru'
                                ? 'bg-amber-100 text-amber-700'
                                : asp.status === 'diproses'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {asp.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
