import { act, renderHook, waitFor } from '@testing-library/react'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { useRemoveDatasetGuestbook } from '@/sections/edit-dataset-terms/edit-guestbook/useRemoveDatasetGuestbook'

describe('useRemoveDatasetGuestbook', () => {
  let onSuccessfulRemoveDatasetGuestbook: () => void
  let guestbookRepository: GuestbookRepository

  beforeEach(() => {
    onSuccessfulRemoveDatasetGuestbook = cy.stub().as('onSuccessfulRemoveDatasetGuestbook')
    guestbookRepository = {
      getGuestbook: cy.stub(),
      getGuestbooksByCollectionId: cy.stub(),
      assignDatasetGuestbook: cy.stub(),
      removeDatasetGuestbook: cy.stub()
    }
  })

  it('should initialize with default state', async () => {
    const { result } = renderHook(() =>
      useRemoveDatasetGuestbook({
        guestbookRepository,
        onSuccessfulRemoveDatasetGuestbook
      })
    )

    await waitFor(() => {
      expect(result.current.isLoadingRemoveDatasetGuestbook).to.deep.equal(false)
      expect(result.current.errorRemoveDatasetGuestbook).to.deep.equal(null)
      expect(typeof result.current.handleRemoveDatasetGuestbook).to.deep.equal('function')
    })
  })

  it('should remove guestbook successfully', async () => {
    const removeDatasetGuestbookStub =
      guestbookRepository.removeDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    removeDatasetGuestbookStub.resolves(undefined)

    const { result } = renderHook(() =>
      useRemoveDatasetGuestbook({
        guestbookRepository,
        onSuccessfulRemoveDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleRemoveDatasetGuestbook(123)
    })

    expect(removeDatasetGuestbookStub).to.have.been.calledWith(123)
    expect(onSuccessfulRemoveDatasetGuestbook).to.have.been.calledOnce
    expect(result.current.isLoadingRemoveDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorRemoveDatasetGuestbook).to.deep.equal(null)
  })

  it('should handle WriteError using the parsed reason without status code', async () => {
    const writeError = new WriteError()
    writeError.message = 'Request failed. Reason was: [400] Guestbook cannot be removed'
    const removeDatasetGuestbookStub =
      guestbookRepository.removeDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    removeDatasetGuestbookStub.rejects(writeError)

    const { result } = renderHook(() =>
      useRemoveDatasetGuestbook({
        guestbookRepository,
        onSuccessfulRemoveDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleRemoveDatasetGuestbook(123)
    })

    expect(removeDatasetGuestbookStub).to.have.been.calledWith(123)
    expect(onSuccessfulRemoveDatasetGuestbook).to.not.have.been.called
    expect(result.current.isLoadingRemoveDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorRemoveDatasetGuestbook).to.deep.equal('Guestbook cannot be removed')
  })

  it('should handle WriteError using the raw error message when no reason can be extracted', async () => {
    const writeError = new WriteError()
    writeError.message = 'Raw write error message'
    const removeDatasetGuestbookStub =
      guestbookRepository.removeDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    removeDatasetGuestbookStub.rejects(writeError)

    const { result } = renderHook(() =>
      useRemoveDatasetGuestbook({
        guestbookRepository,
        onSuccessfulRemoveDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleRemoveDatasetGuestbook(123)
    })

    expect(removeDatasetGuestbookStub).to.have.been.calledWith(123)
    expect(onSuccessfulRemoveDatasetGuestbook).to.not.have.been.called
    expect(result.current.isLoadingRemoveDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorRemoveDatasetGuestbook).to.deep.equal('Raw write error message')
  })

  it('should handle unknown errors and set default message', async () => {
    const removeDatasetGuestbookStub =
      guestbookRepository.removeDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    removeDatasetGuestbookStub.rejects(new Error('Unknown error'))

    const { result } = renderHook(() =>
      useRemoveDatasetGuestbook({
        guestbookRepository,
        onSuccessfulRemoveDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleRemoveDatasetGuestbook(123)
    })

    expect(removeDatasetGuestbookStub).to.have.been.calledWith(123)
    expect(onSuccessfulRemoveDatasetGuestbook).to.not.have.been.called
    expect(result.current.isLoadingRemoveDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorRemoveDatasetGuestbook).to.deep.equal(
      'An error occurred while updating the dataset guestbook. Please try again.'
    )
  })
})
