'use client'

import { useEffect, useState } from 'react'
import TraditionsGrid from './components/TraditionsGrid'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      <section className="h-screen min-h-[700px] flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-deep via-[#1a0f2e] to-deep animate-gradient"
          style={{
            background: 'linear-gradient(135deg, #0A0A0F 0%, #1a0f2e 50%, #0A0A0F 100%)',
            animation: 'gradientShift 15s ease infinite',
          }}
        />

        <style jsx global>{`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientShift 15s ease infinite;
          }
        `}</style>

        <div
          className={`relative z-10 max-w-4xl text-center px-6 transition-all duration-1000 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-30px]'
          }`}
          style={{
            transitionDelay: '0ms',
          }}
        >
          <h1
            className="font-cinzel text-5xl md:text-7xl text-text-primary tracking-wide"
            style={{ transitionDelay: '0ms' }}
          >
            Ancient Wisdom.
            <br />
            Infinite Dialogue.
          </h1>

          <p
            className="font-sans text-xl text-text-secondary mt-6 max-w-2xl mx-auto"
            style={{ transitionDelay: '300ms' }}
          >
            Consult the oracles of four sacred traditions. Tao. Tarot. Tantra. Entheogens.
          </p>

          <div
            className="flex gap-4 justify-center mt-10"
            style={{ transitionDelay: '600ms' }}
          >
            <a
              href="/chat"
              className="bg-gold text-deep px-8 py-4 rounded-md font-medium hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-shadow duration-200"
            >
              Start for Free
            </a>
            <a
              href="/library"
              className="border border-gold/50 text-gold px-8 py-4 rounded-md hover:bg-gold/10 transition-colors duration-200"
            >
              Explore Traditions
            </a>
          </div>

          <div
            className="flex gap-6 justify-center mt-12"
            style={{ transitionDelay: '900ms' }}
          >
            <div className="w-10 h-10 opacity-60" title="Tao">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="#C9A84C" strokeWidth="1.5" />
                <path d="M20 6C20 6 14 14 14 20C14 26 20 34 20 34" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 6C20 6 26 14 26 20C26 26 20 34 20 34" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="4" fill="#C9A84C" />
              </svg>
            </div>

            <div className="w-10 h-10 opacity-60" title="Tarot">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="8" stroke="#C9A84C" strokeWidth="1.5" />
                <path d="M20 4L22 14H32L24 20L26 30L20 24L14 30L16 20L8 14H18L20 4Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="w-10 h-10 opacity-60" title="Tantra">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L32 18H26V32L20 26L14 32V18H8L20 4Z" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M20 12L26 18H22V26L20 22L18 26V18H14L20 12Z" stroke="#C9A84C" strokeWidth="1" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="w-10 h-10 opacity-60" title="Entheogens">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 36C20 36 8 28 8 18C8 10 14 4 20 4C26 4 32 10 32 18C32 28 20 36 20 36Z" stroke="#C9A84C" strokeWidth="1.5" />
                <path d="M20 12C20 12 16 16 16 20C16 24 20 28 20 28" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="20" cy="18" r="2" fill="#C9A84C" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <TraditionsGrid />

      <HowItWorks />

      <Testimonials />

      <FinalCTA />

      <Footer />
    </>
  )
}
