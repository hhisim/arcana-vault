"use client";

import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Choose Your Path",
      description:
        "Select from four sacred traditions. Each oracle carries the voice of its lineage.",
      delay: "",
    },
    {
      number: "2",
      title: "Ask Your Question",
      description:
        "Speak or type your inquiry. Receive wisdom in the language of that tradition.",
      delay: "animate-delay-200",
    },
    {
      number: "3",
      title: "Deepen Your Practice",
      description:
        "Return daily. The oracle remembers your journey and guides your unfolding.",
      delay: "animate-delay-400",
    },
  ];

  return (
    <section className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="font-cinzel text-3xl md:text-4xl text-center text-[#E8E0F0] mb-16">
          Begin Your Journey
        </h2>

        <div className="lg:grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`animate-fade-in-up ${step.delay}`}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#C9A84C]/20 text-[#C9A84C] font-cinzel text-xl mb-4">
                {step.number}
              </div>
              <h3 className="text-lg text-[#E8E0F0] mt-4">
                {step.title}
              </h3>
              <p className="text-[#9B93AB] text-sm mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
