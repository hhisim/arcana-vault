import type { Metadata } from 'next'
import './globals.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { LangProvider } from '@/lib/lang-context'

export const metadata: Metadata = {
  title: 'Vault of Arcana',
  description:
    'A living mystery school built from rare archives, curated datasets, symbolic intelligence, and the collaboration of Hakan Hisim + PRIME.',
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
          <Footer />
        </LangProvider>
      </body>
    </html>
  )
}
