import { renderHook, act, waitFor } from '@testing-library/react'
import { useUpdateDatasetLicense } from '@/sections/edit-dataset-terms/edit-license-and-terms/useUpdateDatasetLicense'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetLicenseUpdateRequest } from '@/dataset/domain/models/DatasetLicenseUpdateRequest'
import { WriteError } from '@iqss/dataverse-client-javascript'

describe('useUpdateDatasetLicense', () => {
  let datasetRepository: DatasetRepository
  let onSuccessfulUpdateLicense: () => void

  const request: DatasetLicenseUpdateRequest = {
    name: 'CC0 1.0'
  }

  const requestWithCustomTerms: DatasetLicenseUpdateRequest = {
    customTerms: {
      termsOfUse: 'Terms text',
      confidentialityDeclaration: '',
      specialPermissions: '',
      restrictions: '',
      citationRequirements: '',
      depositorRequirements: '',
      conditions: '',
      disclaimer: ''
    }
  }

  beforeEach(() => {
    datasetRepository = {} as DatasetRepository
    onSuccessfulUpdateLicense = cy.stub().as('onSuccessfulUpdateLicense')
  })

  it('should initialize with default state', async () => {
    const { result } = renderHook(() =>
      useUpdateDatasetLicense({
        datasetRepository,
        onSuccessfulUpdateLicense
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.error).to.deep.equal(null)
      expect(typeof result.current.handleUpdateLicense).to.deep.equal('function')
    })
  })

  it('should successfully update license by name', async () => {
    datasetRepository.updateDatasetLicense = cy.stub().resolves(undefined)

    const { result } = renderHook(() =>
      useUpdateDatasetLicense({
        datasetRepository,
        onSuccessfulUpdateLicense
      })
    )

    await act(async () => {
      await result.current.handleUpdateLicense(123, request)
    })

    expect(datasetRepository.updateDatasetLicense).to.have.been.calledWith(123, request)
    expect(onSuccessfulUpdateLicense).to.have.been.called
    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(null)
  })

  it('should successfully update license with custom terms', async () => {
    datasetRepository.updateDatasetLicense = cy.stub().resolves(undefined)

    const { result } = renderHook(() =>
      useUpdateDatasetLicense({
        datasetRepository,
        onSuccessfulUpdateLicense
      })
    )

    await act(async () => {
      await result.current.handleUpdateLicense(123, requestWithCustomTerms)
    })

    expect(datasetRepository.updateDatasetLicense).to.have.been.calledWith(
      123,
      requestWithCustomTerms
    )
    expect(onSuccessfulUpdateLicense).to.have.been.called
    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(null)
  })

  it('should handle WriteError and prefer the reason without status code when available', async () => {
    const mockWriteError = new WriteError('Custom error message')
    datasetRepository.updateDatasetLicense = cy.stub().rejects(mockWriteError)

    const { result } = renderHook(() =>
      useUpdateDatasetLicense({
        datasetRepository,
        onSuccessfulUpdateLicense
      })
    )

    await act(async () => {
      await result.current.handleUpdateLicense(123, request)
    })

    expect(datasetRepository.updateDatasetLicense).to.have.been.calledWith(123, request)
    expect(onSuccessfulUpdateLicense).to.not.have.been.called
    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal('Custom error message')
  })

  it('should handle WriteError and fall back to the error message when no reason is present', async () => {
    const mockWriteError = new WriteError('')
    datasetRepository.updateDatasetLicense = cy.stub().rejects(mockWriteError)

    const { result } = renderHook(() =>
      useUpdateDatasetLicense({
        datasetRepository,
        onSuccessfulUpdateLicense
      })
    )

    await act(async () => {
      await result.current.handleUpdateLicense(123, request)
    })

    expect(datasetRepository.updateDatasetLicense).to.have.been.calledWith(123, request)
    expect(onSuccessfulUpdateLicense).to.not.have.been.called
    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal('There was an error when writing the resource.')
  })

  it('should handle unknown errors and set default error message', async () => {
    const unknownError = new Error('Unknown error')
    datasetRepository.updateDatasetLicense = cy.stub().rejects(unknownError)

    const { result } = renderHook(() =>
      useUpdateDatasetLicense({
        datasetRepository,
        onSuccessfulUpdateLicense
      })
    )

    await act(async () => {
      await result.current.handleUpdateLicense(123, request)
    })

    expect(datasetRepository.updateDatasetLicense).to.have.been.calledWith(123, request)
    expect(onSuccessfulUpdateLicense).to.not.have.been.called
    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.error).to.deep.equal(
      'An error occurred while updating the dataset license. Please try again.'
    )
  })
})
