import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import StickyCTA from './components/StickyCTA'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Vault of Arcana',
  description: 'A living mystery school built from rare archives, curated datasets, symbolic intelligence, and the collaboration of Hakan Hisim + PRIME.',
  openGraph: {
    title: 'Vault of Arcana',
    description: 'A living mystery school built from 30 years of esoteric archives, curated datasets, and symbolic intelligence.',
    url: 'https://www.vaultofarcana.com',
    siteName: 'Vault of Arcana',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vault of Arcana',
    description: 'A living mystery school — 30 years of esoteric archives, curated datasets, and symbolic intelligence.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XC46N98LDY" />
        <script dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XC46N98LDY');" }} />
      </head>
      <body className="bg-deep text-text-primary font-sans antialiased">
        <Providers>
          <NavBar />
          <main className="pt-20">{children}</main>
          <Footer />
          <StickyCTA />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
