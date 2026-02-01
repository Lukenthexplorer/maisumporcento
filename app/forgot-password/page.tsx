'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Erro ao enviar e-mail de recuperação')
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
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                E-mail enviado
              </h2>
              <p className="text-neutral-600">
                Enviamos instruções para <strong>{email}</strong>. 
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
            </div>

            <Link href="/login" className="btn-secondary w-full block text-center">
              Voltar para login
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
          <p className="mt-2 text-neutral-600">Recuperar senha</p>
        </div>

        <div className="card">
          <form onSubmit={handleResetRequest} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

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
              <p className="mt-2 text-sm text-neutral-500">
                Você receberá um link para redefinir sua senha
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Enviando...' : 'Enviar instruções'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-neutral-600">
          Lembrou sua senha?{' '}
          <Link href="/login" className="font-medium text-neutral-900 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}