import { act, renderHook, waitFor } from '@testing-library/react'
import { assignDatasetGuestbook, WriteError } from '@iqss/dataverse-client-javascript'
import { useAssignDatasetGuestbook } from '@/sections/edit-dataset-terms/edit-guestbook/useAssignDatasetGuestbook'

describe('useAssignDatasetGuestbook', () => {
  let onSuccessfulAssignDatasetGuestbook: () => void

  beforeEach(() => {
    onSuccessfulAssignDatasetGuestbook = cy.stub().as('onSuccessfulAssignDatasetGuestbook')
  })

  it('should initialize with default state', async () => {
    const { result } = renderHook(() =>
      useAssignDatasetGuestbook({
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
    const executeStub = cy.stub(assignDatasetGuestbook, 'execute').resolves(undefined)

    const { result } = renderHook(() =>
      useAssignDatasetGuestbook({
        onSuccessfulAssignDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleAssignDatasetGuestbook(123, 5)
    })

    expect(executeStub).to.have.been.calledWith(123, 5)
    expect(onSuccessfulAssignDatasetGuestbook).to.have.been.calledOnce
    expect(result.current.isLoadingAssignDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorAssignDatasetGuestbook).to.deep.equal(null)
  })

  it('should handle WriteError', async () => {
    const writeError = new WriteError()
    const executeStub = cy.stub(assignDatasetGuestbook, 'execute').rejects(writeError)

    const { result } = renderHook(() =>
      useAssignDatasetGuestbook({
        onSuccessfulAssignDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleAssignDatasetGuestbook(123, 5)
    })

    expect(executeStub).to.have.been.calledWith(123, 5)
    expect(onSuccessfulAssignDatasetGuestbook).to.not.have.been.called
    expect(result.current.isLoadingAssignDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorAssignDatasetGuestbook).to.not.deep.equal(null)
  })

  it('should handle unknown errors and set default message', async () => {
    const executeStub = cy
      .stub(assignDatasetGuestbook, 'execute')
      .rejects(new Error('Unknown error'))

    const { result } = renderHook(() =>
      useAssignDatasetGuestbook({
        onSuccessfulAssignDatasetGuestbook
      })
    )

    await act(async () => {
      await result.current.handleAssignDatasetGuestbook(123, 5)
    })

    expect(executeStub).to.have.been.calledWith(123, 5)
    expect(onSuccessfulAssignDatasetGuestbook).to.not.have.been.called
    expect(result.current.isLoadingAssignDatasetGuestbook).to.deep.equal(false)
    expect(result.current.errorAssignDatasetGuestbook).to.deep.equal(
      'An error occurred while updating the dataset guestbook. Please try again.'
    )
  })
})
