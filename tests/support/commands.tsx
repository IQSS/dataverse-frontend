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
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18next from '../../src/i18n'
import { UserRepository } from '../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../src/sections/session/SessionProvider'
import { MemoryRouter } from 'react-router-dom'
import { TestsUtils } from '@tests/e2e-integration/shared/TestsUtils'

// Define your custom mount function

Cypress.Commands.add('customMount', (component: ReactNode) => {
  return cy.mount(
    <MemoryRouter>
      <ThemeProvider>
        <I18nextProvider i18n={i18next}>{component}</I18nextProvider>
      </ThemeProvider>
    </MemoryRouter>
  )
})

Cypress.Commands.add('mountAuthenticated', (component: ReactNode) => {
  const user = UserMother.create()
  const userRepository = {} as UserRepository
  userRepository.getAuthenticated = cy.stub().resolves(user)
  userRepository.removeAuthenticated = cy.stub().resolves()

  return cy.customMount(<SessionProvider repository={userRepository}>{component}</SessionProvider>)
})

Cypress.Commands.add('mountSuperuser', (component: ReactNode) => {
  const user = UserMother.createSuperUser()
  const userRepository = {} as UserRepository
  userRepository.getAuthenticated = cy.stub().resolves(user)
  userRepository.removeAuthenticated = cy.stub().resolves()

  return cy.customMount(<SessionProvider repository={userRepository}>{component}</SessionProvider>)
})

Cypress.Commands.add('login', () => {
  cy.visit('/spa/')
  cy.findByTestId('oidc-login').click()

  TestsUtils.enterCredentialsInKeycloak()

  cy.url()
    .should('eq', `${Cypress.config().baseUrl as string}/spa`)
    .then(() => {
      const token = TestsUtils.getLocalStorageItem<string>('ROCP_token')

      return cy.wrap(token)
    })
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
