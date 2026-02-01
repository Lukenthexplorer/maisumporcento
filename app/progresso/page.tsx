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

      console.log('📊 Checks encontrados:', checks?.length)
      console.log('🔍 Todos os checks:', checks)
  
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

      console.log('📈 Heatmap gerado:', heatmap)
      console.log('📅 Hoje deveria ter:', heatmap.find(h => h.date === new Date().toISOString().split('T')[0]))
  
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
    
    console.log('🗓️ Renderizando de', startDate.toISOString().split('T')[0], 'até', today.toISOString().split('T')[0])
    console.log('📊 dataMap contém:', Array.from(dataMap.entries()))

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
    
    console.log('📊 Total de semanas:', weeks.length)
    console.log('🎨 Última semana:', weeks[weeks.length - 1])

    return (
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-1">
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
                    className={`w-3 h-3 rounded-sm ${colors[intensity]}`}
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
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Progresso</h1>
              <p className="text-neutral-600">Consistência é tudo.</p>
            </div>
            <button
              onClick={() => loadProgressData()}
              className="btn-secondary"
            >
              Atualizar
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <div className="text-sm text-neutral-600 mb-1">Sequência atual</div>
            <div className="text-4xl font-bold text-neutral-900">
              {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}
            </div>
          </div>
          
          <div className="card">
            <div className="text-sm text-neutral-600 mb-1">Melhor sequência</div>
            <div className="text-4xl font-bold text-neutral-900">
              {maxStreak} {maxStreak === 1 ? 'dia' : 'dias'}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Últimos 12 meses
          </h2>
          {renderHeatmap()}
          
          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-4">
            <span>Menos</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-neutral-100" />
              <div className="w-3 h-3 rounded-sm bg-neutral-300" />
              <div className="w-3 h-3 rounded-sm bg-neutral-500" />
              <div className="w-3 h-3 rounded-sm bg-neutral-700" />
              <div className="w-3 h-3 rounded-sm bg-neutral-900" />
            </div>
            <span>Mais</span>
          </div>
        </div>

        {currentStreak === 0 && heatmapData.length > 0 && (
          <div className="card bg-neutral-900 text-white">
            <p className="text-sm">
              A regra é não falhar duas vezes.
            </p>
          </div>
        )}

        {heatmapData.length === 0 && (
          <div className="card">
            <p className="text-neutral-600">
              Comece marcando seus hábitos no dashboard. Seu progresso aparecerá aqui.
            </p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}