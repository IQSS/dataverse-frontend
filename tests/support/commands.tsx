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
import { ToastContainer } from 'react-toastify'
// Define your custom mount function

Cypress.Commands.add('customMount', (component: ReactNode) => {
  return cy.mount(
    <MemoryRouter>
      <ThemeProvider>
        <I18nextProvider i18n={i18next}>{component}</I18nextProvider>
        <ToastContainer position="top-right" autoClose={5000} pauseOnHover />
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

Cypress.Commands.add('loginAsAdmin', (go?: string) => {
  cy.visit('/')
  cy.get('#topNavBar').then((navbar) => {
    if (navbar.find('ul > li:nth-child(6) > a').text().includes('Log In')) {
      cy.findAllByRole('link', { name: /Log In/i })
        .first()
        .click()
      cy.findByLabelText('Username/Email').type('dataverseAdmin')
      cy.findByLabelText('Password').type('admin1')
      cy.findByRole('button', { name: /Log In/i }).click()
      cy.findAllByText(/Dataverse Admin/i).should('exist')
      if (go) cy.visit(go)
    }
  })
})

Cypress.Commands.add('getApiToken', () => {
  cy.loginAsAdmin('/dataverseuser.xhtml?selectTab=dataRelatedToMe')
  return cy.findByRole('link', { name: 'API Token' }).click().get('#apiToken code').invoke('text')
})

Cypress.Commands.add('compareDate', (date, expectedDate) => {
  expect(date.getUTCDate()).to.deep.equal(expectedDate.getUTCDate())
  expect(date.getUTCMonth()).to.deep.equal(expectedDate.getUTCMonth())
  expect(date.getUTCFullYear()).to.deep.equal(expectedDate.getUTCFullYear())
})
