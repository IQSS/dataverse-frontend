import { renderHook, act, waitFor } from '@testing-library/react'
import { useUpdateTermsOfAccess } from '@/sections/edit-dataset-terms/edit-terms-of-access/useUpdateTermsOfAccess'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

describe('useUpdateTermsOfAccess', () => {
  let datasetRepository: DatasetRepository
  let onSuccessfulUpdateTermsOfAccess: () => void

  const sampleTerms: TermsOfAccess = {
    fileAccessRequest: true,
    termsOfAccessForRestrictedFiles: 'Terms text',
    dataAccessPlace: 'Place',
    originalArchive: 'Archive',
    availabilityStatus: 'Available',
    contactForAccess: 'contact@example.edu',
    sizeOfCollection: '10GB',
    studyCompletion: 'Complete'
  }

  beforeEach(() => {
    datasetRepository = {} as DatasetRepository
    onSuccessfulUpdateTermsOfAccess = cy.stub().as('onSuccessfulUpdateTermsOfAccess')
  })

  it('should initialize with default state', async () => {
    const { result } = renderHook(() =>
      useUpdateTermsOfAccess({
        datasetRepository,
        onSuccessfulUpdateTermsOfAccess
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal(null)
      expect(typeof result.current.handleUpdateTermsOfAccess).to.deep.equal('function')
    })
  })

  it('should successfully update terms of access', async () => {
    datasetRepository.updateTermsOfAccess = cy.stub().resolves(undefined)

    const { result } = renderHook(() =>
      useUpdateTermsOfAccess({
        datasetRepository,
        onSuccessfulUpdateTermsOfAccess
      })
    )

    await act(async () => {
      await result.current.handleUpdateTermsOfAccess(123, sampleTerms)
    })

    expect(datasetRepository.updateTermsOfAccess).to.have.been.calledWith(123, sampleTerms)
    expect(onSuccessfulUpdateTermsOfAccess).to.have.been.called
    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(null)
  })

  describe('Error handling', () => {
    it('should handle WriteError and set formatted error message from reason without status code', async () => {
      const mockWriteError = new WriteError()
      datasetRepository.updateTermsOfAccess = cy.stub().rejects(mockWriteError)
      cy.stub(JSDataverseWriteErrorHandler.prototype, 'getReasonWithoutStatusCode').returns(
        'Formatted write error'
      )
      cy.stub(JSDataverseWriteErrorHandler.prototype, 'getErrorMessage').returns(
        'Fallback write error'
      )

      const { result } = renderHook(() =>
        useUpdateTermsOfAccess({
          datasetRepository,
          onSuccessfulUpdateTermsOfAccess
        })
      )

      await act(async () => {
        await result.current.handleUpdateTermsOfAccess(123, sampleTerms)
      })

      expect(datasetRepository.updateTermsOfAccess).to.have.been.calledWith(123, sampleTerms)
      expect(onSuccessfulUpdateTermsOfAccess).to.not.have.been.called
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal('Formatted write error')
    })

    it('should fall back to handler getErrorMessage when reason without status code is null', async () => {
      const mockWriteError = new WriteError()
      datasetRepository.updateTermsOfAccess = cy.stub().rejects(mockWriteError)
      cy.stub(JSDataverseWriteErrorHandler.prototype, 'getReasonWithoutStatusCode').returns(null)
      cy.stub(JSDataverseWriteErrorHandler.prototype, 'getErrorMessage').returns(
        'Fallback write error'
      )

      const { result } = renderHook(() =>
        useUpdateTermsOfAccess({
          datasetRepository,
          onSuccessfulUpdateTermsOfAccess
        })
      )

      await act(async () => {
        await result.current.handleUpdateTermsOfAccess(123, sampleTerms)
      })

      expect(datasetRepository.updateTermsOfAccess).to.have.been.calledWith(123, sampleTerms)
      expect(onSuccessfulUpdateTermsOfAccess).to.not.have.been.called
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal('Fallback write error')
    })

    it('should handle unknown errors and set default error message', async () => {
      const unknownError = new Error('Unknown error')
      datasetRepository.updateTermsOfAccess = cy.stub().rejects(unknownError)

      const { result } = renderHook(() =>
        useUpdateTermsOfAccess({
          datasetRepository,
          onSuccessfulUpdateTermsOfAccess
        })
      )

      await act(async () => {
        await result.current.handleUpdateTermsOfAccess(123, sampleTerms)
      })

      expect(datasetRepository.updateTermsOfAccess).to.have.been.calledWith(123, sampleTerms)
      expect(onSuccessfulUpdateTermsOfAccess).to.not.have.been.called
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal(
        'An error occurred while updating the dataset terms of access. Please try again.'
      )
    })
  })
})
