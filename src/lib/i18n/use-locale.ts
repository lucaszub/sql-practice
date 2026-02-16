import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translations, type Locale, type TranslationKey } from "./translations";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
      toggle: () => set({ locale: get().locale === "en" ? "fr" : "en" }),
    }),
    { name: "sql-practice-locale" }
  )
);

export function useLocale() {
  const locale = useLocaleStore((s) => s.locale);
  const toggle = useLocaleStore((s) => s.toggle);

  function t(key: TranslationKey, params?: Record<string, string | number>): string {
    const entry = translations[key];
    let text = entry[locale];
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  }

  return { locale, toggle, t };
}
