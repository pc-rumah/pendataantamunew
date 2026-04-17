'use client'

import { useEffect, useState } from 'react'
import { Eye, Users, TrendingUp } from 'lucide-react'
import { recordVisitAction, getVisitorStatsAction, type VisitorStats } from '@/app/actions/statistics'

const VISITOR_SESSION_KEY = 'visitor_session'

export function VisitorCounter() {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const initStats = async () => {
      try {
        const sessionVisited = sessionStorage.getItem(VISITOR_SESSION_KEY)
        if (sessionVisited) {
          const currentStats = await getVisitorStatsAction()
          setStats(currentStats)
        } else {
          const newStats = await recordVisitAction()
          sessionStorage.setItem(VISITOR_SESSION_KEY, 'true')
          setStats(newStats)
        }
      } catch (error) {
        console.error('Failed to load visitor stats:', error)
      }
    }
    
    initStats()
    
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!stats) return null

  return (
    <div 
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-border shadow-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-foreground">Statistik Pengunjung</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Total Visits */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary tabular-nums">
              {stats.totalVisits.toLocaleString('id-ID')}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total Kunjungan</div>
          </div>
          
          {/* Today Visits */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent tabular-nums">
              {stats.todayVisits.toLocaleString('id-ID')}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Hari Ini</div>
          </div>
        </div>
      </div>
    </div>
  )
}
