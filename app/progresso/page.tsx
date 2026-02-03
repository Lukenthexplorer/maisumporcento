'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

interface Habit {
  id: string
  title: string
  active: boolean
}

interface DayRow {
  date: string
  dayName: string
  completedCount: number
  totalHabits: number
  checks: Record<string, boolean>
  note: string
}

export default function ProgressPage() {
  const { user } = useUser()
  const [habits, setHabits] = useState<Habit[]>([])
  const [monthData, setMonthData] = useState<DayRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  
  const supabase = createClient()

  useEffect(() => {
    loadMonthData()
  }, [user, selectedMonth])

  const loadMonthData = async () => {
    if (!user) return
    
    setLoading(true)

    try {
      // Buscar hábitos ativos
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('id, title, active')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: true })

      if (habitsError) throw habitsError

      setHabits(habitsData || [])

      // Calcular range do mês selecionado
      const [year, month] = selectedMonth.split('-').map(Number)
      const firstDay = new Date(year, month - 1, 1)
      const lastDay = new Date(year, month, 0)
      const daysInMonth = lastDay.getDate()

      const startDateStr = firstDay.toISOString().split('T')[0]
      const endDateStr = lastDay.toISOString().split('T')[0]

      // Buscar checks do mês
      const { data: checksData, error: checksError } = await supabase
        .from('habit_checks')
        .select('date, habit_id, completed')
        .gte('date', startDateStr)
        .lte('date', endDateStr)

      if (checksError) throw checksError

      // Buscar notas do mês
      const { data: notesData, error: notesError } = await supabase
        .from('daily_notes')
        .select('date, content')
        .gte('date', startDateStr)
        .lte('date', endDateStr)

      if (notesError) throw notesError

      // Organizar dados por dia
      const checksMap = new Map<string, Record<string, boolean>>()
      checksData?.forEach(check => {
        if (!checksMap.has(check.date)) {
          checksMap.set(check.date, {})
        }
        checksMap.get(check.date)![check.habit_id] = check.completed
      })

      const notesMap = new Map(notesData?.map(n => [n.date, n.content || '']) || [])

      // Criar linhas da tabela
      const rows: DayRow[] = []
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day)
        const dateStr = date.toISOString().split('T')[0]
        const dayName = dayNames[date.getDay()]
        
        const checks = checksMap.get(dateStr) || {}
        const completedCount = Object.values(checks).filter(c => c).length
        const totalHabits = habitsData?.length || 0

        rows.push({
          date: dateStr,
          dayName,
          completedCount,
          totalHabits,
          checks,
          note: notesMap.get(dateStr) || '',
        })
      }

      setMonthData(rows)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleHabit = async (date: string, habitId: string, currentStatus: boolean) => {
    if (!user) return

    try {
      if (!currentStatus) {
        await supabase.from('habit_checks').insert([
          {
            habit_id: habitId,
            date,
            completed: true,
          },
        ])
      } else {
        await supabase
          .from('habit_checks')
          .delete()
          .eq('habit_id', habitId)
          .eq('date', date)
      }

      loadMonthData()
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error)
    }
  }

  const updateNote = async (date: string, content: string) => {
    if (!user) return

    try {
      await supabase.from('daily_notes').upsert({
        user_id: user.id,
        date,
        content: content.trim(),
      }, {
        onConflict: 'user_id,date'
      })
    } catch (error) {
      console.error('Erro ao salvar nota:', error)
    }
  }

  const calculateCompletion = (habitId: string) => {
    const completed = monthData.filter(row => row.checks[habitId]).length
    const total = monthData.length
    return total > 0 ? Math.round((completed / total) * 100) : 0
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
      <div className="w-full px-4 sm:px-6 py-6 sm:py-12 space-y-6">
        {/* Header com seletor de mês */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Progresso</h1>
          
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        </div>

        {habits.length === 0 ? (
          <div className="card">
            <p className="text-neutral-600">
              Crie hábitos na aba Objetivos para começar a acompanhar seu progresso.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-700 border border-neutral-200 sticky left-0 bg-neutral-100 z-10">
                      Data
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-neutral-700 border border-neutral-200 w-20">
                      %
                    </th>
                    {habits.map(habit => (
                      <th
                        key={habit.id}
                        className="px-3 py-2 text-center text-xs font-medium text-neutral-700 border border-neutral-200 min-w-[80px]"
                      >
                        <div className="truncate" title={habit.title}>
                          {habit.title}
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-2 text-left text-xs font-medium text-neutral-700 border border-neutral-200 min-w-[200px]">
                      Nota do dia
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthData.map((row) => (
                    <tr key={row.date} className="hover:bg-neutral-50">
                      <td className="px-3 py-2 text-xs text-neutral-900 border border-neutral-200 whitespace-nowrap sticky left-0 bg-white z-10">
                        <div className="font-medium">{row.dayName}</div>
                        <div className="text-neutral-500">
                          {new Date(row.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-neutral-900 border border-neutral-200">
                        <div className="font-semibold">
                          {row.totalHabits > 0
                            ? `${Math.round((row.completedCount / row.totalHabits) * 100)}%`
                            : '—'
                          }
                        </div>
                      </td>
                      {habits.map(habit => (
                        <td
                          key={habit.id}
                          className="px-3 py-2 text-center border border-neutral-200"
                        >
                          <input
                            type="checkbox"
                            checked={row.checks[habit.id] || false}
                            onChange={() =>
                              toggleHabit(row.date, habit.id, row.checks[habit.id] || false)
                            }
                            className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 cursor-pointer"
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2 border border-neutral-200">
                        <input
                          type="text"
                          value={row.note}
                          onChange={(e) => {
                            const newData = monthData.map(d =>
                              d.date === row.date ? { ...d, note: e.target.value } : d
                            )
                            setMonthData(newData)
                          }}
                          onBlur={(e) => updateNote(row.date, e.target.value)}
                          placeholder="..."
                          className="w-full px-2 py-1 text-xs border-0 focus:outline-none focus:ring-1 focus:ring-neutral-300 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                  
                  {/* Linha de totais */}
                  <tr className="bg-neutral-100 font-semibold">
                    <td className="px-3 py-2 text-xs text-neutral-900 border border-neutral-200 sticky left-0 bg-neutral-100 z-10">
                      Total
                    </td>
                    <td className="px-3 py-2 text-center text-xs border border-neutral-200">
                      —
                    </td>
                    {habits.map(habit => (
                      <td
                        key={habit.id}
                        className="px-3 py-2 text-center text-xs text-neutral-900 border border-neutral-200"
                      >
                        +{calculateCompletion(habit.id)}%
                      </td>
                    ))}
                    <td className="px-3 py-2 text-xs border border-neutral-200">
                      Count: 0
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}