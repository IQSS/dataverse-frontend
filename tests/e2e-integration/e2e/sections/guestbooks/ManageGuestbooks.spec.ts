import { FRONTEND_BASE_PATH } from '@tests/e2e-integration/shared/basePath'
import { TestsUtils } from '../../../shared/TestsUtils'
import { GuestbookHelper } from '../../../shared/guestbooks/GuestbookHelper'

const GUESTBOOKS_PAGE_URL = `${FRONTEND_BASE_PATH}/root/guestbooks`

describe('Manage Guestbooks', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      cy.wrap(TestsUtils.setup(token))
    })
  })

  const closeNotImplementedModal = () => {
    cy.findByRole('dialog').within(() => {
      cy.findByText('Not Implemented').should('exist')
      cy.findByText(/This feature is not implemented yet in the Modern version./i).should('exist')
    })
    cy.findByText('Close').should('exist').click()
    cy.findByRole('dialog').should('not.exist')
  }

  it('visits the Manage Guestbooks page and manages a guestbook', () => {
    const guestbookName = `E2E Manage Guestbook ${Date.now()}`

    cy.wrap(GuestbookHelper.createAndGetByName(guestbookName), { timeout: 10000 }).then(() => {
      cy.visit(GUESTBOOKS_PAGE_URL)

      cy.findByRole('link', { name: 'Root' })
        .closest('.breadcrumb')
        .within(() => {
          cy.findByText('Dataset Guestbooks').should('exist')
        })
      cy.findByRole('heading', { name: 'Root' }).should('exist')
      cy.findByRole('button', { name: 'Create Dataset Guestbook' }).should('exist')

      cy.contains('tbody tr', guestbookName).within(() => {
        cy.findByRole('button', { name: 'Disable' }).should('exist')
        cy.findByRole('button', { name: 'Preview' }).click()
      })

      cy.findByRole('dialog').within(() => {
        cy.findByText('Preview Guestbook').should('exist')
        cy.findByText(guestbookName).should('exist')
        cy.findByText('Email (Required)').should('exist')
        cy.findByText('Name (Required)').should('exist')
        cy.findByText('Close').should('exist').click()
      })

      cy.contains('tbody tr', guestbookName).findByRole('button', { name: 'Disable' }).click()

      cy.findByText('The guestbook status has been updated.').should('exist')
      cy.contains('tbody tr', guestbookName)
        .findByRole('button', { name: 'Enable' })
        .should('exist')
    })
  })

  it('navigates to the create guestbook page from the create button', () => {
    cy.visit(GUESTBOOKS_PAGE_URL)

    cy.findByRole('button', { name: 'Create Dataset Guestbook' }).click()

    cy.url().should('include', `${FRONTEND_BASE_PATH}/root/guestbooks/create`)
    cy.findByLabelText(/^Guestbook Name/).should('exist')
    cy.findByRole('button', { name: 'Create Dataset Guestbook' }).should('exist')
  })

  it('starts a guestbook responses download from the row download action', () => {
    const guestbookName = `E2E Manage Guestbook Download ${Date.now()}`

    cy.wrap(GuestbookHelper.createAndGetByName(guestbookName), { timeout: 10000 }).then(() => {
      cy.visit(GUESTBOOKS_PAGE_URL)

      cy.window().then((window) => {
        cy.stub(window.URL, 'createObjectURL').returns('blob:e2e-guestbook-download')
        cy.stub(window.URL, 'revokeObjectURL')
      })

      cy.contains('tbody tr', guestbookName)
        .findByRole('button', { name: 'Download responses' })
        .click()

      cy.findByText('Your download has started.').should('exist')
    })
  })

  it('edits a guestbook from the table edit action', () => {
    const guestbookName = `E2E Edit Guestbook ${Date.now()}`
    const updatedGuestbookName = `${guestbookName} Updated`

    cy.wrap(GuestbookHelper.createAndGetByName(guestbookName), { timeout: 10000 }).then(
      (guestbook) => {
        cy.visit(GUESTBOOKS_PAGE_URL)

        cy.contains('tbody tr', guestbookName).findByRole('button', { name: 'Edit' }).click()

        cy.url().should('include', `${FRONTEND_BASE_PATH}/root/guestbooks/${guestbook.id}/edit`)
        cy.findByRole('link', { name: 'Root' })
          .closest('.breadcrumb')
          .within(() => {
            cy.findByText('Dataset Guestbooks').should('exist')
            cy.findByText('Edit Dataset Guestbook').should('exist')
          })
        cy.findByLabelText(/^Guestbook Name/).should('have.value', guestbookName)

        cy.findByLabelText(/^Guestbook Name/)
          .clear()
          .type(updatedGuestbookName)
        cy.findByLabelText('Institution').check()
        cy.findByRole('button', { name: 'Save Changes' }).click()

        cy.findByText('The guestbook has been updated.').should('exist')
        cy.url().should('include', GUESTBOOKS_PAGE_URL)
        cy.contains('tbody tr', updatedGuestbookName).within(() => {
          cy.findByRole('button', { name: 'Edit' }).should('exist')
        })
      }
    )
  })
})
