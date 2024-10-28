import { act, renderHook } from '@testing-library/react'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'
import { useRevokeApiToken } from '@/sections/account/api-token-section/useRevokeApiToken'

describe('useRevokeApiToken', () => {
  let apiTokenInfoRepository: ApiTokenInfoRepository

  beforeEach(() => {
    apiTokenInfoRepository = {} as ApiTokenInfoRepository
  })

  it('should revoke the API token successfully', async () => {
    apiTokenInfoRepository.deleteApiToken = cy.stub().resolves()

    const { result } = renderHook(() => useRevokeApiToken(apiTokenInfoRepository))

    expect(result.current.isRevoking).to.equal(false)
    expect(result.current.error).to.equal(null)

    await act(async () => {
      await result.current.revokeToken()
    })

    expect(result.current.isRevoking).to.equal(false)
    expect(result.current.error).to.equal(null)
  })

  describe('Error Handling', () => {
    it('should handle error correctly when an error is thrown', async () => {
      const errorMessage = 'API token revocation failed.'
      apiTokenInfoRepository.deleteApiToken = cy.stub().rejects(new Error(errorMessage))

      const { result } = renderHook(() => useRevokeApiToken(apiTokenInfoRepository))

      await act(async () => {
        await result.current.revokeToken()
      })

      expect(result.current.isRevoking).to.equal(false)
      expect(result.current.error).to.equal('Failed to revoke API token.')
    })

    it('should handle non-error rejection gracefully', async () => {
      apiTokenInfoRepository.deleteApiToken = cy.stub().rejects('Unexpected error')

      const { result } = renderHook(() => useRevokeApiToken(apiTokenInfoRepository))

      await act(async () => {
        await result.current.revokeToken()
      })

      expect(result.current.isRevoking).to.equal(false)
      expect(result.current.error).to.equal('Failed to revoke API token.')
    })
  })
})
