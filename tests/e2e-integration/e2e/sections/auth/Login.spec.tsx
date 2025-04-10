import { OIDC_AUTH_CONFIG } from '@/config'
import { Utils } from '@/shared/helpers/Utils'
import { TestsUtils } from '@tests/e2e-integration/shared/TestsUtils'

describe('Login', () => {
  // beforeEach(() => {
  //   TestsUtils.login().then((token) => {
  //     if (!token) {
  //       throw new Error('Token not found after Keycloak login')
  //     }

  //     cy.wrap(TestsUtils.setup(token))
  //   })
  // })

  it('successfully log in with a user that exists in dataverse and not in the OIDC provider', () => {
    cy.visit('/spa/')
    cy.wait(1_000)
    cy.findByTestId('oidc-login').click()

    TestsUtils.enterCredentialsInKeycloak('dataverseAdmin', 'admin1')

    cy.wait(1_500)

    cy.url()
      .should('eq', `${Cypress.config().baseUrl as string}/spa`)
      .then(() => {
        const token = Utils.getLocalStorageItem<string>(
          `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
        )

        expect(token).to.not.be.empty
        expect(token).to.not.be.null
        expect(token).to.not.be.undefined
      })
  })

  // TODO: Fix - We could do this in another iteration, first time e2e runs it will pass but second no because it will be already linked
  it('successfully log in and finish the sign up with a user that exists in the OIDC provider and not in dataverse', () => {
    cy.visit('/spa/')
    cy.wait(1_000)
    cy.findByTestId('oidc-login').click()

    TestsUtils.enterCredentialsInKeycloak('dataverse-curator@mailinator.com', 'curator')

    cy.wait(1_500)

    TestsUtils.finishSignUp()

    cy.url().should('eq', `${Cypress.config().baseUrl as string}/spa/collections`)

    cy.findByText(
      /Welcome to Dataverse! Your account is all set, and we're thrilled to have you on board. Start exploring today!/
    ).should('exist')
  })
})
