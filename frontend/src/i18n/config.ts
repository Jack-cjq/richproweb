import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslations from './locales/en.json'
import zhTranslations from './locales/zh.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'

i18n
  .use(LanguageDetector) // 检测浏览器语言
  .use(initReactI18next) // 初始化 react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      zh: {
        translation: zhTranslations,
      },
      es: {
        translation: esTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    fallbackLng: 'en', // 默认语言为英文
    debug: false,
    interpolation: {
      escapeValue: false, // React 已经转义了
    },
    detection: {
      order: ['localStorage', 'navigator'], // 优先从 localStorage 读取，然后从浏览器语言检测
      caches: ['localStorage'], // 将语言选择保存到 localStorage
    },
  })

export default i18n

