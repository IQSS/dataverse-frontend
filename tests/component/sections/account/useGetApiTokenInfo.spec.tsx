import { act, renderHook } from '@testing-library/react'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'
import { useGetApiToken } from '@/sections/account/api-token-section/useGetCurrentApiToken'
import { TokenInfo } from '@/users/domain/models/TokenInfo'

describe('useGetApiToken', () => {
  let apiTokenInfoRepository: ApiTokenInfoRepository

  const mockTokenInfo: TokenInfo = {
    apiToken: 'mocked-api-token',
    expirationDate: '2024-12-31'
  }

  beforeEach(() => {
    apiTokenInfoRepository = {} as ApiTokenInfoRepository
  })

  it('should return the API token correctly', async () => {
    apiTokenInfoRepository.getCurrentApiToken = cy.stub().resolves(mockTokenInfo)

    const { result } = renderHook(() => useGetApiToken(apiTokenInfoRepository))
    await act(() => {
      expect(result.current.isLoading).to.equal(true)
      expect(result.current.error).to.equal(null)
      return expect(result.current.apiTokenInfo).to.deep.equal({
        apiToken: '',
        expirationDate: ''
      })
    })

    await act(() => {
      expect(result.current.isLoading).to.equal(false)
      expect(result.current.error).to.equal(null)
      return expect(result.current.apiTokenInfo).to.deep.equal(mockTokenInfo)
    })
  })

  describe('Error Handling', () => {
    it('should handle error correctly when an error is thrown', async () => {
      apiTokenInfoRepository.getCurrentApiToken = cy.stub().rejects(new Error('API Error'))

      const { result } = renderHook(() => useGetApiToken(apiTokenInfoRepository))

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.equal(null)
      })
      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.equal('API Error')
      })
    })

    it('should return correct error message when there is not an error type catched', async () => {
      apiTokenInfoRepository.getCurrentApiToken = cy.stub().rejects('Error message')

      const { result } = renderHook(() => useGetApiToken(apiTokenInfoRepository))

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.equal(null)
      })
      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal('Failed to fetch API token.')
      })
    })
  })
})
