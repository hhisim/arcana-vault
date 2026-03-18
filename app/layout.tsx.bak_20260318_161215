import type { Metadata } from 'next'
import { Cinzel, DM_Sans } from 'next/font/google'
import './globals.css'
import NavBar from './components/NavBar'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

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
    <html lang="en" className={`${cinzel.variable} ${dmSans.variable}`}>
      <body className="bg-deep text-text-primary font-sans antialiased">
        <NavBar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  )
}
