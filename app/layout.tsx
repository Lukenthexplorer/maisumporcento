import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { Analytics } from '@vercel/analytics/react'
import { Onboarding } from '@/components/Onboarding'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'maisumporcento – 1% melhor por dia',
  description: 'Habit tracker minimalista focado em consistência, identidade e progresso incremental. Construa hábitos que duram.',
  keywords: ['Hábitos', 'habit tracker', 'produtividade', '1% melhor', 'consistência', 'atomic habits'],
  authors: [{ name: 'maisumporcento' }],
  creator: 'maisumporcento',
  publisher: 'maisumporcento',
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
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://maisumporcento.com.br',
    title: 'maisumporcento – 1% melhor por dia',
    description: 'Habit tracker minimalista focado em consistência, identidade e progresso incremental.',
    siteName: 'maisumporcento',
    images: [
      {
        url: 'https://maisumporcento.com.br/icon-512.png',
        width: 512,
        height: 512,
        alt: 'maisumporcento logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'maisumporcento – 1% melhor por dia',
    description: 'Habit tracker minimalista focado em consistência',
    images: ['https://maisumporcento.com.br/icon-512.png'],
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