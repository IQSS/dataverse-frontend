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
    ns: [
      'shared',
      'header',
      'footer',
      'file',
      'astrophysics',
      'biomedical',
      'citation',
      'codeMeta20',
      'computationalworkflow',
      'geospatial',
      'journal',
      'socialscience',
      'homepage'
    ],
    returnNull: false,
    backend: {
      loadPath:
        import.meta.env.BASE_URL != '/spa'
          ? `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`
          : `/spa/locales/{{lng}}/{{ns}}.json`
    }
  })

export default i18next
