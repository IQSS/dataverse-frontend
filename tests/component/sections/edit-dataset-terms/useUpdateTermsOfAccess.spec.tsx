import { renderHook, act, waitFor } from '@testing-library/react'
import { useUpdateTermsOfAccess } from '@/sections/edit-dataset-terms/edit-terms-of-access/useUpdateTermsOfAccess'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { WriteError } from '@iqss/dataverse-client-javascript'

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
    it('should handle WriteError and prefer the reason without status code when available', async () => {
      const mockWriteError = new WriteError(
        'Error [500] Reason was: [500] An error occurred while updating the dataset terms of access. Please try again.'
      )
      datasetRepository.updateTermsOfAccess = cy.stub().rejects(mockWriteError)

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

    it('should handle WriteError and fall back to the error message when no reason is present', async () => {
      const message =
        'An error occurred while updating the dataset terms of access. Please try again.'
      const mockWriteError = new WriteError(message)
      datasetRepository.updateTermsOfAccess = cy.stub().rejects(mockWriteError)

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
      expect(result.current.error).to.deep.equal(message)
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
