import { act, renderHook, waitFor } from '@testing-library/react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { useGetLicenses } from '@/sections/edit-dataset-terms/edit-license-and-terms/useGetLicenses'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { License } from '@/licenses/domain/models/License'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

describe('useGetLicenses', () => {
  let licenseRepository: LicenseRepository

  const mockLicenses: License[] = [
    {
      id: 1,
      name: 'CC0 1.0',
      shortDescription: 'CC0 public domain dedication',
      uri: 'http://creativecommons.org/publicdomain/zero/1.0',
      active: true,
      isDefault: true,
      sortOrder: 0
    },
    {
      id: 2,
      name: 'CC BY 4.0',
      shortDescription: 'Creative Commons Attribution 4.0',
      uri: 'http://creativecommons.org/licenses/by/4.0',
      active: true,
      isDefault: false,
      sortOrder: 1
    }
  ]

  beforeEach(() => {
    licenseRepository = {} as LicenseRepository
  })

  it('should auto fetch licenses by default', async () => {
    licenseRepository.getAvailableStandardLicenses = cy.stub().resolves(mockLicenses)

    const { result } = renderHook(() => useGetLicenses({ licenseRepository }))

    expect(result.current.isLoadingLicenses).to.equal(true)
    expect(result.current.errorLicenses).to.equal(null)
    expect(result.current.licenses).to.deep.equal([])

    await waitFor(() => {
      expect(result.current.isLoadingLicenses).to.equal(false)
      expect(result.current.errorLicenses).to.equal(null)
      expect(result.current.licenses).to.deep.equal(mockLicenses)
    })

    expect(licenseRepository.getAvailableStandardLicenses).to.have.been.calledOnce
  })

  it('should not auto fetch licenses when autoFetch is false and should fetch manually', async () => {
    licenseRepository.getAvailableStandardLicenses = cy.stub().resolves(mockLicenses)

    const { result } = renderHook(() => useGetLicenses({ licenseRepository, autoFetch: false }))

    expect(result.current.isLoadingLicenses).to.equal(false)
    expect(result.current.errorLicenses).to.equal(null)
    expect(result.current.licenses).to.deep.equal([])
    expect(licenseRepository.getAvailableStandardLicenses).to.not.have.been.called

    await act(async () => {
      await result.current.fetchLicenses()
    })

    expect(licenseRepository.getAvailableStandardLicenses).to.have.been.calledOnce
    expect(result.current.isLoadingLicenses).to.equal(false)
    expect(result.current.errorLicenses).to.equal(null)
    expect(result.current.licenses).to.deep.equal(mockLicenses)
  })

  describe('Error handling', () => {
    it('should set formatted error from ReadError reason without status code', async () => {
      const readError = new ReadError()
      licenseRepository.getAvailableStandardLicenses = cy.stub().rejects(readError)
      cy.stub(JSDataverseReadErrorHandler.prototype, 'getReasonWithoutStatusCode').returns(
        'Formatted read error'
      )
      cy.stub(JSDataverseReadErrorHandler.prototype, 'getErrorMessage').returns(
        'Fallback read error'
      )

      const { result } = renderHook(() => useGetLicenses({ licenseRepository }))

      await waitFor(() => {
        expect(result.current.isLoadingLicenses).to.equal(false)
        expect(result.current.errorLicenses).to.equal('Formatted read error')
      })
    })

    it('should fall back to ReadError handler error message when reason is null', async () => {
      const readError = new ReadError()
      licenseRepository.getAvailableStandardLicenses = cy.stub().rejects(readError)
      cy.stub(JSDataverseReadErrorHandler.prototype, 'getReasonWithoutStatusCode').returns(null)
      cy.stub(JSDataverseReadErrorHandler.prototype, 'getErrorMessage').returns(
        'Fallback read error'
      )

      const { result } = renderHook(() => useGetLicenses({ licenseRepository }))

      await waitFor(() => {
        expect(result.current.isLoadingLicenses).to.equal(false)
        expect(result.current.errorLicenses).to.equal('Fallback read error')
      })
    })

    it('should set default error message for unknown errors', async () => {
      licenseRepository.getAvailableStandardLicenses = cy.stub().rejects(new Error('Unknown error'))

      const { result } = renderHook(() => useGetLicenses({ licenseRepository }))

      await waitFor(() => {
        expect(result.current.isLoadingLicenses).to.equal(false)
        expect(result.current.errorLicenses).to.equal(
          'Something went wrong getting the licenses. Try again later.'
        )
      })
    })
  })
})
