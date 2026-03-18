import type { Metadata } from 'next'
import './globals.css'
import NavBar from './components/NavBar'
import { LangProvider } from '@/lib/lang-context'

export const metadata: Metadata = {
  title: 'Vault of Arcana',
  description: 'Ancient wisdom. Infinite dialogue.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-deep text-text-primary font-sans antialiased">
        <LangProvider>
          <NavBar />
          <main className="pt-20">{children}</main>
        </LangProvider>
      </body>
    </html>
  )
}
