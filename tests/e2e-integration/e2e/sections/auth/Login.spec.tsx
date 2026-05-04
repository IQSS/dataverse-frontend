import { FRONTEND_BASE_PATH } from '@tests/e2e-integration/shared/basePath'
import { Utils } from '@/shared/helpers/Utils'
import { TestsUtils } from '@tests/e2e-integration/shared/TestsUtils'
import { requireAppConfig } from '@/config'

const appConfig = requireAppConfig()

describe('Login', () => {
  it('successfully log in with a user that exists in dataverse and not in the OIDC provider', () => {
    cy.visit(`${FRONTEND_BASE_PATH}/`)
    cy.wait(1_000)
    cy.findByTestId('oidc-login').click()

    TestsUtils.enterCredentialsInKeycloak('dataverseAdmin', 'admin1')

    cy.wait(1_500)

    cy.url()
      .should('eq', `${Cypress.config().baseUrl as string}${FRONTEND_BASE_PATH}`)
      .then(() => {
        const token = Utils.getLocalStorageItem<string>(
          `${appConfig.oidc.localStorageKeyPrefix}token`
        )

        expect(token).to.not.be.empty
        expect(token).to.not.be.null
        expect(token).to.not.be.undefined
      })
  })

  // TODO: Fix - We could do this in another iteration, first time e2e runs it will pass but second no because it will be already linked
  it('successfully log in and finish the sign up with a user that exists in the OIDC provider and not in dataverse', () => {
    cy.visit(`${FRONTEND_BASE_PATH}/`)
    cy.wait(1_000)
    cy.findByTestId('oidc-login').click()

    TestsUtils.enterCredentialsInKeycloak('dataverse-curator@mailinator.com', 'curator')

    cy.wait(1_500)

    TestsUtils.finishSignUp()

    cy.url().should((currentUrl) => {
      const baseUrl = Cypress.config().baseUrl as string
      expect([
        `${baseUrl}${FRONTEND_BASE_PATH}`,
        `${baseUrl}${FRONTEND_BASE_PATH}/collections`
      ]).to.include(currentUrl)
    })

    cy.get('body').then(($body) => {
      const hasWelcomeAlert =
        $body.text().includes('Welcome to Dataverse! Your account is all set') ||
        $body.text().includes("we're thrilled to have you on board")

      if (hasWelcomeAlert) {
        cy.findByText(
          /Welcome to Dataverse! Your account is all set, and we're thrilled to have you on board. Start exploring today!/
        ).should('exist')
      }
    })
  })
})
