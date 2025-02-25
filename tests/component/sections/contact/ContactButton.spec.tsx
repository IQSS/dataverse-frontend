import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { ContactButton } from '@/sections/shared/contact/ContactButton'

const mockContacts = {
  fromEmail: 'test@dataverse.com',
  subject: 'Test',
  body: 'You have just been sent the following message via the Root.'
}
const contactRepository: ContactRepository = {} as ContactRepository

describe('ContactButton', () => {
  beforeEach(() => {
    contactRepository.sendFeedbacktoOwners = cy.stub().resolves([mockContacts])
    cy.customMount(
      <ContactButton
        toContactName="Test Dataset"
        contactObjectType="collection"
        id="root"
        contactRepository={contactRepository}
      />
    )
    cy.findByRole('button', { name: /Contact/i })
      .should('exist')
      .click()
  })

  it('shows correct contact title based on different contact object', () => {
    cy.customMount(
      <ContactButton
        toContactName="Test Dataset"
        contactObjectType="collection"
        id="root"
        contactRepository={contactRepository}
      />
    )

    cy.findByRole('button', { name: /Contact/i }).click()
    cy.findByText(/Email Collection Contact/i).should('exist')

    cy.customMount(
      <ContactButton
        toContactName="Test Dataset"
        contactObjectType="dataset"
        id="root"
        contactRepository={contactRepository}
      />
    )

    cy.findByRole('button', { name: /Contact Owner/i }).click()
    cy.findByText(/Email Dataset Contact/i).should('exist')
  })

  it('shows contact owner button if it is in dataset page ', () => {
    cy.customMount(
      <ContactButton
        toContactName="Test Dataset"
        contactObjectType="dataset"
        id="1"
        contactRepository={contactRepository}
      />
    )
    cy.findByRole('button', { name: /Contact Owner/i }).should('exist')
  })

  it('should successfully submit if every field is valid', () => {
    cy.findByTestId('captchaNumbers')
      .invoke('text')
      .then((text) => {
        const matches = text.match(/(\d+)\s*\+\s*(\d+)\s*=/)
        if (matches) {
          const num1 = parseInt(matches[1], 10)
          const num2 = parseInt(matches[2], 10)
          const answer = num1 + num2
          cy.findByTestId('fromEmail').type('email@dataverse.com')
          cy.findByTestId('subject').type('subject')
          cy.findByTestId('body').type('message')
          cy.findByTestId('captchaInput').type(answer.toString())
          cy.findByRole('button', { name: /Submit/i }).click()
        }
      })
    cy.findByRole('dialog').should('not.exist')
  })
})

describe('ContactButton Error', () => {
  beforeEach(() => {
    contactRepository.sendFeedbacktoOwners = cy
      .stub()
      .rejects(new Error('Failed to submit contact info'))
  })
  it('should send alert if the submission is failed', () => {
    cy.customMount(
      <ContactButton
        toContactName="Test Dataset"
        contactObjectType="collection"
        id="root"
        contactRepository={contactRepository}
      />
    )

    cy.findByRole('button', { name: /Contact/i })
      .should('exist')
      .click()
    cy.findByTestId('captchaNumbers')
      .invoke('text')
      .then((text) => {
        const matches = text.match(/(\d+)\s*\+\s*(\d+)\s*=/)
        if (matches) {
          const num1 = parseInt(matches[1], 10)
          const num2 = parseInt(matches[2], 10)
          const answer = num1 + num2
          cy.findByTestId('fromEmail').type('email@dataverse.com')
          cy.findByTestId('subject').type('subject')
          cy.findByTestId('body').type('message')
          cy.findByTestId('captchaInput').type(answer.toString())
          cy.findByRole('button', { name: /Submit/i }).click()
        }
      })
    cy.findByText('Error').should('exist')
  })
})
