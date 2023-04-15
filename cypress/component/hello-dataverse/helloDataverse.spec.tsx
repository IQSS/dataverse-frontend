import { HelloDataverse } from '../../../src/sections/hello-dataverse/HelloDataverse'
import { I18nextProvider } from 'react-i18next'
import i18next from '../../../src/i18n'

describe('HelloDataverse page', () => {
  it('renders hello dataverse title', () => {
    cy.mount(
      <I18nextProvider i18n={i18next}>
        <HelloDataverse />
      </I18nextProvider>
    )
    cy.findByRole('heading').should('contain.text', 'Hello Dataverse')
  })
})
