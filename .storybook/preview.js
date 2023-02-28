import i18next from '../src/i18n'
import '../src/assets/styles/index.scss'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  i18next,
  locale: 'en',
  locales: {
    en: 'English'
  }
}
