import { WriteError } from '@iqss/dataverse-client-javascript'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { SpaFeedbackDTO } from '@/contact/domain/useCases/DTOs/SpaFeedbackDTO'
import { SpaUserFeedbackCTA } from '@/sections/layout/spa-user-feedback-cta/SpaUserFeedbackCTA'
import { Route } from '@/sections/Route.enum'

const contactRepository = {} as ContactRepository

describe('SpaUserFeedbackCTA', () => {
  beforeEach(() => {
    cy.viewport(1200, 800)
    contactRepository.sendSpaFeedback = cy.stub().resolves()
  })

  it('should render the button when user is logged in', () => {
    cy.mountAuthenticated(<SpaUserFeedbackCTA contactRepository={contactRepository} />)

    cy.findByTestId('spa-user-feedback-cta').should('exist')
    cy.findByTestId('spa-user-feedback-cta').should('be.visible')
  })

  it('should not render the button when user is not logged in', () => {
    cy.customMount(<SpaUserFeedbackCTA contactRepository={contactRepository} />)

    cy.findByTestId('spa-user-feedback-cta').should('not.exist')
  })

  describe('form submission', () => {
    it('submits the feedback form and succeeds', () => {
      contactRepository.sendSpaFeedback = cy.stub().as('sendSpaFeedback').resolves()

      cy.mountAuthenticated(
        <SpaUserFeedbackCTA contactRepository={contactRepository} />,
        undefined,
        { email: 'foo@test.com' }
      )
      cy.findByTestId('spa-user-feedback-cta').click()
      cy.findByRole('dialog').should('exist')

      // Open the Page Select and select the Collection option
      cy.findByLabelText('Toggle options menu').click()
      cy.findByText('Collection').click()

      cy.findByLabelText(/Feedback/).type('This is a test feedback')
      cy.findByRole('button', { name: /Send/ }).click()

      cy.findByText(/Thanks for your feedback!/).should('exist')
      cy.findByRole('dialog').should('not.exist')

      const expectedDTO: SpaFeedbackDTO = {
        page: 'Collection',
        feedback: 'This is a test feedback',
        fromEmail: 'foo@test.com'
      }

      cy.get('@sendSpaFeedback').should('have.been.calledWith', expectedDTO)
    })

    it('submits the feedback form and fails with an unknown error', () => {
      contactRepository.sendSpaFeedback = cy.stub().rejects('Error sending feedback!')

      cy.mountAuthenticated(<SpaUserFeedbackCTA contactRepository={contactRepository} />)
      cy.findByTestId('spa-user-feedback-cta').click()
      cy.findByRole('dialog').should('exist')
      cy.findByLabelText(/Feedback/).type('This is a test feedback')

      cy.findByRole('button', { name: /Send/ }).click()

      cy.findByText(
        /An error occurred while sending your feedback. Please try again later./
      ).should('exist')
      cy.findByRole('dialog').should('exist')
    })

    it('submits the feedback form and fails with a WriteError instance', () => {
      contactRepository.sendSpaFeedback = cy
        .stub()
        .rejects(new WriteError('Error sending feedback!'))

      cy.mountAuthenticated(<SpaUserFeedbackCTA contactRepository={contactRepository} />)
      cy.findByTestId('spa-user-feedback-cta').click()
      cy.findByRole('dialog').should('exist')
      cy.findByLabelText(/Feedback/).type('This is a test feedback')

      cy.findByRole('button', { name: /Send/ }).click()

      cy.findByText(/Error sending feedback!/).should('exist')
      cy.findByRole('dialog').should('exist')
    })

    it('shows validation error when feedback is empty', () => {
      cy.mountAuthenticated(<SpaUserFeedbackCTA contactRepository={contactRepository} />)
      cy.findByTestId('spa-user-feedback-cta').click()
      cy.findByRole('dialog').should('exist')
      cy.findByLabelText(/Feedback/).type(' ')

      cy.findByRole('button', { name: /Send/ }).click()

      cy.findByText(/Feedback is required./).should('exist')
    })

    it('shows the spinner, disable Send and Cancel buttons and block closing the modal while sending feedback', () => {
      const DELAYED_TIME = 200
      contactRepository.sendSpaFeedback = cy.stub().callsFake(() => {
        return Cypress.Promise.delay(DELAYED_TIME).then(() => undefined)
      })

      cy.mountAuthenticated(<SpaUserFeedbackCTA contactRepository={contactRepository} />)
      cy.clock()

      cy.findByTestId('spa-user-feedback-cta').click()
      cy.findByRole('dialog').should('exist')
      cy.findByLabelText(/Feedback/).type('This is a test feedback')
      cy.findByRole('button', { name: /Send/ }).click()
      // Loading spinner inside the button
      cy.findByRole('status').should('exist')
      // Disabled buttons
      cy.findByRole('button', { name: /Send/ }).should('be.disabled')
      cy.findByText(/Cancel/).should('be.disabled')
      // Modal not closing while sending the feedback
      cy.findByLabelText(/Close/).click()
      cy.findByRole('dialog').should('exist')

      cy.tick(DELAYED_TIME)

      cy.findByRole('dialog').should('not.exist')

      cy.clock().then((clock) => clock.restore())
    })
  })

  describe('open modal', () => {
    it('should open the modal when the button is clicked', () => {
      cy.mountAuthenticated(<SpaUserFeedbackCTA contactRepository={contactRepository} />, [
        '/a-not-valid-route'
      ])

      cy.findByTestId('spa-user-feedback-cta').click()
      cy.findByRole('dialog').should('exist')
      cy.findByText('Page').should('exist')
      cy.findByLabelText(/Feedback/).should('be.visible')
    })

    // We mount the component mocking the router entries to simulate the user being on the Create Collection page
    it('should open the modal with the Page form field option predefined', () => {
      cy.mountAuthenticated(<SpaUserFeedbackCTA contactRepository={contactRepository} />, [
        Route.CREATE_COLLECTION
      ])

      cy.findByTestId('spa-user-feedback-cta').click()
      cy.findByRole('dialog').should('exist')

      cy.findByTestId('toggle-inner-content').should('contain', 'Create Collection')
    })
  })

  describe('close modal', () => {
    it('should close it when the close icon button is clicked', () => {
      cy.mountAuthenticated(<SpaUserFeedbackCTA contactRepository={contactRepository} />)

      cy.findByTestId('spa-user-feedback-cta').click()
      cy.findByRole('dialog').should('exist')

      cy.findByLabelText(/Close/).click()
      cy.findByRole('dialog').should('not.exist')
    })
    it('should close it when the cancel button is clicked', () => {
      cy.mountAuthenticated(<SpaUserFeedbackCTA contactRepository={contactRepository} />)

      cy.findByTestId('spa-user-feedback-cta').click()
      cy.findByRole('dialog').should('exist')

      cy.findByText(/Cancel/).click()
      cy.findByRole('dialog').should('not.exist')
    })
  })
})
