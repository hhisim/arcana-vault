'use client';

export default function FinalCTA() {
  return (
    <section className="w-full bg-gradient-to-b from-[#0A0A0F] to-[#7B5EA7]/10 py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <h2 className="font-cinzel text-4xl md:text-5xl text-[#E8E0F0] mb-6">
          Your Practice, Deepened
        </h2>
        
        <p className="text-[#9B93AB] text-lg mb-10 max-w-2xl mx-auto">
          Join seekers worldwide. Start free, no credit card required.
        </p>

        <a
          href="/chat"
          className="inline-block bg-[#C9A84C] text-[#0A0A0F] px-10 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] hover:scale-105 active:scale-95"
        >
          Open the Portal
        </a>
      </div>
    </section>
  );
}
