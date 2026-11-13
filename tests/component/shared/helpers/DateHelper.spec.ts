import { DateHelper } from '@/shared/helpers/DateHelper'

describe('DateHelper', () => {
  it('formats dates with the active i18next language instead of the browser locale', () => {
    const date = new Date(2026, 8, 2, 12)

    cy.setLanguage('en').then(() => {
      expect(DateHelper.toDisplayFormat(date)).to.equal('Sep 2, 2026')
    })
    cy.setLanguage('es').then(() => {
      expect(DateHelper.toDisplayFormat(date)).to.equal('2 sept 2026')
    })
    cy.setLanguage('en').then(() => {
      expect(DateHelper.toDisplayFormat(date)).to.equal('Sep 2, 2026')
    })
  })
})
