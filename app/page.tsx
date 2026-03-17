'use client'

import { useEffect, useState } from 'react'
import TraditionsGrid from './components/TraditionsGrid'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <section className="h-screen min-h-[700px] flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0A0A0F 0%, #1a0f2e 50%, #0A0A0F 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 15s ease infinite',
          }}
        />

        <style jsx global>{`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>

        <div className="relative z-10 max-w-4xl text-center px-6">
          <h1 className="font-cinzel text-5xl md:text-7xl text-text-primary tracking-wide animate-fade-in-up">
            Ancient Wisdom.
            <br />
            Infinite Dialogue.
          </h1>

          <p className="font-sans text-xl text-text-secondary mt-6 max-w-2xl mx-auto animate-fade-in-up animate-delay-300">
            Consult the oracles of four sacred traditions. Tao. Tarot. Tantra. Entheogens.
          </p>

          <div className="flex gap-4 justify-center mt-10 animate-fade-in-up animate-delay-600">
            <a
              href="/chat"
              className="bg-gold text-deep px-8 py-4 rounded-md font-medium hover-glow-gold transition-all duration-200"
            >
              Start for Free
            </a>
            <a
              href="/library"
              className="border border-gold/50 text-gold px-8 py-4 rounded-md hover:bg-gold/10 transition-all duration-200"
            >
              Explore Traditions
            </a>
          </div>

          <div className="flex gap-6 justify-center mt-12 animate-fade-in-up animate-delay-900">
            <div className="w-10 h-10 opacity-60 text-gold" title="Tao">
              <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M20 2 C28 2 32 10 32 20 C32 30 28 38 20 38 C12 38 8 30 8 20 C8 10 12 2 20 2 Z M20 12 C16 12 14 16 14 20 C14 24 16 28 20 28 C24 28 26 24 26 20 C26 16 24 12 20 12" fill="currentColor"/></svg>
            </div>

            <div className="w-10 h-10 opacity-60 text-gold" title="Tarot">
              <svg viewBox="0 0 40 40"><polygon points="20,2 24,14 38,14 28,22 32,38 20,28 8,38 12,22 2,14 16,14" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="20" r="6" fill="currentColor"/></svg>
            </div>

            <div className="w-10 h-10 opacity-60 text-gold" title="Tantra">
              <svg viewBox="0 0 40 40"><polygon points="20,4 36,34 4,34" fill="none" stroke="currentColor" strokeWidth="2"/><polygon points="20,36 4,6 36,6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
            </div>

            <div className="w-10 h-10 opacity-60 text-gold" title="Entheogens">
              <svg viewBox="0 0 40 40"><path d="M20 38 C20 38 20 20 20 20 C20 20 8 16 8 8 C8 8 20 12 20 20 C20 20 32 16 32 8 C32 8 20 12 20 20 L20 38" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="20" r="3" fill="currentColor"/></svg>
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
