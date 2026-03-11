import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { Analytics } from '@vercel/analytics/react'
import { Onboarding } from '@/components/Onboarding'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'maisumporcento – 1% melhor por dia',
  description: 'Habit tracker minimalista focado em consistência, identidade e progresso incremental.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'maisumporcento',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#171717',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                })
              }
            `,
          }}
        />
      </head>
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