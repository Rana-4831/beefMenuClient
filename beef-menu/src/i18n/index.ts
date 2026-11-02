import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fa from './locales/fa.json'
import en from './locales/en.json'
import tr from './locales/tr.json'

export const languages = {
  fa: { label: 'فارسی', dir: 'rtl' },
  en: { label: 'English', dir: 'ltr' },
  tr: { label: 'Türkçe', dir: 'ltr' },
} as const

export type Language = keyof typeof languages

const DEFAULT_LANG: Language = 'fa'
const STORAGE_KEY = 'lang'

function isLanguage(value: string | null): value is Language {
  return !!value && value in languages
}

function applyLanguage(lng: string) {
  const lang = isLanguage(lng) ? lng : DEFAULT_LANG
  document.documentElement.lang = lang
  document.documentElement.dir = languages[lang].dir
  localStorage.setItem(STORAGE_KEY, lang)
}

const saved = localStorage.getItem(STORAGE_KEY)
const initialLang: Language = isLanguage(saved) ? saved : DEFAULT_LANG

i18n.on('languageChanged', applyLanguage)

i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: fa },
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

applyLanguage(initialLang)

export default i18n
