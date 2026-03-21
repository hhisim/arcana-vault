import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Vault of Arcana',
  description: 'A living mystery school built from rare archives, curated datasets, symbolic intelligence, and the collaboration of Hakan Hisim + PRIME.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-deep text-text-primary font-sans antialiased">
        <Providers>
          <NavBar />
          <main className="pt-2">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
