'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import { DailyNote } from '@/components/DailyNote'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import Link from 'next/link'

interface Habit {
  id: string
  title: string
  identity_label: string | null
  completed_today: boolean
}

export default function DashboardPage() {
  const { user } = useUser()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const today = new Date().toISOString().split('T')[0]

  const loadHabits = async () => {
    if (!user) return

    try {
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: true })

      if (habitsError) throw habitsError

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
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHabits()
  }, [user])

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

      loadHabits()
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error)
    }
  }

  const completedCount = habits.filter(h => h.completed_today).length
  const totalCount = habits.length

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
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Hoje</h1>
          <p className="text-sm sm:text-base text-neutral-600">
            {completedCount > 0 
              ? `Você completou ${completedCount}/${totalCount} hábitos hoje.`
              : 'Hoje conta.'
            }
          </p>
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
          <div className="space-y-3">
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

        {habits.length > 0 && (
          <div className="text-center pt-4 sm:pt-8">
            <p className="text-neutral-500 text-xs sm:text-sm">
              {completedCount === totalCount && totalCount > 0
                ? 'Consistência vence intensidade.'
                : 'Pequenas ações. Resultados inevitáveis.'
              }
            </p>
          </div>
        )}

        {/* ADICIONAR AQUI - Registro diário opcional */}
        {habits.length > 0 && <DailyNote />}

        </div> 
    </AuthenticatedLayout>
  )
}