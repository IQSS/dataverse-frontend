import { act, renderHook } from '@testing-library/react'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { useRevokeApiToken } from '@/sections/account/api-token-section/useRevokeApiToken'

describe('useRevokeApiToken', () => {
  let UserRepository: UserRepository

  beforeEach(() => {
    UserRepository = {} as UserRepository
  })

  it('should revoke the API token successfully', async () => {
    UserRepository.deleteApiToken = cy.stub().resolves()

    const { result } = renderHook(() => useRevokeApiToken(UserRepository))

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
      UserRepository.deleteApiToken = cy.stub().rejects(new Error(errorMessage))

      const { result } = renderHook(() => useRevokeApiToken(UserRepository))

      await act(async () => {
        await result.current.revokeToken()
      })

      expect(result.current.isRevoking).to.equal(false)
      expect(result.current.error).to.equal(errorMessage)
    })

    it('should handle non-error rejection gracefully', async () => {
      UserRepository.deleteApiToken = cy.stub().rejects('Unexpected error')

      const { result } = renderHook(() => useRevokeApiToken(UserRepository))

      await act(async () => {
        await result.current.revokeToken()
      })

      expect(result.current.isRevoking).to.equal(false)
      expect(result.current.error).to.equal(
        'Something went wrong revoking the api token. Try again later.'
      )
    })
  })
})
