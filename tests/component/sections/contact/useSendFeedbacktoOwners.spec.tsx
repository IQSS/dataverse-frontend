import { act, renderHook } from '@testing-library/react'
import {
  useSendFeedbacktoOwners,
  SubmissionStatus
} from '@/sections/shared/form/ContactForm/useSendFeedbacktoOwners'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { FeedbackDTO } from '@/contact/domain/useCases/FeedbackDTO'
import { Contact } from '@/contact/domain/models/Contact'

const contactRepository: ContactRepository = {} as ContactRepository

const mockFeedbackDTO: FeedbackDTO = {
  subject: 'Test',
  body: 'Hello',
  fromEmail: 'test@dataverse.com'
}
const mockContactsReply: Contact = {
  fromEmail: 'test@dataverse.com',
  subject: 'Test',
  body: 'You have just been sent the following message via the Root.'
}

describe('useSendFeedbacktoOwners', () => {
  beforeEach(() => {
    contactRepository.sendFeedbacktoOwners = cy.stub().resolves([mockContactsReply])
  })

  it('should handle successful form submission', async () => {
    const { result } = renderHook(() => useSendFeedbacktoOwners(contactRepository))

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.NotSubmitted)
    expect(result.current.submitError).to.equal(null)

    await act(async () => {
      const response = await result.current.submitForm(mockFeedbackDTO)
      expect(response).to.deep.equal([mockContactsReply])
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.SubmitComplete)
    expect(result.current.submitError).to.equal(null)
  })

  it('should handle submission error with a proper error message', async () => {
    const errorMessage = 'Failed to submit contact info'
    contactRepository.sendFeedbacktoOwners = cy.stub().rejects(new Error(errorMessage))

    const { result } = renderHook(() => useSendFeedbacktoOwners(contactRepository))

    await act(async () => {
      const response = await result.current.submitForm(mockFeedbackDTO)
      expect(response).to.deep.equal(errorMessage as unknown as Error)
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.Errored)
    expect(result.current.submitError).to.equal(errorMessage)
  })

  it('should handle submission error with a generic error message if not an Error instance', async () => {
    contactRepository.sendFeedbacktoOwners = cy.stub().rejects('Some error string')

    const { result } = renderHook(() => useSendFeedbacktoOwners(contactRepository))

    await act(async () => {
      const response = await result.current.submitForm(mockFeedbackDTO)
      expect(response).to.deep.equal('Unknown error occurred')
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.Errored)
    expect(result.current.submitError).to.equal('Unknown error occurred')
  })

  it('should handle submission error with a generic error message if there is not an Error instance', async () => {
    contactRepository.sendFeedbacktoOwners = cy.stub().rejects('error')

    const { result } = renderHook(() => useSendFeedbacktoOwners(contactRepository))

    await act(async () => {
      const response = await result.current.submitForm(mockFeedbackDTO)
      expect(response).to.equal('Unknown error occurred')
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.Errored)
    expect(result.current.submitError).to.equal('Unknown error occurred')
  })
})
