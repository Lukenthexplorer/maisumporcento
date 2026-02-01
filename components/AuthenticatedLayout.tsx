'use client'

import { Navigation } from '@/components/Navigation'
import { MobileNav } from '@/components/MobileNav'
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
    <div className="min-h-screen bg-neutral-50">
      {/* Navegação Desktop - esconde no mobile */}
      <div className="hidden lg:flex">
        <Navigation />
      </div>

      {/* Navegação Mobile */}
      <MobileNav />

      {/* Conteúdo principal */}
      <main className="lg:ml-64">
        {children}
      </main>
    </div>
  )
}