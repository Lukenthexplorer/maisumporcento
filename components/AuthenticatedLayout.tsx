'use client'

import { Navigation } from '@/components/Navigation'
import { useUser } from '@/contexts/UserContext'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-600">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Navigation />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}