import { act, renderHook } from '@testing-library/react'
import {
  useSubmitContact,
  SubmissionStatus
} from '@/sections/shared/form/ContactForm/useSubmitContact'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { ContactDTO } from '@/contact/domain/useCases/ContactDTO'

const contactRepository: ContactRepository = {} as ContactRepository

const mockFormData: ContactDTO = { subject: 'Test', body: 'Hello', fromEmail: 'test@dataverse.com' }
const mockContacts = {
  fromEmail: 'test@dataverse.com',
  subject: 'Test',
  body: 'You have just been sent the following message via the Root.'
}

describe('useSubmitContact', () => {
  beforeEach(() => {
    contactRepository.submitContactInfo = cy.stub().resolves([mockContacts])
  })

  it('should handle successful form submission', async () => {
    const { result } = renderHook(() => useSubmitContact(contactRepository))

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.NotSubmitted)
    expect(result.current.submitError).to.equal(null)

    await act(async () => {
      const response = await result.current.submitForm(mockFormData)
      expect(response).to.deep.equal([mockContacts])
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.SubmitComplete)
    expect(result.current.submitError).to.equal(null)
  })

  it('should handle submission error with a proper error message', async () => {
    const errorMessage = 'Failed to submit contact info'
    contactRepository.submitContactInfo = cy.stub().rejects(new Error(errorMessage))

    const { result } = renderHook(() => useSubmitContact(contactRepository))

    await act(async () => {
      const response = await result.current.submitForm(mockFormData)
      expect(response).to.deep.equal(errorMessage as unknown as Error)
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.Errored)
    expect(result.current.submitError).to.equal(errorMessage)
  })

  it('should handle submission error with a generic error message if not an Error instance', async () => {
    contactRepository.submitContactInfo = cy.stub().rejects('Some error string')

    const { result } = renderHook(() => useSubmitContact(contactRepository))

    await act(async () => {
      const response = await result.current.submitForm(mockFormData)
      expect(response).to.deep.equal('Unknown error occurred')
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.Errored)
    expect(result.current.submitError).to.equal('Unknown error occurred')
  })
})
