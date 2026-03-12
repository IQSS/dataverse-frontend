import { act, renderHook, waitFor } from '@testing-library/react'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { useAssignDatasetGuestbook } from '@/sections/edit-dataset-terms/edit-guestbook/useAssignDatasetGuestbook'

describe('useAssignDatasetGuestbook', () => {
  let onSuccessfulAssignDatasetGuestbook: () => void
  let guestbookRepository: GuestbookRepository

  beforeEach(() => {
    onSuccessfulAssignDatasetGuestbook = cy.stub().as('onSuccessfulAssignDatasetGuestbook')
    guestbookRepository = {
      getGuestbook: cy.stub(),
      assignDatasetGuestbook: cy.stub(),
      removeDatasetGuestbook: cy.stub()
    }
  })

  it('should initialize with default state', async () => {
    const { result } = renderHook(() =>
      useAssignDatasetGuestbook({
        guestbookRepository,
        onSuccessfulAssignDatasetGuestbook
      })
    )

    await waitFor(() => {
      expect(result.current.isLoadingAssignDatasetGuestbook).to.deep.equal(false)
      expect(result.current.errorAssignDatasetGuestbook).to.deep.equal(null)
      expect(typeof result.current.handleAssignDatasetGuestbook).to.deep.equal('function')
    })
  })

  it('should assign guestbook successfully', async () => {
    const assignDatasetGuestbookStub =
      guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    assignDatasetGuestbookStub.resolves(undefined)

    const { result } = renderHook(() =>
      useAssignDatasetGuestbook({
        guestbookRepository,
        onSuccessfulAssignDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleAssignDatasetGuestbook(123, 5)
    })

    expect(assignDatasetGuestbookStub).to.have.been.calledWith(123, 5)
    expect(onSuccessfulAssignDatasetGuestbook).to.have.been.calledOnce
    expect(result.current.isLoadingAssignDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorAssignDatasetGuestbook).to.deep.equal(null)
  })

  it('should handle WriteError using the parsed reason without status code', async () => {
    const writeError = new WriteError()
    writeError.message = 'Request failed. Reason was: [400] Guestbook cannot be assigned'
    const assignDatasetGuestbookStub =
      guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    assignDatasetGuestbookStub.rejects(writeError)

    const { result } = renderHook(() =>
      useAssignDatasetGuestbook({
        guestbookRepository,
        onSuccessfulAssignDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleAssignDatasetGuestbook(123, 5)
    })

    expect(assignDatasetGuestbookStub).to.have.been.calledWith(123, 5)
    expect(onSuccessfulAssignDatasetGuestbook).to.not.have.been.called
    expect(result.current.isLoadingAssignDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorAssignDatasetGuestbook).to.deep.equal(
      'Guestbook cannot be assigned'
    )
  })

  it('should handle WriteError using the raw error message when no reason can be extracted', async () => {
    const writeError = new WriteError()
    writeError.message = 'Raw write error message'
    const assignDatasetGuestbookStub =
      guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    assignDatasetGuestbookStub.rejects(writeError)

    const { result } = renderHook(() =>
      useAssignDatasetGuestbook({
        guestbookRepository,
        onSuccessfulAssignDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleAssignDatasetGuestbook(123, 5)
    })

    expect(assignDatasetGuestbookStub).to.have.been.calledWith(123, 5)
    expect(onSuccessfulAssignDatasetGuestbook).to.not.have.been.called
    expect(result.current.isLoadingAssignDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorAssignDatasetGuestbook).to.deep.equal('Raw write error message')
  })

  it('should handle unknown errors and set default message', async () => {
    const assignDatasetGuestbookStub =
      guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    assignDatasetGuestbookStub.rejects(new Error('Unknown error'))

    const { result } = renderHook(() =>
      useAssignDatasetGuestbook({
        guestbookRepository,
        onSuccessfulAssignDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleAssignDatasetGuestbook(123, 5)
    })

    expect(assignDatasetGuestbookStub).to.have.been.calledWith(123, 5)
    expect(onSuccessfulAssignDatasetGuestbook).to.not.have.been.called
    expect(result.current.isLoadingAssignDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorAssignDatasetGuestbook).to.deep.equal(
      'An error occurred while updating the dataset guestbook. Please try again.'
    )
  })
})
