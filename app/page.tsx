import Hero from './components/Hero'
import TraditionsGrid from './components/TraditionsGrid'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <TraditionsGrid />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  )
}
