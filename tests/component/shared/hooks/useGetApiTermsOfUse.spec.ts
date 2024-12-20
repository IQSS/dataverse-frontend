import { act, renderHook } from '@testing-library/react'
import { useGetApiTermsOfUse } from '@/shared/hooks/useGetApiTermsOfUse'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { TermsOfUseMother } from '@tests/component/info/models/TermsOfUseMother'

const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository
const termsOfUseMock = TermsOfUseMother.create()

describe('useGetApiTermsOfUse', () => {
  it('should return terms of use correctly', async () => {
    dataverseInfoRepository.getApiTermsOfUse = cy.stub().resolves(termsOfUseMock)

    const { result } = renderHook(() => useGetApiTermsOfUse(dataverseInfoRepository))

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.termsOfUse).to.deep.equal('')
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)

      return expect(result.current.termsOfUse).to.deep.equal(termsOfUseMock)
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      dataverseInfoRepository.getApiTermsOfUse = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() => useGetApiTermsOfUse(dataverseInfoRepository))

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal('Error message')
      })
    })

    it('should return correct error message when there is not an error type catched', async () => {
      dataverseInfoRepository.getApiTermsOfUse = cy.stub().rejects('Error message')

      const { result } = renderHook(() => useGetApiTermsOfUse(dataverseInfoRepository))

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal(
          'Something went wrong getting the use of terms. Try again later.'
        )
      })
    })
  })
})
