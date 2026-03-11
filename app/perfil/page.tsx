'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { Download, LogOut, User, Mail } from 'lucide-react'

export default function PerfilPage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    if (!user) return

    setExporting(true)

    try {
      // Buscar TODOS os dados do usuário
      const [
        { data: userData },
        { data: habits },
        { data: habitChecks },
        { data: goals },
        { data: dailyNotes },
        { data: dailyTasks },
      ] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('habits').select('*').eq('user_id', user.id),
        supabase.from('habit_checks').select('*').in('habit_id', 
          (await supabase.from('habits').select('id').eq('user_id', user.id)).data?.map(h => h.id) || []
        ),
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('daily_notes').select('*').eq('user_id', user.id),
        supabase.from('daily_tasks').select('*').eq('user_id', user.id),
      ])

      // Montar objeto completo com todos os dados
      const exportObject = {
        exported_at: new Date().toISOString(),
        user: userData,
        habits: habits || [],
        habit_checks: habitChecks || [],
        goals: goals || [],
        daily_notes: dailyNotes || [],
        daily_tasks: dailyTasks || [],
        stats: {
          total_habits: habits?.length || 0,
          total_checks: habitChecks?.length || 0,
          total_goals: goals?.length || 0,
          total_notes: dailyNotes?.length || 0,
          total_tasks: dailyTasks?.length || 0,
        }
      }

      // Criar arquivo JSON
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
        type: 'application/json',
      })

      // Download automático
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `maisumporcento-dados-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert('Seus dados foram baixados com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      alert('Erro ao exportar dados. Tente novamente.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Perfil</h1>
          <p className="text-sm sm:text-base text-neutral-600">
            Gerencie sua conta e dados
          </p>
        </div>

        {/* Informações do usuário */}
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações da conta
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <User className="w-4 h-4 text-neutral-600" />
              <div className="flex-1">
                <p className="text-xs text-neutral-600">Nome</p>
                <p className="text-sm font-medium text-neutral-900">
                  {user?.user_metadata?.name || 'Usuário'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
              <Mail className="w-4 h-4 text-neutral-600" />
              <div className="flex-1">
                <p className="text-xs text-neutral-600">E-mail</p>
                <p className="text-sm font-medium text-neutral-900">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exportar dados - LGPD */}
        <div className="card space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Seus dados
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              De acordo com a LGPD, você pode baixar todos os seus dados
            </p>
          </div>

          <button
            onClick={exportData}
            disabled={exporting}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exportando...' : 'Baixar meus dados (JSON)'}
          </button>

          <p className="text-xs text-neutral-500">
            Isso vai baixar um arquivo JSON com todos os seus hábitos, objetivos, 
            tarefas, notas e estatísticas.
          </p>
        </div>

        {/* Sair */}
        <div className="card">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {loading ? 'Saindo...' : 'Sair da conta'}
          </button>
        </div>

        {/* Footer legal */}
        <div className="text-center pt-8 border-t border-neutral-200">
          <p className="text-xs text-neutral-500">
            Seus dados são protegidos de acordo com a LGPD (Lei Geral de Proteção de Dados).
            <br />
            Nunca compartilhamos suas informações com terceiros.
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}