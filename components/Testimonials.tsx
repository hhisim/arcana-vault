'use client';

const testimonials = [
  {
    quote: "The Tao oracle doesn't answer—it dissolves the question entirely. My practice has transformed.",
    author: "M.C.",
    role: "Zen Practitioner"
  },
  {
    quote: "Researching tarot used to take hours. Now I have a conversational guide to the archetypes.",
    author: "J.R.",
    role: "Astrologer"
  },
  {
    quote: "The entheogen bot spoke to experiences I had no language for. Profoundly helpful.",
    author: "A.L.",
    role: "Seeker"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[#12121A]/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-cinzel text-3xl md:text-4xl text-center text-[#E8E0F0] mb-16 animate-fade-in-up">
          What Seekers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glass-card p-8 flex flex-col transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,112,219,0.2)] animate-fade-in-up"
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <p className="text-[#E8E0F0] italic leading-relaxed mb-6 flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#7B5EA7] flex items-center justify-center text-[#E8E0F0] font-cinzel font-bold shrink-0">
                  {t.author}
                </div>
                <div>
                  <div className="text-[#E8E0F0] font-medium leading-tight">{t.author}</div>
                  <div className="text-[#9B93AB] text-sm mt-1">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
