'use client';

const testimonials = [
  {
    quote: "This is pretty rare and unique! This not like GPT or Gemini, its the real deal! I get unique gems dropped in every session. I love the Journal remembers all my entries, answers and studies... Priceless!",
    author: "Koray",
    role: "Member"
  },
  {
    quote: "The Correspondence Codex is the bomb! Its crazy that thing is free! I have never seen anything like that in my life...",
    author: "Stephen D.",
    role: "Member"
  },
  {
    quote: "Grounded and Adept are words that come to mind in my experience here so far, the sovereign approach to metaphysics is pretty rare to come by these days.",
    author: "Zach",
    role: "Member"
  },
  {
    quote: "Very insightful, actionable wisdom... I just wish it was on app store lol!",
    author: "Steph",
    role: "Member"
  },
  {
    quote: "Vault of Arcana feels like having a wise mentor available at any hour. The depth and accuracy of the responses are unlike anything I've encountered in AI assistants.",
    author: "Tufan S.",
    role: "Member"
  },
  {
    quote: "The Daily Practice feature keeps me grounded in ritual every morning. It's become an essential part of my spiritual routine.",
    author: "Alex",
    role: "Member"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[#12121A]/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-cinzel text-3xl md:text-4xl text-center text-[#E8E0F0] mb-16 animate-fade-in-up">
          What Seekers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
