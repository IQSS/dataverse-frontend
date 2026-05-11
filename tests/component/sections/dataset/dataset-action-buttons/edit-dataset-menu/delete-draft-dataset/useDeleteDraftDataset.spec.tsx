import { act, renderHook, waitFor } from '@testing-library/react'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useDeleteDraftDataset } from '@/sections/dataset/dataset-action-buttons/edit-dataset-menu/delete-draft-dataset/useDeleteDraftDataset'
import { Utils } from '@/shared/helpers/Utils'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

describe('useDeleteDraftDataset', () => {
  let datasetRepository: DatasetRepository
  let onSuccessfulDelete: () => void

  beforeEach(() => {
    datasetRepository = {} as DatasetRepository
    onSuccessfulDelete = cy.stub().as('onSuccessfulDelete')
  })

  it('should initialize with default state', async () => {
    const { result } = renderHook(() =>
      useDeleteDraftDataset({
        datasetRepository,
        onSuccessfulDelete
      })
    )

    await waitFor(() => {
      expect(result.current.isDeletingDataset).to.deep.equal(false)
      expect(result.current.errorDeletingDataset).to.deep.equal(null)
      expect(typeof result.current.handleDeleteDraftDataset).to.deep.equal('function')
    })
  })

  it('should delete draft dataset successfully and call onSuccessfulDelete after sleep', async () => {
    datasetRepository.deleteDatasetDraft = cy.stub().resolves(undefined)
    const sleepStub = cy.stub(Utils, 'sleep').resolves()

    const { result } = renderHook(() =>
      useDeleteDraftDataset({
        datasetRepository,
        onSuccessfulDelete
      })
    )

    await act(async () => {
      await result.current.handleDeleteDraftDataset(123)
    })

    expect(datasetRepository.deleteDatasetDraft).to.have.been.calledWith(123)
    expect(sleepStub).to.have.been.calledWith(3000)
    expect(onSuccessfulDelete).to.have.been.calledOnce
    expect(result.current.isDeletingDataset).to.deep.equal(false)
    expect(result.current.errorDeletingDataset).to.deep.equal(null)
  })

  describe('Error handling', () => {
    it('should set formatted error from WriteError reason without status code', async () => {
      const writeError = new WriteError()
      datasetRepository.deleteDatasetDraft = cy.stub().rejects(writeError)
      cy.stub(JSDataverseWriteErrorHandler.prototype, 'getReasonWithoutStatusCode').returns(
        'Formatted write error'
      )
      cy.stub(JSDataverseWriteErrorHandler.prototype, 'getErrorMessage').returns(
        'Fallback write error'
      )

      const { result } = renderHook(() =>
        useDeleteDraftDataset({
          datasetRepository,
          onSuccessfulDelete
        })
      )

      await act(async () => {
        await result.current.handleDeleteDraftDataset(123)
      })

      expect(datasetRepository.deleteDatasetDraft).to.have.been.calledWith(123)
      expect(onSuccessfulDelete).to.not.have.been.called
      expect(result.current.isDeletingDataset).to.deep.equal(false)
      expect(result.current.errorDeletingDataset).to.deep.equal('Formatted write error')
    })

    it('should fall back to WriteError handler error message when reason is null', async () => {
      const writeError = new WriteError()
      datasetRepository.deleteDatasetDraft = cy.stub().rejects(writeError)
      cy.stub(JSDataverseWriteErrorHandler.prototype, 'getReasonWithoutStatusCode').returns(null)
      cy.stub(JSDataverseWriteErrorHandler.prototype, 'getErrorMessage').returns(
        'Fallback write error'
      )

      const { result } = renderHook(() =>
        useDeleteDraftDataset({
          datasetRepository,
          onSuccessfulDelete
        })
      )

      await act(async () => {
        await result.current.handleDeleteDraftDataset(123)
      })

      expect(datasetRepository.deleteDatasetDraft).to.have.been.calledWith(123)
      expect(onSuccessfulDelete).to.not.have.been.called
      expect(result.current.isDeletingDataset).to.deep.equal(false)
      expect(result.current.errorDeletingDataset).to.deep.equal('Fallback write error')
    })

    it('should set default translated error message for unknown errors', async () => {
      datasetRepository.deleteDatasetDraft = cy.stub().rejects(new Error('unknown error'))

      const { result } = renderHook(() =>
        useDeleteDraftDataset({
          datasetRepository,
          onSuccessfulDelete
        })
      )

      await act(async () => {
        await result.current.handleDeleteDraftDataset(123)
      })

      expect(datasetRepository.deleteDatasetDraft).to.have.been.calledWith(123)
      expect(onSuccessfulDelete).to.not.have.been.called
      expect(result.current.isDeletingDataset).to.deep.equal(false)
      expect(result.current.errorDeletingDataset).to.deep.equal(
        'An error occurred while deleting the dataset.'
      )
    })
  })
})
