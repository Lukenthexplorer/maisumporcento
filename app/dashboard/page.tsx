'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import { getLocalDateString } from '@/lib/date-utils'
import { DailyNote } from '@/components/DailyNote'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import Link from 'next/link'
import { 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Calendar,
  Flame
} from 'lucide-react'

interface Habit {
  id: string
  title: string
  identity_label: string | null
  completed_today: boolean
  created_at: string
}

interface Stats {
  daysUsingApp: number
  todayCompleted: number
  todayTotal: number
  activeTasks: number
  totalHabits: number
  currentStreak: number
}

export default function DashboardPage() {
  const { user } = useUser()
  const [habits, setHabits] = useState<Habit[]>([])
  const [stats, setStats] = useState<Stats>({
    daysUsingApp: 0,
    todayCompleted: 0,
    todayTotal: 0,
    activeTasks: 0,
    totalHabits: 0,
    currentStreak: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const today = getLocalDateString()

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return

    try {
      // Buscar hábitos ativos
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: true })

      if (habitsError) throw habitsError

      // Buscar checks de hoje
      const { data: checksData, error: checksError } = await supabase
        .from('habit_checks')
        .select('habit_id, completed')
        .eq('date', today)
        .eq('completed', true)

      if (checksError) throw checksError

      const checksMap = new Map(checksData?.map(c => [c.habit_id, true]) || [])
      const habitsWithStatus = habitsData?.map(h => ({
        ...h,
        completed_today: checksMap.has(h.id),
      })) || []

      setHabits(habitsWithStatus)

      // Buscar todos os hábitos (ativos + inativos) para total
      const { data: allHabits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user.id)

      // Buscar data de criação do usuário
      const { data: userData } = await supabase
        .from('users')
        .select('created_at')
        .eq('id', user.id)
        .single()

      // Calcular dias usando o app
      const createdAt = userData?.created_at ? new Date(userData.created_at) : new Date()
      const daysSinceCreation = Math.floor((new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1

      // Calcular streak atual
      const { data: allChecks } = await supabase
        .from('habit_checks')
        .select('date')
        .in('habit_id', habitsData?.map(h => h.id) || [])
        .eq('completed', true)
        .order('date', { ascending: false })

      const streak = calculateCurrentStreak(allChecks?.map(c => c.date) || [])

      setStats({
        daysUsingApp: daysSinceCreation,
        todayCompleted: habitsWithStatus.filter(h => h.completed_today).length,
        todayTotal: habitsWithStatus.length,
        activeTasks: habitsWithStatus.length,
        totalHabits: allHabits?.length || 0,
        currentStreak: streak,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCurrentStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0

    const uniqueDates = [...new Set(dates)].sort().reverse()
    const today = getLocalDateString()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = getLocalDateString()

    // Se não fez nada hoje nem ontem, streak = 0
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterdayStr) {
      return 0
    }

    let streak = 0
    let checkDate = new Date()

    for (const dateStr of uniqueDates) {
      const date = new Date(dateStr + 'T12:00:00')
      const expectedDate = new Date(checkDate)
      expectedDate.setHours(12, 0, 0, 0)

      const daysDiff = Math.floor((expectedDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0 || daysDiff === 1) {
        streak++
        checkDate = date
      } else {
        break
      }
    }

    return streak
  }

  const toggleHabit = async (habitId: string, currentStatus: boolean) => {
    if (!user) return

    try {
      if (!currentStatus) {
        await supabase.from('habit_checks').insert([
          {
            habit_id: habitId,
            date: today,
            completed: true,
          },
        ])
      } else {
        await supabase
          .from('habit_checks')
          .delete()
          .eq('habit_id', habitId)
          .eq('date', today)
      }

      loadData()
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error)
    }
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
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Olá, {user?.user_metadata?.name?.split(' ')[0] || 'usuário'}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Você está usando o maisumporcento há {stats.daysUsingApp} {stats.daysUsingApp === 1 ? 'dia' : 'dias'}
          </p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Hábitos de hoje */}
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-neutral-600" />
              <span className="text-xs text-neutral-600">Hoje</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {stats.todayCompleted}/{stats.todayTotal}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {stats.todayTotal > 0 
                ? `${Math.round((stats.todayCompleted / stats.todayTotal) * 100)}%`
                : '—'
              }
            </div>
          </div>

          {/* Tarefas ativas */}
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-neutral-600" />
              <span className="text-xs text-neutral-600">Ativas</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {stats.activeTasks}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              tarefas
            </div>
          </div>

          {/* Hábitos totais */}
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-neutral-600" />
              <span className="text-xs text-neutral-600">Total</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {stats.totalHabits}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              hábitos
            </div>
          </div>

          {/* Streak */}
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-neutral-600">Streak</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              dias
            </div>
          </div>

          {/* Dias de uso */}
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-neutral-600" />
              <span className="text-xs text-neutral-600">Jornada</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {stats.daysUsingApp}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              dias
            </div>
          </div>
        </div>

        {/* Hábitos de hoje */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Hábitos de hoje</h2>
            {habits.length > 0 && (
              <Link href="/goals" className="text-sm text-neutral-600 hover:text-neutral-900">
                Gerenciar
              </Link>
            )}
          </div>

          {habits.length === 0 ? (
            <div className="card space-y-4">
              <p className="text-neutral-600 text-sm sm:text-base">
                Você ainda não criou nenhum hábito.
              </p>
              <Link href="/goals" className="btn-primary inline-block text-sm sm:text-base">
                Criar primeiro hábito
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {habits.map((habit) => (
                <div key={habit.id} className="card">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={() => toggleHabit(habit.id, habit.completed_today)}
                      className={`
                        w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 flex items-center justify-center flex-shrink-0
                        transition-all
                        ${habit.completed_today
                          ? 'bg-neutral-900 border-neutral-900'
                          : 'border-neutral-300 hover:border-neutral-400'
                        }
                      `}
                    >
                      {habit.completed_today && (
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 text-sm sm:text-base truncate">
                        {habit.title}
                      </h3>
                      {habit.identity_label && (
                        <p className="text-xs sm:text-sm text-neutral-500 mt-1 line-clamp-2">
                          {habit.identity_label}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mensagem motivacional */}
        {habits.length > 0 && (
          <div className="text-center pt-4">
            <p className="text-neutral-500 text-xs sm:text-sm">
              {stats.todayCompleted === stats.todayTotal && stats.todayTotal > 0
                ? 'Consistência vence intensidade. 🎯'
                : stats.currentStreak > 0
                ? `Você está em uma sequência de ${stats.currentStreak} ${stats.currentStreak === 1 ? 'dia' : 'dias'}! 🔥`
                : 'Pequenas ações. Resultados inevitáveis.'
              }
            </p>
          </div>
        )}

        {/* Registro diário */}
        {habits.length > 0 && <DailyNote />}
      </div>
    </AuthenticatedLayout>
  )
}