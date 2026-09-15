import i18n from '@/i18n'
import { DateHelper } from '@/shared/helpers/DateHelper'

describe('DateHelper', () => {
  beforeEach(() => cy.wrap(i18n.changeLanguage('en')))
  afterEach(() => cy.wrap(i18n.changeLanguage('en')))

  it('formats dates with the active i18next language instead of the browser locale', () => {
    const date = new Date(2026, 8, 2, 12)

    cy.wrap(i18n.changeLanguage('es')).then(() => {
      expect(DateHelper.toDisplayFormat(date)).to.equal(
        date.toLocaleDateString('es', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      )
    })
  })
})
