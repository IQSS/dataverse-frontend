import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'
import { ContactButton } from '@/sections/contact/ContactButton'

describe('ContactButton', () => {
  const contactRepository = new ContactJSDataverseRepository()
  beforeEach(() => {
    cy.stub(ContactJSDataverseRepository.prototype, 'submitContactInfo').resolves([])
    cy.customMount(
      <ContactButton
        onSuccess={() => {}}
        toContactName="Test Dataset"
        isCollection={true}
        id="root"
        contactRepository={contactRepository}
      />
    )

    cy.findByRole('button', { name: /Contact/i })
      .should('exist')
      .click()
  })
  it('shows contact button if it is in collection page ', () => {
    cy.findByRole('dialog').should('exist')
  })

  it('shows contact owner button if it is in dataset page ', () => {
    cy.customMount(
      <ContactButton
        onSuccess={() => {}}
        toContactName="Test Dataset"
        isCollection={false}
        id="1"
        contactRepository={contactRepository}
      />
    )
    cy.findByRole('button', { name: /Contact Owner/i })
      .should('exist')
      .click()
    cy.findByRole('dialog').should('exist')
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
