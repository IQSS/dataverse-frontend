import { act, renderHook } from '@testing-library/react'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'
import { useRecreateApiToken } from '@/sections/account/api-token-section/useRecreateApiToken'
import { TokenInfo } from '@/users/domain/models/TokenInfo'

describe('useRecreateApiToken', () => {
  let apiTokenInfoRepository: ApiTokenInfoRepository

  const mockTokenInfo: TokenInfo = {
    apiToken: 'new-mocked-api-token',
    expirationDate: '2024-12-31'
  }

  beforeEach(() => {
    apiTokenInfoRepository = {} as ApiTokenInfoRepository
  })

  it('should return the API token correctly', async () => {
    apiTokenInfoRepository.recreateApiToken = cy.stub().resolves(mockTokenInfo)

    const { result } = renderHook(() => useRecreateApiToken(apiTokenInfoRepository))

    expect(result.current.isRecreating).to.equal(false)
    expect(result.current.error).to.equal(null)
    expect(result.current.tokenInfo).to.deep.equal(null)

    act(() => {
      result.current.initiateRecreateToken()
    })

    await act(() => {
      expect(result.current.isRecreating).to.equal(true)
      expect(result.current.error).to.equal(null)
      return expect(result.current.tokenInfo).to.equal(null)
    })

    await act(() => {
      expect(result.current.isRecreating).to.equal(false)
      expect(result.current.error).to.equal(null)
      return expect(result.current.tokenInfo).to.deep.equal(mockTokenInfo)
    })
  })

  describe('Error Handling', () => {
    it('should handle error correctly when an error is thrown', async () => {
      const errorMessage = 'Failed to recreate API token.'
      apiTokenInfoRepository.recreateApiToken = cy.stub().rejects(new Error(errorMessage))

      const { result } = renderHook(() => useRecreateApiToken(apiTokenInfoRepository))

      expect(result.current.isRecreating).to.equal(false)
      expect(result.current.error).to.equal(null)
      expect(result.current.tokenInfo).to.equal(null)

      act(() => {
        result.current.initiateRecreateToken()
      })

      await act(() => {
        expect(result.current.isRecreating).to.equal(true)
        return expect(result.current.error).to.equal(null)
      })

      await act(() => {
        expect(result.current.isRecreating).to.equal(false)
        expect(result.current.error).to.equal('Failed to recreate API token.')
        return expect(result.current.tokenInfo).to.equal(null)
      })
    })

    it('should return correct error message when there is not an error type catched', async () => {
      apiTokenInfoRepository.recreateApiToken = cy.stub().rejects('Unexpected error message')

      const { result } = renderHook(() => useRecreateApiToken(apiTokenInfoRepository))

      expect(result.current.isRecreating).to.equal(false)
      expect(result.current.error).to.equal(null)
      expect(result.current.tokenInfo).to.equal(null)

      act(() => {
        result.current.initiateRecreateToken()
      })

      await act(() => {
        expect(result.current.isRecreating).to.equal(true)
        return expect(result.current.error).to.equal(null)
      })

      await act(() => {
        expect(result.current.isRecreating).to.equal(false)
        expect(result.current.error).to.equal('Failed to recreate API token.')
        return expect(result.current.tokenInfo).to.equal(null)
      })
    })
  })
})
