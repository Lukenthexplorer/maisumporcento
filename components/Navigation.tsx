'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useUser } from '@/contexts/UserContext'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { href: '/dashboard', label: 'Hoje' },
    { href: '/progresso', label: 'Progresso' },
    { href: '/goals', label: 'Objetivos' },
    { href: '/perfil', label: 'Perfil' },
  ]

  return (
    <nav className="w-64 bg-white border-r border-neutral-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-neutral-200">
        <Link href="/dashboard" className="text-xl font-semibold text-neutral-900">
          maisumporcento
        </Link>
      </div>

      <div className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-neutral-900 text-white' 
                  : 'text-neutral-600 hover:bg-neutral-100'
                }
              `}
            >
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-neutral-200">
        <div className="text-sm text-neutral-600 mb-3">
          Bem-vindo, {user?.user_metadata?.name.split(' ')[0] || 'usuário'}!
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          Sair
        </button>
      </div>
    </nav>
  )
}