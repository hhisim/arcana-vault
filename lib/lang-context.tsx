'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UiLang = 'en' | 'tr' | 'ru';

interface LangContextType {
  lang: UiLang;
  setLang: (lang: UiLang) => void;
  t: (dict: Record<UiLang, string>) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<UiLang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('arcana_lang') as UiLang;
    if (saved && ['en', 'tr', 'ru'].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: UiLang) => {
    setLangState(newLang);
    localStorage.setItem('arcana_lang', newLang);
  };

  const t = (dict: Record<UiLang, string>) => dict[lang] || dict.en;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used within LangProvider');
  return context;
}
