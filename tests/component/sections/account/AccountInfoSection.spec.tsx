import { AccountInfoSection } from '@/sections/account/account-info-section/AccountInfoSection'
import { UserMother } from '@tests/component/users/domain/models/UserMother'
import { WithRepositories } from '@tests/component/WithRepositories'
import { UserRepository } from '@/users/domain/repositories/UserRepository'

const testUser = UserMother.create()
const userRepository = {} as UserRepository

const mountSection = (overrides?: Parameters<typeof cy.mountAuthenticated>[2]) =>
  cy.mountAuthenticated(
    <WithRepositories userRepository={userRepository}>
      <AccountInfoSection />
    </WithRepositories>,
    undefined,
    overrides
  )

describe('AccountInfoSection', () => {
  beforeEach(() => {
    userRepository.getAuthenticatedOrcid = cy.stub().resolves(null)
  })

  it('should display the user information', () => {
    mountSection()

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

  it('should display the user affiliation and position if present', () => {
    mountSection({
      affiliation: 'Harvard University',
      position: 'Researcher'
    })

    cy.findAllByRole('row').spread(
      (_usernameRow, _givenNameRow, _familyNameRow, _emailRow, affiliationRow, positionRow) => {
        cy.wrap(affiliationRow).within(() => {
          cy.findByText('Affiliation').should('exist')
          cy.findByText('Harvard University').should('exist')
        })

        cy.wrap(positionRow).within(() => {
          cy.findByText('Position').should('exist')
          cy.findByText('Researcher').should('exist')
        })
      }
    )
  })

  it('shows the linked ORCID iD with a link to the ORCID record', () => {
    const orcid = 'https://orcid.org/0000-0002-1825-0097'
    userRepository.getAuthenticatedOrcid = cy.stub().resolves(orcid)
    mountSection()

    cy.findByTestId('orcid-row').within(() => {
      cy.findByText('ORCID iD').should('exist')
      cy.findByRole('link', { name: orcid }).should('have.attr', 'href', orcid)
    })
  })

  it('shows that no ORCID iD is connected', () => {
    mountSection()

    cy.findByTestId('orcid-row').should('contain.text', 'Not connected')
  })

  it('hides the ORCID row when the ORCID iD cannot be loaded', () => {
    userRepository.getAuthenticatedOrcid = cy.stub().rejects(new Error('boom'))
    mountSection()

    cy.findByText(testUser.identifier).should('exist')
    cy.findByTestId('orcid-row').should('not.exist')
  })
})
