'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts'

interface CategoryData {
  category: string
  label: string
  value: number
  color: string
}

const CATEGORIES = {
  physical_health: { 
    label: 'Saúde física', 
    color: '#10b981' // verde
  },
  mental_health: { 
    label: 'Saúde mental', 
    color: '#3b82f6' // azul
  },
  spirituality: { 
    label: 'Espiritualidade', 
    color: '#8b5cf6' // roxo
  },
  knowledge: { 
    label: 'Conhecimento', 
    color: '#f59e0b' // laranja
  },
  work: { 
    label: 'Trabalho', 
    color: '#ef4444' // vermelho
  },
  relationships: { 
    label: 'Relacionamentos', 
    color: '#ec4899' // rosa
  },
}

export default function EquilibrioPage() {
  const { user } = useUser()
  const [chartData, setChartData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadBalanceData()
  }, [user])

  const loadBalanceData = async () => {
    if (!user) return

    setLoading(true)

    try {
      // Buscar todos os hábitos do usuário
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('id, category, created_at')
        .eq('user_id', user.id)
        .eq('active', true)

      if (habitsError) throw habitsError

      if (!habits || habits.length === 0) {
        setChartData([])
        setLoading(false)
        return
      }

      // Buscar todos os checks do usuário
      const { data: checks, error: checksError } = await supabase
        .from('habit_checks')
        .select('habit_id, date, completed')
        .in('habit_id', habits.map(h => h.id))

      if (checksError) throw checksError

      // Calcular consistência por categoria
      const categoryStats = new Map<string, { total: number; completed: number; firstDate: string }>()

      habits.forEach(habit => {
        if (!categoryStats.has(habit.category)) {
          categoryStats.set(habit.category, {
            total: 0,
            completed: 0,
            firstDate: habit.created_at
          })
        }
      })

      // Contar dias desde o primeiro hábito de cada categoria
      const today = new Date()
      
      habits.forEach(habit => {
        const stats = categoryStats.get(habit.category)!
        const habitCreated = new Date(habit.created_at)
        const daysSinceCreation = Math.floor((today.getTime() - habitCreated.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        stats.total += daysSinceCreation

        // Contar dias completados
        const habitChecks = checks?.filter(c => c.habit_id === habit.id && c.completed) || []
        stats.completed += habitChecks.length
      })

      // Converter para array de dados do gráfico
      const data: CategoryData[] = Object.entries(CATEGORIES).map(([key, config]) => {
        const stats = categoryStats.get(key)
        
        // Se não tem hábito nessa categoria OU nunca foi completado, valor = 0
        const value = stats && stats.completed > 0
          ? Math.round((stats.completed / stats.total) * 100)
          : 0

        return {
          category: key,
          label: config.label,
          value,
          color: config.color
        }
      })

      setChartData(data)
    } catch (error) {
      console.error('Erro ao carregar dados de equilíbrio:', error)
    } finally {
      setLoading(false)
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

  const hasData = chartData.some(d => d.value > 0)

  return (
    <AuthenticatedLayout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Equilíbrio</h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Este gráfico mostra em quais áreas você tem aparecido com mais frequência.
          </p>
        </div>

        {!hasData ? (
          <div className="card text-center py-12">
            <p className="text-neutral-600 text-sm sm:text-base">
              Comece marcando seus hábitos para ver seu equilíbrio de vida.
            </p>
          </div>
        ) : (
          <>
            {/* Gráfico Aranha */}
            <div className="card">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={chartData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="label" 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                  />
                  <Radar
                    name="Consistência"
                    dataKey="value"
                    stroke="#171717"
                    fill="#171717"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Consistência']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda com cores */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {chartData.map(item => (
                <div key={item.category} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-neutral-900 truncate">
                      {item.label}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {item.value}% de consistência
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Explicação */}
            <div className="card bg-neutral-50 border-neutral-200">
              <p className="text-xs sm:text-sm text-neutral-700">
                <strong>Como funciona:</strong> Cada eixo mostra o percentual de dias em que você apareceu 
                naquela área desde que criou o primeiro hábito relacionado. Quanto mais você mantém 
                a consistência, maior o valor no gráfico.
              </p>
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  )
}