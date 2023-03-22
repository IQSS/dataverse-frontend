import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import I18NextHttpBackend from 'i18next-http-backend'

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
  }
}

void i18next
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .use(I18NextHttpBackend)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en'],
    ns: [],
    returnNull: false,
    backend: {
      loadPath:
        import.meta.env.BASE_URL != '/'
          ? `${import.meta.env.BASE_URL}/locales/{{lng}}/{{ns}}.json`
          : `/locales/{{lng}}/{{ns}}.json`
    }
  })

export default i18next
