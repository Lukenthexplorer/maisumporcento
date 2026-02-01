'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

export default function ProfilePage() {
  const { user } = useUser()
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setName(data?.name || '')
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id)

      if (error) throw error

      setMessage('Perfil atualizado com sucesso')
    } catch (error) {
      setMessage('Erro ao atualizar perfil')
      console.error('Erro:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm(
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.'
    )) return

    if (!confirm(
      'Última confirmação: você tem certeza absoluta? Todos os seus hábitos e progresso serão perdidos.'
    )) return

    try {
      await supabase.from('habit_checks').delete().eq('habit_id', user?.id)
      await supabase.from('habits').delete().eq('user_id', user?.id)
      await supabase.from('goals').delete().eq('user_id', user?.id)
      await supabase.from('users').delete().eq('id', user?.id)

      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Erro ao deletar conta:', error)
      alert('Erro ao deletar conta. Por favor, tente novamente.')
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
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">Perfil</h1>
          <p className="text-neutral-600">Gerencie suas informações</p>
        </div>

        <form onSubmit={handleSave} className="card space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="input bg-neutral-100"
              disabled
            />
            <p className="text-sm text-neutral-500 mt-1">
              O e-mail não pode ser alterado
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('sucesso')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Preferências</h2>
          
          <div className="flex items-center justify-between py-3 border-b border-neutral-200">
            <div>
              <div className="font-medium text-neutral-900">Lembretes diários</div>
              <div className="text-sm text-neutral-600">Receber lembretes por e-mail</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
            </label>
          </div>

          <p className="text-sm text-neutral-500">
            Mais preferências em breve
          </p>
        </div>

        <div className="card border-red-200 space-y-4">
          <h2 className="text-lg font-semibold text-red-700">Zona de perigo</h2>
          
          <div className="space-y-2">
            <p className="text-sm text-neutral-600">
              Excluir sua conta removerá permanentemente todos os seus dados, incluindo hábitos, 
              progresso e objetivos. Esta ação não pode ser desfeita.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Excluir minha conta
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}