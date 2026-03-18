'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BOTS, BotId } from '@/lib/bots';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function ChatPage() {
  const [selectedBotId, setSelectedBotId] = useState<BotId>('tao');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedBot = BOTS[selectedBotId];

  // Mock welcome message on bot switch
  useEffect(() => {
    const welcome: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome seeker. I am the ${selectedBot.name}. ${selectedBot.description}. How may I guide you today?`,
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, [selectedBotId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Mock response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `As the ${selectedBot.name}, I hear your inquiry. [Response logic based on: ${selectedBot.tradition}]`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#0A0A0F] text-[#E8E0F0]">
      {/* Left Sidebar */}
      <aside className="w-80 bg-[#12121A]/80 backdrop-blur-xl border-r border-[rgba(255,255,255,0.06)] flex flex-col hidden md:flex">
        <header className="p-6 border-b border-[rgba(255,255,255,0.06)]">
          <h2 className="font-cinzel text-xl text-[#E8E0F0]">Select Oracle</h2>
        </header>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {(Object.keys(BOTS) as BotId[]).map((id) => {
            const bot = BOTS[id];
            const isActive = selectedBotId === id;
            return (
              <div
                key={id}
                onClick={() => setSelectedBotId(id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#7B5EA7]/20 border-l-2 border-[#7B5EA7]' 
                    : 'hover:bg-[#1A1A28]'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full shrink-0" 
                  style={{ backgroundColor: bot.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{bot.name}</div>
                  <div className="text-sm text-[#9B93AB] truncate">{bot.description}</div>
                </div>
                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded border ${
                   bot.voiceEnabled ? 'border-teal-500/50 text-teal-400' : 'border-gray-500/50 text-gray-400'
                }`}>
                  {bot.voiceEnabled ? 'Voice' : 'Text'}
                </span>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0F]">
        {/* Header */}
        <header className="h-16 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: selectedBot.color }}
            />
            <div>
              <div className="font-cinzel text-sm md:text-base flex items-center gap-2">
                {selectedBot.name}
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-[#9B93AB] uppercase tracking-widest leading-none">Online</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {selectedBot.voiceEnabled && (
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-full transition-colors ${isRecording ? 'text-red-500 bg-red-500/10' : 'text-[#9B93AB] hover:text-[#E8E0F0]'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m8 0h-4m4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
            <button 
              onClick={clearChat}
              className="text-[#9B93AB] hover:text-[#E8E0F0] text-sm"
            >
              Clear Chat
            </button>
          </div>
        </header>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-[#1A1A28] border border-[rgba(255,255,255,0.06)] text-[#E8E0F0]' 
                  : 'bg-[#12121A] border border-[#7B5EA7]/20 text-[#E8E0F0]'
              }`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                <div className="text-[10px] text-[#9B93AB] mt-2 text-right uppercase opacity-50">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-[rgba(255,255,255,0.06)] p-4">
          <div className="max-w-4xl mx-auto flex items-end gap-3 bg-[#12121A] border border-[rgba(255,255,255,0.06)] rounded-xl p-2 focus-within:border-[#7B5EA7]/50 transition-colors">
            {selectedBot.voiceEnabled && (
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 h-10 w-10 shrink-0 rounded-lg flex items-center justify-center transition-all ${
                  isRecording ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-[#1A1A28] text-[#9B93AB]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m8 0h-4m4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
            
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask the oracle..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base py-2 max-h-32 resize-none"
            />

            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-[#C9A84C] text-[#0A0A0F] px-5 py-2 h-10 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shrink-0"
            >
              Send
            </button>
          </div>
          <div className="text-[10px] text-center text-[#9B93AB] mt-2 uppercase tracking-widest opacity-40">
            Sacred transmission in progress
          </div>
        </div>
      </main>
    </div>
  );
}
