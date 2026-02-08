'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      if (!authData.user) {
        throw new Error('Erro ao criar usuário')
      }

      // Criar perfil do usuário no banco
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name,
          },
        ])

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
      }

      // Mostrar mensagem de sucesso
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8 text-center space-y-4">
            {/* Ícone de e-mail */}
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Confirme seu e-mail
              </h2>
              <p className="text-sm sm:text-base text-neutral-600">
                Enviamos um link de confirmação para:
              </p>
              <p className="text-sm sm:text-base font-medium text-neutral-900">
                {email}
              </p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-left space-y-2">
              <p className="text-xs sm:text-sm text-neutral-700">
                <strong>Próximos passos:</strong>
              </p>
              <ol className="text-xs sm:text-sm text-neutral-600 space-y-1 list-decimal list-inside">
                <li>Abra seu e-mail</li>
                <li>Procure na caixa de entrada ou <strong>spam</strong></li>
                <li>Clique no link de confirmação</li>
              </ol>
            </div>

            <div className="pt-4">
              <Link 
                href="/login" 
                className="text-sm text-neutral-600 hover:text-neutral-900 underline"
              >
                Voltar para login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold text-neutral-900">
            maisumporcento
          </Link>
          <p className="mt-2 text-sm text-neutral-600">
            Crie sua conta gratuita
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
          <form onSubmit={handleSignup} className="space-y-4">
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
                placeholder="Seu nome"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-neutral-900 hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}