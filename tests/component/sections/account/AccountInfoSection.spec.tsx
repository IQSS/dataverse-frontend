import { AccountInfoSection } from '@/sections/account/account-info-section/AccountInfoSection'
import { UserMother } from '@tests/component/users/domain/models/UserMother'

const testUser = UserMother.create()

describe('AccountInfoSection', () => {
  it('should display the user information', () => {
    cy.mountAuthenticated(<AccountInfoSection />)

    cy.findAllByRole('row').spread((usernameRow, givenNameRow, familyNameRow, emailRow) => {
      cy.wrap(usernameRow).within(() => {
        cy.findByText('Username').should('exist')
        cy.findByText(testUser.identifier).should('exist')
      })

      cy.wrap(givenNameRow).within(() => {
        cy.findByText('Given Name').should('exist')
        cy.findByText(testUser.firstName).should('exist')
      })

      cy.wrap(familyNameRow).within(() => {
        cy.findByText('Family Name').should('exist')
        cy.findByText(testUser.lastName).should('exist')
      })

      cy.wrap(emailRow).within(() => {
        cy.findByText('Email').should('exist')
        cy.findByText(testUser.email).should('exist')
      })
    })
  })
})
