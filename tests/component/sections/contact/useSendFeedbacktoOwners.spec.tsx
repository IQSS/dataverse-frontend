import { act, renderHook } from '@testing-library/react'
import { useSendFeedbacktoOwners } from '@/sections/shared/form/ContactForm/useSendFeedbacktoOwners'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { FeedbackDTO } from '@/contact/domain/useCases/FeedbackDTO'
import { ContactResponse } from '@/contact/domain/models/ContactResponse'
import { WriteError } from '@iqss/dataverse-client-javascript'

const contactRepository: ContactRepository = {} as ContactRepository

const mockFeedbackDTO: FeedbackDTO = {
  subject: 'Test',
  body: 'Hello',
  fromEmail: 'test@dataverse.com'
}
const mockContactsReply: ContactResponse = {
  fromEmail: 'test@dataverse.com',
  subject: 'Test',
  body: 'You have just been sent the following message via the Root.'
}

describe('useSendFeedbacktoOwners', () => {
  beforeEach(() => {
    contactRepository.sendFeedbacktoOwners = cy.stub().resolves([mockContactsReply])
  })

  it('should handle successful form submission', async () => {
    const { result } = renderHook(() =>
      useSendFeedbacktoOwners({ contactRepository, onSuccessfulSubmit: () => {} })
    )
    expect(result.current.isSubmittingForm).to.equal(false)
    expect(result.current.submitError).to.equal(null)

    await act(async () => {
      const response = await result.current.submitForm(mockFeedbackDTO)
      expect(response).to.deep.equal([mockContactsReply])
    })
    expect(result.current.isSubmittingForm).to.equal(false)
    expect(result.current.submitError).to.equal(null)
  })

  it('should handle submission error with a proper error message', async () => {
    const errorMessage = 'An error occurred while submitting your feedback. Please try again later.'
    contactRepository.sendFeedbacktoOwners = cy.stub().rejects(new WriteError(errorMessage))

    const { result } = renderHook(() =>
      useSendFeedbacktoOwners({ contactRepository, onSuccessfulSubmit: () => {} })
    )

    await act(async () => {
      const response = await result.current.submitForm(mockFeedbackDTO)
      expect(response).to.deep.equal(errorMessage as unknown as WriteError)
    })
    expect(result.current.isSubmittingForm).to.equal(false)
    expect(result.current.submitError).to.equal(errorMessage)
  })
})
