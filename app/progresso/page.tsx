'use client'

import { useEffect, useState, useRef } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { useSwipeable } from 'react-swipeable'
import { 
  Target, 
  Dumbbell, 
  Activity, 
  Apple, 
  BookOpen, 
  Brain, 
  Droplet, 
  Moon, 
  Heart, 
  Code, 
  Music, 
  Users,
  LucideIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const AVAILABLE_ICONS: Record<string, LucideIcon> = {
  target: Target,
  dumbbell: Dumbbell,
  running: Activity,
  apple: Apple,
  book: BookOpen,
  brain: Brain,
  water: Droplet,
  moon: Moon,
  heart: Heart,
  code: Code,
  music: Music,
  users: Users,
}

interface Habit {
  id: string
  title: string
  active: boolean
  icon: string
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
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const supabase = createClient()

  // Handlers de swipe
  const handlers = useSwipeable({
    onSwipedLeft: () => scrollTable('right'),
    onSwipedRight: () => scrollTable('left'),
    trackMouse: false,
    trackTouch: true,
  })

  const scrollTable = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 200
    const currentScroll = scrollContainerRef.current.scrollLeft
    const targetScroll = direction === 'right' 
      ? currentScroll + scrollAmount 
      : currentScroll - scrollAmount

    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    checkScrollButtons()
    container.addEventListener('scroll', checkScrollButtons)
    
    return () => container.removeEventListener('scroll', checkScrollButtons)
  }, [monthData])

  useEffect(() => {
    loadMonthData()
  }, [user, selectedMonth])

  const loadMonthData = async () => {
    if (!user) return
    
    setLoading(true)

    try {
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('id, title, active, icon')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: true })

      if (habitsError) throw habitsError

      setHabits(habitsData || [])

      const [year, month] = selectedMonth.split('-').map(Number)
      const firstDay = new Date(year, month - 1, 1)
      const lastDay = new Date(year, month, 0)
      const daysInMonth = lastDay.getDate()

      const startDateStr = firstDay.toISOString().split('T')[0]
      const endDateStr = lastDay.toISOString().split('T')[0]

      const { data: checksData, error: checksError } = await supabase
        .from('habit_checks')
        .select('date, habit_id, completed')
        .gte('date', startDateStr)
        .lte('date', endDateStr)

      if (checksError) throw checksError

      const { data: notesData, error: notesError } = await supabase
        .from('daily_notes')
        .select('date, content')
        .gte('date', startDateStr)
        .lte('date', endDateStr)

      if (notesError) throw notesError

      const checksMap = new Map<string, Record<string, boolean>>()
      checksData?.forEach(check => {
        if (!checksMap.has(check.date)) {
          checksMap.set(check.date, {})
        }
        checksMap.get(check.date)![check.habit_id] = check.completed
      })

      const notesMap = new Map(notesData?.map(n => [n.date, n.content || '']) || [])

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Progresso</h1>
          
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 text-sm sm:text-base"
          />
        </div>

        {habits.length === 0 ? (
          <div className="card">
            <p className="text-neutral-600 text-sm sm:text-base">
              Crie hábitos na aba Objetivos para começar a acompanhar seu progresso.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Botões de scroll (só aparecem no desktop quando há scroll) */}
            {canScrollLeft && (
              <button
                onClick={() => scrollTable('left')}
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white border border-neutral-300 rounded-full p-2 shadow-lg hover:bg-neutral-50 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-700" />
              </button>
            )}
            
            {canScrollRight && (
              <button
                onClick={() => scrollTable('right')}
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white border border-neutral-300 rounded-full p-2 shadow-lg hover:bg-neutral-50 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-neutral-700" />
              </button>
            )}

            {/* Indicador de scroll no mobile */}
            {canScrollRight && (
              <div className="lg:hidden absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-neutral-50 to-transparent pointer-events-none z-10" />
            )}

            <div 
              {...handlers}
              ref={scrollContainerRef}
              className="overflow-x-auto -mx-4 sm:mx-0 scroll-smooth"
              style={{ 
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin'
              }}
            >
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-100">
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-neutral-700 border border-neutral-200 sticky left-0 bg-neutral-100 z-20 min-w-[80px] shadow-sm">
                        Data
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-center text-xs font-medium text-neutral-700 border border-neutral-200 w-16 sm:w-20">
                        %
                      </th>
                      {habits.map(habit => {
                        const IconComponent = AVAILABLE_ICONS[habit.icon] || Target
                        return (
                          <th
                            key={habit.id}
                            className="px-2 sm:px-3 py-2 text-center text-xs font-medium text-neutral-700 border border-neutral-200 min-w-[70px] sm:min-w-[80px]"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600" />
                              <div className="truncate max-w-[60px] sm:max-w-none" title={habit.title}>
                                {habit.title}
                              </div>
                            </div>
                          </th>
                        )
                      })}
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-neutral-700 border border-neutral-200 min-w-[150px] sm:min-w-[200px]">
                        Nota
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthData.map((row) => (
                      <tr key={row.date} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-2 sm:px-3 py-2 text-xs text-neutral-900 border border-neutral-200 whitespace-nowrap sticky left-0 bg-white z-10 shadow-sm">
                          <div className="font-medium">{row.dayName}</div>
                          <div className="text-neutral-500 text-[10px] sm:text-xs">
                            {new Date(row.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-center text-xs text-neutral-900 border border-neutral-200">
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
                            className="px-2 sm:px-3 py-2 text-center border border-neutral-200"
                          >
                            <input
                              type="checkbox"
                              checked={row.checks[habit.id] || false}
                              onChange={() =>
                                toggleHabit(row.date, habit.id, row.checks[habit.id] || false)
                              }
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 cursor-pointer"
                            />
                          </td>
                        ))}
                        <td className="px-2 sm:px-3 py-2 border border-neutral-200">
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
                    
                    <tr className="bg-neutral-100 font-semibold">
                      <td className="px-2 sm:px-3 py-2 text-xs text-neutral-900 border border-neutral-200 sticky left-0 bg-neutral-100 z-10 shadow-sm">
                        Total
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-center text-xs border border-neutral-200">
                        —
                      </td>
                      {habits.map(habit => (
                        <td
                          key={habit.id}
                          className="px-2 sm:px-3 py-2 text-center text-xs text-neutral-900 border border-neutral-200"
                        >
                          +{calculateCompletion(habit.id)}%
                        </td>
                      ))}
                      <td className="px-2 sm:px-3 py-2 text-xs border border-neutral-200">
                        —
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dica de swipe no mobile */}
            {habits.length > 2 && (
              <div className="lg:hidden text-center mt-3">
                <p className="text-xs text-neutral-500">
                  ← Deslize para ver mais →
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}