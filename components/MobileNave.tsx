'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useUser } from '@/contexts/UserContext'

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { href: '/dashboard', label: 'Hoje', icon: '📅' },
    { href: '/progresso', label: 'Progresso', icon: '📊' },
    { href: '/goals', label: 'Objetivos', icon: '🎯' },
    { href: '/perfil', label: 'Perfil', icon: '👤' },
  ]

  return (
    <>
      {/* Header Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-semibold text-neutral-900">
            maisumporcento
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-neutral-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Mobile Slide */}
      <div className={`
        lg:hidden fixed top-0 right-0 bottom-0 w-64 bg-white z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header do menu */}
          <div className="p-4 border-b border-neutral-200">
            <div className="text-sm text-neutral-600 mb-2">
              Olá, {user?.user_metadata?.name?.split(' ')[0] || 'usuário'}
            </div>
            <div className="text-xs text-neutral-400">{user?.email}</div>
          </div>

          {/* Links */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-neutral-900 text-white' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Spacer para o header fixo */}
      <div className="lg:hidden h-14" />
    </>
  )
}