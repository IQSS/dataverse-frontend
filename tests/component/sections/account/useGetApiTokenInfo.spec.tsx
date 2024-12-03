import { act, renderHook } from '@testing-library/react'
import { useGetApiToken } from '@/sections/account/api-token-section/useGetCurrentApiToken'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { TokenInfo } from '@/users/domain/models/TokenInfo'
import { DateHelper } from '@/shared/helpers/DateHelper'

describe('useGetApiToken', () => {
  let UserRepository: UserRepository

  const mockTokenInfo: TokenInfo = {
    apiToken: 'mocked-api-token',
    expirationDate: new Date('2024-11-05')
  }

  beforeEach(() => {
    UserRepository = {} as UserRepository
  })

  it('should return the API token correctly', async () => {
    UserRepository.getCurrentApiToken = cy.stub().resolves(mockTokenInfo)

    const { result } = renderHook(() => useGetApiToken(UserRepository))
    await act(() => {
      expect(result.current.isLoading).to.equal(true)
      expect(result.current.error).to.equal(null)

      return expect(result.current.apiTokenInfo).to.deep.equal({
        apiToken: '',
        expirationDate: new Date(0)
      })
    })

    await act(() => {
      expect(result.current.isLoading).to.equal(false)
      expect(result.current.error).to.equal(null)
      const apiTokenInfo = {
        ...result.current.apiTokenInfo,
        expirationDate: DateHelper.toISO8601Format(result.current.apiTokenInfo.expirationDate)
      }

      return expect(apiTokenInfo).to.deep.equal({
        apiToken: mockTokenInfo.apiToken,
        expirationDate: DateHelper.toISO8601Format(mockTokenInfo.expirationDate)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle error correctly when an error is thrown', async () => {
      UserRepository.getCurrentApiToken = cy.stub().rejects(new Error('API Error'))

      const { result } = renderHook(() => useGetApiToken(UserRepository))

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
      UserRepository.getCurrentApiToken = cy.stub().rejects('Error message')

      const { result } = renderHook(() => useGetApiToken(UserRepository))

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.equal(null)
      })
      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal(
          'Something went wrong getting the current api token. Try again later.'
        )
      })
    })
  })
})
