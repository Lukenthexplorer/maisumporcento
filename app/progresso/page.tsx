'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

interface HeatmapDay {
  date: string
  count: number
}

export default function ProgressPage() {
  const { user } = useUser()
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProgressData()
  }, [user])
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProgressData()
      }
    }
  
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user])

  const loadProgressData = async () => {
    if (!user) return
  
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 365)
      const startDateStr = startDate.toISOString().split('T')[0]
  
      const { data: checks, error } = await supabase
        .from('habit_checks')
        .select('date, habit_id, completed')
        .gte('date', startDateStr)
        .order('date', { ascending: true })
  
      if (error) throw error
  
      const dateMap = new Map<string, Set<string>>()
      
      checks?.forEach(check => {
        if (check.completed) {
          if (!dateMap.has(check.date)) {
            dateMap.set(check.date, new Set())
          }
          dateMap.get(check.date)?.add(check.habit_id)
        }
      })
  
      const heatmap = Array.from(dateMap.entries()).map(([date, habitIds]) => ({
        date,
        count: habitIds.size,
      }))
  
      setHeatmapData(heatmap)
      calculateStreaks(Array.from(dateMap.keys()).sort())
    } catch (error) {
      console.error('Erro ao carregar progresso:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStreaks = (dates: string[]) => {
    if (dates.length === 0) {
      setCurrentStreak(0)
      setMaxStreak(0)
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let current = 0
    let max = 0
    let tempStreak = 0
    let lastDate: Date | null = null

    dates.sort().forEach(dateStr => {
      const date = new Date(dateStr)
      
      if (!lastDate) {
        tempStreak = 1
      } else {
        const diffDays = Math.floor((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          tempStreak++
        } else {
          max = Math.max(max, tempStreak)
          tempStreak = 1
        }
      }
      
      lastDate = date
    })

    max = Math.max(max, tempStreak)

    const lastDateStr = dates[dates.length - 1]
    if (lastDateStr === today || lastDateStr === yesterdayStr) {
      current = tempStreak
    }

    setCurrentStreak(current)
    setMaxStreak(max)
  }

  const renderHeatmap = () => {
    const weeks = []
    const today = new Date()
    
    const startDate = new Date(today)
    startDate.setMonth(startDate.getMonth() - 12)
    startDate.setDate(1)
    
    const dayOfWeek = startDate.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(startDate.getDate() - daysToMonday)

    const dataMap = new Map(heatmapData.map(d => [d.date, d.count]))

    const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.ceil(totalDays / 7)

    for (let i = 0; i < totalWeeks; i++) {
      const week = []
      for (let j = 0; j < 7; j++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + (i * 7) + j)
        
        if (currentDate <= today) {
          const dateStr = currentDate.toISOString().split('T')[0]
          const count = dataMap.get(dateStr) || 0
          week.push({ date: dateStr, count })
        }
      }
      if (week.length > 0) {
        weeks.push(week)
      }
    }

    return (
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-4">
        <div className="inline-flex gap-1 min-w-max">
          {weeks.reverse().map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day, dayIdx) => {
                const intensity = day.count === 0 ? 0 : Math.min(day.count, 4)
                const colors = [
                  'bg-neutral-100',
                  'bg-neutral-300',
                  'bg-neutral-500',
                  'bg-neutral-700',
                  'bg-neutral-900',
                ]
                
                return (
                  <div
                    key={dayIdx}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${colors[intensity]}`}
                    title={`${day.date}: ${day.count} hábitos`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-neutral-600">Carregando...</div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Progresso</h1>
              <p className="text-sm sm:text-base text-neutral-600">Consistência é tudo.</p>
            </div>
            <button
              onClick={() => loadProgressData()}
              className="btn-secondary text-sm sm:text-base w-full sm:w-auto"
            >
              Atualizar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="card">
            <div className="text-xs sm:text-sm text-neutral-600 mb-1">Sequência atual</div>
            <div className="text-3xl sm:text-4xl font-bold text-neutral-900">
              {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}
            </div>
          </div>
          
          <div className="card">
            <div className="text-xs sm:text-sm text-neutral-600 mb-1">Melhor sequência</div>
            <div className="text-3xl sm:text-4xl font-bold text-neutral-900">
              {maxStreak} {maxStreak === 1 ? 'dia' : 'dias'}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">
            Últimos 12 meses
          </h2>
          {renderHeatmap()}
          
          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-3 sm:mt-4">
            <span>Menos</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-neutral-100" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-neutral-300" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-neutral-500" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-neutral-700" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-neutral-900" />
            </div>
            <span>Mais</span>
          </div>
        </div>

        {currentStreak === 0 && heatmapData.length > 0 && (
          <div className="card bg-neutral-900 text-white">
            <p className="text-xs sm:text-sm">
              A regra é não falhar duas vezes.
            </p>
          </div>
        )}

        {heatmapData.length === 0 && (
          <div className="card">
            <p className="text-neutral-600 text-sm sm:text-base">
              Comece marcando seus hábitos no dashboard. Seu progresso aparecerá aqui.
            </p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}