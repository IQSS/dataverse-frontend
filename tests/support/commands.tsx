import { UserMother } from '../component/users/domain/models/UserMother'

export {}
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import '@testing-library/cypress/add-commands'
import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18next from '../../src/i18n'
import { RouteObject, RouterProvider, createMemoryRouter, Location } from 'react-router-dom'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { TestsUtils } from '@tests/e2e-integration/shared/TestsUtils'
import { Utils } from '@/shared/helpers/Utils'
import { SessionContext } from '@/sections/session/SessionContext'
import { User } from '@/users/domain/models/User'
import { OIDC_AUTH_CONFIG } from '@/config'
import { ToastContainer } from 'react-toastify'

// Define your custom mount function

export type RouterInitialEntry = string | Partial<Location>

Cypress.Commands.add(
  'customMount',
  (component: ReactNode, initialEntries?: RouterInitialEntry[]) => {
    const routes: RouteObject[] = [
      {
        element: component,
        path: '/*'
      }
    ]
    const memoryRouter = createMemoryRouter(routes, {
      initialEntries: initialEntries
    })

    return cy.mount(
      <ThemeProvider>
        <I18nextProvider i18n={i18next}>
          <RouterProvider router={memoryRouter} />
        </I18nextProvider>
        <ToastContainer position="top-right" autoClose={5000} pauseOnHover />
      </ThemeProvider>
    )
  }
)

// Cypress.Commands.add(
//   'customMount',
//   (component: ReactNode, initialEntries?: RouterInitialEntry[]) => {
//     return cy.mount(
//       <MemoryRouter initialEntries={initialEntries}>
//         <ThemeProvider>
//           <I18nextProvider i18n={i18next}>{component}</I18nextProvider>
//         </ThemeProvider>
//       </MemoryRouter>
//     )
//   }
// )

Cypress.Commands.add(
  'mountAuthenticated',
  (component: ReactNode, initialEntries?: RouterInitialEntry[], userOverrides?: Partial<User>) => {
    return cy.customMount(
      <SessionContext.Provider
        value={{
          user: UserMother.create(userOverrides),
          logout: () => Promise.resolve(),
          setUser: () => {},
          isLoadingUser: false,
          sessionError: null,
          refetchUserSession: () => Promise.resolve()
        }}>
        {component}
      </SessionContext.Provider>,
      initialEntries
    )
  }
)

Cypress.Commands.add(
  'mountSuperuser',
  (component: ReactNode, initialEntries?: RouterInitialEntry[]) => {
    return cy.customMount(
      <SessionContext.Provider
        value={{
          user: UserMother.createSuperUser(),
          logout: () => Promise.resolve(),
          setUser: () => {},
          isLoadingUser: false,
          sessionError: null,
          refetchUserSession: () => Promise.resolve()
        }}>
        {component}
      </SessionContext.Provider>,
      initialEntries
    )
  }
)

Cypress.Commands.add('login', () => {
  cy.visit('/spa/')
  cy.wait(1_000)
  cy.findByTestId('oidc-login').click()

  TestsUtils.enterCredentialsInKeycloak()

  cy.wait(1_500)

  // This function will check if the sign-up page is visible (valid token not linked account) and finish the sign-up process and return the token
  // Else, it will check if the home page is visible and return the token

  ifElseVisible(
    () => cy.get('[data-testid="sign-up-page"]', { timeout: 10_000 }),
    () => {
      TestsUtils.finishSignUp()

      cy.url()
        .should('eq', `${Cypress.config().baseUrl as string}/spa/collections`)
        .then(() => {
          const token = Utils.getLocalStorageItem<string>(
            `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
          )

          return cy.wrap(token)
        })
    },
    () => {
      cy.url()
        .should('eq', `${Cypress.config().baseUrl as string}/spa`)
        .then(() => {
          const token = Utils.getLocalStorageItem<string>(
            `${OIDC_AUTH_CONFIG.LOCAL_STORAGE_KEY_PREFIX}token`
          )

          return cy.wrap(token)
        })
    }
  )
})

Cypress.Commands.add('logout', () => {
  cy.visit('/spa/')
  cy.get('#dropdown-user').click()
  cy.findByTestId('oidc-logout').click()
})

Cypress.Commands.add('compareDate', (date, expectedDate) => {
  expect(date.getUTCDate()).to.deep.equal(expectedDate.getUTCDate())
  expect(date.getUTCMonth()).to.deep.equal(expectedDate.getUTCMonth())
  expect(date.getUTCFullYear()).to.deep.equal(expectedDate.getUTCFullYear())
})

// Define the type for the conditional functions
type ConditionCallback = ($el: JQuery<HTMLElement>) => boolean
type CypressCommandFn = (cyChainable: () => Cypress.Chainable<any>) => void

export function ifElseVisible(
  cyChainable: () => Cypress.Chainable<JQuery<HTMLElement>>,
  ifFn: CypressCommandFn,
  elseFn: CypressCommandFn
) {
  return ifElse(
    cyChainable,
    (el) => Cypress.dom.isElement(el) && Cypress.dom.isVisible(el),
    ifFn,
    elseFn
  )
}

export function ifElse(
  cyChainable: () => Cypress.Chainable<JQuery<HTMLElement>>,
  conditionCallback: ConditionCallback,
  ifFn: CypressCommandFn,
  elseFn: CypressCommandFn
) {
  cyChainable()
    .should((_) => {})
    .then(($el) => {
      const result = conditionCallback($el)

      Cypress.log({
        name: 'ifElse',
        message: `conditionCallback returned ${String(result)}, calling ${
          String(result) === 'true' ? 'ifFn' : 'elseFn'
        }`,
        type: 'parent',
        consoleProps: () => {
          return {
            conditionCallback
          }
        }
      })
      if (result) {
        ifFn(cyChainable)
      } else {
        if (elseFn) {
          elseFn(cyChainable)
        }
      }
    })
  return cyChainable
}
