import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { Analytics } from '@vercel/analytics/react'
import { Onboarding } from '@/components/Onboarding'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'maisumporcento – 1% melhor por dia',
  description: 'Habit tracker minimalista focado em consistência, identidade e progresso incremental.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <UserProvider>
          {children}
          <Onboarding />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}