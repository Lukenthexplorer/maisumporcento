'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
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

      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              name,
            },
          ])

        if (insertError) {
          console.error('Erro ao criar perfil:', insertError)
        }
      }

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-neutral-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/" className="text-2xl font-semibold text-neutral-900">
              maisumporcento
            </Link>
          </div>

          <div className="card space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Conta criada com sucesso
              </h2>
              <p className="text-neutral-600">
                Enviamos um e-mail de confirmação para <strong>{email}</strong>. 
                Verifique sua caixa de entrada e confirme seu e-mail para começar.
              </p>
            </div>

            <Link href="/login" className="btn-primary w-full block text-center">
              Ir para login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-neutral-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-semibold text-neutral-900">
            maisumporcento
          </Link>
          <p className="mt-2 text-neutral-600">Crie sua conta</p>
        </div>

        <div className="card">
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

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
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-neutral-900 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}