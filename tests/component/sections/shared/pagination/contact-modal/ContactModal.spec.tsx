import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { ContactModal } from '@/sections/shared/contact/contact-modal/contact-modal'

const contactRepository: ContactRepository = {} as ContactRepository

const mockContacts = {
  fromEmail: 'test@dataverse.com',
  subject: 'Test',
  body: 'You have just been sent the following message via the Root.'
}
const title = 'Email Collection Contact'
const toContactName = 'Root'

describe('Contact Modal', () => {
  beforeEach(() => {
    contactRepository.sendFeedbacktoOwners = cy.stub().resolves([mockContacts])

    cy.customMount(
      <ContactModal
        show
        title={title}
        handleClose={() => {}}
        toContactName={toContactName}
        id="123"
        contactRepository={contactRepository}
      />
    )
  })
  it('should should fields and information correctly', () => {
    cy.findByText(title).should('exist')
    cy.findByText('Root Contact').should('exist')
    cy.findByText('From').should('exist')
    cy.findByPlaceholderText('name@email.xyz').should('exist')
    cy.findByText('Subject').should('exist')
    cy.findByText('Message').should('exist')
    cy.findByText('Please fill this out to prove you are not a robot.').should('exist')
    cy.findByRole('button', { name: /Submit/i }).should('exist')
    cy.findByText('Close').should('exist')
  })

  it('should validation errors when captcha answer is not numbers', () => {
    cy.findByTestId('fromEmail').type('email@dataverse.com')
    cy.findByTestId('subject').type('subject')
    cy.findByTestId('body').type('message')
    cy.findByTestId('captchaInput').type('abc')
    cy.findByRole('button', { name: /Submit/i }).click()
    cy.findByText(/Only numbers are allowed./i).should('exist')
  })

  it('shows validation errors when fields are empty', () => {
    cy.findByRole('button', { name: /submit/i }).click()
    cy.findByText(/email is required/i).should('exist')
    cy.findByText(/subject is required/i).should('exist')
    cy.findByText(/message is required/i).should('exist')
  })

  it('shows validation errors when email is in wrong format', () => {
    cy.findByTestId('fromEmail').type('email')
    cy.findByTestId('subject').type('subject')
    cy.findByTestId('body').type('message')
    cy.findByRole('button', { name: /submit/i }).click()
    cy.findByText(/Invalid email format/i).should('exist')
  })

  it('shows validation errors when captcha answer is wrong ', () => {
    cy.findByTestId('fromEmail').type('email@dataverse.com')
    cy.findByTestId('subject').type('subject')
    cy.findByTestId('body').type('message')
    cy.findByRole('button', { name: /submit/i }).click()
    cy.findByTestId('captchaNumbers')
      .invoke('text')
      .then((text) => {
        const matches = text.match(/(\d+)\s*\+\s*(\d+)\s*=/)
        if (matches) {
          const num1 = parseInt(matches[1], 10)
          const num2 = parseInt(matches[2], 10)
          const answer = num1 + num2 + 1
          cy.findByTestId('captchaInput').type(answer.toString())
          cy.findByRole('button', { name: /Submit/i }).click()
          cy.findByText(/Incorrect answer./i).should('exist')
        }
      })
  })
})
