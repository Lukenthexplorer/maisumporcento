'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import { getLocalDateString } from '@/lib/date-utils'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { Plus, Calendar, Clock, CheckCircle2, Circle, Trash2 } from 'lucide-react'

interface Task {
  id: string
  title: string
  completed: boolean
  date: string
  reminder_time: string | null
}

type ViewMode = 'today' | 'week' | 'all'

export default function TarefasPage() {
  const { user } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('today')
  const [loading, setLoading] = useState(true)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDate, setNewTaskDate] = useState(getLocalDateString())
  const [newTaskTime, setNewTaskTime] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadTasks()
  }, [user, viewMode])

  const loadTasks = async () => {
    if (!user) return

    setLoading(true)

    try {
      let query = supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user.id)

      const today = getLocalDateString()

      if (viewMode === 'today') {
        query = query.eq('date', today)
      } else if (viewMode === 'week') {
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        
        const startStr = weekStart.toISOString().split('T')[0]
        const endStr = weekEnd.toISOString().split('T')[0]
        
        query = query.gte('date', startStr).lte('date', endStr)
      }

      query = query.order('date', { ascending: true }).order('created_at', { ascending: true })

      const { data, error } = await query

      if (error) throw error

      setTasks(data || [])
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase.from('daily_tasks').insert([
        {
          user_id: user.id,
          title: newTaskTitle,
          date: newTaskDate,
          reminder_time: newTaskTime || null,
          completed: false,
        },
      ])

      if (error) throw error

      setNewTaskTitle('')
      setNewTaskDate(getLocalDateString())
      setNewTaskTime('')
      setShowNewTask(false)
      loadTasks()
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
    }
  }

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update({ completed: !currentStatus })
        .eq('id', taskId)

      if (error) throw error
      loadTasks()
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

    try {
      const { error } = await supabase
        .from('daily_tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      loadTasks()
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const groupTasksByDate = () => {
    const grouped = new Map<string, Task[]>()
    tasks.forEach(task => {
      if (!grouped.has(task.date)) {
        grouped.set(task.date, [])
      }
      grouped.get(task.date)!.push(task)
    })
    return grouped
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dateStr === getLocalDateString()) return 'Hoje'
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Amanhã'

    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    })
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

  const groupedTasks = groupTasksByDate()

  return (
    <AuthenticatedLayout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Tarefas</h1>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                {completedCount} de {totalCount} concluídas ({completionRate}%)
              </p>
            </div>
            <button
              onClick={() => setShowNewTask(true)}
              className="btn-primary text-sm sm:text-base flex items-center gap-2 justify-center"
            >
              <Plus className="w-4 h-4" />
              Nova tarefa
            </button>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setViewMode('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                viewMode === 'today'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                viewMode === 'week'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Esta semana
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                viewMode === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Todas
            </button>
          </div>
        </div>

        {/* Form de nova tarefa */}
        {showNewTask && (
          <form onSubmit={createTask} className="card space-y-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Título da tarefa"
              className="input text-sm sm:text-base"
              required
              autoFocus
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm text-neutral-600 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="input text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-neutral-600 mb-2">
                  Lembrete (opcional)
                </label>
                <input
                  type="time"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="input text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button type="submit" className="btn-primary text-sm sm:text-base">
                Criar
              </button>
              <button
                type="button"
                onClick={() => setShowNewTask(false)}
                className="btn-secondary text-sm sm:text-base"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Lista de tarefas */}
        {tasks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-neutral-600 text-sm sm:text-base">
              {viewMode === 'today' && 'Nenhuma tarefa para hoje.'}
              {viewMode === 'week' && 'Nenhuma tarefa esta semana.'}
              {viewMode === 'all' && 'Você ainda não criou nenhuma tarefa.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.from(groupedTasks.entries()).map(([date, dateTasks]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(date)}
                </h3>
                <div className="space-y-2">
                  {dateTasks.map((task) => (
                    <div key={task.id} className="card">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTask(task.id, task.completed)}
                          className="flex-shrink-0"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-neutral-900" />
                          ) : (
                            <Circle className="w-5 h-5 text-neutral-300 hover:text-neutral-400" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base ${
                            task.completed
                              ? 'line-through text-neutral-500'
                              : 'text-neutral-900'
                          }`}>
                            {task.title}
                          </p>
                          {task.reminder_time && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
                              <Clock className="w-3 h-3" />
                              {task.reminder_time.slice(0, 5)}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="flex-shrink-0 text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}