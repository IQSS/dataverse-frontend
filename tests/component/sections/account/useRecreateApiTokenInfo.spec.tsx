import { act, renderHook } from '@testing-library/react'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { useRecreateApiToken } from '@/sections/account/api-token-section/useRecreateApiToken'
import { TokenInfo } from '@/users/domain/models/TokenInfo'

describe('useRecreateApiToken', () => {
  let UserRepository: UserRepository

  const mockTokenInfo: TokenInfo = {
    apiToken: 'new-mocked-api-token',
    expirationDate: new Date('2024-12-31')
  }

  beforeEach(() => {
    UserRepository = {} as UserRepository
  })

  it('should return the API token correctly', async () => {
    UserRepository.recreateApiToken = cy.stub().resolves(mockTokenInfo)

    const { result } = renderHook(() => useRecreateApiToken(UserRepository))

    expect(result.current.isRecreating).to.equal(false)
    expect(result.current.error).to.equal(null)
    expect(result.current.apiTokenInfo).to.deep.equal(null)

    act(() => {
      void result.current.recreateToken()
    })

    await act(() => {
      expect(result.current.isRecreating).to.equal(true)
      expect(result.current.error).to.equal(null)
      return expect(result.current.apiTokenInfo).to.equal(null)
    })

    await act(() => {
      expect(result.current.isRecreating).to.equal(false)
      expect(result.current.error).to.equal(null)
      return expect(result.current.apiTokenInfo).to.deep.equal(mockTokenInfo)
    })
  })

  describe('Error Handling', () => {
    it('should handle error correctly when an error is thrown', async () => {
      const errorMessage = 'Failed to recreate API token.'
      UserRepository.recreateApiToken = cy.stub().rejects(new Error(errorMessage))

      const { result } = renderHook(() => useRecreateApiToken(UserRepository))

      expect(result.current.isRecreating).to.equal(false)
      expect(result.current.error).to.equal(null)
      expect(result.current.apiTokenInfo).to.equal(null)

      act(() => {
        void result.current.recreateToken()
      })

      await act(() => {
        expect(result.current.isRecreating).to.equal(true)
        return expect(result.current.error).to.equal(null)
      })

      await act(() => {
        expect(result.current.isRecreating).to.equal(false)
        expect(result.current.error).to.equal('Failed to recreate API token.')
        return expect(result.current.apiTokenInfo).to.equal(null)
      })
    })

    it('should return correct error message when there is not an error type catched', async () => {
      UserRepository.recreateApiToken = cy.stub().rejects('Unexpected error message')

      const { result } = renderHook(() => useRecreateApiToken(UserRepository))

      expect(result.current.isRecreating).to.equal(false)
      expect(result.current.error).to.equal(null)
      expect(result.current.apiTokenInfo).to.equal(null)

      act(() => {
        void result.current.recreateToken()
      })

      await act(() => {
        expect(result.current.isRecreating).to.equal(true)
        return expect(result.current.error).to.equal(null)
      })

      await act(() => {
        expect(result.current.isRecreating).to.equal(false)
        expect(result.current.error).to.equal(
          'Something went wrong creating the api token. Try again later.'
        )
        return expect(result.current.apiTokenInfo).to.equal(null)
      })
    })
  })
})
