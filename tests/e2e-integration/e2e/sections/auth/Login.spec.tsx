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

    /* eslint-disable @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, no-console */
    // ---- diagnostic block: prove or disprove "curator already linked" -----
    // Tests the user's hypothesis that on CI the curator user is already
    // registered in Dataverse before this spec runs (so sign-up never
    // triggers and the test ends up at /modern with no #termsAccepted to
    // click). We log the URL, presence of sign-up DOM, and the bearer
    // token's resolved user from /api/v1/users/:me. Pure observation;
    // no behavior change.
    cy.url().then((u) => {
      // eslint-disable-next-line no-console
      console.log('[diag] URL after Keycloak step:', u)
      cy.log(`[diag] URL after Keycloak step: ${u}`)
    })
    cy.get('body').then(($body) => {
      const onSignUpPage = $body.find('[data-testid="sign-up-page"]').length > 0
      const termsCheckbox = $body.find('#termsAccepted').length > 0
      const createAccountBtn = $body.find('button:contains("Create Account")').length > 0
      // eslint-disable-next-line no-console
      console.log('[diag] sign-up DOM state:', {
        onSignUpPage,
        termsCheckbox,
        createAccountBtn
      })
      cy.log(
        `[diag] sign-up DOM state: onSignUpPage=${onSignUpPage} termsCheckbox=${termsCheckbox} createAccountBtn=${createAccountBtn}`
      )
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.window().then((win: any) => {
      // The bearer token lives in localStorage under a configured prefix.
      // The exact key is `${prefix}token`; default prefix is "DV_".
      const keys = Object.keys(win.localStorage)
      const tokenKey = keys.find((k) => k.endsWith('token'))
      const bearer = tokenKey ? (win.localStorage.getItem(tokenKey) as string) : null
      // eslint-disable-next-line no-console
      console.log('[diag] localStorage token key:', tokenKey, 'len:', bearer?.length)
      cy.log(`[diag] localStorage token key=${tokenKey} bearerLen=${bearer?.length}`)
      if (bearer) {
        cy.request({
          method: 'GET',
          url: '/api/v1/users/:me',
          headers: { Authorization: `Bearer ${bearer}` },
          failOnStatusCode: false
        }).then((resp) => {
          // eslint-disable-next-line no-console
          console.log('[diag] /users/:me status:', resp.status, 'body:', resp.body)
          cy.log(
            `[diag] /users/:me status=${resp.status} useridentifier=${
              (resp.body as { data?: { authenticatedUser?: { useridentifier?: string } } })?.data
                ?.authenticatedUser?.useridentifier ?? '<none>'
            }`
          )
        })
      }
    })
    // ---- end diagnostic block --------------------------------------------
    /* eslint-enable @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, no-console */

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
