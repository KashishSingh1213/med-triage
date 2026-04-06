import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MedTriage-Env | AI Medical Triage Dashboard',
  description: 'AI-powered medical triage environment for emergency room assessment',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '🏥',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1e293b" />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
      </body>
    </html>
  )
}