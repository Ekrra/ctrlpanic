import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translate, type Language } from "@/lib/language";

const LanguageContext = createContext({ language: "en" as Language, setLanguage: (_language: Language) => {}, t: (text: string) => text });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: text => translate(language, text) }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }