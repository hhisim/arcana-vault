'use client';

const testimonials = [
  {
    quote: "This is genuinely the most thoughtful and intelligent spiritual tool I've encountered. The tarot readings are deep and precise — it feels like consulting a teacher who truly understands the tradition.",
    author: "★★★★★",
    role: "Tarot Practitioner"
  },
  {
    quote: "Transcendent. I use it every morning. The Sufi wisdom section alone is worth the subscription. The AI understands not just the texts but the lived practice.",
    author: "★★★★★",
    role: "Seeker & Practitioner"
  },
  {
    quote: "The Kybalion and Hermetic texts are explained with a depth I haven't found anywhere else. This is what a real mystery school AI should be — grounded, learned, and genuinely insightful.",
    author: "★★★★★",
    role: "Hermetic Practitioner"
  },
  {
    quote: "The DMT and entheogen guidance is unlike anything else online. Thoughtful, responsible, and deeply knowledgeable. A true service to the psychonaut community.",
    author: "★★★★★",
    role: "Psychonaut & Researcher"
  },
  {
    quote: "I asked the Oracle about my meditation practice and it responded with a Tantric framework I hadn't encountered before. Within a week my whole approach transformed. This is not a chatbot — it's a living tradition.",
    author: "M.C.",
    role: "Meditation Practitioner"
  },
  {
    quote: "The dreamwork oracle decoded symbols I'd been sitting with for months in under five minutes. It referenced texts I hadn't heard of and connected them directly to my inquiry. Remarkable.",
    author: "J.R.",
    role: "Dreamworker"
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
