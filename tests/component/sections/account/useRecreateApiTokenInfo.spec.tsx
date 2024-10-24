import { act, renderHook } from '@testing-library/react'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'
import { useRecreateApiToken } from '@/sections/account/api-token-section/useRecreateApiToken'
import { TokenInfo } from '@/users/domain/models/TokenInfo'

describe('useRecreateApiToken', () => {
  let apiTokenInfoRepository: ApiTokenInfoRepository

  const mockTokenInfo: TokenInfo = {
    apiToken: 'mocked-api-token',
    expirationDate: '2024-12-31'
  }

  beforeEach(() => {
    apiTokenInfoRepository = {} as ApiTokenInfoRepository
  })

  it('should return the API token correctly', async () => {
    apiTokenInfoRepository.recreateApiToken = cy.stub().resolves(mockTokenInfo)

    const { result } = renderHook(() => useRecreateApiToken(apiTokenInfoRepository))
    await act(() => {
      expect(result.current.isRecreating).to.equal(true)
      expect(result.current.error).to.equal(null)
      return expect(result.current.tokenInfo).to.deep.equal({
        apiToken: '',
        expirationDate: ''
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle error correctly when an error is thrown', async () => {
      apiTokenInfoRepository.getCurrentApiToken = cy.stub().rejects(new Error('API Error'))

      const { result } = renderHook(() => useRecreateApiToken(apiTokenInfoRepository))

      await act(() => {
        expect(result.current.isRecreating).to.deep.equal(true)
        return expect(result.current.error).to.equal(null)
      })
      await act(() => {
        expect(result.current.tokenInfo).to.deep.equal(false)
        return expect(result.current.error).to.equal('API Error')
      })
    })
    it('should handle error correctly when there is no error is thrown', async () => {
      apiTokenInfoRepository.getCurrentApiToken = cy.stub().rejects('Error message')

      const { result } = renderHook(() => useRecreateApiToken(apiTokenInfoRepository))

      await act(() => {
        expect(result.current.isRecreating).to.deep.equal(true)
        return expect(result.current.error).to.equal(null)
      })
      await act(() => {
        expect(result.current.isRecreating).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal('Failed to fetch API token.')
      })
    })
  })
})
