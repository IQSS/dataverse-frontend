import { RequestAccessModal } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/RequestAccessModal'
import { Route } from '../../../../../../src/sections/Route.enum'
import { FilePreviewMother } from '../../../../files/domain/models/FilePreviewMother'

describe('RequestAccessModal', () => {
  it('renders the RequestAccessModal', () => {
    const file = FilePreviewMother.create()
    cy.customMount(<RequestAccessModal fileId={file.id} />)

    cy.findByRole('button', { name: 'Request Access' }).should('exist')
  })

  it('shows login modal when button is clicked and user is not logged in', () => {
    const file = FilePreviewMother.create()
    cy.customMount(<RequestAccessModal fileId={file.id} />)

    cy.findByRole('button', { name: 'Request Access' }).click()

    cy.findByRole('dialog').should('exist')
    cy.findAllByText('Request Access').should('exist')

    cy.findByRole('button', { name: 'Log In' }).should('exist')

    cy.findByRole('link', { name: 'Sign Up' })
      .should('exist')
      .should('have.attr', 'href', Route.SIGN_UP_JSF)

    cy.findByText('Close').click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('shows request access modal when button is clicked and user is logged in', () => {
    const file = FilePreviewMother.create()

    cy.mountAuthenticated(<RequestAccessModal fileId={file.id} />)

    cy.findByRole('button', { name: 'Request Access' }).click()

    cy.findByRole('dialog').should('exist')
    cy.findAllByText('Request Access').should('exist')

    cy.findByText(
      'Please confirm and/or complete the information needed below in order to request access to files in this dataset.'
    ).should('exist')
    cy.findByText('Terms of Access for Restricted Files').should('exist')

    // cy.findByText(dataset.terms).should('exist') // TODO - Get dataset terms of use, doubting where to get it from

    cy.findByText('Cancel').click()
    cy.findByRole('dialog').should('not.exist')
  })

  it.skip('calls request access use case when button is clicked and user is logged in', () => {
    // TODO - Implement request access use case
  })
})
