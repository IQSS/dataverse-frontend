import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { requireAppConfig } from './config'

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
  }
}

const appConfig = requireAppConfig()

export const LANGUAGE_LOCAL_STORAGE_KEY = 'DV_lang'

void i18next
  .use(initReactI18next)
  .use(I18NextHttpBackend)
  .init({
    lng: defineLanguage(),
    fallbackLng: appConfig.defaultLanguage,
    supportedLngs: appConfig.languages.map((lang) => lang.code),
    lowerCaseLng: true,
    ns: ['shared', 'header', 'footer', 'file', 'citation', 'homepage'],
    returnNull: false,
    backend: {
      loadPath:
        import.meta.env.BASE_URL != '/spa'
          ? `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`
          : `/spa/locales/{{lng}}/{{ns}}.json`
    }
  })

export default i18next

/**
 * Detect the initial language to be used by i18next.
 * The order of precedence is:
 * 1. Language stored in localStorage (if any)
 * 2. Browser language (if supported)
 * 3. Default language from app config
 */

function defineLanguage(): string {
  const storedLang = localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY)
  const supportedLangs = appConfig.languages.map((l) => l.code.toLowerCase())
  const defaultLang = appConfig.defaultLanguage.toLowerCase()

  if (storedLang) return storedLang

  const browserLang = navigator.language?.toLowerCase()
  if (browserLang && supportedLangs.includes(browserLang)) {
    return browserLang
  }

  // Check for base language (e.g., "en" from "en-US")
  const baseLang = browserLang?.split('-')[0]
  if (baseLang && supportedLangs.includes(baseLang)) {
    return baseLang
  }

  return defaultLang
}
