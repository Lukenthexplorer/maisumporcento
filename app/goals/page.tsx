'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

interface Goal {
  id: string
  title: string
  description: string | null
}

interface Habit {
  id: string
  title: string
  identity_label: string | null
  frequency: 'daily' | 'weekly'
  time_hint: string | null
  active: boolean
}

export default function GoalsPage() {
  const { user } = useUser()
  const [goals, setGoals] = useState<Goal[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [showNewHabit, setShowNewHabit] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalDescription, setNewGoalDescription] = useState('')
  const [newHabitTitle, setNewHabitTitle] = useState('')
  const [newHabitIdentity, setNewHabitIdentity] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    if (!user) return

    try {
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (goalsError) throw goalsError

      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (habitsError) throw habitsError

      setGoals(goalsData || [])
      setHabits(habitsData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase.from('goals').insert([
        {
          user_id: user.id,
          title: newGoalTitle,
          description: newGoalDescription || null,
        },
      ])

      if (error) throw error

      setNewGoalTitle('')
      setNewGoalDescription('')
      setShowNewGoal(false)
      loadData()
    } catch (error) {
      console.error('Erro ao criar objetivo:', error)
    }
  }

  const createHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase.from('habits').insert([
        {
          user_id: user.id,
          title: newHabitTitle,
          identity_label: newHabitIdentity || null,
          frequency: 'daily',
          active: true,
        },
      ])

      if (error) throw error

      setNewHabitTitle('')
      setNewHabitIdentity('')
      setShowNewHabit(false)
      loadData()
    } catch (error) {
      console.error('Erro ao criar hábito:', error)
    }
  }

  const toggleHabitActive = async (habitId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({ active: !currentStatus })
        .eq('id', habitId)

      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error)
    }
  }

  const deleteGoal = async (goalId: string) => {
    if (!confirm('Tem certeza que deseja excluir este objetivo?')) return

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)

      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Erro ao excluir objetivo:', error)
    }
  }

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Tem certeza que deseja excluir este hábito?')) return

    try {
      await supabase.from('habit_checks').delete().eq('habit_id', habitId)
      
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)

      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Erro ao excluir hábito:', error)
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
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12">
        {/* Objetivos */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Objetivos</h2>
              <p className="text-neutral-600 text-xs sm:text-sm mt-1">Bússolas, não cobranças</p>
            </div>
            <button
              onClick={() => setShowNewGoal(true)}
              className="btn-primary text-sm sm:text-base w-full sm:w-auto"
            >
              Novo objetivo
            </button>
          </div>

          {showNewGoal && (
            <form onSubmit={createGoal} className="card space-y-4">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Título do objetivo"
                className="input text-sm sm:text-base"
                required
                autoFocus
              />
              <textarea
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                placeholder="Descrição (opcional)"
                className="input min-h-[100px] text-sm sm:text-base"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button type="submit" className="btn-primary text-sm sm:text-base">Criar</button>
                <button
                  type="button"
                  onClick={() => setShowNewGoal(false)}
                  className="btn-secondary text-sm sm:text-base"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-xs sm:text-sm text-neutral-600 mt-1 break-words">{goal.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-neutral-400 hover:text-neutral-600 flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {goals.length === 0 && !showNewGoal && (
              <div className="card text-neutral-600 text-sm sm:text-base">
                Nenhum objetivo criado ainda.
              </div>
            )}
          </div>
        </section>

        {/* Hábitos */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Hábitos</h2>
              <p className="text-neutral-600 text-xs sm:text-sm mt-1">Menos de 30 segundos para criar</p>
            </div>
            <button
              onClick={() => setShowNewHabit(true)}
              className="btn-primary text-sm sm:text-base w-full sm:w-auto"
            >
              Novo hábito
            </button>
          </div>

          {showNewHabit && (
            <form onSubmit={createHabit} className="card space-y-4">
              <input
                type="text"
                value={newHabitTitle}
                onChange={(e) => setNewHabitTitle(e.target.value)}
                placeholder="Ex: Meditar 10 minutos"
                className="input text-sm sm:text-base"
                required
                autoFocus
              />
              <input
                type="text"
                value={newHabitIdentity}
                onChange={(e) => setNewHabitIdentity(e.target.value)}
                placeholder="Identidade: Sou uma pessoa que... (opcional)"
                className="input text-sm sm:text-base"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button type="submit" className="btn-primary text-sm sm:text-base">Criar</button>
                <button
                  type="button"
                  onClick={() => setShowNewHabit(false)}
                  className="btn-secondary text-sm sm:text-base"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-neutral-900 text-sm sm:text-base break-words">{habit.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                          habit.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {habit.active ? 'Ativo' : 'Pausado'}
                      </span>
                    </div>
                    {habit.identity_label && (
                      <p className="text-xs sm:text-sm text-neutral-600 mt-1 break-words">{habit.identity_label}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleHabitActive(habit.id, habit.active)}
                      className="text-xs sm:text-sm text-neutral-600 hover:text-neutral-900 whitespace-nowrap"
                    >
                      {habit.active ? 'Pausar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {habits.length === 0 && !showNewHabit && (
              <div className="card text-neutral-600 text-sm sm:text-base">
                Nenhum hábito criado ainda.
              </div>
            )}
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
  )
}